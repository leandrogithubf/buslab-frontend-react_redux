import React, { useState, useEffect } from "react";
import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, LineChart, Line } from "recharts";
import Colors from "../../../assets/constants/Colors";
import PillColor from "../../../components/PillColor";
import ClipLoader from "react-spinners/ClipLoader";

import HeaderToken from "../../../services/headerToken";
import Interceptor from "../../../services/interceptor";
import api from "../../../services/api";
import { getNewSearch } from "../../../hooks/useFilterFormat";

const TotalEventChart = ({ search }) => {
    const [data, setData] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        api.get(`api/telemetry/total-event-by-date`, {
            ...HeaderToken(),
            params: getNewSearch(search),
        })
            .then(response => {
                setData(response.data);
                setIsLoaded(true);
            })
            .catch(error => {
                Interceptor(error);
            });
    };

    return (
        <>
            {isLoaded && data.length > 0 && (
                <ResponsiveContainer height={220} width={"100%"}>
                    <LineChart data={data}>
                        <CartesianGrid vertical={false} />
                        <YAxis type="number" />
                        <XAxis allowDuplicatedCategory dataKey="description" type="category" />
                        <Line
                            type="linear"
                            dataKey="qtt"
                            stroke={Colors.vermelho}
                            dot={null}
                            strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
            )}
            {!isLoaded && <ClipLoader size={20} color={Colors.buslab} loading={!isLoaded} />}
            <div className="flex">
                <PillColor
                    styled={"mb-10 mt-4 mr-4 ml-8"}
                    list={[
                        {
                            text: "total",
                            color: "bg-vermelho",
                        },
                    ]}
                />
            </div>
        </>
    );
};
export default TotalEventChart;
