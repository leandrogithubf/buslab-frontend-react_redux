import React, { useState, useEffect } from "react";
import Title from "../../components/Title";
import Card from "../../components/Cards/Card";
import ButtonIconTextDefault from "../../components/Buttons/default/ButtonIconTextDefault";
import { IoIosAddCircle, IoIosCloudUpload } from "react-icons/io";
import eyeSVG from "../../assets/svgs/eye.svg";
import trashSVG from "../../assets/svgs/trash.svg";
import { Link } from "react-router-dom";
import HeaderToken from "../../services/headerToken";
import api from "../../services/api";
import Paginate from "../../components/Paginate";
import Colors from "../../assets/constants/Colors";
import ClipLoader from "react-spinners/ClipLoader";
import ModalDelete from "../../components/Modais/ModalDelete";
import ModalCreate from "./Modals/ModalCreate";
import ModalImport from "./Modals/ModalImport";
import SearchEngine from "../../components/Filter/SearchEngine";
import Interceptor from "../../services/interceptor";
import Sorting from "../../components/Sorting";

const Lines = props => {
    const [modalForm, setModalForm] = useState(false);
    const [modalDecision, setModalBody] = useState(false);
    const [modalImport, setModalImport] = useState(false);
    const [load, setLoad] = useState(false);
    const [companyList, setCompanyList] = useState([]);
    const [lineList, setLineList] = useState([]);
    const [meta, setMeta] = useState({
        current_page: 1,
    });
    const [action, setAction] = useState(1);
    const [search, setSearch] = useState({
        company: "",
        name: "",
        lineCode: "",
        direction: "",
    });
    const dataToDelete = ["Pontos da linha", "Escalas", "Eventos"];
    const [identifierSelected, setIdentifierSelected] = useState([]);
    const [sortingString, setSortingString] = useState("");
    const [currentSortingField, setCurrentSortingField] = useState("");
    const [currentSortingDirection, setCurrentSortingDirection] = useState(false);

    useEffect(() => {
        getCompany();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        getLine();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [action, search, sortingString]);

    const getCompany = () => {
        api.get(`api/adm/company/list`, HeaderToken()).then(response => {
            setCompanyList(response.data.data);
        });
    };

    const getLine = () => {
        setLoad(true);
        api.get(
            `api/adm/line/list?&${sortingString}&page=${meta.current_page}&company[]=${search.company}&description=${search.name}&code=${search.lineCode}&direction=${search.direction}`,
            HeaderToken()
        )
            .then(response => {
                setLineList(response.data.data);
                setMeta(response.data.meta);
                setLoad(false);
            })
            .catch(error => {
                setLoad(false);
                Interceptor(error);
            });
    };

    const actionModalForm = () => {
        setModalForm(!modalForm);
    };

    const actionModalBody = identifier => {
        setIdentifierSelected(identifier);
        setModalBody(!modalDecision);
    };

    const actionModalImport = () => {
        setModalImport(!modalImport);
    };

    const Modals = () => {
        return (
            <>
                <ModalDelete
                    actionModalDelete={actionModalBody}
                    getList={getLine}
                    modalDelete={modalDecision}
                    identifier={identifierSelected}
                    type="create"
                    url="line"
                    name="linha"
                    redirect="/lines"
                    data={dataToDelete}
                />
                <ModalCreate
                    actionModalPost={actionModalForm}
                    getList={getLine}
                    companyList={companyList}
                    modalPost={modalForm}
                />
                <ModalImport actionModalPost={actionModalImport} modalPost={modalImport} />
            </>
        );
    };

    return (
        <>
            <Title title={"Linhas cadastradas"} crumbs={props.crumbs} />
            <Modals />
            <SearchEngine
                search={search}
                setSearch={setSearch}
                type={{
                    lineCode: true,
                    name: true,
                    direction: true,
                    company: true,
                }}
            />
            <Card>
                <div className="flex justify-between">
                    <h2 className="mb-5 font-light">Listagem de linhas de ônibus</h2>
                    <div className="text-right">
                        <ButtonIconTextDefault
                            className="mr-2"
                            title={"Importar"}
                            onClick={actionModalImport}
                            icon={<IoIosCloudUpload />}
                        />
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
                                        label="Código"
                                        field="e.code"
                                        currentSortingField={currentSortingField}
                                        setCurrentSortingField={setCurrentSortingField}
                                        currentSortingDirection={currentSortingDirection}
                                        setCurrentSortingDirection={setCurrentSortingDirection}
                                        setSortingString={setSortingString}
                                    />
                                </th>
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
                                        label="Sentido"
                                        field="e.direction"
                                        currentSortingField={currentSortingField}
                                        setCurrentSortingField={setCurrentSortingField}
                                        currentSortingDirection={currentSortingDirection}
                                        setCurrentSortingDirection={setCurrentSortingDirection}
                                        setSortingString={setSortingString}
                                    />
                                </th>
                                <th className="px-3 py-2 text-left font-medium text-14">
                                    <Sorting
                                        label="Valor da Passagem"
                                        field="e.passage"
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
                        {lineList.length > 0 && !load && (
                            <tbody>
                                {lineList.map((value, index) => {
                                    return (
                                        <tr
                                            className={index % 2 === 0 ? "bg-tablerow" : ""}
                                            key={value.identifier}>
                                            <td className="px-4 py-5 font-light text-c8 text-14">
                                                {value.code}
                                            </td>
                                            <td className="px-4 py-5 font-light text-c8 text-14">
                                                {value.description}
                                            </td>
                                            <td className="px-4 py-5 font-light text-c8 text-14">
                                                {value.direction === "GOING"
                                                    ? "Ida"
                                                    : value.direction === "RETURN"
                                                    ? "Volta"
                                                    : "Circular"}
                                            </td>
                                            <td className="px-4 py-5 font-light text-c8 text-14">
                                                {value.passage.toLocaleString("pt-BR", {
                                                    style: "currency",
                                                    currency: "BRL",
                                                })}
                                            </td>
                                            <td className="px-4 py-5 font-light text-c8 text-14 text-center w-1/12">
                                                <Link to={`/lines/show/${value.identifier}`}>
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
                        {lineList.length === 0 && !load && (
                            <p className="center">Nenhuma linha encontrada </p>
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

export default Lines;
