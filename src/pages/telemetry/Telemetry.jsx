import React, { useState } from "react";
import Fade from "react-reveal/Fade";
import { MdKeyboardArrowUp, MdKeyboardArrowDown, MdFileDownload } from "react-icons/md";
import { subDays } from "date-fns";

import { getNewSearch } from "../../hooks/useFilterFormat";
import { IoIosCloudDownload } from "react-icons/io";
import { dateObjToString } from "../../assets/utils/dates";
import { fileDownload } from "../../services/requests";
import "../../assets/styles/checkbox.css";
import targetSVG from "../../assets/svgs/target.svg";
import Colors from "../../assets/constants/Colors";
import DriversHigherPerformance from "../dashboard/Tables/DriversHigherPerformance";
import LowerPerformanceDrivers from "../dashboard/Tables/LowerPerformanceDrivers";
import Title from "../../components/Title";
import HeatMapChart from "../../components/Charts/HeatMap";
import AverageHourlyCompliance from "../../components/Charts/AverageHourlyCompliance";
import SearchEngine from "../../components/Filter/SearchEngine";
import AverageTrip from "../../components/Charts/AverageTrip";
import TimeTrip from "../../components/Charts/TimeTrip";
import ButtonDefault from "../../components/Buttons/default/ButtonDefault";
import ButtonIconTextDefault from "../../components/Buttons/default/ButtonIconTextDefault";
import BetterLowerConsumptionChart from "./Charts/BetterLowerConsumption";
import TotalEventChart from "./Charts/TotalEvents";
import AlertFrequency from "./Charts/AlertFrequency";
import { getPastDays } from "../../components/Filter/utils";

