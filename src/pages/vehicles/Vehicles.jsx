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
import Colors from "../../assets/constants/Colors";
import ClipLoader from "react-spinners/ClipLoader";
import DependencyModalCreate from "./Modals/DependencyModalCreate";
import Paginate from "../../components/Paginate";
import SearchEngine from "../../components/Filter/SearchEngine";
import Interceptor from "../../services/interceptor";
import ModalImport from "./Modals/ModalImport";
import Sorting from "../../components/Sorting";

const Vehicles = props => {
    const [modalForm, setModalForm] = useState(0);
    const [modalNewModel, setModalNewModel] = useState(0);
    const [modalNewBrand, setModalNewBrand] = useState(0);
    const [modalDecision, setModalBody] = useState(0);
    const [load, setLoad] = useState(false);
    const [identifierSelected, setIdentifierSelected] = useState();
    const [obdList, setObdList] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [status, setStatus] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [models, setModels] = useState([]);
    const [brandList, setBrandList] = useState([]);
    const [action, setAction] = useState(1);
    const [modalImport, setModalImport] = useState(false);
    const [meta, setMeta] = useState({
        current_page: 1,
    });
    const dataToDelete = ["Escalas", "Viagens", "Eventos"];
    const [search, setSearch] = useState({
        company: "",
        brand: "",
        model: "",
        code: "",
        plate: "",
        obd: "",
        status: "",
    });

    const actionModalForm = () => {
        setModalForm(!modalForm);
    };

    const actionModalImport = () => {
        setModalImport(!modalImport);
    };

    const actionModalNewModel = () => {
        setModalNewModel(!modalNewModel);
    };

    const actionModalNewBrand = () => {
        setModalNewBrand(!modalNewBrand);
    };

    const actionModalBody = identifier => {
        setIdentifierSelected(identifier);
        setModalBody(!modalDecision);
    };

    const getVehicles = () => {
        setLoad(true);
        api.get(
            `api/adm/vehicle/list?&page=${meta.current_page}&${sortingString}&company[]=${search.company}&prefix=${search.code}&model[]=${search.model}&brand[]=${search.brand}&plate=${search.plate}&obd[]=${search.obd}`,
            HeaderToken()
        )
            .then(response => {
                setLoad(false);
                setVehicles(response.data.data);
                setMeta(response.data.meta);
            })
            .catch(error => {
                setLoad(false);
                Interceptor(error);
            });
    };

    const getModels = () => {
        api.get(`api/adm/vehicle/model/list?page_size=999999`, HeaderToken())
            .then(response => {
                setModels(response.data.data);
            })
            .catch(error => {
                setLoad(false);
                Interceptor(error);
            });
    };

    const getObds = () => {
        api.get(`api/adm/obd/list-free/?page_size=999999`, HeaderToken())
            .then(response => {
                setObdList(response.data.data);
            })
            .catch(error => {
                setLoad(false);
                Interceptor(error);
            });
    };

    const getCompanies = () => {
        api.get(`api/adm/company/list?page_size=999999`, HeaderToken())
            .then(response => {
                setCompanies(response.data.data);
            })
            .catch(error => {
                setLoad(false);
                Interceptor(error);
            });
    };

    const getStatus = () => {
        api.get(`api/adm/vehicle/status/list?page_size=999999`, HeaderToken())
            .then(response => {
                setStatus(response.data.data);
            })
            .catch(error => {
                setLoad(false);
                Interceptor(error);
            });
    };

    const getBrand = () => {
        setLoad(true);
        api.get(`api/adm/vehicle/brand/list?page_size=999999`, HeaderToken())
            .then(response => {
                setBrandList(response.data.data);
                setLoad(false);
            })
            .catch(error => {
                setLoad(false);
                Interceptor(error);
            });
    };

    const [sortingString, setSortingString] = useState("");
    const [currentSortingField, setCurrentSortingField] = useState("");
    const [currentSortingDirection, setCurrentSortingDirection] = useState(false);

    useEffect(() => {
        getVehicles();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [action, search, sortingString]);

    useEffect(() => {
        getCompanies();
        getObds();
        getModels();
        getBrand();
        getStatus();
    }, []);

    const Modals = () => {
        return (
            <>
                <ModalCreate
                    modalPost={modalForm}
                    actionModalPost={actionModalForm}
                    getList={getVehicles}
                    modelList={models}
                    obdList={obdList}
                    companyList={companies}
                    statusList={status}
                />
                <ModalImport
                    actionModalPost={actionModalImport}
                    modalPost={modalImport}
                    type="vehicles"
                />
                <ModalDelete
                    actionModalDelete={actionModalBody}
                    modalDelete={modalDecision}
                    getList={getVehicles}
                    identifier={identifierSelected}
                    type="create"
                    url="vehicle"
                    redirect="/vehicles"
                    name="veículo"
                    data={dataToDelete}
                />
                <DependencyModalCreate
                    modalPost={modalNewModel}
                    actionModalPost={actionModalNewModel}
                    brandList={brandList}
                    getList={getModels}
                    type="model"
                />
                <DependencyModalCreate
                    modalPost={modalNewBrand}
                    actionModalPost={actionModalNewBrand}
                    getList={getBrand}
                    type="brand"
                />
            </>
        );
    };

    return (
        <>
            <Title title={"Veículos cadastrados"} crumbs={props.crumbs} />
            <Modals />
            <SearchEngine
                search={search}
                setSearch={setSearch}
                type={{
                    company: true,
                    brand: true,
                    model: true,
                    code: true,
                    plate: true,
                    obd: true,
                }}
            />
            <Card>
                <div className="flex justify-between">
                    <h2 className="mb-5 font-light">Listagem de Veículos</h2>
                    <div className="text-right">
                        <ButtonIconTextDefault
                            className="mr-2"
                            title={"Novo fabricante"}
                            onClick={actionModalNewBrand}
                            icon={<IoIosAddCircle />}
                        />
                        <ButtonIconTextDefault
                            className="mr-2"
                            title={"Novo Modelo"}
                            onClick={actionModalNewModel}
                            icon={<IoIosAddCircle />}
                        />
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
                    <table className="table-auto text-left w-full">
                        <thead>
                            <tr className="text-primary">
                                <th className="px-3 py-2 text-left font-medium text-14">
                                    <Sorting
                                        label="OBD"
                                        field="obd.serial"
                                        currentSortingField={currentSortingField}
                                        setCurrentSortingField={setCurrentSortingField}
                                        currentSortingDirection={currentSortingDirection}
                                        setCurrentSortingDirection={setCurrentSortingDirection}
                                        setSortingString={setSortingString}
                                    />
                                </th>
                                <th className="px-3 py-2 text-left font-medium text-14">
                                    <Sorting
                                        label="Prefixo"
                                        field="e.prefix"
                                        currentSortingField={currentSortingField}
                                        setCurrentSortingField={setCurrentSortingField}
                                        currentSortingDirection={currentSortingDirection}
                                        setCurrentSortingDirection={setCurrentSortingDirection}
                                        setSortingString={setSortingString}
                                    />
                                </th>
                                <th className="px-3 py-2 text-left font-medium text-14">
                                    <Sorting
                                        label="Placa"
                                        field="e.plate"
                                        currentSortingField={currentSortingField}
                                        setCurrentSortingField={setCurrentSortingField}
                                        currentSortingDirection={currentSortingDirection}
                                        setCurrentSortingDirection={setCurrentSortingDirection}
                                        setSortingString={setSortingString}
                                    />
                                </th>
                                <th className="px-3 py-2 text-left font-medium text-14">
                                    <Sorting
                                        label="Fabricante Chassi"
                                        field="brand.description"
                                        currentSortingField={currentSortingField}
                                        setCurrentSortingField={setCurrentSortingField}
                                        currentSortingDirection={currentSortingDirection}
                                        setCurrentSortingDirection={setCurrentSortingDirection}
                                        setSortingString={setSortingString}
                                    />
                                </th>
                                <th className="px-3 py-2 text-left font-medium text-14">
                                    <Sorting
                                        label="Modelo Chassi"
                                        field="model.description"
                                        currentSortingField={currentSortingField}
                                        setCurrentSortingField={setCurrentSortingField}
                                        currentSortingDirection={currentSortingDirection}
                                        setCurrentSortingDirection={setCurrentSortingDirection}
                                        setSortingString={setSortingString}
                                    />
                                </th>
                                <th className="px-3 py-2 text-left font-medium text-14">
                                    <Sorting
                                        label="Ano Chassi"
                                        field="e.manufacture"
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
                                        field="status.status"
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
                        {vehicles.length > 0 && !load && (
                            <tbody>
                                {vehicles.map((value, index) => {
                                    return (
                                        <tr
                                            className={index % 2 === 0 ? "bg-tablerow" : ""}
                                            key={value.identifier}>
                                            <td className="px-4 py-5 font-light text-c8 text-14">
                                                {value.obd
                                                    ? value.obd.serial
                                                    : "Nenhum obd vinculado"}
                                            </td>
                                            <td className="px-4 py-5 font-light text-c8 text-14">
                                                {value.prefix}
                                            </td>
                                            <td className="px-4 py-5 font-light text-c8 text-14">
                                                {value.plate}
                                            </td>
                                            <td className="px-4 py-5 font-light text-c8 text-14">
                                                {value.model.brand.description}
                                            </td>
                                            <td className="px-4 py-5 font-light text-c8 text-14">
                                                {value.model.description}
                                            </td>
                                            <td className="px-4 py-5 font-light text-c8 text-14">
                                                {value.manufacture}
                                            </td>
                                            <td className="px-4 py-5 font-light text-c8 text-14">
                                                {value.status
                                                    ? value.status.status
                                                    : "Sem status cadastrado"}
                                            </td>
                                            <td className="px-4 py-5 font-light text-c8 text-14">
                                                {value.company.description}
                                            </td>
                                            <td className="px-4 py-5 font-light text-c8 text-14 text-center w-1/12">
                                                <Link to={`/vehicles/show/${value.identifier}`}>
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
                        {vehicles.length === 0 && !load && (
                            <p className="center">Nenhum veículo encontrado</p>
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

export default Vehicles;
