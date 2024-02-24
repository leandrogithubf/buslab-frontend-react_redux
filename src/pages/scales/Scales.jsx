import React, { useState, useEffect } from "react";
import Title from "../../components/Title";
import trashSVG from "../../assets/svgs/trash.svg";
import Card from "../../components/Cards/Card";
import ButtonIconTextDefault from "../../components/Buttons/default/ButtonIconTextDefault";
import { IoIosAddCircle, IoIosCloudUpload } from "react-icons/io";
import SearchEngine from "../../components/Filter/SearchEngine";
import ModalCreate from "./Modals/ModalCreate";
import ModalDelete from "../../components/Modais/ModalDelete";
import ModalImport from "./Modals/ModalImport";
import api from "../../services/api";
import HeaderToken from "../../services/headerToken";
import Interceptor from "../../services/interceptor";
import Colors from "../../assets/constants/Colors";
import Paginate from "../../components/Paginate";
import ClipLoader from "react-spinners/ClipLoader";
import eyeSVG from "../../assets/svgs/eye.svg";
import { Link } from "react-router-dom";
import Sorting from "../../components/Sorting";

const Scales = props => {
    const [modalForm, setModalform] = useState(false);
    const [modalDecision, setModalBody] = useState(false);
    const [modalImport, setModalImport] = useState(false);
    const [action, setAction] = useState(1);
    const [identifierSelected, setIdentifierSelected] = useState("");
    const [employeeList, setEmployeeList] = useState([]);
    const [vehicle, setVehicle] = useState([]);
    const [line, setLine] = useState([]);
    const [meta, setMeta] = useState({
        currentPage: 1,
    });
    const [load, setLoad] = useState(true);
    const [scaleList, setScaleList] = useState([]);
    const [companyList, setCompanyList] = useState([]);
    const [search, setSearch] = useState({
        employee: "",
        vehicle: "",
        line: "",
        company: "",
    });

    const [sortingString, setSortingString] = useState("");
    const [currentSortingField, setCurrentSortingField] = useState("");
    const [currentSortingDirection, setCurrentSortingDirection] = useState(false);

    useEffect(() => {
        getScale();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, action, sortingString]);

    useEffect(() => {
        getVehicle();
        getEmployee();
        getLine();
        getCompany();
    }, []);

    const getCompany = () => {
        api.get(`api/adm/company/list?page_size=999999`, HeaderToken())
            .then(response => {
                setCompanyList(response.data.data);
            })
            .catch(error => {
                setLoad(false);
                Interceptor(error);
            });
    };

    const getScale = () => {
        setLoad(true);
        api.get(
            `api/adm/schedule/list?&${sortingString}&page=${meta.currentPage}&company[]=${search.company}&vehicle[]=${search.vehicle}&line[]=${search.line}`,
            HeaderToken()
        )
            .then(response => {
                setScaleList(response.data.data);
                setMeta(response.data.meta);
                setLoad(false);
            })
            .catch(error => {
                setLoad(false);
                Interceptor(error);
            });
    };

    const getVehicle = () => {
        api.get(`api/adm/vehicle/list?page_size=9999999`, HeaderToken()).then(response => {
            setVehicle(response.data.data);
        });
    };

    const getLine = () => {
        setLoad(true);
        api.get(`api/adm/line/list?page_size=9999999`, HeaderToken()).then(response => {
            setLoad(false);
            setLine(response.data.data);
        });
    };

    const getEmployee = () => {
        api.get(`api/adm/employee/list?page_size=9999999`, HeaderToken()).then(response => {
            setEmployeeList(response.data.data);
        });
    };

    const actionModalForm = () => {
        setModalform(!modalForm);
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
                <ModalCreate
                    overflow
                    actionModalPost={actionModalForm}
                    modalPost={modalForm}
                    getList={() => getScale()}
                    vehicleList={vehicle}
                    lineList={line}
                    employeeList={employeeList}
                    companyList={companyList}
                />
                <ModalDelete
                    actionModalDelete={actionModalBody}
                    modalDelete={modalDecision}
                    identifier={identifierSelected}
                    getList={getScale}
                    type={"create"}
                    url="schedule"
                    redirect="/scales"
                    name="escala"
                />
                <ModalImport actionModalPost={actionModalImport} modalPost={modalImport} />
            </>
        );
    };

    return (
        <>
            <Modals />
            <Title title={"Escalas cadastradas"} crumbs={props.crumbs} />
            <SearchEngine
                search={search}
                setSearch={setSearch}
                type={{
                    company: true,
                    vehicle: true,
                    line: true,
                }}
            />
            <Card>
                <div className="flex flex-wrap justify-between -mx-3 mb-2">
                    <div className="px-3 mb-6 md:mb-0">
                        <h2 className="mb-5 font-light">Listagem de escalas</h2>
                    </div>
                    <div className=" px-3 mb-6 md:mb-0">
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
                </div>
                <div className="overflow-auto">
                    <table className="table-auto w-full">
                        <thead>
                            <tr className="text-primary">
                                <th className="px-3 py-2 text-left font-medium text-14">
                                    <Sorting
                                        label="Linha"
                                        field="line.code"
                                        currentSortingField={currentSortingField}
                                        setCurrentSortingField={setCurrentSortingField}
                                        currentSortingDirection={currentSortingDirection}
                                        setCurrentSortingDirection={setCurrentSortingDirection}
                                        setSortingString={setSortingString}
                                    />
                                </th>
                                <th className="px-3 py-2 text-left font-medium text-14">
                                    <Sorting
                                        label="Descrição"
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
                                        label="Veículo"
                                        field="vehicle.plate"
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
                        {scaleList.length > 0 && !load && (
                            <tbody>
                                {scaleList.map((scale, index) => (
                                    <tr
                                        className={index % 2 === 0 ? "bg-tablerow" : ""}
                                        key={scale.identifier}>
                                        <td className="px-4 py-5 font-light text-c8 text-14">
                                            {scale?.line?.code + " - " + scale?.line?.description}
                                            {scale?.line?.direction === "CIRCULATE" &&
                                                " - Circular"}
                                            {scale?.line?.direction === "GOING" && " - Ida"}
                                            {scale?.line?.direction === "RETURN" && " - Volta"}
                                        </td>
                                        <td className="px-4 py-5 font-light text-c8 text-14">
                                            {scale.description}
                                        </td>
                                        <td className="px-4 py-5 font-light text-c8 text-14">
                                            {scale.vehicle ? scale.vehicle.plate : "Não definido"}
                                        </td>
                                        <td className="px-4 py-5 font-light text-c8 text-14 text-center w-1/12">
                                            <Link to={`/scale/show/${scale.identifier}`}>
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
                                                onClick={() => actionModalBody(scale.identifier)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        )}
                    </table>
                </div>
                <div className="w-full">
                    <div className="flex justify-center">
                        {scaleList.length === 0 && !load && (
                            <p className="center">Nenhuma escala encontrada </p>
                        )}
                        {load && <ClipLoader size={20} color={Colors.buslab} loading={load} />}
                    </div>
                </div>
                {meta.totalPages > 1 && (
                    <Paginate meta={meta} setMeta={setMeta} action={action} setAction={setAction} />
                )}
            </Card>
        </>
    );
};

export default Scales;
