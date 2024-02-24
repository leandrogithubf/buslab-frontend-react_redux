import React, { useState, useEffect, useRef } from "react";
import { format } from "date-fns";

import { notifyPosition, activeSocket, notifyStatus } from "../../../services/socket";
import { filterPositions, filterStatus } from "./utils/filterSocket";
import MapSynoptic from "./MapSynoptic";
import Collapsible from "./Collapsible";
import StatusBus from "./StatusBus";
import SynopticLines from "./SynopticLines";
import useFence from "../../../components/Maps/GoogleMaps/hooks/useFence";
import { isOnGarage } from "../../../components/Maps/GoogleMaps/components/polygons/areas";
import HeaderToken from "../../../services/headerToken";
import api from "../../../services/api";
import { getNewSearch } from "../../../hooks/useFilterFormat";

const TabsGraph = ({ search, company }) => {
    const [openTabGraph, setOpenTabGraph] = useState(1);
    const [itineraries, setItineraries] = useState({});

    const lastReceivedTimestamp = useRef("");
    const companyList = useRef();
    const { fences } = useFence();
    const socketDataRef = useRef({});
    const status = useRef({});
    const qtt = useRef({
        IN_ROUTE: { total: 0, vehicles: [] },
        IN_ROUTE_EARLY: { total: 0, vehicles: [] },
        IN_ROUTE_LATE: { total: 0, vehicles: [] },
        IN_ROUTE_AT_START: { total: 0, vehicles: [] },
        IN_ROUTE_AT_END: { total: 0, vehicles: [] },
        OFF_ROUTE: { total: 0, vehicles: [] },
        MAINTENANCE: { total: 0, vehicles: [] },
    });

    useEffect(() => {
        api.get(`api/adm/company/list?page_size=9999999`, HeaderToken()).then(response => {
            const companies = {};
            companyList.current = companies;

            response.data.data.forEach(comp => {
                companies[comp.identifier] = { ...comp };
            });
        });
    }, []);

    useEffect(() => {
        if (fences) {
            api.get(`/api/geolocation/vehicle-location`, {
                ...HeaderToken(),
                params: { ...getNewSearch(search) },
            }).then(response => {
                const aux = {};

                Object.entries(response.data).forEach(([key, value]) => {
                    value.color = "#d3d3d3";
                    value.onGarage = isOnGarage({ areas: fences, point: value });
                    value.line = "sem atualização";
                    value.dt = format(Date.parse(value.date), "dd/MM/yyyy HH:mm");
                    aux[key] = [value];
                });
                setItineraries(aux);
            });
        }
    }, [fences, search]);

    useEffect(() => {
        if (!fences) {
            return;
        }

        const socket = activeSocket();
        let socketData = socketDataRef.current;

        let newSocket = {};

        notifyStatus(socket, (err, data) => {
            if (err) return;
            const response = JSON.parse(data);
            const newData = filterStatus(response, search);

            qtt.current = Object.values(newData).reduce(
                (acc, current) => {
                    if (!status.current[current.company]) {
                        status.current[current.company] = {
                            company: companyList.current[current.company],
                        };
                        status.current[current.company][current.identifier] = {};
                    }
                    status.current[current.company][current.identifier] = current;

                    switch (current.status) {
                        case "IN_ROUTE": {
                            const obj = acc["IN_ROUTE"];
                            obj.total += 1;
                            obj.vehicles.push(current.identifier);
                            break;
                        }
                        case "IN_ROUTE_EARLY": {
                            const obj = acc["IN_ROUTE_EARLY"];
                            obj.total += 1;
                            obj.vehicles.push(current.identifier);
                            break;
                        }
                        case "IN_ROUTE_LATE": {
                            const obj = acc["IN_ROUTE_LATE"];
                            obj.total += 1;
                            obj.vehicles.push(current.identifier);
                            break;
                        }
                        case "IN_ROUTE_AT_START": {
                            const obj = acc["IN_ROUTE_AT_START"];
                            obj.total += 1;
                            obj.vehicles.push(current.identifier);
                            break;
                        }
                        case "IN_ROUTE_AT_END": {
                            const obj = acc["IN_ROUTE_AT_END"];
                            obj.total += 1;
                            obj.vehicles.push(current.identifier);
                            break;
                        }
                        case "OFF_ROUTE": {
                            const obj = acc["OFF_ROUTE"];
                            obj.total += 1;
                            obj.vehicles.push(current.identifier);
                            break;
                        }
                        case "MAINTENANCE": {
                            const obj = acc["MAINTENANCE"];
                            obj.total += 1;
                            obj.vehicles.push(current.identifier);
                            break;
                        }
                        default:
                    }
                    return acc;
                },

                {
                    IN_ROUTE: { total: 0, vehicles: [] },
                    IN_ROUTE_EARLY: { total: 0, vehicles: [] },
                    IN_ROUTE_LATE: { total: 0, vehicles: [] },
                    IN_ROUTE_AT_START: { total: 0, vehicles: [] },
                    IN_ROUTE_AT_END: { total: 0, vehicles: [] },
                    OFF_ROUTE: { total: 0, vehicles: [] },
                    MAINTENANCE: { total: 0, vehicles: [] },
                }
            );
        });

        notifyPosition(socket, company?.identifier, (err, data) => {
            if (err) return;
            const response = JSON.parse(data);

            socketData[response.identifier] = [
                {
                    ...response,
                    onGarage: fences && isOnGarage({ areas: fences, point: response }),
                },
            ];

            newSocket = filterPositions(socketData, search);
            lastReceivedTimestamp.current = response.now;
        });

        const interval = setInterval(() => {
            setItineraries({ ...newSocket });
        }, 3000);
        return () => {
            socket.disconnect();
            clearInterval(interval);
        };
    }, [search, fences, company]);

    return (
        <>
            <div className="flex flex-wrap ">
                <div className="w-full">
                    <ul
                        className={`flex list-none flex-wrap flex-row ${
                            openTabGraph === 1 ? "bg-c4" : openTabGraph === 2 ? "bg-c2" : "bg-white"
                        }`}
                        role="tablist">
                        <li>
                            <a
                                className={
                                    "py-3 px-4 text-gray-700 inline-block font-medium " +
                                    (openTabGraph === 1
                                        ? "bg-white rounded-t"
                                        : openTabGraph === 2
                                        ? "bg-c2 rounded-t"
                                        : "bg-c4 rounded-t")
                                }
                                onClick={e => {
                                    e.preventDefault();
                                    setOpenTabGraph(1);
                                }}
                                data-toggle="tab"
                                href="#link1"
                                role="tablist">
                                Mapa de tempo real
                            </a>
                        </li>
                        <li>
                            <a
                                className={
                                    " py-3 px-4 text-gray-700 inline-block font-medium " +
                                    (openTabGraph === 2 ? "bg-white rounded-t" : "bg-c2 rounded-t")
                                }
                                onClick={e => {
                                    e.preventDefault();
                                    setOpenTabGraph(2);
                                }}
                                data-toggle="tab"
                                href="#link2"
                                role="tablist">
                                Sinótico/Timeline
                            </a>
                        </li>
                        <li>
                            <a
                                className={
                                    " py-3 px-4 text-gray-700 inline-block font-medium " +
                                    (openTabGraph === 3 ? "bg-white rounded-t" : "bg-c4 rounded-t")
                                }
                                onClick={e => {
                                    e.preventDefault();
                                    setOpenTabGraph(3);
                                }}
                                data-toggle="tab"
                                href="#link3"
                                role="tablist">
                                Status
                            </a>
                        </li>
                    </ul>
                    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
                        <div className="px-4 py-5 flex-auto">
                            {status && itineraries && (
                                <div className="tab-content tab-space">
                                    <div
                                        className={openTabGraph === 1 ? "block" : "hidden"}
                                        id="link1">
                                        <MapSynoptic
                                            itineraries={itineraries}
                                            lastReceivedTimestamp={lastReceivedTimestamp.current}
                                            search={search}
                                        />
                                        <Collapsible
                                            itineraries={itineraries}
                                            status={status.current}
                                        />
                                    </div>
                                    <div
                                        className={openTabGraph === 2 ? "block" : "hidden"}
                                        id="link2">
                                        <SynopticLines
                                            itineraries={itineraries}
                                            qtt={qtt.current}
                                            search={search}
                                        />
                                    </div>
                                    <div
                                        className={openTabGraph === 3 ? "block" : "hidden"}
                                        id="link3">
                                        <StatusBus status={status.current} qtt={qtt.current} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default TabsGraph;
