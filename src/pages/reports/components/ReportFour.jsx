/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

import api from "../../../services/api";
import HeaderToken from "../../../services/headerToken";
import Interceptor from "../../../services/interceptor";
import Title from "../../../components/Title";
import Card from "../../../components/Cards/Card";
import Sorting from "../../../components/Sorting";
import Paginate from "../../../components/Paginate";
import NumberFormat from "react-number-format";
import moment from "moment";
import { Link } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import Colors from "../../../assets/constants/Colors";
import ButtonIconTextDefault from "../../../components/Buttons/default/ButtonIconTextDefault";
import ButtonIconTextYellow from "../../../components/Buttons/yellow/ButtonIconTextYellow";
import ButtonIconTextRed from "../../../components/Buttons/red/ButtonIconTextRed";
import { IoIosCloudDownload } from "react-icons/io";
import { Label, Information, Pencil, LoadSave, Save } from "../../../components/Details";

const ReportFour = ({ search }) => {
    let [activeEdit, setActiveEdit] = useState();
    const [line, setLine] = useState();
    let [load, setLoad] = useState(false);
    let [reportList, setReportList] = useState([]);
    const [currentSortingField, setCurrentSortingField] = useState("");
    const [currentSortingDirection, setCurrentSortingDirection] = useState(false);
    const [sortingString, setSortingString] = useState("");
    const [action, setAction] = useState(1);
    const [meta, setMeta] = useState({
        current_page: 1,
    });
    const setInputActive = value => {
        setActiveEdit(value);
    };

    useEffect(() => {
        if (search.line) {
            api.get(`/api/adm/line/${search.line}/points`, HeaderToken())
                .then(response => {
                    setLine(response.data);
                })
                .catch(error => {
                    Interceptor(error);
                });
        }
    }, [search]);

    const getReport = () => {
        setLoad(true);
        api.get(
            `api/adm/report-files/list?page=${meta.current_page}&${sortingString}`,
            HeaderToken()
        )
            .then(response => {
                setReportList(response.data.data);
                setMeta(response.data.meta);
                setLoad(false);
            })
            .catch(error => {
                setLoad(false);
                Interceptor(error);
            });
    };

    useEffect(() => {
        getReport();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [action, search, sortingString]);

    return (
        <>
            {/* <Title title={"Histórico de relatórios"} crumbs={search.crumbs} /> */}
            {/* <SearchEngine
                search={search}
                setSearch={setSearch}
                type={{
                    cellphone: true,
                }}
            /> */}
            <Card>
                <div className="flex justify-between">
                    <h4>Listagem do histórico de relatórios</h4>
                </div>
                <div className="overflow-auto">
                    <table className="table-auto w-full">
                        <thead>
                            <tr className="text-primary">
                                <th className="px-3 py-2 text-left font-medium text-14">
                                    <Sorting
                                        label="Data"
                                        field="e.name"
                                        currentSortingField={currentSortingField}
                                        setCurrentSortingField={setCurrentSortingField}
                                        currentSortingDirection={currentSortingDirection}
                                        setCurrentSortingDirection={setCurrentSortingDirection}
                                        setSortingString={setSortingString}
                                    />
                                </th>
                                <th className="px-3 py-2 text-left font-medium text-14">
                                    <Sorting
                                        label="Tipo"
                                        field="e.number"
                                        currentSortingField={currentSortingField}
                                        setCurrentSortingField={setCurrentSortingField}
                                        currentSortingDirection={currentSortingDirection}
                                        setCurrentSortingDirection={setCurrentSortingDirection}
                                        setSortingString={setSortingString}
                                    />
                                </th>

                                <th className="px-3 py-2 text-center font-medium text-14">Ações</th>
                            </tr>
                        </thead>
                        {reportList.length > 0 && !load && (
                            <tbody>
                                {reportList.map((value, index) => {
                                    return (
                                        <tr
                                            key={value.identifier}
                                            className={index % 2 === 0 ? "bg-tablerow" : ""}>
                                            <td className="px-4 py-5 font-light text-c8 text-14">
                                                <Information
                                                        description={moment(
                                                            value.createdAt
                                                        ).format("DD/MM/YYYY HH:mm:ss")}
                                                    />
                                            </td>
                                            <td className="px-4 py-5 font-light text-c8 text-14">
                                                {value.description} 
                                            </td>

                                            <td className="px-4 py-5 font-light text-c8 text-14 text-center">
                                                <Link to={`./assets/pdf/total_frota-16-11-2021 13:49:56.pdf`}>
                                                <ButtonIconTextDefault
                                                    className="mr-2"
                                                    title={"Download"}
                                                    icon={<IoIosCloudDownload />}
                                                />
                                                </Link>
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
                        {reportList.length === 0 && !load && (
                            <p className="center">Nenhum relatório encontrado </p>
                        )}
                        {load && <ClipLoader size={20} color={Colors.buslab} loading={load} />}
                    </div>
                </div>
                {meta.total_pages > 1 && (
                    <Paginate meta={meta} setMeta={setMeta} action={action} setAction={setAction} />
                )}
            </Card>
        </>
    );
};
export default ReportFour;
