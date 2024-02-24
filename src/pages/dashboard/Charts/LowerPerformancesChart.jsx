import React, { useState, useEffect } from "react";
import { LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Line } from "recharts";
import Colors from "../../../assets/constants/Colors";
import HeaderToken from "../../../services/headerToken";
import api from "../../../services/api";
import Interceptor from "../../../services/interceptor";
import ClipLoader from "react-spinners/ClipLoader";

const LowerPerformancesChart = ({ actionQuote }) => {
    const [fuelQuote, setFuelQuote] = useState(false);
    const [load, setLoad] = useState(false);

    useEffect(() => {
        getFuelQuote();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [actionQuote]);

    const getFuelQuote = () => {
        setLoad(true);
        api.get(`api/dashboard/fuel-quote`, HeaderToken())
            .then(response => {
                let data = [];

                for (let key in response.data) {
                    data.push({
                        name: response.data[key].label,
                        total: response.data[key].average,
                    });
                }

                setFuelQuote(data);
                setLoad(false);
            })
            .catch(error => {
                setLoad(false);
                Interceptor(error);
            });
    };

    return (
        <>
            {load ? (
                <ClipLoader size={20} color={Colors.buslab} loading={load} />
            ) : (
                <ResponsiveContainer height={220} width={"100%"}>
                    <LineChart
                        data={fuelQuote}
                        margin={{
                            top: 5,
                            right: 30,
                            bottom: 5,
                        }}>
                        <CartesianGrid vertical={false} />
                        <YAxis type="number" />
                        <XAxis allowDuplicatedCategory dataKey="name" type="category" />
                        <Line type="linear" dataKey="total" stroke={Colors.esmeralda} dot={null} strokeWidth={3} />
                    </LineChart>
                </ResponsiveContainer>
            )}
        </>
    );
};

export default LowerPerformancesChart;
