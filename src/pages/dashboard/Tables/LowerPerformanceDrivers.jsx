import React, { useState, useEffect } from "react";
import HeaderToken from "../../../services/headerToken";
import api from "../../../services/api";
import Interceptor from "../../../services/interceptor";

const LowerPerformanceDrivers = () => {
    const [data, setData] = useState();

    useEffect(() => {
        api.get(`api/telemetry/list-drivers-ranking`, HeaderToken())
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                Interceptor(error);
            });
    }, []);

    return (
        <div className="overflow-auto ">
            <table className="table-auto w-full">
                <tbody>
                    <tr>
                        <td className="py-2 text-azul font-medium text-left">posição</td>
                        <td className="py-2 text-azul font-medium text-center">motorista</td>
                        <td className="py-2 text-azul font-medium text-right">
                            Km percorrido/Ocorrência
                        </td>
                    </tr>
                    {data &&
                        Object.entries(data).map(([name, value], index) => (
                            <tr key={index} className="bg-c2 text-c5 ">
                                <td className="px-4 py-2 text-left font-medium text-14 ">
                                    #{index + 1}
                                </td>
                                <td className="px-4 py-2 text-center font-light ">{name}</td>
                                <td className="px-4 py-2 text-right font-light">{value.toFixed(2)}</td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
};
export default LowerPerformanceDrivers;
