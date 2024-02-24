import React, { useState, useEffect } from "react";
import HeaderToken from "../../../services/headerToken";
import api from "../../../services/api";
import Interceptor from "../../../services/interceptor";

const DriversHigherPerformance = () => {
    const [data, setData] = useState(false);

    useEffect(() => {
        api.get(`api/dashboard/driver-ranking/fuel/best`, HeaderToken())
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                Interceptor(error);
            });
    }, []);

    return (
        <div className="overflow-auto">
            <table className="table-auto w-full">
                <tbody>
                    <tr>
                        <td className="py-2 text-azul font-medium text-left">posição</td>
                        <td className="py-2 text-azul font-medium text-center">motorista</td>
                        <td className="py-2 text-azul font-medium text-right">km/L</td>
                    </tr>
                    {data &&
                        data.length > 0 &&
                        data.map((row, index) => {
                            return (
                                <tr key={index} className="bg-c2 text-c5 ">
                                    <td className="px-4 py-2 text-left font-medium text-14 ">
                                        #{index + 1}
                                    </td>
                                    <td className="px-4 py-2 text-center font-light ">
                                        {row.employee && (
                                            <>
                                                {row.employee.code}
                                                {" - "}
                                                {row.employee.name}
                                            </>
                                        )}
                                    </td>
                                    <td className="px-4 py-2 text-right font-light">{row.kmL.toFixed(2)}</td>
                                </tr>
                            );
                        })}
                </tbody>
            </table>
        </div>
    );
};
export default DriversHigherPerformance;
