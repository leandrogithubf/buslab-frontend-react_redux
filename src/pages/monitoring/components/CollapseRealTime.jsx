import React, { useState } from "react";
import Collapse from "../../../components/Collapse";
import Fade from "react-reveal/Fade";
import targetSVG from "../../../assets/svgs/target.svg";

const CollapseRealTime = () => {
    const [openCollapse, setOpenCollapse] = useState("");

    return (
        <div className="mt-8">
            <Collapse
                title="Ônibus em rota"
                openCollapse={openCollapse}
                setOpenCollapse={setOpenCollapse}>
                <Fade>
                    <div className="p-2 text-grey-darkest">
                        <div className="overflow-auto">
                            <table className="table-auto w-full">
                                <thead>
                                    <tr className="text-primary">
                                        <th className="px-3 py-2 text-left font-medium text-14">
                                            Onibus
                                        </th>
                                        <th className="px-3 py-2 text-left font-medium text-14">
                                            Motorista
                                        </th>
                                        <th className="px-3 py-2 text-left font-medium text-14">
                                            Linha
                                        </th>
                                        <th className="px-3 py-2 text-left font-medium text-14">
                                            Sentido
                                        </th>
                                        <th className="px-3 py-2 text-left font-medium text-14">
                                            saída prev.
                                        </th>
                                        <th className="px-3 py-2 text-left font-medium text-14">
                                            saída
                                        </th>
                                        <th className="px-3 py-2 text-left font-medium text-14">
                                            prev. chegada
                                        </th>
                                        <th className="px-3 py-2 text-left font-medium text-14">
                                            chegada prog.
                                        </th>
                                        <th className="px-3 py-2 text-left font-medium text-14">
                                            Status
                                        </th>
                                        <th className="px-3 py-2 text-left font-medium text-14">
                                            Eventos
                                        </th>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>
                        </div>
                    </div>
                </Fade>
            </Collapse>
            <Collapse
                title={`Ônibus parados no ponto inicial`}
                openCollapse={openCollapse}
                setOpenCollapse={setOpenCollapse}>
                <Fade>
                    <div className="p-2 text-grey-darkest">
                        <div className="overflow-auto">
                            <table className="table-auto w-full">
                                <thead>
                                    <tr className="text-primary">
                                        <th className="px-3 py-2 text-left font-medium text-14">
                                            Onibus
                                        </th>
                                        <th className="px-3 py-2 text-left font-medium text-14">
                                            Motorista
                                        </th>
                                        <th className="px-3 py-2 text-left font-medium text-14">
                                            Linha
                                        </th>
                                        <th className="px-3 py-2 text-left font-medium text-14">
                                            saída prev.
                                        </th>
                                        <th className="px-3 py-2 text-left font-medium text-14">
                                            prev. chegada
                                        </th>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>
                        </div>
                    </div>
                </Fade>
            </Collapse>
            <Collapse
                title={`Ônibus parados no ponto final`}
                openCollapse={openCollapse}
                setOpenCollapse={setOpenCollapse}>
                <Fade>
                    <div className="p-2 text-grey-darkest">
                        <div className="overflow-auto">
                            <table className="table-auto w-full">
                                <thead>
                                    <tr className="text-primary">
                                        <th className="px-3 py-2 text-left font-medium text-14">
                                            Onibus
                                        </th>
                                        <th className="px-3 py-2 text-left font-medium text-14">
                                            Motorista
                                        </th>
                                        <th className="px-3 py-2 text-left font-medium text-14">
                                            Linha
                                        </th>
                                        <th className="px-3 py-2 text-left font-medium text-14">
                                            saída prev.
                                        </th>
                                        <th className="px-3 py-2 text-left font-medium text-14">
                                            prev. chegada
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="bg-tablerow">
                                        <td className="px-4 py-2 text-14 font-light text-c8">
                                            <img
                                                className="cursor-pointer font-light w-4 text-primary inline mr-4"
                                                alt="Ver"
                                                src={targetSVG}
                                                onClick={() => {}}
                                            />
                                            000
                                        </td>
                                        <td className="px-4 py-2 text-14 font-light text-c8">
                                            000
                                        </td>
                                        <td className="px-4 py-2 text-14 font-light text-c8">
                                            000
                                        </td>
                                        <td className="px-4 py-2 text-14 font-light text-c8">
                                            000
                                        </td>
                                        <td className="px-4 py-2 text-14 font-light text-c8">
                                            000
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-2 text-14 font-light text-c8">
                                            <img
                                                className="cursor-pointer font-light w-4 text-primary inline mr-4"
                                                alt="Ver"
                                                src={targetSVG}
                                                onClick={() => {}}
                                            />
                                            000
                                        </td>
                                        <td className="px-4 py-2 text-14 font-light text-c8">
                                            000
                                        </td>
                                        <td className="px-4 py-2 text-14 font-light text-c8">
                                            000
                                        </td>
                                        <td className="px-4 py-2 text-14 font-light text-c8">
                                            000
                                        </td>
                                        <td className="px-4 py-2 text-14 font-light text-c8">
                                            000
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>{" "}
                    </div>
                </Fade>
            </Collapse>
            <Collapse
                title={`Ônibus na garagem`}
                openCollapse={openCollapse}
                setOpenCollapse={setOpenCollapse}>
                <Fade>
                    <div className="p-2 text-grey-darkest">
                        <div className="overflow-auto">
                            <table className="table-auto w-full">
                                <thead>
                                    <tr className="text-primary">
                                        <th className="px-3 py-2 text-left font-medium text-14">
                                            Onibus
                                        </th>
                                        <th className="px-3 py-2 text-left font-medium text-14">
                                            Linha
                                        </th>
                                        <th className="px-3 py-2 text-left font-medium text-14">
                                            saída prev.
                                        </th>
                                        <th className="px-3 py-2 text-left font-medium text-14">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>
                        </div>
                    </div>
                </Fade>
            </Collapse>
            <Collapse
                title={`Eventos`}
                openCollapse={openCollapse}
                setOpenCollapse={setOpenCollapse}>
                <Fade>
                    <div className="p-2 text-grey-darkest">
                        <div className="overflow-auto">
                            <table className="table-auto w-full">
                                <thead>
                                    <tr className="text-primary">
                                        <th className="px-3 py-2 text-left font-medium text-14">
                                            Evento
                                        </th>
                                        <th className="px-3 py-2 text-left font-medium text-14">
                                            Hora
                                        </th>
                                        <th className="px-3 py-2 text-left font-medium text-14">
                                            Onibus
                                        </th>
                                        <th className="px-3 py-2 text-left font-medium text-14">
                                            Motorista
                                        </th>
                                        <th className="px-3 py-2 text-left font-medium text-14">
                                            Linha
                                        </th>
                                    </tr>
                                </thead>
                                <tbody></tbody>
                            </table>
                        </div>
                    </div>
                </Fade>
            </Collapse>
        </div>
    );
};
export default CollapseRealTime;
