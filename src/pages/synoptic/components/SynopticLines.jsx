import React, { useState, useEffect, useRef } from "react";

import busGrayRightSVG from "../../../assets/svgs/bus/bus-gray-right.svg";
import idaLeftSVG from "../../../assets/svgs/arrow-thick-left.svg";
import idaRightSVG from "../../../assets/svgs/arrow-thick-right.svg";
import HeaderToken from "../../../services/headerToken";
import api from "../../../services/api";
import Interceptor from "../../../services/interceptor";
import PillColor from "../../../components/PillColor";
import TimelineBus from "../../../components/Timeline/TimelineBus";
import BusLine from "../../../components/Bus/BusLine";

function SynopticLines({ itineraries, qtt, search }) {
    const [lineList, setLineList] = useState([]);
    const [fleet, setFleet] = useState([]);
    const counter = useRef({});

    useEffect(() => {
        api.get(`api/adm/line/list?page_size=99999`, {
            params: { "company[]": search.company },
            ...HeaderToken(),
        })
            .then(response => {
                setLineList(response.data.data);
            })
            .catch(error => {
                Interceptor(error);
            });
    }, []);

    useEffect(() => {
        const status = [
            "OFF_ROUTE",
            "IN_ROUTE_EARLY",
            "IN_ROUTE_LATE",
            "IN_ROUTE",
            "IN_ROUTE_AT_START",
            "IN_ROUTE_AT_END",
        ];

        function getVehicles(line) {
            const vehicles = Object.values(itineraries)
                .filter(it => it[0].lineIdentifier === line.identifier)
                .map(it => it[it.length - 1]);
            return vehicles;
        }

        setFleet(
            lineList
                .map(line => {
                    const vehicles = getVehicles(line);

                    const newPoints = [...line.points];

                    if (line.points && line.direction === "RETURN") {
                        newPoints.reverse();
                    }
                    return {
                        ...line,
                        points: newPoints,
                        vehicles,
                        sequence: vehicles.reduce((acc, vehicle) => {
                            const index = status.indexOf(vehicle.status);
                            return index !== -1 && index <= acc ? index : acc;
                        }, status.length),
                    };
                })
                .sort((current, next) => current.sequence - next.sequence)
        );
    }, [lineList, itineraries]);

    return (
        <div>
            <div className="flex flex-wrap justify-between w-full md:w-1/2 lg:w-1/2 mb-2">
                <PillColor
                    list={[
                        {
                            text: `no horário (${qtt["IN_ROUTE"]?.total})`,
                            color: "bg-azul",
                        },
                        {
                            text: `adiantado  (${qtt["IN_ROUTE_EARLY"]?.total})`,
                            color: "bg-amarelo",
                        },
                        {
                            text: `atrasado  (${qtt["IN_ROUTE_LATE"]?.total})`,
                            color: "bg-laranja",
                        },
                        {
                            text: `fora da rota  (${
                                qtt["OFF_ROUTE"]?.vehicles.filter(identifier =>
                                    fleet.find(entity =>
                                        entity.vehicles.find(
                                            vehicle => vehicle.identifier === identifier
                                        )
                                    )
                                ).length
                            })`,
                            color: "bg-vermelho",
                        },
                    ]}
                />
            </div>
            {fleet.map(line => (
                <div key={line.identifier} className="mt-8">
                    <div className="px-8">
                        <h4 className="text-buslab font-light ">
                            {line.code +
                                " - " +
                                line.description +
                                (line.direction === "RETURN" ? " (volta)" : "")}
                        </h4>
                        <div className="flex justify-between mt-2 flex-wrap">
                            <div className="w-full sm:w-full md:w-1/2 lg:w-1/2">
                                <p className="font-medium text-13 text-c7-14 mb-2">
                                    parados no ponto inicial
                                </p>
                                <div className="border mr-2 flex p-1">
                                    <BusLine
                                        list={line.vehicles
                                            .filter(vehicle => vehicle.lastPoint === 0)
                                            .map(vehicle => ({
                                                img: busGrayRightSVG,
                                                number: vehicle.prefix,
                                            }))}
                                    />
                                </div>
                            </div>
                            <div className="w-full sm:w-full md:w-1/2 lg:w-1/2">
                                <p className="font-medium ml-2 text-13 text-c7-14 sm:ml-0 mb-2">
                                    parados no ponto final
                                </p>
                                <div className="border ml-2 sm:ml-0 p-1">
                                    <BusLine
                                        list={line.vehicles
                                            .filter(
                                                vehicle => vehicle.lastPoint === line.points.length
                                            )
                                            .map(vehicle => ({
                                                img: busGrayRightSVG,
                                                number: vehicle.prefix,
                                            }))}
                                    />
                                </div>
                            </div>
                        </div>

                        <TimelineBus line={line} vehicles={line.vehicles} />

                        {line.direction === "CIRCULATE" && <p className="font-medium">circular</p>}
                        {line.direction === "GOING" && (
                            <div className="flex items-center mt-4">
                                <img
                                    className="cursor-pointer font-light w-2 inline mr-2"
                                    alt="Seta Esquerda"
                                    src={idaRightSVG}
                                />
                                <p className="font-medium">ida</p>
                            </div>
                        )}
                        {line.direction === "RETURN" && (
                            <div className="flex items-center mt-2">
                                <img
                                    className="cursor-pointer font-light w-2 inline mr-2"
                                    alt="Seta Esquerda"
                                    src={idaLeftSVG}
                                />
                                <p className="font-medium">volta</p>
                            </div>
                        )}

                        {/* <div className="px-8">
                            <div className="bg-c1 p-2 w-full flex flex-wrap mt-2">
                                <p className="mr-10">02 desvio de itinerário</p>
                                <p className="mr-10">02 desvio de itinerário</p>
                                <p className="mr-10">02 desvio de itinerário</p>
                            </div>
                        </div> */}

                        <hr className="mt-5 mb-5" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export default SynopticLines;
