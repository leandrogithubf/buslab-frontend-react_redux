import React, { useState, useEffect } from "react";
import HeaderToken from "../../../services/headerToken";
import api from "../../../services/api";
import Interceptor from "../../../services/interceptor";

import PillColor from "../../../components/PillColor";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import Colors from "../../../assets/constants/Colors";

const EventsChart = () => {
    const [data, setData] = useState(false);

    useEffect(() => {
        getData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getData = () => {
        api.get(`api/dashboard/events`, HeaderToken())
            .then(response => {
                setData(response.data.formatted);
            })
            .catch(error => {
                Interceptor(error);
            })
        ;
    };

    return (
        <>
            <ResponsiveContainer height={220} width={"100%"}>
                <BarChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                        tick={{ stroke: "#6D6D6D", strokeWidth: 0.1, width: 50 }}
                        textAnchor="middle"
                        height={50}
                        dataKey="name"
                        allowDataOverflow={true}
                        type="category"
                    />
                    <YAxis />
                    <Bar barSize={20} dataKey="today" fill={Colors.azul} />
                    <Bar barSize={20} dataKey="yesterday" fill={Colors.esmeralda} />
                    <Bar barSize={20} dataKey="thisWeek" fill={Colors.amarelo} />
                    <Bar barSize={20} dataKey="thisMonth" fill={Colors.laranja} />
                </BarChart>
            </ResponsiveContainer>
            <div className="p-8 flex flex-wrap justify-between w-full sm:w-full md:w-full lg:w-1/2">
                <PillColor
                    list={[
                        {
                            text: "Hoje",
                            color: "bg-azul",
                        },
                        {
                            text: "Ontem",
                            color: "bg-esmeralda",
                        },
                        {
                            text: "Essa semana",
                            color: "bg-amarelo",
                        },
                        {
                            text: "Esse mês",
                            color: "bg-laranja",
                        },
                    ]}
                />
            </div>
        </>
    );
};

export default EventsChart;
