import React, { useState, useEffect } from "react";
import Colors from "../../../assets/constants/Colors";
import HeaderToken from "../../../services/headerToken";
import api from "../../../services/api";
import ClipLoader from "react-spinners/ClipLoader";
import { activeSocket, notifyPlacar, notifyPlacarCompany } from "../../../services/socket";

const OperationalScore = () => {
    const [scoreboard, setScoreboard] = useState(false);
    const [load, setLoad] = useState(false);

    useEffect(() => {
        setLoad(true);
        const socket = activeSocket();

        api.get(`api/profile/show`, HeaderToken())
            .then(response => {
                setLoad(false);
                if (response.data.company && response.data.company.identifier) {
                    notifyPlacarCompany(response.data.company.identifier, socket, (err, data) => {
                        setScoreboard(data);
                    });
                } else {
                    notifyPlacar(socket, (err, data) => {
                        setScoreboard(data);
                    });
                }
            })
        ;
    }, []);

    return (
        <div className="overflow-auto">
            <table className="table-auto w-full">
                <tbody>
                    <tr className="bg-c2">
                        <td className="px-4 py-2 text-right font-medium text-c7-18">Viagens</td>
                        <td className="px-4 py-2 w-1/2 font-light text-c7-22">
                            {load ? (
                                <ClipLoader size={20} color={Colors.buslab} loading={load} />
                            ) : (
                                <span>{scoreboard.qttTripScheduled ? scoreboard.qttTripScheduled : 0}</span>
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td className="px-4 py-2 text-right font-medium text-c7-18">Viagens não realizadas</td>
                        <td className="px-4 py-2 w-1/2 font-light text-c7-22">
                            {load ? (
                                <ClipLoader size={20} color={Colors.buslab} loading={load} />
                            ) : (
                                <span>{scoreboard.qttTripScheduledNotDone ? scoreboard.qttTripScheduledNotDone : 0}</span>
                            )}
                        </td>
                    </tr>
                    <tr className="bg-c2">
                        <td className="px-4 py-2 text-right font-medium text-c7-18">Viagens não produtivas</td>
                        <td className="px-4 py-2 w-1/2 font-light text-c7-22">
                            {load ? (
                                <ClipLoader size={20} color={Colors.buslab} loading={load} />
                            ) : (
                                <span>{scoreboard.qttTripNonProductive ? scoreboard.qttTripNonProductive : 0}</span>
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td className="px-4 py-2 text-right font-medium text-c7-18">Viagens especiais</td>
                        <td className="px-4 py-2 w-1/2 font-light text-c7-22">
                            {load ? (
                                <ClipLoader size={20} color={Colors.buslab} loading={load} />
                            ) : (
                                <span>{scoreboard.qttTripUnscheduled ? scoreboard.qttTripUnscheduled : 0}</span>
                            )}
                        </td>
                    </tr>
                    <tr className="bg-c2">
                        <td className="px-4 py-2 text-right font-medium text-c7-18">Acidentes</td>
                        <td className="px-4 py-2 w-1/2 font-light text-c7-22">
                            {load ? (
                                <ClipLoader size={20} color={Colors.buslab} loading={load} />
                            ) : (
                                <span>{scoreboard.qttAccidentEvent ? scoreboard.qttAccidentEvent : 0}</span>
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td className="px-4 py-2 text-right font-medium text-c7-18">Ocorrências em aberto</td>
                        <td className="px-4 py-2 w-1/2 font-light text-c7-22">
                            {load ? (
                                <ClipLoader size={20} color={Colors.buslab} loading={load} />
                            ) : (
                                <span>{scoreboard.qttEventsUnsolved ? scoreboard.qttEventsUnsolved : 0}</span>
                            )}
                        </td>
                    </tr>
                    {/* <tr className="bg-c2">
                        <td className=" py-2 text-right font-medium text-c7-18"></td>
                        <td className=" py-2 w-1/2 font-light text-c7-22">
                        </td>
                    </tr> */}
                    {/* <tr>
                        <td className="py-2 text-left font-medium text-c7-18 pt-10">Oferta de lugares</td>
                        <td className="px-4 py-2 w-1/2 font-light text-c7-22">
                        </td>
                    </tr>
                    <tr className="bg-c2">
                        <td className="px-4 py-2 text-right font-medium text-c7-18">No dia</td>
                        <td className="px-4 py-2 w-1/2 font-light text-c7-22">
                            {load ? (
                                <ClipLoader size={20} color={Colors.buslab} loading={load} />
                            ) : (
                                <span>{scoreboard.qttAccidentEvent ? scoreboard.qttAccidentEvent : 0}</span>
                            )}
                        </td>
                    </tr>
                    <tr>
                        <td className="px-4 py-2 text-right font-medium text-c7-18">No momento</td>
                        <td className="px-4 py-2 w-1/2 font-light text-c7-22">
                            {load ? (
                                <ClipLoader size={20} color={Colors.buslab} loading={load} />
                            ) : (
                                <span>{scoreboard.qttAccidentEvent ? scoreboard.qttAccidentEvent : 0}</span>
                            )}
                        </td>
                    </tr> */}
                </tbody>
            </table>
        </div>
    );
};
export default OperationalScore;
