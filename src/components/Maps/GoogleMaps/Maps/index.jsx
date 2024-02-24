import React, { useEffect, useRef, useState } from "react";

import { icons } from "../utils/icons";
import { setLines } from "../components/lines";
import { setMarkers } from "../components/markers";
import { Markers } from "../components/markers/Markers";
import { Lines } from "../components/lines/Lines";
import { pushAreas } from "../components/polygons/areas";
import useFence from "../hooks/useFence";
import { useRealTime } from "./controllers/realTimeController";
import { Container } from "./styles";
import RuntimeEnv from "../../../../config/RuntimeEnv";

function Maps({ checkpoints, points, occurrences, vehiclesMap, id, options, trafficLayer }) {
    const [load, setLoad] = useState(false);
    const [map, setMap] = useState();
    const prevData = useRef({});

    const [objMarkers, setObjMarkers] = useState(new Markers());
    const [objLines, setObjLines] = useState(new Lines());
    const { fences, setFences } = useFence();
    const realTime = useRealTime();

    useEffect(() => {
        if (!window.google || (!checkpoints && !points && !vehiclesMap && !occurrences)) {
            return;
        }
        //MAP
        if (!map) {
            const newMap = new window.google.maps.Map(document.getElementById(id), options);

            const mk = new Markers(newMap);
            const ln = new Lines(newMap);
            setObjMarkers(mk);
            setObjLines(ln);
            setMap(newMap);
            if (points && (points.length < 3 || points[points.length - 1].lon)) {
                mk.setBounds(points);
                const eventZoom = newMap.addListener("zoom_changed", () => {
                    if (newMap.getZoom() > 18) {
                        newMap.setZoom(18);
                        window.google.maps.event.removeListener(eventZoom);
                    }
                });
            }
            return;
        }

        if (trafficLayer) {
            const trafficLayer = new window.google.maps.TrafficLayer();
            trafficLayer.setMap(map);
        }

        //LINES
        checkpoints && checkpoints !== prevData.current.checkpoints && setLines(map, checkpoints);

        //  MARKERS with number
        points &&
            points !== prevData.current.points &&
            setMarkers({
                map,
                points,
                icon: icons({ width: 25, height: 25, color: points[0]?.line?.company?.color })
                    .point,
                iconTextField: "sequence",
                bound: true,
            });

        occurrences &&
            occurrences !== prevData.current.occurrences &&
            occurrences.forEach(data => {
                setMarkers({
                    map,
                    points: data.checkpoints,
                    message: data.event.category.description,
                });
            });
        prevData.current.checkpoints = checkpoints;
        prevData.current.points = points;
        prevData.current.occurrences = occurrences;

        if (vehiclesMap) {
            realTime({ map, vehiclesMap, objLines, objMarkers });
        }

        if (fences) {
            pushAreas({
                map,
                objLines,
                areas: fences,
                color: JSON.parse(localStorage.getItem("session-user-company"))?.color,
            });
            setFences();
        }

        //  onMapLoad(map);
    }, [points, checkpoints, vehiclesMap, occurrences, load, fences]);

    useEffect(() => {
        if (!window.google) {
            var s = document.createElement("script");
            s.type = "text/javascript";
            s.src = `https://maps.googleapis.com/maps/api/js?key=${RuntimeEnv.KEY_MAPS}&libraries=geometry&v=weekly`;

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

    return <Container style={{ width: "100%", height: "100%" }} id={id} />;
}

export default Maps;
