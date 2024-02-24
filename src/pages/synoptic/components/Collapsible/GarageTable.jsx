import React, { useEffect, useState } from "react";
import Fade from "react-reveal/Fade";

const GarageTable = ({ status, itineraries }) => {
    const [statusArray, setStatusArray] = useState();

    useEffect(() => {
        if (status && itineraries) {
            setStatusArray(
                Object.values(status).filter(
                    buses =>
                        Object.values(itineraries).filter(
                            items =>
                                items[0].onGarage && items[0].company === buses.company.identifier
                        ).length > 0
                )
            );
        }
    }, [itineraries, status]);
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
                                                Local
                                            </th>
                                            <th className="px-3 py-2 text-left font-medium text-13">
                                                Latitude
                                            </th>
                                            <th className="px-3 py-2 text-left font-medium text-13">
                                                Longitude
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.values(itineraries)
                                            .filter(
                                                items =>
                                                    items[0].onGarage &&
                                                    items[0].company === buses.company.identifier
                                            )
                                            .map((item, index) => {
                                                const bus = item[item.length - 1];
                                                return (
                                                    <tr
                                                        className={` ${
                                                            index % 2 === 0 ? "bg-tablerow" : ""
                                                        }`}
                                                        key={bus.identifier}>
                                                        <td className="px-4 py-2 text-14 font-light text-c8">
                                                            {bus.prefix}
                                                        </td>
                                                        <td className="px-4 py-2 text-14 font-light text-c8">
                                                            {bus.onGarage}
                                                        </td>
                                                        <td className="px-4 py-2 text-14 font-light text-c8">
                                                            {bus.latitude}
                                                        </td>
                                                        <td className="px-4 py-2 text-14 font-light text-c8">
                                                            {bus.longitude}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
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

export default GarageTable;
