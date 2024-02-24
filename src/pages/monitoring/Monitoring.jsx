/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { subMinutes } from "date-fns";
import moment from "moment";

import Title from "../../components/Title";

import PillColor from "../../components/PillColor";
import BusLine from "../../components/Bus/BusLine";
import TimelineBus from "../../components/Timeline/TimelineBus";
import SearchEngine from "../../components/Filter/SearchEngine";
import CollapseRealTime from "./components/CollapseRealTime";
import Replay from "./components/Replay";
import MapReplay from "./components/MapReplay";
import busGrayRightSVG from "../../assets/svgs/bus/bus-gray-right.svg";
import { dateObjToString } from "../../assets/utils/dates";
import idaLeftSVG from "../../assets/svgs/arrow-thick-left.svg";
import idaRightSVG from "../../assets/svgs/arrow-thick-right.svg";
import { getDates, getGeolocation } from "./services/apis";
import { ClipLoader } from "react-spinners";
import Colors from "../../assets/constants/Colors";
import { toast } from "react-toastify";

const Monitoring = props => {
    const [openTabGraph, setOpenTabGraph] = useState(1);
    const [dateLimit, setDateLimit] = useState({
        min: moment().format("YYYY-MM-DD HH:mm:ss"),
        max: moment().format("YYYY-MM-DD HH:mm:ss"),
    });
    const [search, setSearch] = useState({
        startsAt: subMinutes(new Date(), 61),
        endsAt: subMinutes(new Date(), 1),
    });

    const [vehicles, setVehicles] = useState({});
    const [load, setLoad] = useState(true);
    const status = useState({
        onTime: [
            {
                line: "05B",
                numberLine: "783",
                color: "bg-buslab",
            },
            {
                line: "05B",
                numberLine: "783",
                color: "bg-buslab",
            },
            {
                line: "05B",
                numberLine: "783",
                color: "bg-buslab",
            },
        ],
        inAdvance: [
            {
                line: "05B",
                numberLine: "783",
                color: "bg-amarelo",
            },
            {
                line: "05B",
                numberLine: "783",
                color: "bg-amarelo",
            },
            {
                line: "05B",
                numberLine: "783",
                color: "bg-amarelo",
            },
        ],
        Delayed: [
            {
                line: "05B",
                numberLine: "783",
                color: "bg-laranja",
            },
            {
                line: "05B",
                numberLine: "783",
                color: "bg-laranja",
            },
            {
                line: "05B",
                numberLine: "783",
                color: "bg-laranja",
            },
        ],
        stoppedStartingPoint: [
            {
                line: "05B",
                numberLine: "783",
                color: "bg-c6",
            },
            {
                line: "05B",
                numberLine: "783",
                color: "bg-c6",
            },
            {
                line: "05B",
                numberLine: "783",
                color: "bg-c6",
            },
        ],
        stoppedEndPoint: [
            {
                line: "05B",
                numberLine: "783",
                color: "bg-c6",
            },
            {
                line: "05B",
                numberLine: "783",
                color: "bg-c6",
            },
            {
                line: "05B",
                numberLine: "783",
                color: "bg-c6",
            },
        ],
        OutOfOperation: [
            {
                line: "05B",
                numberLine: "783",
                color: "bg-c6",
            },
            {
                line: "05B",
                numberLine: "783",
                color: "bg-c6",
            },
            {
                line: "05B",
                numberLine: "783",
                color: "bg-c6",
            },
        ],
        UnderMaintenance: [
            {
                line: "05B",
                numberLine: "783",
                color: "bg-c6",
            },
            {
                line: "05B",
                numberLine: "783",
                color: "bg-c6",
            },
            {
                line: "05B",
                numberLine: "783",
                color: "bg-c6",
            },
        ],
    });

    const getReplayGeolocation = async search => {
        setLoad(true);
        return getGeolocation(search)
            .then(response => {
                setVehicles(response.data.data);
                setDateLimit({
                    min: response.data.firstDate,
                    max: response.data.lastDate,
                });
                setLoad(false);
            })
            .catch(error => {
                toast.info("a busca falhou, tente novamente");
                setLoad(false);
            });
    };

    useEffect(() => {
        if (search.startsAt instanceof Date) {
            getReplayGeolocation({
                ...search,
                startsAt: dateObjToString(search.startsAt),
                endsAt: dateObjToString(search.endsAt),
            });
        } else {
            getReplayGeolocation(search);
        }
    }, [search]);
    useEffect(() => {
        getDates().then(response => {
            //console.log(response);
        });
    }, []);

    const Synoptic = () => {
        return (
            <div className="mt-8">
                <Replay startsAt={dateLimit.min} endsAt={dateLimit.max} />
                <div className="px-8">
                    <h4 className="text-buslab font-light ">05B - Sentido Paço / Laura</h4>
                    <div className="flex justify-between mt-2 flex-wrap">
                        <div className="w-full sm:w-full md:w-1/2 lg:w-1/2">
                            <p className="font-medium mb-2">parados no ponto inicial</p>
                            <div className="border mr-2 flex p-1">
                                <BusLine
                                    list={[
                                        { img: busGrayRightSVG, number: "111" },
                                        { img: busGrayRightSVG, number: "738" },
                                        { img: busGrayRightSVG, number: "888" },
                                        { img: busGrayRightSVG, number: "999" },
                                    ]}
                                />
                            </div>
                        </div>
                        <div className="w-full sm:w-full md:w-1/2 lg:w-1/2">
                            <p className="font-medium ml-2 sm:ml-0 mb-2">parados no ponto final</p>
                            <div className="border ml-2 sm:ml-0 p-1">
                                <BusLine
                                    list={[
                                        { img: busGrayRightSVG, number: "111" },
                                        { img: busGrayRightSVG, number: "738" },
                                        { img: busGrayRightSVG, number: "888" },
                                        { img: busGrayRightSVG, number: "999" },
                                    ]}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center mt-4">
                        <img
                            className="cursor-pointer font-light w-2 inline mr-2"
                            alt="Seta Esquerda"
                            src={idaRightSVG}
                        />
                        <p className="font-medium">ida</p>
                    </div>
                </div>
                <TimelineBus />
                <div className="px-8">
                    <div className="flex items-center mt-2">
                        <img
                            className="cursor-pointer font-light w-2 inline mr-2"
                            alt="Seta Esquerda"
                            src={idaLeftSVG}
                        />
                        <p className="font-medium">volta</p>
                    </div>
                    <div className="bg-c1 p-2 w-full flex flex-wrap mt-2">
                        <p className="mr-10">02 desvio de itinerário</p>
                        <p className="mr-10">02 desvio de itinerário</p>
                        <p className="mr-10">02 desvio de itinerário</p>
                    </div>
                </div>
            </div>
        );
    };

    const StickerBus = ({ list }) => {
        if (list === undefined) return null;
        return list.map((list, index) => (
            <div key={index} className={`bg-c3 rounded-sm h-8 w-8 mr-6`}>
                <p className="font-medium text-12  mb-1 text-center">{list.line}</p>
                <div
                    className={`${list.color} rounded-full h-8 -mt-1 flex items-center  justify-center`}>
                    <p className="text-white text-12 font-medium">{list.numberLine}</p>
                </div>
            </div>
        ));
    };

    return (
        <>
            <Title title={"Replay de trajetos"} crumbs={props.crumbs} />
            <SearchEngine
                search={search}
                setSearch={setSearch}
                type={{
                    dateAndHour: true,
                    vehicle: true,
                    driver: true,
                    line: true,
                    company: true,
                }}
            />
            <div className="m-6">
                <>
                    <div className="flex flex-wrap ">
                        <div className="w-full">
                            <ul
                                className={`flex list-none flex-wrap flex-row ${
                                    openTabGraph === 1
                                        ? "bg-c4"
                                        : openTabGraph === 2
                                        ? "bg-c2"
                                        : "bg-white"
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
                                        Mapa de replay
                                    </a>
                                </li>
                            </ul>
                            <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
                                <div className="px-4 py-5 flex-auto">
                                    <div className="tab-content tab-space">
                                        <div
                                            className={openTabGraph === 1 ? "block" : "hidden"}
                                            id="link1">
                                            {load ? (
                                                <div className="w-full mt-4">
                                                    <div className="flex justify-center">
                                                        <ClipLoader
                                                            size={20}
                                                            color={Colors.buslab}
                                                            loading={true}
                                                        />
                                                    </div>
                                                </div>
                                            ) : Object.entries(vehicles).length > 0 ? (
                                                <MapReplay
                                                    setDateLimit={setDateLimit}
                                                    dateLimit={dateLimit}
                                                    vehicles={vehicles}
                                                    search={search}
                                                    onFinish={() => {
                                                        setVehicles({ ...vehicles });
                                                    }}
                                                />
                                            ) : (
                                                <div className="flex justify-center">
                                                    <p className="center">
                                                        Nenhum replay encontrado, tente outro
                                                        período{" "}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        <div
                                            className={openTabGraph === 2 ? "block" : "hidden"}
                                            id="link2">
                                            <div className="flex flex-wrap justify-between w-full md:w-1/2 lg:w-1/2 mb-2">
                                                <PillColor
                                                    list={[
                                                        {
                                                            text: "no horário (0)",
                                                            color: "bg-azul",
                                                        },
                                                        {
                                                            text: "adiantado (0)",
                                                            color: "bg-amarelo",
                                                        },
                                                        {
                                                            text: "atrasado (0)",
                                                            color: "bg-laranja",
                                                        },
                                                        {
                                                            text: "fora de operação (0)",
                                                            color: "bg-c5",
                                                        },
                                                        {
                                                            text: "fora da rota (0)",
                                                            color: "bg-vermelho",
                                                        },
                                                    ]}
                                                />
                                            </div>
                                            <Synoptic />
                                        </div>
                                        <div
                                            className={openTabGraph === 3 ? "block" : "hidden"}
                                            id="link3">
                                            <div className="flex flex-wrap justify-between w-full md:w-1/2 lg:w-1/2 mb-2">
                                                <PillColor
                                                    list={[
                                                        {
                                                            text: "no horário (0)",
                                                            color: "bg-azul",
                                                        },
                                                        {
                                                            text: "adiantado (0)",
                                                            color: "bg-amarelo",
                                                        },
                                                        {
                                                            text: "atrasado (0)",
                                                            color: "bg-laranja",
                                                        },
                                                        {
                                                            text: "fora de operação (0)",
                                                            color: "bg-c5",
                                                        },
                                                    ]}
                                                />
                                            </div>
                                            <div className="mb-10">
                                                <p className="font-medium mb-1">No horário</p>
                                                <div className="border rounded-sm p-2 pb-8 flex flex-wrap">
                                                    <StickerBus list={status.onTime} />
                                                </div>
                                            </div>
                                            <div className="mb-10">
                                                <p className="font-medium mb-1">Adiantados</p>
                                                <div className="border rounded-sm p-2 pb-8 flex flex-wrap">
                                                    <StickerBus list={status.inAdvance} />
                                                </div>
                                            </div>
                                            <div className="mb-10">
                                                <p className="font-medium mb-1">Atrasados</p>
                                                <div className="border rounded-sm p-2 pb-8 flex flex-wrap">
                                                    <StickerBus list={status.Delayed} />
                                                </div>
                                            </div>
                                            <div className="mb-10">
                                                <p className="font-medium mb-1">
                                                    Parados no ponto inicial
                                                </p>
                                                <div className="border rounded-sm p-2 pb-8 flex flex-wrap">
                                                    <StickerBus
                                                        list={status.stoppedStartingPoint}
                                                    />
                                                </div>
                                            </div>
                                            <div className="mb-10">
                                                <p className="font-medium mb-1">
                                                    Parados no ponto final
                                                </p>
                                                <div className="border rounded-sm p-2 pb-8 flex flex-wrap">
                                                    <StickerBus list={status.stoppedEndPoint} />
                                                </div>
                                            </div>
                                            <div className="mb-10">
                                                <p className="font-medium mb-1">Fora de operação</p>
                                                <div className="border rounded-sm p-2 pb-8 flex flex-wrap">
                                                    <StickerBus list={status.OutOfOperation} />
                                                </div>
                                            </div>
                                            <div className="mb-10">
                                                <p className="font-medium mb-1">Em manutenção</p>
                                                <div className="border rounded-sm p-2 pb-8 flex flex-wrap">
                                                    <StickerBus list={status.UnderMaintenance} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            </div>
        </>
    );
};

export default Monitoring;
