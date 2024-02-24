import React from "react";

import PillColor from "../../../components/PillColor";
import ScheduledTrips from "../../../components/Charts/ScheduledTrips";

const ScheduledTripsChart = () => {
    return (
        <>
            <div className="flex justify-between flex-wrap">
                <div className=" sm:w-full md:w-2/3 lg:w-2/3">
                    <ScheduledTrips />
                </div>
                <div className="sm:w-full md:w-1/3 lg:w-1/3 ">
                    <div className="md:mt-8 lg:mt-6 xl:mt-20 sm:ml-12">
                        <PillColor
                            styled={"mb-4"}
                            list={[
                                {
                                    text: "concluídas pontualmente",
                                    color: "bg-esmeralda",
                                },
                                {
                                    text: "concluídas com atraso",
                                    color: "bg-amarelo",
                                },
                                {
                                    text: "concluídas adiantadamente",
                                    color: "bg-c3",
                                },
                                {
                                    text: "não realizadas",
                                    color: "bg-vermelho",
                                },
                            ]}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default ScheduledTripsChart;
