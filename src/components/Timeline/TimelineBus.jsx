import React, { useState } from "react";
import Swiper from "react-id-swiper";
import Colors from "../../assets/constants/Colors";
import { ReactComponent as BusBlueLeftSVG } from "../../assets/svgs/bus/bus-blue-left.svg";
import { ReactComponent as BusBlueRightSVG } from "../../assets/svgs/bus/bus-blue-right.svg";
import chevronLeftSVG from "../../assets/svgs/cheveron-left.svg";
import chevronRightSVG from "../../assets/svgs/cheveron-right.svg";
import "./style.css";

const TimelineBus = ({ line, vehicles }) => {
    const [selected, setSelected] = useState({});
    const [onClicked, setOnClicked] = useState(false);

    const colors = {
        OFF_ROUTE: Colors.vermelho,
        IN_ROUTE_EARLY: Colors.amarelo,
        IN_ROUTE_LATE: Colors.laranja,
        IN_ROUTE: Colors.azul,
    };

    const handlerPopupInformation = info => {
        setSelected(info);
        if (info.identifier === selected.identifier || Object.keys(selected).length === 0) {
            setOnClicked(!onClicked);
        }
    };

    const ButtonPagination = ({ type }) => (
        <img
            className={`cursor-pointer w-2 ${type === "prev" ? "mr-4" : "ml-4"}`}
            alt={type === "prev" ? "Anterior" : "Próximo"}
            src={type === "prev" ? chevronLeftSVG : chevronRightSVG}
        />
    );

    const PaginationSwiper = () => (
        <div className="ml-2 w-full">
            <div className="flex justify-between mt-6">
                {line.points.map((point, index) => {
                    const TitleGraph = () => (
                        <p key={index} className="number-ruller -ml-1">
                            {line.direction === "RETURN" ? line.points.length - index : index + 1}
                        </p>
                    );
                    const BarMiddle = () => <div className="border-b-2 w-full" />;

                    const CarRoute = () =>
                        vehicles.map(itinerary => {
                            const last = line.points.length - 1 === index;
                            return (
                                index > 0 &&
                                (line.direction === "RETURN"
                                    ? line.points.length - index === itinerary?.lastPoint
                                    : index + 1 === itinerary?.lastPoint) && (
                                    <div
                                        key={itinerary.identifier}
                                        className=" absolute items-center w-10 flex mt-1 m-2 cursor-pointer"
                                        onClick={() => handlerPopupInformation({ ...point, last })}>
                                        {line.direction !== "RETURN" ? (
                                            <BusBlueRightSVG
                                                fill={colors[itinerary.status]}
                                                className="cursor-pointer font-light w-10"
                                            />
                                        ) : (
                                            <BusBlueLeftSVG
                                                fill={colors[itinerary.status]}
                                                className="cursor-pointer font-light w-10"
                                            />
                                        )}

                                        <p className="absolute text-white text-12 font-medium ml-2">
                                            {itinerary.prefix}
                                        </p>
                                    </div>
                                )
                            );
                        });

                    return (
                        <div className="w-full" key={index}>
                            {point.identifier === selected.identifier && onClicked && (
                                <div
                                    className={`${
                                        selected.last ? "-ml-32" : ""
                                    } w-48 bg-white border rounded-md p-2 z-50 absolute mt-12`}>
                                    Endereço:{" "}
                                    {selected.address ? selected.address : "Não informado"} <br />
                                    Status:{" "}
                                    {selected.isActive ? selected.isActive : "Não informado"} <br />
                                    Latitude:{" "}
                                    {selected.latitude ? selected.latitude : "Não informado"}
                                    <br />
                                    Longitude:{" "}
                                    {selected.longitude ? selected.longitude : "Não informado"}
                                    <br />
                                    Sequência:{" "}
                                    {selected.sequence ? selected.sequence : "Não informado"}
                                    <br />
                                </div>
                            )}
                            <TitleGraph />
                            <div className="border-l justify-center self-center items-center h-8">
                                <CarRoute />
                            </div>
                            <BarMiddle />
                        </div>
                    );
                })}
            </div>
        </div>
    );

    return (
        <div className="justify-center items-center self-center ">
            <Swiper noSwiping={true}>
                {line !== undefined && line.points !== undefined && line.points.length > 0 ? (
                    <div className="w-full h-32 flex justify-between ">
                        <ButtonPagination type="prev" />
                        <PaginationSwiper />
                        <ButtonPagination type="next" />
                    </div>
                ) : (
                    <div className="flex justify-start">
                        <p>Linha sem pontos</p>
                    </div>
                )}
            </Swiper>
        </div>
    );
};
export default TimelineBus;
