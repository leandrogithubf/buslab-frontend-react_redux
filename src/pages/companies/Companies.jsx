import React, { useState, useEffect } from "react";
import ButtonIconTextDefault from "../../components/Buttons/default/ButtonIconTextDefault";
import Card from "../../components/Cards/Card";
import Title from "../../components/Title";
import eyeSVG from "../../assets/svgs/eye.svg";
import trashSVG from "../../assets/svgs/trash.svg";
import { parseISO, format } from "date-fns";
import { Link } from "react-router-dom";
import api from "../../services/api";
import ModalCreate from "./Modals/ModalCreate";
import ModalDelete from "../../components/Modais/ModalDelete";
import { IoIosAddCircle } from "react-icons/io";
import Colors from "../../assets/constants/Colors";
import ClipLoader from "react-spinners/ClipLoader";
import HeaderToken from "../../services/headerToken";
import Paginate from "../../components/Paginate";
import SearchEngine from "../../components/Filter/SearchEngine";
import Interceptor from "../../services/interceptor";
import Sorting from "../../components/Sorting";

const Companies = props => {
    const [load, setLoad] = useState(true);
    const [modalForm, setModalform] = useState(false);
    const [modalDecision, setModalBody] = useState(false);
    const [state, setState] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [identifierSelected, setIdentifierSelected] = useState();
    const [search, setSearch] = useState({
        descriptionName: "",
        city: "",
        state: "",
    });
    const [meta, setMeta] = useState({
        current_page: 1,
    });
    const [action, setAction] = useState(1);
    const [sortingString, setSortingString] = useState("");
    const [currentSortingField, setCurrentSortingField] = useState("");
    const [currentSortingDirection, setCurrentSortingDirection] = useState(false);
    const dataToDelete = ["Colaboradores", "Escalas", "OBDS", "Viagens", "Eventos"];

    useEffect(() => {
        getLocation("state");
    }, []);

    useEffect(() => {
        getCompanies();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [action, search, sortingString]);

    const getLocation = type => {
        api.get(`/api/geolocation/${type}/list?page_size=99999`, HeaderToken())
            .then(response => {
                if (type === "state") {
                    setState(response.data.data);
                }
            })
            .catch(error => {
                Interceptor(error);
            });
    };

    const getCompanies = () => {
        setLoad(true);

        // let  = `sort=${field}&direction=${direction}`;
        api.get(`api/adm/company/list?&${sortingString}&page=${meta.current_page}`, {
            ...HeaderToken(),
            params: search,
        })
            .then(response => {
                setCompanies(response.data.data);
                setMeta(response.data.meta);
                setLoad(false);
            })
            .catch(error => {
                setLoad(false);
                Interceptor(error);
            });
    };

    const actionModalForm = () => {
        setModalform(!modalForm);
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
                    getList={() => getCompanies()}
                    stateList={state}
                />
                <ModalDelete
                    actionModalDelete={actionModalBody}
                    modalDelete={modalDecision}
                    identifier={identifierSelected}
                    getList={() => getCompanies()}
                    type={"create"}
                    name="empresa"
                    url="company"
                    redirect="/companies"
                    data={dataToDelete}
                />
            </>
        );
    };

    return (
        <>
            <Title title={"Empresas"} crumbs={props.crumbs} />

            <Modals />
            <SearchEngine
                search={search}
                setSearch={setSearch}
                type={{
                    descriptionName: true,
                }}
            />
            <Card>
                <div className="flex justify-between">
                    <h2 className="mb-5 font-light">Empresas cadastradas</h2>
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
                                        label="Nome"
                                        field="e.description"
                                        currentSortingField={currentSortingField}
                                        setCurrentSortingField={setCurrentSortingField}
                                        currentSortingDirection={currentSortingDirection}
                                        setCurrentSortingDirection={setCurrentSortingDirection}
                                        setSortingString={setSortingString}
                                    />
                                </th>
                                <th className="px-3 py-2 text-left font-medium text-14">
                                    <Sorting
                                        label="Cidade"
                                        field="city.name"
                                        currentSortingField={currentSortingField}
                                        setCurrentSortingField={setCurrentSortingField}
                                        currentSortingDirection={currentSortingDirection}
                                        setCurrentSortingDirection={setCurrentSortingDirection}
                                        setSortingString={setSortingString}
                                    />
                                </th>
                                <th className="px-3 py-2 text-left font-medium text-14">
                                    <Sorting
                                        label="Estado"
                                        field="state.name"
                                        currentSortingField={currentSortingField}
                                        setCurrentSortingField={setCurrentSortingField}
                                        currentSortingDirection={currentSortingDirection}
                                        setCurrentSortingDirection={setCurrentSortingDirection}
                                        setSortingString={setSortingString}
                                    />
                                </th>
                                <th className="px-3 py-2 text-left font-medium text-14">
                                    <Sorting
                                        label="CEP"
                                        field="e.streetCode"
                                        currentSortingField={currentSortingField}
                                        setCurrentSortingField={setCurrentSortingField}
                                        currentSortingDirection={currentSortingDirection}
                                        setCurrentSortingDirection={setCurrentSortingDirection}
                                        setSortingString={setSortingString}
                                    />
                                </th>
                                <th className="px-3 py-2 text-left font-medium text-14">
                                    <Sorting
                                        label="Data de criação"
                                        field="e.createdAt"
                                        currentSortingField={currentSortingField}
                                        setCurrentSortingField={setCurrentSortingField}
                                        currentSortingDirection={currentSortingDirection}
                                        setCurrentSortingDirection={setCurrentSortingDirection}
                                        setSortingString={setSortingString}
                                    />
                                </th>
                                <th className="px-3 py-2 text-center font-medium text-14 w-1/12">Ações</th>
                            </tr>
                        </thead>
                        {companies.length > 0 && !load && (
                            <tbody>
                                {companies.map((value, index) => {
                                    return (
                                        <tr
                                            className={index % 2 === 0 ? "bg-tablerow" : ""}
                                            key={value.identifier}>
                                            <td className="px-4 py-5 font-light text-c8 text-14">
                                                {value.description}
                                            </td>
                                            <td className="px-4 py-5 font-light text-c8 text-14">
                                                {value.city.name}
                                            </td>
                                            <td className="px-4 py-5 font-light text-c8 text-14">
                                                {value.city.state.name}
                                            </td>
                                            <td className="px-4 py-5 font-light text-c8 text-14">
                                                {value.streetCode}
                                            </td>
                                            <td className="px-4 py-5 font-light text-c8 text-14">
                                                {format(
                                                    parseISO(value.createdAt),
                                                    "dd'/'MM'/'yyyy'"
                                                )}
                                            </td>
                                            <td className="px-4 py-5 font-light text-c8 text-14 text-center w-1/12">
                                                <Link to={`/companies/show/${value.identifier}`}>
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
                        {companies.length === 0 && !load && (
                            <p className="center">Nenhuma empresa encontrada </p>
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

export default Companies;
