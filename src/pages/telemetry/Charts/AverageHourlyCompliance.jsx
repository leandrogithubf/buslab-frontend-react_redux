import React, { useState, useEffect } from "react";
import { ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import Colors from "../../../assets/constants/Colors";
import PillColor from "../../../components/PillColor";
import ClipLoader from "react-spinners/ClipLoader";

import HeaderToken from "../../../services/headerToken";
import Interceptor from "../../../services/interceptor";
import api from "../../../services/api";

const AverageHourlyCompliance = () => {
    const [data, setData] = useState([]);
    const [ticks, setTicks] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        getData();
    }, []);

    const getData = () => {
        api.get(`api/telemetry/time-performance`, HeaderToken())
            .then(response => {
                setTicks(response.data.ticks); 
                setData(response.data.data);
                setIsLoaded(true);
            })
            .catch(error => {
                Interceptor(error);
            });
    };

    return (
        <>
            {isLoaded && data.length > 0 && (
                <ResponsiveContainer height={167} width={"100%"}>
                    <ComposedChart data={data}>
                        <CartesianGrid stroke="#f5f5f5" />
                        <XAxis dataKey="description" />
                        <YAxis />
                        <Line type="linear" dataKey="average" stroke={Colors.azul} dot={null} strokeWidth={2} />
                        <Area
                            type="linear"
                            stackId="1"
                            dataKey="advance"
                            fill={Colors.laranja}
                            fillOpacity={0.2}
                            stroke={null}
                        />
                        <Area
                            type="linear"
                            stackId="1"
                            dataKey="tolerance"
                            stroke={null}
                            fill={Colors.C2}
                            fillOpacity={0.5}
                        />
                        <Area
                            type="linear"
                            stackId="1"
                            dataKey="late"
                            fill={Colors.vermelho}
                            fillOpacity={0.2}
                            stroke={null}
                        />
                    </ComposedChart>
                </ResponsiveContainer>
            )}
            {!isLoaded && <ClipLoader size={20} color={Colors.buslab} loading={!isLoaded} />}
            <div className="flex">
                <PillColor
                    styled={"mb-10 mt-4 mr-4 ml-8"}
                    list={[
                        {
                            text: "tolerância",
                            color: "bg-c2",
                        },
                        {
                            text: "adiantados",
                            color: "bg-b1",
                        },
                        {
                            text: "atrasados",
                            color: "bg-b1",
                        },
                        {
                            text: "média",
                            color: "bg-azul",
                        },
                    ]}
                />
            </div>
        </>
    );
};
export default AverageHourlyCompliance;
