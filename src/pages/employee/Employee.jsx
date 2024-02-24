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
import ModalCreate from "./Modals/ModalCreate";
import ModalDelete from "../../components/Modais/ModalDelete";
import ModalImport from "./Modals/ModalImport";
import Colors from "../../assets/constants/Colors";
import ClipLoader from "react-spinners/ClipLoader";
import Paginate from "../../components/Paginate";
import SearchEngine from "../../components/Filter/SearchEngine";
import Interceptor from "../../services/interceptor";
import Sorting from "../../components/Sorting";

const Employee = props => {
    const [modalForm, setModalForm] = useState(0);
    const [modalDecision, setModalBody] = useState(0);
    const [modalImport, setModalImport] = useState(false);
    const [load, setLoad] = useState(0);
    const [employees, setEmployees] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [modalities, setModalities] = useState([]);
    const [identifierSelected, setIdentifierSelected] = useState("");
    const [search, setSearch] = useState({
        name: "",
        employeeCode: "",
        company: "",
        modalityEmployee: "",
    });
    const [meta, setMeta] = useState({
        current_page: 1,
    });
    const [action, setAction] = useState(1);
    const [sortingString, setSortingString] = useState("");
    const [currentSortingField, setCurrentSortingField] = useState("");
    const [currentSortingDirection, setCurrentSortingDirection] = useState(false);
    const dataToDelete = ["Escalas", "Viagens", "Eventos"];

    useEffect(() => {
        getEmployees();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [action, search, sortingString]);

    useEffect(() => {
        getModalities();
        getCompanies();
    }, []);

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

    const getEmployees = () => {
        setLoad(true);
        api.get(
            `api/adm/employee/list?&${sortingString}&page=${meta.current_page}&company[]=${search.company}&name=${search.name}&modality[]=${search.modalityEmployee}&code=${search.employeeCode}`,
            HeaderToken()
        )
            .then(response => {
                setEmployees(response.data.data);
                setLoad(false);
                setMeta(response.data.meta);
            })
            .catch(error => {
                setLoad(false);
                Interceptor(error);
            });
    };

    const getCompanies = () => {
        api.get(`api/adm/company/list?page_size=9999999`, HeaderToken())
            .then(response => {
                setCompanies(response.data.data);
            })
            .catch(error => {
                setLoad(false);
                Interceptor(error);
            });
    };

    const getModalities = () => {
        api.get(`api/adm/employee-modality/list?page_size=9999999`, HeaderToken())
            .then(response => {
                setModalities(response.data.data);
            })
            .catch(error => {
                setLoad(false);
                Interceptor(error);
            });
    };

    const Modals = () => {
        return (
            <>
                <ModalCreate
                    modalPost={modalForm}
                    actionModalPost={actionModalForm}
                    getList={getEmployees}
                    modalityList={modalities}
                    companyList={companies}
                />
                <ModalDelete
                    actionModalDelete={actionModalBody}
                    modalDelete={modalDecision}
                    getList={getEmployees}
                    identifier={identifierSelected}
                    type="create"
                    redirect="/employee"
                    url="employee"
                    name="colaborador"
                    data={dataToDelete}
                />

                <ModalImport actionModalPost={actionModalImport} modalPost={modalImport} />
            </>
        );
    };

    return (
        <>
            <Title title={"Listagem de colaboradores"} crumbs={props.crumbs} />
            <Modals />
            <SearchEngine
                search={search}
                setSearch={setSearch}
                type={{
                    name: true,
                    employeeCode: true,
                    company: true,
                    modalityEmployee: true,
                }}
            />
            <Card>
                <div className="flex justify-between">
                    <h2 className="mb-5 font-light">Listagem de colaboradores</h2>
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
                                        label="Função"
                                        field="modality.description"
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
                                <th className="px-3 py-2 text-center font-medium text-14 w-1/12">Ações</th>
                            </tr>
                        </thead>
                        {employees.length > 0 && !load && (
                            <tbody>
                                {employees.map((value, index) => {
                                    return (
                                        <tr
                                            className={index % 2 === 0 ? "bg-tablerow" : ""}
                                            key={value.identifier}>
                                            <td className="px-4 py-5 font-light text-c8 text-14">
                                                {value.code}
                                            </td>
                                            <td className="px-4 py-5 font-light text-c8 text-14">
                                                {value.name}
                                            </td>
                                            <td className="px-4 py-5 font-light text-c8 text-14">
                                                {value.modality.description}
                                            </td>
                                            <td className="px-4 py-5 font-light text-c8 text-14">
                                                {value.company.description}
                                            </td>
                                            <td className="px-4 py-5 font-light text-c8 text-14 text-center w-1/12">
                                                <Link to={`/employee/show/${value.identifier}`}>
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
                        {employees.length === 0 && !load && (
                            <p className="center">Nenhum colaborador encontrado </p>
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

export default Employee;
