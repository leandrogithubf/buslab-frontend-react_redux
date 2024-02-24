import React from "react";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Bar } from "recharts";
import Colors from "../../../assets/constants/Colors";
import PillColor from "../../../components/PillColor";
const AverageConsumptionGreetingChart = () => {
    const data = [
        {
            name: "00/00",
            period: "08:00 - 10:00",
            onTime: 50,
            late: 25,
            advance: 25,
        },
        {
            name: "00/00",
            period: "08:00 - 10:00",
            onTime: 50,
            late: 25,
            advance: 25,
        },
        {
            name: "00/00",
            period: "08:00 - 10:00",
            onTime: 50,
            late: 25,
            advance: 25,
        },
        {
            name: "00/00",
            period: "08:00 - 10:00",
            onTime: 50,
            late: 25,
            advance: 25,
        },
        {
            name: "00/00",
            onTime: 50,
            late: 25,
            advance: 25,
        },
        {
            name: "00/00",
            period: "08:00 - 10:00",
            onTime: 50,
            late: 25,
            advance: 25,
        },
    ];
    return (
        <>
            <ResponsiveContainer height={384} width={"100%"}>
                <BarChart data={data}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Bar barSize={20} dataKey="onTime" stackId="chartAverage" fill={Colors.azul} />
                    <Bar barSize={20} dataKey="late" stackId="chartAverage" fill={Colors.vermelho} />
                    <Bar barSize={20} dataKey="advance" stackId="chartAverage" fill={Colors.amarelo} />
                </BarChart>
            </ResponsiveContainer>
            <div className="flex">
                <PillColor
                    styled={"mb-10 mt-4 mr-4 ml-8"}
                    list={[
                        {
                            text: "no horário",
                            color: "bg-azul",
                        },
                        {
                            text: "com atraso",
                            color: "bg-vermelho",
                        },
                        {
                            text: "adiantados",
                            color: "bg-amarelo",
                        },
                    ]}
                />
            </div>
        </>
    );
};
export default AverageConsumptionGreetingChart;
