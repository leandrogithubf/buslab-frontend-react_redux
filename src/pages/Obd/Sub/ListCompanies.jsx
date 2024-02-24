import React, { useState, useEffect } from "react";
import eyeSVG from "../../../assets/svgs/eye.svg";
import { Link } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import Colors from "../../../assets/constants/Colors";
import Card from "../../../components/Cards/Card";
import trashSVG from "../../../assets/svgs/trash.svg";
import api from "../../../services/api";
import HeaderToken from "../../../services/headerToken";
import { toast } from "react-toastify";
import Interceptor from "../../../services/interceptor";

const ListCompanies = ({ identifier }) => {
    const [load, setLoad] = useState(0);
    const [companiesList, setCompaniesList] = useState([]);
    const [modalDecision, setModalBody] = useState(0);
    const [identifierSelected, setIdentifierSelected] = useState([]);

    useEffect(() => {
        getCompanies();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getCompanies = () => {
        setLoad(true);
        api.get(`api/adm/obd/${identifier}/companies`, HeaderToken())
            .then(response => {
                setCompaniesList(response.data.data);
                setLoad(false);
            })
            .catch(error => {
                setLoad(false);
                Interceptor(error);
            });
    };

    const actionModalBody = identifier => {
        setIdentifierSelected(identifier);
        setModalBody(!modalDecision);
    };

    return (
        <Card>
            {load ? (
                <div className="justify-center w-full">
                    <ClipLoader size={20} color={Colors.buslab} loading={true} />
                </div>
            ) : (
                <>
                    <div className="flex justify-between">
                        <h2 className="mb-5 font-light">Empresas do Obd</h2>
                    </div>
                    <div className="overflow-auto">
                        <table className="table-auto w-full">
                            <thead>
                                <tr className="text-primary">
                                    <th className="px-3 py-2 text-left font-medium text-14">
                                        Serial
                                    </th>
                                    <th className="px-3 py-2 text-left font-medium text-14">
                                        Versão
                                    </th>
                                    <th className="px-3 py-2 text-left font-medium text-14">
                                        Número de telefone
                                    </th>
                                    <th className="px-3 py-2 text-left font-medium text-14">
                                        Empresa
                                    </th>
                                    <th className="px-3 py-2 text-center font-medium text-14">
                                        Ações
                                    </th>
                                </tr>
                            </thead>
                            {companiesList.length > 0 && !load && (
                                <tbody>
                                    {companiesList.map((value, index) => {
                                        return (
                                            <tr
                                                key={value.identifier}
                                                className={index % 2 === 0 ? "bg-tablerow" : ""}>
                                                <td className="px-4 py-5 font-light text-c8 text-14">
                                                    {value.serial}
                                                </td>
                                                <td className="px-4 py-5 font-light text-c8 text-14">
                                                    {value.version}
                                                </td>
                                                <td className="px-4 py-5 font-light text-c8 text-14">
                                                    {value.cellphoneNumber
                                                        ? value.cellphoneNumber.number
                                                        : ""}
                                                </td>
                                                <td className="px-4 py-5 font-light text-c8 text-14">
                                                    {value.company
                                                        ? value.company.description
                                                        : "-"}
                                                </td>
                                                <td className="px-4 py-5 font-light text-c8 text-14 text-center">
                                                    <Link to={`/obd/show/${value.identifier}`}>
                                                        <img
                                                            className="cursor-pointer font-light w-6 text-primary inline mr-4"
                                                            alt="Ver"
                                                            src={eyeSVG}
                                                        />
                                                    </Link>
                                                    <img
                                                        className="cursor-pointer font-light w-4 text-primary inline"
                                                        alt="Remover"
                                                        src={trashSVG}
                                                        onClick={() => {
                                                            actionModalBody(value.identifier);
                                                        }}
                                                    />
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            )}
                        </table>
                    </div>
                    <div className="w-full">
                        <div className="flex justify-center">
                            {companiesList.length === 0 && !load && (
                                <p className="center">Nenhuma empresa encontrada </p>
                            )}
                            {load && <ClipLoader size={20} color={Colors.buslab} loading={load} />}
                        </div>
                    </div>
                </>
            )}
        </Card>
    );
};

export default ListCompanies;
