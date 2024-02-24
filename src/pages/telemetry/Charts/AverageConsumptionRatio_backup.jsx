import React from "react";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Bar } from "recharts";
import Colors from "../../../assets/constants/Colors";
import PillColor from "../../../components/PillColor";
const AverageConsumptionRatioChart = () => {
    const data = [
        {
            name: "30/10",
            period: "08:00 - 10:00",
            great: 50,
            average: 25,
            excessive: 25,
        },
        {
            name: "00/00",
            period: "08:00 - 10:00",
            great: 50,
            average: 25,
            excessive: 25,
        },
        {
            name: "00/00",
            period: "08:00 - 10:00",
            great: 50,
            average: 25,
            excessive: 25,
        },
        {
            name: "00/00",
            period: "08:00 - 10:00",
            great: 50,
            average: 25,
            excessive: 25,
        },
        {
            name: "00/00",
            great: 50,
            average: 25,
            excessive: 25,
        },
        {
            name: "00/00",
            period: "08:00 - 10:00",
            great: 50,
            average: 25,
            excessive: 25,
        },
    ];
    return (
        <>
            <ResponsiveContainer height={384} width={"100%"}>
                <BarChart data={data}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Bar barSize={20} dataKey="great" stackId="chartAverage" fill={Colors.verde} />
                    <Bar barSize={20} dataKey="average" stackId="chartAverage" fill={Colors.azul} />
                    <Bar barSize={20} dataKey="excessive" stackId="chartAverage" fill={Colors.vermelho} />
                </BarChart>
            </ResponsiveContainer>
            <div className="flex">
                <PillColor
                    styled={"mb-10 mt-4 mr-4 ml-8"}
                    list={[
                        {
                            text: "consumo ótimo",
                            color: "bg-verde",
                        },
                        {
                            text: "dentro da média",
                            color: "bg-azul",
                        },
                        {
                            text: "consumo excessivo",
                            color: "bg-vermelho",
                        },
                    ]}
                />
            </div>
        </>
    );
};
export default AverageConsumptionRatioChart;
