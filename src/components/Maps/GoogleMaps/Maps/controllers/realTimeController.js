import { useRef } from "react";

import { latLngObj } from "../../utils/formatValues";
import animatedMove from "../../utils/movement";
import { markerInfo } from "../..//components/info";
import Colors, { getColorByBgColor } from "../../../../../assets/constants/Colors";
import { icons } from "../../utils/icons";

export function useRealTime() {
    const positions = useRef(new Map());

    function realTime({ vehiclesMap, objMarkers, map, objLines }) {
        const isFirst = !objMarkers.markers.size;
        if (isFirst) {
            objMarkers.setBounds(Object.values(vehiclesMap).map(v => v[0]));
            map.setZoom(11);
        }
        Object.values(vehiclesMap).forEach(vehicles => {
            let auxVehicles = [];
            
            // save cpu processing
            if (Object.values(vehiclesMap).length === 1) {
                auxVehicles = vehicles;
            } else {
                auxVehicles = [vehicles[vehicles.length - 1]];
            }

            auxVehicles.forEach(vehicle => {
                // const infoSpeed = vehicle.speed?.value ? vehicle.speed?.value + " " + 
                //     vehicle.speed?.unit : vehicle.can?.['65132']?.['Tachograph vehicle speed']?.value ? 
                //     vehicle.can['65132']['Tachograph vehicle speed'].value.toFixed(1) + " " + 
                //     vehicle.can['65132']['Tachograph vehicle speed'].unit : 
                //     "parado: " + vehicle.date?.split(" ")[1];
                const infoSpeed = vehicle.can?.['65132']?.['Tachograph vehicle speed']?.value ? 
                    vehicle.can['65132']['Tachograph vehicle speed'].value.toFixed(1) + " " + 
                    vehicle.can['65132']['Tachograph vehicle speed'].unit : vehicle.speed?.value ? 
                    vehicle.speed?.value + " " + vehicle.speed?.unit : "parado: " + 
                    vehicle.date?.split(" ")[1];

                const markerPoint = {
                    ...vehicle,
                    prefix: Number(vehicle.prefix) || vehicle.vehicle,
                    key: vehicle.identifier || vehicle.vehicle,
                    color: vehicle.color || Colors.buslab,
                };

                markerPoint.rowsInfo = [
                    { text: markerPoint.dt ? `desde ${markerPoint.dt}` : "" },
                    { strong: "Local:", text: markerPoint.onGarage },
                    { strong: "Ônibus: ", text: markerPoint.prefix },
                    { strong: "Motorista: ", text: markerPoint.driver },
                    { strong: "Velocidade: ", text: infoSpeed },
                    // { strong: "RPM: ", text: markerPoint.rpm },
                    { strong: "RPM: ", text: markerPoint.rpm ? markerPoint.rpm : 
                    markerPoint.can?.['61444']?.['Engine Speed']?.value ? 
                    markerPoint.can['61444']['Engine Speed'].value : null 
                    },
                    {
                        strong: "Temperatura:",
                        text: markerPoint.temperatura ? `${markerPoint.temperatura} °C` : null,
                    },
                ];

                const { key } = markerPoint;
                const latLng = latLngObj(markerPoint);
                if (!latLng) {
                    return;
                }
                const newPosition = latLng ? new window.google.maps.LatLng(latLng) : null;

                // set new position with filter
                const prevMarker = objMarkers.markers.get(key);
                if (prevMarker) {
                    const sumPrev =
                        Number(prevMarker.position.lat()) + Number(prevMarker.position.lng());
                    const sumNew = Number(newPosition.lat()) + Number(newPosition.lng());
                    const isColorDifferent = prevMarker.icon.fillColor !== markerPoint.color;

                    if (sumNew.toFixed(5) !== sumPrev.toFixed(5) || isColorDifferent) {
                        // rotate
                        const rotation = window.google.maps.geometry.spherical.computeHeading(
                            prevMarker.position ,
                            newPosition
                        );

                        animatedMove(
                            prevMarker,
                            vehicle.vehicle ? 0 : 1, // if it is "replay"
                            prevMarker.position,
                            newPosition
                        );
                        window.google.maps.event.clearListeners(prevMarker, "mouseover");

                        markerInfo({
                            map,
                            marker: prevMarker,
                            title: markerPoint.line || "N/A",
                            rows: markerPoint.rowsInfo,
                        });

                        if (markerPoint.speed && markerPoint.speed.value > 0) {
                            prevMarker.setIcon(
                                icons({ width: 31, height: 31, color: markerPoint.color, rotation })
                                    .busDirection
                            );
                        } else {
                            prevMarker.setIcon(
                                icons({ width: 31, height: 31, color: markerPoint.color + "CC", rotation })
                                    .point
                            );
                        }
                        if (isColorDifferent) {
                            prevMarker.label.color = getColorByBgColor({
                                bgColor: markerPoint.color,
                                darkColor: "#000",
                                lightColor: "#fff",
                            });
                        }
                    }

                    // lines only in replay
                    if (vehicle.vehicle) {
                        const prevLine = objLines.lines.get(key);
                        if (prevLine) {
                            const vehiclePositions = positions.current.get(key);

                            const index = vehiclePositions.findIndex(pos =>
                                pos.equals(newPosition)
                            );
                            if (index >= 0) {
                                vehiclePositions.splice(index, vehiclePositions.length);
                            }
                            vehiclePositions.push(newPosition);

                            prevLine.setPath(vehiclePositions);
                        }
                    }

                    prevMarker.label.text = markerPoint.prefix?.toString() || "";

                    return;
                } else {
                    // It don't have previous maker
                    //  new Line
                     objLines.addLine({
                         checkPoint: [newPosition],
                         color: "#000000",
                         key,
                     });
                     positions.current.set(key, [newPosition]);
                     objLines.setMapOnAll(map);
                }

                // new Marker
                const marker = objMarkers.addMarker({
                    point: markerPoint,
                    icon: icons({ width: 30, height: 30, color: markerPoint.color }).point,
                    text: markerPoint.prefix?.toString(),
                });
                if (!marker) {
                    return;
                }

                markerInfo({
                    map,
                    marker,
                    title: markerPoint.line || "N/A",
                    rows: markerPoint.rowsInfo,
                });

                // new events
                marker.addListener("click", () => {
                    map.setZoom(17);
                    map.setCenter(marker.getPosition());

                    const position = marker.addListener("position_changed", () => {
                        const distanceOfCenter = window.google.maps.geometry.spherical.computeDistanceBetween(
                            marker.getPosition(),
                            map.getCenter()
                        );
                        if (distanceOfCenter > 50) {
                            map.panTo(marker.getPosition());
                        }

                        const eventZoom = map.addListener("zoom_changed", () => {
                            if (map.getZoom() < 17) {
                                window.google.maps.event.removeListener(position);
                                window.google.maps.event.removeListener(eventZoom);
                            }
                        });
                        const dragStart = map.addListener("dragstart", () => {
                            window.google.maps.event.removeListener(position);
                            window.google.maps.event.removeListener(dragStart);
                        });
                    });
                });

                objMarkers.setMapOnAll(map);
            });
        });
    }

    return realTime;
}
