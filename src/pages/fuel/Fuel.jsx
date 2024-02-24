import React, { useState, useEffect } from "react";
import Title from "../../components/Title";
import Card from "../../components/Cards/Card";
import ButtonIconTextDefault from "../../components/Buttons/default/ButtonIconTextDefault";
import { IoIosAddCircle } from "react-icons/io";
import { parseISO, format } from "date-fns";
import HeaderToken from "../../services/headerToken";
import api from "../../services/api";
import ModalCreate from "./Modals/ModalCreate";
import { Link } from "react-router-dom";
import eyeSVG from "../../assets/svgs/eye.svg";
import trashSVG from "../../assets/svgs/trash.svg";
import Colors from "../../assets/constants/Colors";
import Paginate from "../../components/Paginate";
import ClipLoader from "react-spinners/ClipLoader";
import ModalDelete from "../../components/Modais/ModalDelete";
import SearchEngine from "../../components/Filter/SearchEngine";
import Interceptor from "../../services/interceptor";
import Sorting from "../../components/Sorting";

const Fuel = props => {
    const [search, setSearch] = useState({
        value: "",
        date: "",
        company: "",
    });
    const [modalForm, setModalForm] = useState(false);
    const [modalDecision, setModalBody] = useState(false);
    const [identifierSelected, setIdentifierSelected] = useState("");
    const [load, setLoad] = useState(false);
    const [fuelList, setFuelList] = useState([]);
    const [companyList, setCompanyList] = useState([]);
    const [action, setAction] = useState([]);
    const [meta, setMeta] = useState({
        current_page: 1,
    });
    const [sortingString, setSortingString] = useState("");
    const [currentSortingField, setCurrentSortingField] = useState("");
    const [currentSortingDirection, setCurrentSortingDirection] = useState(false);

    useEffect(() => {
        getFuel();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [action, search, sortingString]);

    useEffect(() => {
        getCompany();
    }, []);

    const getFuel = () => {
        setLoad(true);
        api.get(
            `api/adm/fuel-quote/list?&${sortingString}&page=${meta.current_page}&company[]=${search.company}&date=${search.date}`,
            HeaderToken()
        )
            .then(response => {
                setFuelList(response.data.data);
                setMeta(response.data.meta);
                setLoad(false);
            })
            .catch(error => {
                setLoad(false);
                Interceptor(error);
            });
    };

    const getCompany = () => {
        api.get(`api/adm/company/list?page_size=9999999`, HeaderToken()).then(response => {
            setCompanyList(response.data.data);
        });
    };

    const actionModalForm = () => {
        setModalForm(!modalForm);
    };

    const actionModalBody = identifier => {
        setIdentifierSelected(identifier);
        setModalBody(!modalDecision);
    };

    const Modals = () => {
        return (
            <>
                <ModalCreate
                    actionModalPost={actionModalForm}
                    modalPost={modalForm}
                    getList={getFuel}
                    companyList={companyList}
                />
                <ModalDelete
                    identifier={identifierSelected}
                    actionModalDelete={actionModalBody}
                    type="create"
                    modalDelete={modalDecision}
                    getList={getFuel}
                    url="fuel-quote"
                    redirect="/fuel"
                    name="cotação de combustível"
                />
            </>
        );
    };
    return (
        <>
            <Title title={"Cotação de combustível"} crumbs={props.crumbs} />
            <Modals />
            <SearchEngine
                search={search}
                setSearch={setSearch}
                type={{ date: true, company: true }}
            />
            <Card>
                <div className="flex justify-between">
                    <h2 className="mb-5 font-light">Cotações</h2>
                    <div className="text-right">
                        <ButtonIconTextDefault
                            title={"Adicionar"}
                            onClick={actionModalForm}
                            icon={<IoIosAddCircle />}
                        />
                    </div>
                </div>
                <div className="overflow-auto">
                    <table className="table-auto w-full">
                        <thead>
                            <tr className="text-primary">
                                <th className="px-3 py-2 text-left font-medium text-14">
                                    <Sorting
                                        label="Empresa"
                                        field="company.description"
                                        currentSortingField={currentSortingField}
                                        setCurrentSortingField={setCurrentSortingField}
                                        currentSortingDirection={currentSortingDirection}
                                        setCurrentSortingDirection={setCurrentSortingDirection}
                                        setSortingString={setSortingString}
                                    />
                                </th>
                                <th className="px-3 py-2 text-center font-medium text-14">
                                    <Sorting
                                        label="Data"
                                        field="e.date"
                                        currentSortingField={currentSortingField}
                                        setCurrentSortingField={setCurrentSortingField}
                                        currentSortingDirection={currentSortingDirection}
                                        setCurrentSortingDirection={setCurrentSortingDirection}
                                        setSortingString={setSortingString}
                                    />
                                </th>
                                <th className="px-3 py-2 text-center font-medium text-14">
                                    <Sorting
                                        label="Valor"
                                        field="e.value"
                                        currentSortingField={currentSortingField}
                                        setCurrentSortingField={setCurrentSortingField}
                                        currentSortingDirection={currentSortingDirection}
                                        setCurrentSortingDirection={setCurrentSortingDirection}
                                        setSortingString={setSortingString}
                                    />
                                </th>
                                <th className="px-3 py-2 font-medium text-14 text-center w-1/12">Ações</th>
                            </tr>
                        </thead>
                        {fuelList.length > 0 && !load && (
                            <tbody>
                                {fuelList.map((value, index) => {
                                    return (
                                        <tr
                                            className={index % 2 === 0 ? "bg-tablerow" : ""}
                                            key={index}>
                                            <td className="px-4 py-5 font-light text-c8 text-14">
                                                {value.company.description}
                                            </td>
                                            <td className="px-4 py-5 font-light text-c8 text-14">
                                                {format(parseISO(value.date), "dd'/'MM'/'yyyy'")}
                                            </td>
                                            <td className="px-4 py-5 font-light text-c8 text-14">
                                                R$ {value.value}
                                            </td>
                                            <td className="px-4 py-5 font-light text-c8 text-14 text-center w-1/12">
                                                <Link to={`/fuel/show/${value.identifier}`}>
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
                        {fuelList.length === 0 && !load && (
                            <p className="center">Nenhuma cotação encontrada </p>
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

export default Fuel;
