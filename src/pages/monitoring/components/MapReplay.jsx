/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import moment from "moment";

import Replay from "./Replay";
import useFence from "../../../components/Maps/GoogleMaps/hooks/useFence";
import GoogleMaps from "../../../components/Maps/GoogleMaps";
import api from "../../../services/api";
import HeaderToken from "../../../services/headerToken";
import Interceptor from "../../../services/interceptor";
import { isOnGarage } from "../../../components/Maps/GoogleMaps/components/polygons/areas";

const MapReplay = ({ setDateLimit, dateLimit, vehicles, onFinish, search }) => {
    const [vehiclesMap, setVehiclesMap] = useState({});
    const [provisionalDate, setProvisionalDate] = useState(dateLimit);
    const [action, setAction] = useState(true);
    const [reload, setReload] = useState();
    const [line, setLine] = useState();
    const { fences } = useFence();
    const viewport = {
        latitude: -23.6956019,
        longitude: -46.6297295,
        zoom: 11,
    };

    useEffect(() => {
        if (search.line) {
            api.get(`/api/adm/line/${search.line}/points`, HeaderToken())
                .then(response => {
                    setLine(response.data);
                })
                .catch(error => {
                    Interceptor(error);
                });
        }
    }, [search]);

    useEffect(() => {
        if (!reload || !action || !fences) {
            return;
        }

        function updateHours(vehiclesTemp) {
            let date = [Object.values(vehicles)][0][0][0].date;
            let last = [Object.values(vehicles)].slice(-1)[0].slice(-1)[0].slice(-1)[0].date;
            if (new Date(date) <= new Date(provisionalDate.min)) {
                date = provisionalDate.min;
            }
            setVehiclesMap(vehiclesTemp);
            setProvisionalDate({
                ...dateLimit,
                min: moment(new Date(date)).add(1, "minutes").format("YYYY-MM-DD HH:mm:ss"),
                max: moment(new Date(last)).format("YYYY-MM-DD HH:mm:ss"),
            });
        }

        let vehiclesTemp = {};
        Object.values(vehicles).forEach(schedules => {
            schedules.forEach(bus => {
                if (
                    typeof bus === "object" &&
                    moment(bus.date).format("YYYY-MM-DD HH:mm") <=
                        moment(provisionalDate.min).format("YYYY-MM-DD HH:mm")
                ) {
                    if (!vehiclesTemp[bus.vehicle]) {
                        vehiclesTemp[bus.vehicle] = [];
                    }
                    vehiclesTemp[bus.vehicle].push({
                        ...bus,
                        onGarage: isOnGarage({ areas: fences, point: bus }),
                    });
                }
            });
        });
        updateHours(vehiclesTemp);
    }, [reload, fences]);

    useEffect(() => {
        if (
            vehicles &&
            Object.values(vehicles).length &&
            moment(provisionalDate.min).format("YYYY-MM-DD HH:mm") <
                moment(provisionalDate.max).format("YYYY-MM-DD HH:mm") &&
            action
        ) {
            setTimeout(() => {
                setReload({ reload: true });
            }, 1000);
        }
        if (
            Object.values(vehiclesMap).length > 0 &&
            moment(provisionalDate.min).format("YYYY-MM-DD HH:mm") >=
                moment(provisionalDate.max).format("YYYY-MM-DD HH:mm")
        ) {
            onFinish();
            setAction(false);
        }
    }, [provisionalDate, action]);

    return (
        <>
            <Replay
                setAction={setAction}
                action={action}
                vehicles={vehicles}
                startsAt={provisionalDate.min}
                endsAt={provisionalDate.max}
                setDateLimit={setProvisionalDate}
                setVehiclesMap={setVehiclesMap}
            />

            <section style={{ height: "600px" }}>
                <GoogleMaps checkpoints={line} viewport={viewport} vehiclesMap={vehiclesMap} />
            </section>
        </>
    );
};
export default MapReplay;
