import React, { useState, useEffect } from "react";

import { ResponsiveContainer, BarChart, XAxis, YAxis, CartesianGrid, Bar } from "recharts";
import Colors from "../../../assets/constants/Colors";
import PillColor from "../../../components/PillColor";
import ClipLoader from "react-spinners/ClipLoader";

import HeaderToken from "../../../services/headerToken";
import Interceptor from "../../../services/interceptor";
import api from "../../../services/api";
import { getNewSearch } from "../../../hooks/useFilterFormat";

const AlertFrequency = ({ search }) => {
    const [data, setData] = useState();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        api.get(`api/telemetry/event-frequency`, { ...HeaderToken(), params: getNewSearch(search) })
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
                    <BarChart
                        data={data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                        barSize={20}>
                        <XAxis
                            dataKey="description"
                            scale="point"
                            interval={0}
                            width={20}
                            height={70}
                            tick={{ stroke: "#6D6D6D", strokeWidth: 0.1, width: 70 }}
                            padding={{ left: 15, right: 10 }}
                        />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Bar dataKey="qtt" fill={Colors.laranja} />
                    </BarChart>
                </ResponsiveContainer>
            )}
            {!isLoaded && <ClipLoader size={20} color={Colors.buslab} loading={!isLoaded} />}
            <div className="w-1/6">
                <PillColor list={[]} styled={"mb-10 mt-4 mr-4 ml-8"} />
            </div>
        </>
    );
};
export default AlertFrequency;