const Telemetry = props => {
    const [search, setSearch] = useState({
        ...getPastDays(7),
    });
    const [occurrence, setOccurrence] = useState(false);
    const [openTabGraph, setOpenTabGraph] = useState(1);
    const [openCollapsible, setOpenCollapsible] = useState(1);

    // reports download
    const reportRoutes = [
        "/api/telemetry/export-consumption",
        "/api/telemetry/export-occurrence",
        "/api/telemetry/export-time-trip",
    ];
    const csvNames = ["Relatório de Consumo", "Relatório de Ocorrências", "Relatório de Viagem"];
    const type = {
        company: true,
        period: true,
        line: true,
        sector: true,
        occurrenceType: true,
        driver: true,
        vehicle: true,
        direction: true,
    };

    const Collapsible = () => {
        const actionCollapsible = tab => {
            setOpenCollapsible(tab);
        };
        return null;

        return (
            <>
                <article className="mt-6">
                    <header
                        className="flex justify-between items-center p-4 cursor-pointer bg-c3 rounded-md"
                        onClick={() =>
                            openCollapsible === 1 ? actionCollapsible(0) : actionCollapsible(1)
                        }>
                        <span className="text-c7-16 font-medium text-xl">
                            Média de consumo por motorista
                        </span>
                        <div className="w-7 h-7 flex items-center justify-center">
                            {openCollapsible === 1 ? (
                                <MdKeyboardArrowUp size={25} color={Colors.C6} />
                            ) : (
                                <MdKeyboardArrowDown size={25} color={Colors.C6} />
                            )}
                        </div>
                    </header>
                    {openCollapsible === 1 && (
                        <Fade>
                            <div className="p-2 text-grey-darkest">
                                <RenderTable />
                            </div>
                        </Fade>
                    )}
                </article>
                <article className="mt-6">
                    <header
                        className="flex justify-between items-center p-4 cursor-pointer bg-c3 rounded-md"
                        onClick={() =>
                            openCollapsible === 2 ? actionCollapsible(0) : actionCollapsible(2)
                        }>
                        <span className="text-c7-16 font-medium text-xl">Consumo por linha</span>
                        {openCollapsible === 2 ? (
                            <MdKeyboardArrowUp size={25} color={Colors.C6} />
                        ) : (
                            <MdKeyboardArrowDown size={25} color={Colors.C6} />
                        )}
                    </header>
                    {openCollapsible === 2 && (
                        <Fade>
                            <div className="p-2 text-grey-darkest">
                                <RenderTable />
                            </div>
                        </Fade>
                    )}
                </article>
                <article className="mt-6">
                    <header
                        className="flex justify-between items-center p-4 cursor-pointer bg-c3 rounded-md"
                        onClick={() =>
                            openCollapsible === 3 ? actionCollapsible(0) : actionCollapsible(3)
                        }>
                        <span className="text-c7-16 font-medium text-xl">Consumo por modelo</span>
                        {openCollapsible === 3 ? (
                            <MdKeyboardArrowUp size={25} color={Colors.C6} />
                        ) : (
                            <MdKeyboardArrowDown size={25} color={Colors.C6} />
                        )}
                    </header>
                    {openCollapsible === 3 && (
                        <Fade>
                            <div className="p-2 text-grey-darkest">
                                <RenderTable />
                            </div>
                        </Fade>
                    )}
                </article>
                <article className="mt-6">
                    <header
                        className="flex justify-between items-center p-4 cursor-pointer bg-c3 rounded-md"
                        onClick={() =>
                            openCollapsible === 4 ? actionCollapsible(0) : actionCollapsible(4)
                        }>
                        <span className="text-c7-16 font-medium text-xl">Consumo por veículo</span>
                        {openCollapsible === 4 ? (
                            <MdKeyboardArrowUp size={25} color={Colors.C6} />
                        ) : (
                            <MdKeyboardArrowDown size={25} color={Colors.C6} />
                        )}
                    </header>
                    {openCollapsible === 4 && (
                        <Fade>
                            <div className="p-2 text-grey-darkest">
                                <RenderTable />
                            </div>
                        </Fade>
                    )}
                </article>
                <article className="mt-6">
                    <header
                        className="flex justify-between items-center p-4 cursor-pointer bg-c3 rounded-md"
                        onClick={() =>
                            openCollapsible === 5 ? actionCollapsible(0) : actionCollapsible(5)
                        }>
                        <span className="text-c7-16 font-medium text-xl">Eventos</span>
                        {openCollapsible === 5 ? (
                            <MdKeyboardArrowUp size={25} color={Colors.C6} />
                        ) : (
                            <MdKeyboardArrowDown size={25} color={Colors.C6} />
                        )}
                    </header>
                    {openCollapsible === 5 && (
                        <div className="p-2 text-grey-darkest">
                            <div className="overflow-auto">
                                <table className="table-auto w-full">
                                    <thead>
                                        <tr className="text-primary">
                                            <th className="px-3 py-2 text-left font-medium text-14">
                                                Evento
                                            </th>
                                            <th className="px-3 py-2 text-left font-medium text-14">
                                                Hora
                                            </th>
                                            <th className="px-3 py-2 text-left font-medium text-14">
                                                Onibus
                                            </th>
                                            <th className="px-3 py-2 text-left font-medium text-14">
                                                Motorista
                                            </th>
                                            <th className="px-3 py-2 text-left font-medium text-14">
                                                Linha
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="bg-tablerow">
                                            <td className="px-4 py-2 text-14 font-light text-c8">
                                                <img
                                                    className="cursor-pointer font-light w-4 text-primary inline mr-4"
                                                    alt="Ver"
                                                    src={targetSVG}
                                                    onClick={() => {}}
                                                />
                                                000
                                            </td>
                                            <td className="px-4 py-2 text-14 font-light text-c8">
                                                000
                                            </td>
                                            <td className="px-4 py-2 text-14 font-light text-c8">
                                                000
                                            </td>
                                            <td className="px-4 py-2 text-14 font-light text-c8">
                                                000
                                            </td>
                                            <td className="px-4 py-2 text-14 font-light text-c8">
                                                000
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-2 text-14 font-light text-c8">
                                                <img
                                                    className="cursor-pointer font-light w-4 text-primary inline mr-4"
                                                    alt="Ver"
                                                    src={targetSVG}
                                                    onClick={() => {}}
                                                />
                                                000
                                            </td>
                                            <td className="px-4 py-2 text-14 font-light text-c8">
                                                000
                                            </td>
                                            <td className="px-4 py-2 text-14 font-light text-c8">
                                                000
                                            </td>
                                            <td className="px-4 py-2 text-14 font-light text-c8">
                                                000
                                            </td>
                                            <td className="px-4 py-2 text-14 font-light text-c8">
                                                000
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </article>
            </>
        );
    };

    const RenderTable = () => {
        return <div className="overflow-auto"></div>;
    };

    const TabsGraph = () => {
        return (
            <>
                <div className="flex w-full ">
                    <div className="w-full">
                        <section
                            className={`flex flex-wrap items-center justify-between 
                                ${
                                    openTabGraph === 3
                                        ? "bg-white rounded-t"
                                        : openTabGraph === 2
                                        ? "bg-c2 rounded-t"
                                        : "bg-c4 rounded-t"
                                }`}>
                            <ul
                                className={`flex list-none flex-wrap flex-row rounded-t ${
                                    openTabGraph === 1
                                        ? "bg-c4"
                                        : openTabGraph === 2
                                        ? "bg-c4"
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
                                            setOccurrence(false);
                                        }}
                                        data-toggle="tab"
                                        href="#link1"
                                        role="tablist">
                                        Consumo
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className={
                                            " py-3 px-4 text-gray-700 inline-block font-medium " +
                                            (openTabGraph === 2
                                                ? "bg-white rounded-t"
                                                : openTabGraph === 1 || openTabGraph === 3
                                                ? "bg-c2 rounded-t"
                                                : "bg-c4 rounded-t")
                                        }
                                        onClick={e => {
                                            e.preventDefault();
                                            setOpenTabGraph(2);
                                            setOccurrence(true);
                                        }}
                                        data-toggle="tab"
                                        href="#link2"
                                        role="tablist">
                                        Ocorrências
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className={
                                            " py-3 px-4 text-gray-700 inline-block font-medium " +
                                            (openTabGraph === 3
                                                ? "bg-white rounded-t"
                                                : openTabGraph === 2
                                                ? "bg-c2 rounded-t"
                                                : "bg-c4 rounded-t")
                                        }
                                        onClick={e => {
                                            e.preventDefault();
                                            setOpenTabGraph(3);
                                            setOccurrence(false);
                                        }}
                                        data-toggle="tab"
                                        href="#link3"
                                        role="tablist">
                                        Tempo de viagem
                                    </a>
                                </li>
                            </ul>
                            <ButtonIconTextDefault
                                className="mr-2"
                                icon={<IoIosCloudDownload />}
                                onClick={() =>
                                    fileDownload({
                                        route: reportRoutes[openTabGraph - 1],
                                        filename: csvNames[openTabGraph - 1],
                                        ext: "csv",
                                        search: getNewSearch(search),
                                    })
                                }
                                title={"Exportar"}
                            />
                        </section>

                        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
                            <div className="px-4 py-5 font-light text-14 text-c8 flex-auto">
                                <div className="tab-content tab-space">
                                    {openTabGraph === 1 && (
                                        <section id="link1">
                                            <h4 className="font-medium mt-3 mb-4">
                                                Melhores e piores consumos do período
                                            </h4>
                                            <BetterLowerConsumptionChart search={search} />
                                            <h4 className="font-medium mt-3 mb-4">
                                                Relação da média do consumo/hora do período
                                            </h4>
                                            <HeatMapChart
                                                type={"averageConsumption"}
                                                search={search}
                                            />

                                            <div className="flex mt-3 flex-wrap ">
                                                <div className="w-full sm:w-full md:w-full lg:w-1/2 px-2">
                                                    <div className="bg-white p-4 h-full">
                                                        <h4 className="font-medium">
                                                            Motoristas com melhor desempenho - Km/L
                                                        </h4>
                                                        <p className="text-c5 mb-2 font-light">
                                                            (Km/L)
                                                        </p>
                                                        <DriversHigherPerformance />
                                                    </div>
                                                </div>
                                                <div className="w-full sm:w-full  md:w-full lg:w-1/2 px-2 ">
                                                    <div className="bg-white p-4 h-full">
                                                        <h4 className="font-medium">
                                                            Motoristas com melhor desempenho -
                                                            Ocorrência/Km percorrido
                                                        </h4>
                                                        <p className="text-c5 mb-2 font-light">
                                                            Ocorrência/Km percorrido
                                                        </p>
                                                        <LowerPerformanceDrivers />
                                                    </div>
                                                </div>
                                            </div>

                                            <Collapsible />
                                        </section>
                                    )}
                                    {openTabGraph === 2 && (
                                        <section id="link2">
                                            <h4 className="font-medium mt-3 mb-4">
                                                Frequência de ocorrências em todas as viagens do
                                                período
                                            </h4>
                                            <AlertFrequency search={search} />
                                            <h4 className="font-medium mt-3 mb-4 mt-8">
                                                Total de ocorrência no período
                                            </h4>
                                            <TotalEventChart search={search} />
                                        </section>
                                    )}

                                    {openTabGraph === 3 && (
                                        <section id id="link3">
                                            <h4 className="font-medium mt-3 mb-4">
                                                Média de tempo de viagem por sentido da faixa
                                                horária
                                            </h4>
                                            <AverageHourlyCompliance search={search} />
                                            <h4 className="font-medium mt-3 mb-4">
                                                Fator de cumprimento de viagem
                                            </h4>
                                            <AverageTrip search={search} />
                                            <h4 className="font-medium mt-3 mb-4">
                                                Índice de pontualidade
                                            </h4>
                                            <TimeTrip search={search} />
                                        </section>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    };

    return (
        <>
            <Title title={"Telemetria"} crumbs={props.crumbs} />
            <SearchEngine
                search={search}
                setSearch={setSearch}
                report
                type={{ ...type, sector: occurrence, occurrenceType: occurrence }}
            />
            <div className="m-6">
                <TabsGraph />
            </div>
        </>
    );
};

export default Telemetry;
