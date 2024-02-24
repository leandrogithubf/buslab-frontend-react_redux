import React, { useState, useEffect } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import moment from "moment";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { IoIosAddCircle } from "react-icons/io";
import { Formik } from "formik";
import Interceptor from "../../services/interceptor";
import api from "../../services/api";
import HeaderToken from "../../services/headerToken";
import Paginate from "../../components/Paginate";
import Title from "../../components/Title";
import Card from "../../components/Cards/Card";
import Back from "../../components/Back";
import SelectStyle from "../../components/Select";
import ButtonIconTextDefault from "../../components/Buttons/default/ButtonIconTextDefault";
import { Label, Information, Pencil, Save, LoadSave } from "../../components/Details";
import eyeSVG from "../../assets/svgs/eye.svg";
import Colors from "../../assets/constants/Colors";
import ModalCreateOccurence from "./Modals/ModalCreateOccurence";
import TripMap from "./TripMap";

const ShowTrip = props => {
    const [trip, setTrip] = useState({});
    const [scheduleDate, setScheduleDate] = useState([]);
    const [load, setLoad] = useState(0);
    const [activeEdit, setActiveEdit] = useState();
    const [employeeList, setEmployeeList] = useState([]);
    const [modalForm, setModalform] = useState(false);
    const [lineList, setLineList] = useState([]);
    const [occurrenceList, setOccurrenceList] = useState([]);
    const [vehicle, setVehicle] = useState([]);
    const [sector, setSector] = useState([]);
    const [metaOcurrence, setMetaOcurrence] = useState({
        current_page: 1,
    });
    //maps
    const [actionOcurrence, setActionOcurrence] = useState(1);
    const [points, setPoints] = useState([]);
    const [report, setReport] = useState({});

    useEffect(() => {
        getTrip();
        getVehicle();
        getEmployee();
        getLine();
        getSector();
    }, []);

    const getTrip = () => {
        setLoad(true);
        api.get(`api/adm/trip/${props.match.params.identifier}/show`, HeaderToken())
            .then(response => {
                setScheduleDate(response.data);
                if (response.data.trip) {
                    setTrip(response.data.trip);
                    setPoints(response.data.trip.identifier);
                    getOccurrences(response.data.trip.identifier);
                    setReport(response.data.trip.report)
                }
                setLoad(false);
            })
            .catch(() => {
                setLoad(false);
            });
    };

    const getOccurrences = identifier => {
        api.get(
            `/api/adm/event/${identifier}/list-events-by-trip?page_size=9999999`,
            HeaderToken()
        ).then(response => {
            setOccurrenceList(response.data.data);
        });
    };

    const getVehicle = () => {
        api.get(`api/adm/vehicle/list?page_size=9999999`, HeaderToken()).then(response => {
            setVehicle(response.data.data);
        });
    };

    const getLine = () => {
        api.get(`api/adm/line/list?page_size=9999999`, HeaderToken()).then(response => {
            setLineList(response.data.data);
        });
    };

    const getEmployee = () => {
        api.get(`api/adm/employee/list?page_size=9999999`, HeaderToken()).then(response => {
            setEmployeeList(response.data.data);
        });
    };

    const getSector = () => {
        api.get(`api/adm/sector/list?page_size=9999999`, HeaderToken()).then(response => {
            setSector(response.data.data);
        });
    };

    const setInputActive = value => {
        setActiveEdit(value);
    };

    const actionModalForm = () => {
        setModalform(!modalForm);
    };

    const Modals = () => {
        return (
            <>
                <ModalCreateOccurence
                    actionModalPost={actionModalForm}
                    modalPost={modalForm}
                    vehicleList={vehicle}
                    sectorList={sector}
                    lineList={lineList}
                    employeeList={employeeList}
                    trip={trip}
                    getTrip={getTrip}
                />
            </>
        );
    };

    return (
        <>
            <Modals />
            <Title title={"Detalhes da viagem"} crumbs={props.crumbs} />
            {load ? (
                <Card className="justify-center w-full">
                    <ClipLoader size={20} color={Colors.buslab} loading={true} />
                </Card>
            ) : (
                <>
                    <Card>
                        <Formik
                            initialValues={{
                                date: new Date(trip.starts_at),
                                schedule: scheduleDate.schedule,
                                tableCode: scheduleDate.tableCode,
                                driver: trip.driver,
                                collector: trip.collector,
                                line: trip.line,
                                vehicle: trip.vehicle,
                                obd: trip.obd,
                                company: trip.company,
                                status: trip.status,
                                modality: trip.modality,
                                trip: trip,
                            }}
                            enableReinitialize={true}
                            onSubmit={(values, { setSubmitting }) => {
                                const aux = {
                                    driver: values.driver?.identifier,
                                    collector: values.collector?.identifier,
                                    line: values.line?.identifier,
                                    obd: trip.obd?.identifier,
                                    vehicle: values.vehicle?.identifier,
                                    company: trip.company?.identifier,
                                    starts_at: moment(new Date(trip.starts_at)).format(
                                        "DD/MM/YYYY HH:mm:ss"
                                    ),
                                    ends_at: moment(new Date(trip.ends_at)).format(
                                        "DD/MM/YYYY HH:mm:ss"
                                    ),
                                    status: trip.status?.identifier,
                                    modality: trip.modality?.identifier,
                                    scheduleDate: scheduleDate.identifier,
                                };

                                api.post(`api/adm/trip/${trip.identifier}/edit`, aux, HeaderToken())
                                    .then(() => {
                                        toast.info("Viagem editada com sucesso!");
                                        setSubmitting(false);
                                        setInputActive("");
                                    })
                                    .catch(error => {
                                        setSubmitting(false);
                                        setLoad(false);
                                        Interceptor(error);
                                    });
                            }}>
                            {({
                                handleChange,
                                handleSubmit,
                                values,
                                handleBlur,
                                setFieldValue,
                                isSubmitting,
                            }) => (
                                <form onSubmit={handleSubmit}>
                                    <div className="flex justify-between mb-5">
                                        <Back />
                                        <LoadSave isSubmitting={isSubmitting} />
                                    </div>
                                    <div className="flex justify-between mb-4">
                                        {values.tableCode ? (
                                            <h3 className="font-light text-custom_c7">
                                                {values.tableCode}
                                            </h3>
                                        ) : (
                                            <ClipLoader
                                                size={20}
                                                color={Colors.buslab}
                                                loading={load}
                                            />
                                        )}
                                    </div>
                                    <h2 className="mb-2 font-medium text-18 text-custom_c7">
                                        Informações gerais
                                    </h2>
                                    <div className="flex flex-wrap">
                                        <div className="xs:w-full sm:w-full md:w-1/2 lg:w-1/3 lg:pr-4">
                                            <div className="sm:w-full xs:w-full bg-tablerow flex justify-center items-center">
                                                <Label description="Data" />
                                                <div className="flex justify-between w-2/3">
                                                    {" "}
                                                    <Information
                                                        description={moment(values.date).format(
                                                            "DD/MM/YYYY"
                                                        )}
                                                    />
                                                </div>
                                            </div>
                                            <div className="sm:w-full xs:w-full flex justify-center items-center">
                                                <Label description="Tabela" />
                                                <div className="flex justify-between w-2/3">
                                                    {" "}
                                                    {values.schedule ? (
                                                        <Information
                                                            description={values.schedule.tableCode}
                                                        />
                                                    ) : (
                                                        <ClipLoader
                                                            size={20}
                                                            color={Colors.buslab}
                                                            loading={load}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="sm:w-full xs:w-full bg-tablerow flex justify-center items-center">
                                                <Label description="Horário programado de partida" />
                                                <div className="flex justify-between w-2/3">
                                                    {values.schedule ? (
                                                        <Information
                                                            description={moment(
                                                                scheduleDate.schedule.startsAt
                                                            ).format(" HH:mm")}
                                                        />
                                                    ) : (
                                                        <ClipLoader
                                                            size={20}
                                                            color={Colors.buslab}
                                                            loading={load}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="sm:w-full xs:w-full flex justify-center items-center">
                                                <Label description="Horário programado de chegada" />
                                                <div className="flex justify-between w-2/3">
                                                    {values.schedule ? (
                                                        <Information
                                                            description={moment(
                                                                scheduleDate.schedule.endsAt
                                                            ).format(" HH:mm")}
                                                        />
                                                    ) : (
                                                        <ClipLoader
                                                            size={20}
                                                            color={Colors.buslab}
                                                            loading={load}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="sm:w-full xs:w-full bg-tablerow flex justify-center items-center">
                                                <Label description="Linha" />
                                                <div className="flex justify-between w-2/3">
                                                    {" "}
                                                    {values.schedule ? (
                                                        activeEdit === "line" ? (
                                                            <>
                                                                <SelectStyle
                                                                    onChange={select => {
                                                                        if (
                                                                            select &&
                                                                            select.value
                                                                        ) {
                                                                            setFieldValue("line", {
                                                                                label: select.label,
                                                                                identifier:
                                                                                    select.value,
                                                                            });
                                                                        } else {
                                                                            setFieldValue(
                                                                                "line",
                                                                                {}
                                                                            );
                                                                        }
                                                                    }}
                                                                    name={"line"}
                                                                    id={"line"}
                                                                    value={
                                                                        values.line !==
                                                                            undefined && {
                                                                            label:
                                                                                values.line.label,
                                                                            value:
                                                                                values.line
                                                                                    .identifier,
                                                                        }
                                                                    }
                                                                    optionsMap={(() => {
                                                                        let options = [];
                                                                        lineList.map(line =>
                                                                            options.push({
                                                                                value:
                                                                                    line.identifier,
                                                                                label: line.label,
                                                                            })
                                                                        );
                                                                        return options;
                                                                    })()}
                                                                />
                                                                <Save handleSubmit={handleSubmit} />
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Information
                                                                    description={
                                                                        values.line !== undefined
                                                                            ? values.line.label
                                                                            : ""
                                                                    }
                                                                />
                                                                <Pencil
                                                                    setInputActive={() =>
                                                                        setInputActive("line")
                                                                    }
                                                                />
                                                            </>
                                                        )
                                                    ) : (
                                                        <ClipLoader
                                                            size={20}
                                                            color={Colors.buslab}
                                                            loading={load}
                                                        />
                                                    )}
                                                </div>
                                            </div>
                                            <div className="sm:w-full xs:w-full flex justify-center items-center">
                                                <Label description="Motorista" />
                                                <div className="flex justify-between w-2/3">
                                                    {" "}
                                                    {activeEdit === "driver" ? (
                                                        <>
                                                            <SelectStyle
                                                                onChange={select => {
                                                                    if (select && select.value) {
                                                                        setFieldValue("driver", {
                                                                            name: select.label,
                                                                            identifier:
                                                                                select.value,
                                                                        });
                                                                    } else {
                                                                        setFieldValue("driver", {});
                                                                    }
                                                                }}
                                                                name={"driver"}
                                                                id={"driver"}
                                                                value={
                                                                    values.driver !== undefined && {
                                                                        label: values.driver.name,
                                                                        value:
                                                                            values.driver
                                                                                .identifier,
                                                                    }
                                                                }
                                                                optionsMap={(() => {
                                                                    let options = [];
                                                                    employeeList.map(
                                                                        employee =>
                                                                            employee.modality
                                                                                .description ===
                                                                                "Motorista" &&
                                                                            options.push({
                                                                                value:
                                                                                    employee.identifier,
                                                                                label:
                                                                                    employee.name,
                                                                            })
                                                                    );
                                                                    return options;
                                                                })()}
                                                            />

                                                            <Save handleSubmit={handleSubmit} />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Information
                                                                description={
                                                                    values.driver !== undefined
                                                                        ? `${values.driver.name}`
                                                                        : "Não definido"
                                                                }
                                                            />
                                                            <Pencil
                                                                setInputActive={() =>
                                                                    setInputActive("driver")
                                                                }
                                                            />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="sm:w-full xs:w-full bg-tablerow flex justify-center items-center">
                                                <Label description="Cobrador" />
                                                <div className="flex justify-between w-2/3">
                                                    {" "}
                                                    {activeEdit === "collector" ? (
                                                        <>
                                                            <SelectStyle
                                                                onChange={select => {
                                                                    if (select && select.value) {
                                                                        setFieldValue("collector", {
                                                                            name: select.label,
                                                                            identifier:
                                                                                select.value,
                                                                        });
                                                                    } else {
                                                                        setFieldValue(
                                                                            "collector",
                                                                            {}
                                                                        );
                                                                    }
                                                                }}
                                                                name={"collector"}
                                                                id={"collector"}
                                                                value={
                                                                    values.collector !==
                                                                        undefined && {
                                                                        label:
                                                                            values.collector.name,
                                                                        value:
                                                                            values.collector
                                                                                .identifier,
                                                                    }
                                                                }
                                                                optionsMap={(() => {
                                                                    let options = [];
                                                                    employeeList.map(
                                                                        employee =>
                                                                            employee.modality
                                                                                .description ===
                                                                                "Cobrador" &&
                                                                            options.push({
                                                                                value:
                                                                                    employee.identifier,
                                                                                label:
                                                                                    employee.name,
                                                                            })
                                                                    );
                                                                    return options;
                                                                })()}
                                                            />
                                                            <Save handleSubmit={handleSubmit} />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Information
                                                                description={
                                                                    values.collector !== undefined
                                                                        ? `${values.collector.name}`
                                                                        : "Não definido"
                                                                }
                                                            />
                                                            <Pencil
                                                                setInputActive={() =>
                                                                    setInputActive("collector")
                                                                }
                                                            />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="sm:w-full xs:w-full flex justify-center items-center">
                                                <Label description="Veículo" />
                                                <div className="flex justify-between w-2/3">
                                                    {" "}
                                                    {values.trip ? (
                                                        <Information
                                                        description={
                                                            values.vehicle !== undefined
                                                                ? `${values.vehicle.label}`
                                                                : "Não definido"
                                                        }
                                                    />
                                                    ) : (
                                                        "-"
                                                    )}
                                                </div>
                                            </div>
                                            <div className="sm:w-full xs:w-full bg-tablerow flex justify-center items-center">
                                                <Label description="Horário real de partida" />
                                                <div className="flex justify-between w-2/3">
                                                    {" "}
                                                    {values.trip ? (
                                                        <Information
                                                            description={moment(
                                                                values.trip.starts_at
                                                            ).format("HH:mm")}
                                                        />
                                                    ) : (
                                                        "Não iniciada"
                                                    )}
                                                </div>
                                            </div>
                                            <div className="sm:w-full xs:w-full flex justify-center items-center">
                                                <Label description="Horário real de chegada" />
                                                <div className="flex justify-between w-2/3">
                                                    {" "}
                                                    {values.trip ? (
                                                        <Information
                                                            description={moment(
                                                                values.trip.ends_at
                                                            ).format("HH:mm")}
                                                        />
                                                    ) : (
                                                        "Não finalizada"
                                                    )}
                                                </div>
                                            </div>
                                            <div className="sm:w-full xs:w-full bg-tablerow flex justify-center items-center">
                                                <Label description="Status" />
                                                <div className="flex justify-between w-2/3">
                                                    {" "}
                                                    {values.trip ? (
                                                        <Information
                                                            description={
                                                                values.trip.status !== undefined
                                                                    ? values.trip.status.description
                                                                    : ""
                                                            }
                                                        />
                                                    ) : (
                                                        "Não iniciada"
                                                    )}
                                                </div>
                                            </div>
                                            <div className="sm:w-full xs:w-full flex justify-center items-center">
                                                <Label description="Modalidade" />
                                                <div className="flex justify-between w-2/3">
                                                    {" "}
                                                    {values.trip ? (
                                                        <Information
                                                            description={
                                                                values.trip.modality !== undefined
                                                                    ? values.trip.modality
                                                                          .description
                                                                    : ""
                                                            }
                                                        />
                                                    ) : (
                                                        "Programada"
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="xs:w-full sm:w-full md:w-1/2 lg:w-2/3 lg:pl-4">
                                            <TripMap
                                                trip={trip}
                                                schedule={scheduleDate?.schedule}
                                            />
                                        </div>
                                    </div>
                                    <h4 className="mt-8 mb-2 font-medium text-custom_c7 text-18">
                                        Métricas
                                    </h4>
                                    <div className="flex bg-tablerow py-5 px-5">
                                        <div className="w-1/3 flex">
                                            <div className="w-1/3">
                                                <p className="font-medium text-custom_c7 text-14">
                                                    Consumo
                                                </p>
                                            </div>
                                            <div className="w-2/3 pl-2">
                                                <p className="font-light text-custom_c7 text-14">
                                                {report && report.consumption ? `${report.consumption} Km/L` : '-'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="w-1/3 flex">
                                            <div className="w-1/3">
                                                <p className="font-medium text-custom_c7 text-14">
                                                    Pontos
                                                </p>
                                            </div>
                                            <div className="w-2/3 pl-2">
                                                <p className="font-light text-custom_c7 text-14">
                                                    0/{points.length}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="w-1/3 flex">
                                            <div className="w-1/3">
                                                <p className="font-medium text-custom_c7 text-14">
                                                    Velocidade média
                                                </p>
                                            </div>
                                            <div className="w-2/3 pl-2">
                                                <p className="font-light text-custom_c7 text-14">
                                                {report && report.average_speed_stops ? `${report.average_speed_stops} Km/h` : '-'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex py-5 px-5">
                                        <div className="w-1/3 flex">
                                            <div className="w-1/3">
                                                <p className="font-medium text-custom_c7 text-14">
                                                    Tempo de viagem
                                                </p>
                                            </div>
                                            <div className="w-2/3 pl-2">
                                                <p className="font-light text-custom_c7 text-14">
                                                    {report && report.trip_time ? moment(`${report.trip_time}`).format("HH:mm") : '-'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="w-1/3 flex">
                                            <div className="w-1/3">
                                                <p className="font-medium text-custom_c7 text-14">
                                                    Velocidade Média (Com paradas):
                                                </p>
                                            </div>
                                            <div className="w-2/3 pl-2">
                                                <p className="font-light text-custom_c7 text-14">
                                                    {report && report.speedAverage ? `${report.speedAverage} Km/h` : '-'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="w-1/3 flex">
                                            <div className="w-1/3">
                                                <p className="font-medium text-custom_c7 text-14">
                                                    Ocorrências
                                                </p>
                                            </div>
                                            <div className="w-2/3 pl-2">
                                                <p className="font-light text-custom_c7 text-14">
                                                    {`${occurrenceList.length}`}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex bg-tablerow py-5 px-5">
                                        <div className="w-1/3 flex">
                                            <div className="w-1/3">
                                                <p className="font-medium text-custom_c7 text-14">
                                                    Distância percorrida
                                                </p>
                                            </div>
                                            <div className="w-2/3 pl-2">
                                                <p className="font-light text-custom_c7 text-14">
                                                    {report && report.distance ? `${report.distance} Km` : '-'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            )}
                        </Formik>
                    </Card>
                    <Card>
                        <div className="flex justify-between">
                            <h2 className="mb-5 font-light">Ocorrências</h2>
                            <div>
                                <ButtonIconTextDefault
                                    title="Adicionar"
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
                                            Protocolo
                                        </th>
                                        <th className="px-3 py-2 text-left font-medium text-14">
                                            Tipo
                                        </th>
                                        <th className="px-3 py-2 text-left font-medium text-14">
                                            Início
                                        </th>
                                        <th className="px-3 py-2 text-left font-medium text-14">
                                            Fim
                                        </th>
                                        <th className="px-3 py-2 text-left font-medium text-14">
                                            Status
                                        </th>
                                        <th className="px-3 py-2 text-left font-medium text-14">
                                            Ações
                                        </th>
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
                                                    {moment(occurrence.start).format(
                                                        "DD/MM/YYYY HH:mm"
                                                    )}
                                                </td>
                                                <td className="px-4 py-5 font-light text-c8 text-14">
                                                    {occurrence.end ? moment(occurrence.end).format(
                                                        "DD/MM/YYYY HH:mm"
                                                    ) : "(Não cadastrado)"}
                                                </td>
                                                <td className="px-4 py-5 font-light text-c8 text-14">
                                                    {occurrence.status.description}
                                                </td>
                                                <td className="px-4 py-5 font-light text-c8 text-14 w-32">
                                                    <Link
                                                        to={`/occurrences/show/${occurrence.identifier}`}>
                                                        <img
                                                            className="cursor-pointer font-light w-6 text-primary inline mr-4"
                                                            alt="Ver"
                                                            src={eyeSVG}
                                                            onClick={() => {}}
                                                        />
                                                    </Link>
                                                    {/* <img
                                                className="cursor-pointer font-light w-4 text-primary inline"
                                                alt="Remover"
                                                src={trashSVG}
                                                onClick={() => {
                                                    actionModalBody(occurrence.identifier);
                                                }}
                                            /> */}
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
                                    <p className="center">Nenhuma ocorrência vinculada</p>
                                )}
                                {load && (
                                    <ClipLoader size={20} color={Colors.buslab} loading={load} />
                                )}
                            </div>
                        </div>
                        {metaOcurrence.total_pages > 1 && (
                            <Paginate
                                meta={metaOcurrence}
                                setMeta={setMetaOcurrence}
                                action={actionOcurrence}
                                setAction={setActionOcurrence}
                            />
                        )}
                    </Card>
                </>
            )}
        </>
    );
};

export default ShowTrip;
