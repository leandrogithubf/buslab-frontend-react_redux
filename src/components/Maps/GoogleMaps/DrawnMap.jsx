import React, { useEffect, useRef, useState } from "react";

import Colors from "../../../assets/constants/Colors";
import RuntimeEnv from "../../../config/RuntimeEnv";
import { pushAreas } from "./components/polygons/areas";
import { Lines } from "./components/lines/Lines";
import { Markers } from "./components/markers/Markers";
import { icons } from "./utils/icons";

function DrawMap({ areas, setAreas, points, setPoints, id, options, trafficLayer, draw }) {
    const [load, setLoad] = useState(false);
    const [map, setMap] = useState();
    const [point, setPoint] = useState();
    const [area, setArea] = useState();
    const [objMarkers, setObjMarkers] = useState(new Markers());
    const [objLines, setObjLines] = useState(new Lines());
    const pointsRef = useRef(points);

    function initMap() {
        const newMap = new window.google.maps.Map(document.getElementById(id), options);
        //init class and click listener
        const mk = new Markers(newMap);
        const ln = new Lines(newMap);
        if (areas) {
            draw && ln.listemClick(cbLines);
        } else {
            mk.listemClick(cbMarkers);
        }
        //zoom control
        if (points && (points.length < 3 || points[points.length - 1].lon)) {
            mk.setBounds(points);
            areas &&
                Object.entries(areas).forEach(([key, pathLine]) => {
                    ln.setBounds(pathLine);
                });
            const eventZoom = newMap.addListener("zoom_changed", () => {
                if (newMap.getZoom() > 18) {
                    newMap.setZoom(18);
                    window.google.maps.event.removeListener(eventZoom);
                }
            });
        }
        //state
        setObjMarkers(mk);
        setObjLines(ln);
        setMap(newMap);
        return;
    }

    function cbMarkers({ latitude, longitude }) {
        setPoint([{ latitude, longitude }]);
    }
    function cbLines({ latitude, longitude }) {
        setArea({ latitude, longitude });
    }

    useEffect(() => {
        if ((!map && !window.google) || (!areas && !points)) {
            return;
        } else {
            initMap();
        }
    }, [draw]);

    useEffect(() => {
        if (!window.google || (!areas && !points)) {
            return;
        }
        !map && initMap();

        if (trafficLayer) {
            const trafficLayer = new window.google.maps.TrafficLayer();
            trafficLayer.setMap(map);
        }
        //  MARKERS with number
        if (points) {
            objMarkers.deleteMarkers();
            points.forEach((point, index) => {
                const icon = areas
                    ? icons({
                          width: 6,
                          height: 6,
                          color: point.color,
                          horizontal: 220,
                          vertical: 620,
                      }).build
                    : icons({ width: 29, height: 29 }).point2;

                //new Marker
                const marker = objMarkers.addDrawnMarker({
                    draggable: !areas,
                    point,
                    icon,
                    labelColor: areas ? Colors.cinzaGrafico : "#fff",
                    text: point.description || (index + 1).toString(),
                });

                marker &&
                    marker.addListener("dragend", event => {
                        const { lat, lng } = event.latLng;

                        setPoint([
                            { latitude: lat().toFixed(6), longitude: lng().toFixed(6) },
                            index,
                        ]);
                    });
            });
            if (
                !areas &&
                (points.length < 3 ||
                    (points[0].address && pointsRef.current?.length !== points.length))
            ) {
                objMarkers.setBounds(points);
                pointsRef.current = points;
            }
            objMarkers.setMapOnAll(map);
        }

        //MULTIPLE AREAS FENCE
        areas && pushAreas({ map, objLines, areas, color: points[0]?.color });

        //  onMapLoad(map);
    }, [load, points, areas, map]);

    useEffect(() => {
        function update(obj, setObj, objs, setObjs) {
            if (obj && obj[1] >= 0) {
                objs[obj[1]] = obj[0];
                setObjs([...objs]);
            } else if (obj) {
                objs.push(obj[0]);
                setObjs([...objs]);
                setObj();
            }
        }
        function updateLines(area, setArea, areas, setAreas) {
            if (areas["temp"]) {
                areas["temp"].push(area);
            } else {
                areas["temp"] = [area];
            }

            setAreas({ ...areas });
            setArea();
        }

        point && setPoints && update(point, setPoint, points, setPoints);
        area && setAreas && updateLines(area, setArea, areas, setAreas);
    }, [point, area]);

    useEffect(() => {
        if (!window.google) {
            var s = document.createElement("script");
            s.type = "text/javascript";
            s.src = `https://maps.googleapis.com/maps/api/js?key=${RuntimeEnv.KEY_MAPS}&v=weekly`;

            var x = document.getElementsByTagName("script")[0];
            x.parentNode.insertBefore(s, x);
            s.addEventListener("load", e => {
                setLoad(true);
            });
        } else {
            setLoad(true);
        }
        return () => {
            objMarkers.deleteMarkers();
            objLines.deleteLines();
            document.getElementById(id).remove();
        };
    }, []);

    return (
        <>
            <div style={{ width: "100%", height: "100%" }} id={id} />
        </>
    );
}

export default DrawMap;
