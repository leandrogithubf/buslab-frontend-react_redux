import React, { useState, useEffect } from "react";
import Title from "../../components/Title";
import eyeSVG from "../../assets/svgs/eye.svg";
import ClipLoader from "react-spinners/ClipLoader";
import Card from "../../components/Cards/Card";
import { Link } from "react-router-dom";
import SearchEngine from "../../components/Filter/SearchEngine";
import ButtonIconTextDefault from "../../components/Buttons/default/ButtonIconTextDefault";
import { IoIosAddCircle } from "react-icons/io";
import api from "../../services/api";
import ModalCreate from "./Modals/ModalCreate";
import ModalDelete from "../../components/Modais/ModalDelete";
import HeaderToken from "../../services/headerToken";
import Interceptor from "../../services/interceptor";
import Colors from "../../assets/constants/Colors";
import Paginate from "../../components/Paginate";
import trashSVG from "../../assets/svgs/trash.svg";
import Sorting from "../../components/Sorting";

import moment from "moment";
import useFilterFormat from "../../hooks/useFilterFormat";

const Occurrences = props => {
    const [search, setSearch] = useState({
        protocol: "",
        vehicle: "",
        collaborators: "",
        sector: "",
        occurrenceType: "",
    });
    const [modalForm, setModalform] = useState(false);
    const [modalDecision, setModalBody] = useState(false);
    const [action, setAction] = useState(1);
    const [identifierSelected, setIdentifierSelected] = useState();
    const [occurrenceList, setOccurrenceList] = useState([]);
    const [eventCategory, setEventCategory] = useState([]);
    const [occurrenceType, setOccurrenceType] = useState([]);
    const [eventStatus, setEventStatus] = useState([]);
    const [employeeList, setEmployeeList] = useState([]);
    const [vehicle, setVehicle] = useState([]);
    const [trip, setTrip] = useState([]);
    const [sector, setSector] = useState([]);
    const [collaborators, setCollaborators] = useState([]);
    const [line, setLine] = useState([]);
    const [load, setLoad] = useState(false);
    const [meta, setMeta] = useState({
        current_page: 1,
    });
    const [sortingString, setSortingString] = useState("");
    const [currentSortingField, setCurrentSortingField] = useState("");
    const [currentSortingDirection, setCurrentSortingDirection] = useState(false);

    const newSearch = useFilterFormat(search);
    useEffect(() => {
        getEventByType("status");
        getEventByType("category");
        getVehicle();
        getSector();
        getCollaborators();
        getOccurrenceType();
        getLine();
        getTrip();
        getEmployee();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        getOccurrences();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newSearch, action, sortingString]);

    const getEventByType = type => {
        api.get(`api/adm/event-${type}/list?page_size=9999999`, HeaderToken()).then(response => {
            // eslint-disable-next-line default-case
            switch (type) {
                case "status":
                    setEventStatus(response.data.data);
                    break;
                case "category":
                    setEventCategory(response.data.data);
                    break;
            }
        });
    };

    const getOccurrences = () => {
        setLoad(true);
        api.get(`api/adm/occurrences/list?&${sortingString}&page=${meta.current_page}`, {
            ...HeaderToken(),
            params: newSearch,
        })
            .then(response => {
                setOccurrenceList(response.data.data);
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

    const getSector = () => {
        api.get(`api/adm/sector/list?page_size=9999999`, HeaderToken()).then(response => {
            setSector(response.data.data);
        });
    };

    const getCollaborators = () => {
        api.get(`api/adm/employee/list?page_size=9999999`, HeaderToken()).then(response => {
            setCollaborators(response.data.data);
        });
    };

    const getOccurrenceType = () => {
        api.get(`api/adm/event-category/list?page_size=9999999`, HeaderToken()).then(response => {
            setOccurrenceType(response.data.data);
        });
    };

    const getLine = () => {
        setLoad(true);
        api.get(`api/adm/line/list?page_size=9999999`, HeaderToken()).then(response => {
            setLoad(false);
            setLine(response.data.data);
        });
    };

    const getTrip = () => {
        setLoad(true);
        api.get(`api/adm/trip/list?page_size=9999999`, HeaderToken()).then(response => {
            setLoad(false);
            setTrip(response.data.data);
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

    const Modals = () => {
        return (
            <>
                <ModalCreate
                    actionModalPost={actionModalForm}
                    modalPost={modalForm}
                    getList={getOccurrences}
                    categoryList={eventCategory}
                    statusList={eventStatus}
                    vehicleList={vehicle}
                    sectorList={sector}
                    lineList={line}
                    tripList={trip}
                    employeeList={employeeList}
                />
                <ModalDelete
                    actionModalDelete={actionModalBody}
                    modalDelete={modalDecision}
                    identifier={identifierSelected}
                    getList={getOccurrences}
                    type={"create"}
                    url="occurrences"
                    name="ocorrência"
                    redirect="/occurrences"
                />
            </>
        );
    };

    return (
        <>
            <Modals />
            <Title title={"Listagem de ocorrências"} crumbs={props.crumbs} />
            <SearchEngine
                search={search}
                setSearch={setSearch}
                type={{
                    period: "0",
                    occurrenceType: true,
                    collaborators: true,
                    vehicle: true,
                    protocol: true,
                    sector: true,
                }}
            />

            <Card>
                <div className="flex justify-between">
                    <h2 className="mb-5 font-light">Ocorrências</h2>
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
                                        label="Protocolo"
                                        field="e.protocol"
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
                                        field="occurrenceType.description"
                                        currentSortingField={currentSortingField}
                                        setCurrentSortingField={setCurrentSortingField}
                                        currentSortingDirection={currentSortingDirection}
                                        setCurrentSortingDirection={setCurrentSortingDirection}
                                        setSortingString={setSortingString}
                                    />
                                </th>
                                <th className="px-3 py-2 text-left font-medium text-14">
                                    <Sorting
                                        label="Início"
                                        field="e.start"
                                        currentSortingField={currentSortingField}
                                        setCurrentSortingField={setCurrentSortingField}
                                        currentSortingDirection={currentSortingDirection}
                                        setCurrentSortingDirection={setCurrentSortingDirection}
                                        setSortingString={setSortingString}
                                    />
                                </th>
                                <th className="px-3 py-2 text-left font-medium text-14">
                                    <Sorting
                                        label="Fim"
                                        field="e.end"
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
                                        field="eventStatus.description"
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
                        {occurrenceList.length > 0 && !load && (
                            <tbody>
                                {occurrenceList.map((occurrence, index) => (
                                    <tr
                                        className={index % 2 === 0 ? "bg-tablerow" : ""}
                                        key={index}>
                                        <td className="px-4 py-5 font-light text-c8 text-14">
                                            {occurrence.protocol}
                                        </td>
                                        <td className="px-4 py-5 font-light text-c8 text-14">
                                            {occurrence.category.description}
                                        </td>
                                        <td className="px-4 py-5 font-light text-c8 text-14">
                                            {occurrence.start
                                                ? moment(occurrence.start).format(
                                                      "DD/MM/YYYY HH:mm:ss"
                                                  )
                                                : "-"}
                                        </td>
                                        <td className="px-4 py-5 font-light text-c8 text-14">
                                            {occurrence.end
                                                ? moment(occurrence.end).format(
                                                      "DD/MM/YYYY HH:mm:ss"
                                                  )
                                                : "-"}
                                        </td>
                                        <td className="px-4 py-5 font-light text-c8 text-14">
                                            {occurrence.status.description}
                                        </td>
                                        <td className="px-4 py-5 font-light text-c8 text-14 text-center w-1/12">
                                            <Link to={`/occurrences/show/${occurrence.identifier}`}>
                                                <img
                                                    className="cursor-pointer font-light w-6 text-primary inline mr-4"
                                                    alt="Ver"
                                                    src={eyeSVG}
                                                    onClick={() => {}}
                                                />
                                            </Link>
                                            <img
                                                className="cursor-pointer font-light w-4 text-primary inline"
                                                alt="Remover"
                                                src={trashSVG}
                                                onClick={() => {
                                                    actionModalBody(occurrence.identifier);
                                                }}
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
                        {occurrenceList.length === 0 && !load && (
                            <p className="center">Nenhuma ocorrência encontrada </p>
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

export default Occurrences;
