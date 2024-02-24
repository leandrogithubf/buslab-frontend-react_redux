import React, { useState, useEffect } from "react";
import Title from "../../components/Title";
import Card from "../../components/Cards/Card";
import ButtonIconTextDefault from "../../components/Buttons/default/ButtonIconTextDefault";
import { IoIosAddCircle } from "react-icons/io";
import eyeSVG from "../../assets/svgs/eye.svg";
import trashSVG from "../../assets/svgs/trash.svg";
import { Link } from "react-router-dom";
import api from "../../services/api";
import ModalDelete from "../../components/Modais/ModalDelete";
import ModalCreate from "./Modals/ModalCreate";
import Colors from "../../assets/constants/Colors";
import ClipLoader from "react-spinners/ClipLoader";
import HeaderToken from "../../services/headerToken";
import Paginate from "../../components/Paginate";
import SearchEngine from "../../components/Filter/SearchEngine";
import Interceptor from "../../services/interceptor";
import NumberFormat from "react-number-format";
import Sorting from "../../components/Sorting";

const Obd = props => {
    const [modalForm, setModalForm] = useState(0);
    const [modalDecision, setModalBody] = useState(0);
    const [load, setLoad] = useState(false);
    const [obdList, setObdList] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [cellphoneNumber, setCellphoneNumber] = useState([]);
    const [identifierSelected, setIdentifierSelected] = useState([]);
    const [search, setSearch] = useState({
        serial: "",
        version: "",
        cellphoneNumber: "",
        company: "",
    });
    const [meta, setMeta] = useState({
        current_page: 1,
    });
    const [action, setAction] = useState(1);
    const [sortingString, setSortingString] = useState("");
    const [currentSortingField, setCurrentSortingField] = useState("");
    const [currentSortingDirection, setCurrentSortingDirection] = useState(false);
    const dataToDelete = ["Veículo", "OBD", "Escalas", "Viagens", "Número", "Eventos"];

    useEffect(() => {
        getCompanies();
        getCellphoneNumber();
    }, []);

    useEffect(() => {
        getObd();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [action, search, sortingString]);

    const getCompanies = () => {
        setLoad(true);
        api.get(`api/adm/company/list?page_size=999999`, HeaderToken())
            .then(response => {
                setCompanies(response.data.data);
                setLoad(false);
            })
            .catch(error => {
                setLoad(false);
                Interceptor(error);
            });
    };

    const getCellphoneNumber = () => {
        api.get(`api/adm/cellphone/list/free?page_size=999999`, HeaderToken())
            .then(response => {
                setCellphoneNumber(response.data.data);
            })
            .catch(error => {
                setLoad(false);
                Interceptor(error);
            });
    };

    const getObd = () => {
        setLoad(true);
        api.get(
            `api/adm/obd/list?&${sortingString}&page=${meta.current_page}&company[]=${search.company}&serial=${search.serial}&version=${search.version}&cellphoneNumber[]=${search.cellphoneNumber}`,
            HeaderToken()
        )
            .then(response => {
                setLoad(false);
                setObdList(response.data.data);
                setMeta(response.data.meta);
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

    const Modals = () => {
        return (
            <>
                <ModalCreate
                    actionModalPost={actionModalForm}
                    modalPost={modalForm}
                    getList={() => getObd()}
                    companyList={companies}
                    cellphoneList={cellphoneNumber}
                />
                <ModalDelete
                    actionModalDelete={actionModalBody}
                    modalDelete={modalDecision}
                    getList={getObd}
                    identifier={identifierSelected}
                    type={"create"}
                    url="obd"
                    redirect="/obd"
                    name="OBD"
                    data={dataToDelete}
                />
            </>
        );
    };

    return (
        <>
            <Title title={"Obds cadastrados"} crumbs={props.crumbs} />
            <Modals />
            <SearchEngine
                search={search}
                setSearch={setSearch}
                type={{
                    serial: true,
                    version: true,
                    cellphoneNumber: true,
                    company: true,
                }}
            />
            <Card>
                <div className="flex justify-between">
                    <h2 className="mb-5 font-light">Listagem de Obds</h2>
                    <div>
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
                                        label="Serial"
                                        field="e.serial"
                                        currentSortingField={currentSortingField}
                                        setCurrentSortingField={setCurrentSortingField}
                                        currentSortingDirection={currentSortingDirection}
                                        setCurrentSortingDirection={setCurrentSortingDirection}
                                        setSortingString={setSortingString}
                                    />
                                </th>
                                <th className="px-3 py-2 text-left font-medium text-14">
                                    <Sorting
                                        label="Versão"
                                        field="e.version"
                                        currentSortingField={currentSortingField}
                                        setCurrentSortingField={setCurrentSortingField}
                                        currentSortingDirection={currentSortingDirection}
                                        setCurrentSortingDirection={setCurrentSortingDirection}
                                        setSortingString={setSortingString}
                                    />
                                </th>
                                <th className="px-3 py-2 text-left font-medium text-14">
                                    <Sorting
                                        label="Número"
                                        field="cellphoneNumber.number"
                                        currentSortingField={currentSortingField}
                                        setCurrentSortingField={setCurrentSortingField}
                                        currentSortingDirection={currentSortingDirection}
                                        setCurrentSortingDirection={setCurrentSortingDirection}
                                        setSortingString={setSortingString}
                                    />
                                </th>
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
                                <th className="px-3 py-2 text-left font-medium text-14">
                                    <Sorting
                                        label="Status"
                                        field="e.status"
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
                        {obdList.length > 0 && !load && (
                            <tbody>
                                {obdList.map((value, index) => {
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
                                                <NumberFormat
                                                    value={
                                                        value.cellphoneNumber
                                                            ? value.cellphoneNumber.number
                                                            : ""
                                                    }
                                                    displayType={"text"}
                                                    format="(##) #####-####"
                                                />
                                            </td>
                                            <td className="px-4 py-5 font-light text-c8 text-14">
                                                {value.company ? value.company.description : "-"}
                                            </td>
                                            <td className="px-4 py-5 font-light text-c8 text-14">
                                                {value.status == true ? "Alocado" : "Não alocado"}
                                            </td>
                                            <td className="px-4 py-5 font-light text-c8 text-14 text-center w-1/12">
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
                        {obdList.length === 0 && !load && (
                            <p className="center">Nenhum obd encontrado </p>
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

export default Obd;
