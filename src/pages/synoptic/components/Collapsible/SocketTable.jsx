import React, { useState, useEffect } from "react";
import Fade from "react-reveal/Fade";

const SocketTable = ({ type, status }) => {
    const [statusArray, setStatusArray] = useState();

    useEffect(() => {
        if (status) {
            setStatusArray([
                ...Object.values(status).filter(
                    buses => Object.values(buses).filter(bus => bus.status === type).length > 0
                ),
            ]);
        }
    }, [status, type]);
    return (
        <Fade>
            <div className="p-2 text-grey-darkest">
                <div className="overflow-auto">
                    {statusArray &&
                        statusArray.map(buses => (
                            <div key={buses.company.description}>
                                <h3>{buses.company.description}</h3>
                                <table className="table-auto w-full">
                                    <thead>
                                        <tr className="text-primary">
                                            <th className="px-3 py-2 text-left font-medium text-13">
                                                Prefixo
                                            </th>
                                            <th className="px-3 py-2 text-left font-medium text-13">
                                                Linha
                                            </th>
                                            <th className="px-3 py-2 text-left font-medium text-13">
                                                Local
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.values(buses)
                                            .filter(({ status }) => status === type)
                                            .map((item, index) => (
                                                <tr
                                                    className={` ${
                                                        index % 2 === 0 ? "bg-tablerow" : ""
                                                    }`}
                                                    key={item.identifier}>
                                                    <td className="px-4 py-2 text-14 font-light text-c8">
                                                        {item.prefix}
                                                    </td>
                                                    <td className="px-4 py-2 text-14 font-light text-c8">
                                                        {item.line}
                                                    </td>
                                                    <td className="px-4 py-2 text-14 font-light text-c8">
                                                        {item.address}
                                                    </td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}

                    {statusArray && !statusArray?.length && (
                        <p className="text-center bg-tablerow py-2">
                            Nenhum ônibus para exibir no momento
                        </p>
                    )}
                </div>
            </div>
        </Fade>
    );
};

export default SocketTable;
