/* eslint-disable default-case */
import React, { useEffect, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { Link } from "react-router-dom";
import moment from "moment";
import { IoIosAddCircle } from "react-icons/io";

import Colors from "../../assets/constants/Colors";
import eyeSVG from "../../assets/svgs/eye.svg";
import trashSVG from "../../assets/svgs/trash.svg";
import api from "../../services/api";
import HeaderToken from "../../services/headerToken";
import Interceptor from "../../services/interceptor";
import useFilterFormat from "../../hooks/useFilterFormat";
import ButtonIconTextDefault from "../../components/Buttons/default/ButtonIconTextDefault";
import Card from "../../components/Cards/Card";
import ModalDelete from "../../components/Modais/ModalDelete";
import Paginate from "../../components/Paginate";
import SearchEngine from "../../components/Filter/SearchEngine";
import Title from "../../components/Title";
import ModalCreate from "./Modals/ModalCreate";
import { getPastDays } from "../../components/Filter/utils";

const Events = props => {
    const [search, setSearch] = useState({
        vehicle: "",
        collaborators: "",
        sector: "",
        occurrenceType: "",
        ...getPastDays(7),
    });
    const [eventList, setEventList] = useState([]);
    const [modalPost, setModalPost] = useState(false);
    const [modalDecision, setModalBody] = useState(false);
    const [eventModality, setEventModality] = useState([]);
    const [eventCategory, setEventCategory] = useState([]);
    const [eventStatus, setEventStatus] = useState([]);
    const [collaborators, setCollaborators] = useState([]);
    const [vehicle, setVehicle] = useState([]);
    const [occurrenceType, setOccurrenceType] = useState([]);
    const [sector, setSector] = useState([]);
    const [line, setLine] = useState([]);
    const [load, setLoad] = useState(false);
    const [identifierSelected, setIdentifierSelected] = useState();
    const [meta, setMeta] = useState({
        current_page: 1,
    });
    const newSearch = useFilterFormat(search);
    const [action, setAction] = useState(1);

    const actionModalPost = () => {
        setModalPost(!modalPost);
    };

    const actionModalBody = identifier => {
        setIdentifierSelected(identifier);
        setModalBody(!modalDecision);
    };

    const getEventByType = type => {
        api.get(`api/adm/event-${type}/list?page_size=9999999`, HeaderToken())
            .then(response => {
                switch (type) {
                    case "modality":
                        setEventModality(response.data.data);
                        break;
                    case "status":
                        setEventStatus(response.data.data);
                        break;
                    case "category":
                        setEventCategory(response.data.data);
                        break;
                }
            })
            .catch(error => {
                setLoad(false);
                Interceptor(error);
            });
    };

    const getCollaborators = () => {
        api.get(`api/adm/employee/list?page_size=9999999`, HeaderToken()).then(response => {
            setCollaborators(response.data.data);
        });
    };

    const getLine = () => {
        setLoad(true);
        api.get(`api/adm/line/list?page_size=9999999`, HeaderToken()).then(response => {
            setLoad(false);
            setLine(response.data.data);
        });
    };

    const getSector = () => {
        api.get(`api/adm/sector/list?page_size=9999999`, HeaderToken()).then(response => {
            setSector(response.data.data);
        });
    };

    const getOccurrenceType = () => {
        api.get(`api/adm/event-category/list?page_size=9999999`, HeaderToken()).then(response => {
            setOccurrenceType(response.data.data);
        });
    };

    const getVehicle = () => {
        api.get(`api/adm/vehicle/list?page_size=9999999`, HeaderToken())
            .then(response => {
                setVehicle(response.data.data);
            })
            .catch(error => {
                setLoad(false);
                Interceptor(error);
            });
    };

    useEffect(() => {
        getEventByType("status");
        getEventByType("category");
        getVehicle();
        getSector();
        getCollaborators();
        getOccurrenceType();
        getLine();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setLoad(true);
        api.get(`api/adm/event/list`, {
            ...HeaderToken(),
            params: { page: meta.current_page, ...newSearch },
        })
            .then(response => {
                setEventList(response.data.data);
                setLoad(false);
                setMeta(response.data.meta);
            })
            .catch(error => {
                setLoad(false);
                Interceptor(error);
            });
    }, [action, newSearch]);

    const Modals = () => {
        return (
            <>
                <ModalCreate
                    actionModalPost={actionModalPost}
                    modalPost={modalPost}
                    getList={() => setAction(!action)}
                    vehicleList={vehicle}
                    modalityList={eventModality}
                    categoryList={eventCategory}
                    statusList={eventStatus}
                />
                <ModalDelete
                    actionModalDelete={actionModalBody}
                    modalDelete={modalDecision}
                    identifier={identifierSelected}
                    getList={() => setAction(!action)}
                    type={"create"}
                    redirect="/event"
                    url="event"
                    name="evento"
                />
            </>
        );
    };

    return (
        <>
            <Title title={"Lista de eventos"} crumbs={props.crumbs} />
            <Modals />
            <SearchEngine
                search={search}
                setSearch={setSearch}
                type={{
                    period: true,
                    occurrenceType: true,
                    collaborators: true,
                    vehicle: true,
                    sector: true,
                }}
            />

            <Card>
                <div className="flex justify-between">
                    <h2 className="mb-5 font-light">Eventos</h2>
                    <div className="text-right">
                        <ButtonIconTextDefault
                            title={"Adicionar"}
                            onClick={actionModalPost}
                            icon={<IoIosAddCircle />}
                        />
                    </div>
                </div>
                <div className="overflow-auto">
                    <table className="table-auto w-full">
                        <thead>
                            <tr className="text-primary">
                                <th className="px-3 py-2 text-left font-medium text-14">
                                    Descrição
                                </th>
                                <th className="px-3 py-2 text-left font-medium text-14">Início</th>
                                <th className="px-3 py-2 text-left font-medium text-14">Fim</th>
                                <th className="px-3 py-2 text-left font-medium text-14">Status</th>
                                <th className="px-3 py-2 text-left font-medium text-14">
                                    Modalidade
                                </th>
                                <th className="px-3 py-2 text-left font-medium text-14">
                                    Categoria
                                </th>
                                <th className="px-3 py-2 text-left font-medium text-14">Ações</th>
                            </tr>
                        </thead>
                        {eventList.length > 0 && !load && (
                            <tbody>
                                {eventList.map((event, index) => {
                                    return (
                                        <tr
                                            className={index % 2 === 0 ? "bg-tablerow" : ""}
                                            key={event.identifier}>
                                            <td className="px-4 py-5 font-light text-c8 text-14">
                                                {event.comment}
                                            </td>
                                            <td className="px-4 py-5 font-light text-c8 text-14">
                                                {moment(event.start).format("DD/MM/YYYY HH:mm")}
                                            </td>
                                            <td className="px-4 py-5 font-light text-c8 text-14">
                                                {moment(event.end).format("DD/MM/YYYY HH:mm")}
                                            </td>
                                            <td className="px-4 py-5 font-light text-c8 text-14">
                                                {event.status.description}
                                            </td>
                                            <td className="px-4 py-5 font-light text-c8 text-14">
                                                {event.modality.description}
                                            </td>
                                            <td className="px-4 py-5 font-light text-c8 text-14">
                                                {event.category.description}
                                            </td>
                                            <td className="px-4 py-5 font-light text-c8 text-14 w-32">
                                                <Link to={`/event/show/${event.identifier}`}>
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
                                                        actionModalBody(event.identifier);
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
                        {eventList.length === 0 && !load && (
                            <p className="center">Nenhum evento encontrado </p>
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

export default Events;
