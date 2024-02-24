import React, { useState } from "react";
import Title from "../../components/Title";
import { Link } from "react-router-dom";
import ScheduledTripsChart from "./Charts/ScheduledTripsChart";
import EventsChart from "./Charts/EventsChart";
import LowerPerformancesChart from "./Charts/LowerPerformancesChart";
import OperationalScore from "./Tables/OperationalScore";
import DriversHigherPerformance from "./Tables/DriversHigherPerformance";
import LowerPerformanceDrivers from "./Tables/LowerPerformanceDrivers";
import NewOccurrence from "./Forms/NewOccurrence";
import NewFuel from "./Forms/NewFuel";
import NewConsumption from "./Forms/NewConsumption";
import ConsumptionChart from "./Charts/ConsumptionChart";

const Dashboard = props => {
    const [actionQuote, setActionQuote] = useState(false);
    const [actionConsumption, setActionConsumption] = useState(false);

    return (
        <>
            <Title title={"Dashboard"} crumbs={props.crumbs} />
            <div className="p-4 pt-6">
                <div className="flex flex-wrap ">
                    <div className=" w-full sm:w-full md:w-full lg:w-1/3 px-2">
                        <div className="bg-white p-4 h-full">
                            <div className="flex justify-between mb-8">
                                <h4 className="font-medium">Placar operacional</h4>
                            </div>
                            <OperationalScore />
                        </div>
                    </div>
                    <div className=" w-screen sm:w-screen md:w-screen lg:w-2/3 px-2">
                        <div className="bg-white mb-8 pb-8">
                            <h4 className="font-medium pt-4 pl-6">Viagens programadas</h4>
                            <ScheduledTripsChart />
                        </div>
                        <div className="bg-white">
                            <h4 className="font-medium pt-4 pl-10 mb-8">Ocorrências</h4>
                            <EventsChart />
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-4">
                <div className="flex flex-wrap ">
                    <div className="w-full sm:w-full md:w-full lg:w-1/2 px-2">
                        <div className="bg-white p-4 h-full">
                            <h4 className="font-medium">Motoristas com melhor desempenho - Km/L</h4>
                            <p className="text-c5 mb-2 font-light">
                                (Km/L)
                            </p>
                            <DriversHigherPerformance />
                        </div>
                    </div>
                    <div className="w-full sm:w-full  md:w-full lg:w-1/2 px-2 ">
                        <div className="bg-white p-4 h-full">
                            <h4 className="font-medium">Motoristas com melhor desempenho - Km percorrido/Ocorrência</h4>
                            <p className="text-c5 mb-2 font-light">
                            Km percorrido/Ocorrência
                            </p>
                            <LowerPerformanceDrivers />
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-4">
                <div className="flex flex-wrap ">
                    <div className="w-full sm:w-full md:w-full lg:w-1/2 px-2 ">
                        <div className="bg-white p-4 h-full">
                            <h4 className="font-medium">Cadastrar cotação diária de combustível</h4>
                            <NewFuel />
                            <p className="underline text-right text-azul mb-4 cursor-pointer">
                                <Link to="/fuel">Registros passados</Link>
                            </p>
                            <p className="font-medium mb-8">Últimas cotações (dia/preço por litro)</p>
                            <LowerPerformancesChart actionQuote={actionQuote} />
                        </div>
                    </div>
                    <div className="w-full sm:w-full md:w-full lg:w-1/2 px-2 ">
                        <div className="bg-white p-4 h-full">
                            <h4 className="font-medium">Consumo diário de km/l</h4>
                            <NewConsumption />
                            <p className="underline text-right text-azul mb-4 cursor-pointer">
                                <Link to="/consumption">Registros passados</Link>
                            </p>
                            <p className="font-medium mb-8">Últimos registros de consumo (dia/km/l)</p>
                            <ConsumptionChart actionConsumption={actionConsumption} />
                        </div>
                    </div>
                </div>
            </div>
            <NewOccurrence setActionQuote={setActionQuote} />
        </>
    );
};

export default Dashboard;
