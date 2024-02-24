/* eslint-disable default-case */
import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import moment from "moment";

import Title from "../../components/Title";
import Card from "../../components/Cards/Card";
import Back from "../../components/Back";
import HeaderToken from "../../services/headerToken";
import api from "../../services/api";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import Colors from "../../assets/constants/Colors";
import {
    Label,
    Information,
    Pencil,
    Save,
    LoadSave,
    LabelFullDefault,
} from "../../components/Details";
import Interceptor from "../../services/interceptor";
import { DatePickerWithHour } from "../../components/Date/DatePickerPeriod";
import SelectStyle from "../../components/Select";
import { Input } from "../../components/Formik";
import ErrorFormik from "../../components/Formik/Error";
const ShowEvent = props => {
    const [load, setLoad] = useState(false);
    const [event, setEvent] = useState(false);
    const [vehicleList, setVehicleList] = useState(false);
    const [lineList, setLineList] = useState([]);
    const [eventCategory, setEventCategory] = useState([]);
    const [eventStatus, setEventStatus] = useState([]);
    const [activeEdit, setActiveEdit] = useState();
    const [employeeList, setEmployeeList] = useState([]);
    const [trip, setTrip] = useState([]);
    const [sectorList, setSectorList] = useState([]);
    const [aux, setAux] = useState(false);

    useEffect(() => {
        getOccurrence();
        getVehicle();
        getUOccurrenceByType("status");

        getLine();
        getEmployee();
        getTrip();
        getSector();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [aux]);

    const getVehicle = () => {
        api.get(`api/adm/vehicle/list`, HeaderToken())
            .then(response => {
                setVehicleList(response.data.data);
            })
            .catch(error => {
                setLoad(false);
                Interceptor(error);
            });
    };

    const getLine = () => {
        setLoad(true);
        api.get(`api/adm/line/list?page_size=9999999`, HeaderToken()).then(response => {
            setLoad(false);
            setLineList(response.data.data);
        });
    };

    const getEmployee = () => {
        api.get(`api/adm/employee/list?page_size=9999999`, HeaderToken()).then(response => {
            setEmployeeList(response.data.data);
        });
    };

    const getTrip = () => {
        setLoad(true);
        api.get(`api/adm/trip/list-form?page_size=9999999`, HeaderToken()).then(response => {
            setLoad(false);
            setTrip(response.data.data);
        });
    };

    const getSector = () => {
        setLoad(true);
        api.get(`api/adm/sector/list?page_size=9999999`, HeaderToken()).then(response => {
            setLoad(false);
            setSectorList(response.data.data);
        });
    };

    const getUOccurrenceByType = type => {
        api.get(`api/adm/event-${type}/list`, HeaderToken())
            .then(response => {
                switch (type) {
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
    const getOccurrenceTypeBySector = e => {
        const value = e?.value;
        value &&
            api
                .get(`api/event/category/list?page_size=9999999&sector=${value}`, HeaderToken())
                .then(response => {
                    setEventCategory(response.data.data);
                });
    };

    const getOccurrence = () => {
        setLoad(true);
        api.get(`api/adm/occurrences/${props.match.params.identifier}/show`, HeaderToken())
            .then(response => {
                setEvent(response.data);
                getOccurrenceTypeBySector({ value: response.data.sector.identifier });
                setLoad(false);
            })
            .catch(error => {
                setLoad(false);
                Interceptor(error);
            });
    };
    const setInputActive = value => {
        setActiveEdit(value);
    };

    return (
        <>
            <Title title={"Detalhes da ocorrência"} crumbs={props.crumbs} />
            <Card>
                {load ? (
                    <div className="justify-center w-full">
                        <ClipLoader size={20} color={Colors.buslab} loading={true} />
                    </div>
                ) : (
                    <Formik
                        initialValues={{
                            comment: event.comment,
                            action: event.action,
                            start: new Date(event.start),
                            end: event.end ? new Date(event.end) : '',
                            vehicle: event.vehicle,
                            line: event.line,
                            driver: event.driver,
                            collector: event.collector,
                            category: event.category,
                            status: event.status,
                            protocol: event.protocol,
                            trip: event.trip,
                            sector: event.sector,
                        }}
                        enableReinitialize={true}
                        onSubmit={(values, { setSubmitting, setFieldError }) => {
                            if (!values.category.identifier) {
                                setFieldError("category", "Selecione a categoria");
                                setSubmitting(false);
                                return;
                            }

                            api.post(
                                `/api/adm/occurrences/${props.match.params.identifier}/edit`,
                                {
                                    ...values,
                                    start: moment(values.start).format("DD/MM/YYYY HH:mm:ss"),
                                    end: values.end == '' ? '' : moment(values.end).format("DD/MM/YYYY HH:mm:ss"),
                                    category:
                                        typeof values.category === "object"
                                            ? values.category.identifier
                                            : values.category,
                                    line:
                                        typeof values.line === "object"
                                            ? values.line.identifier
                                            : values.line,
                                    trip:
                                        typeof values.trip === "object"
                                            ? values.trip.identifier
                                            : values.trip,
                                    driver:
                                        typeof values.driver === "object"
                                            ? values.driver.identifier
                                            : values.driver,
                                    collector:
                                        typeof values.collector === "object"
                                            ? values.collector.identifier
                                            : values.collector,
                                    status:
                                        typeof values.status === "object"
                                            ? values.status.identifier
                                            : values.status,
                                    vehicle:
                                        typeof values.vehicle === "object"
                                            ? values.vehicle.identifier
                                            : values.vehicle,
                                    sector:
                                        typeof values.sector === "object"
                                            ? values.sector.identifier
                                            : values.sector,
                                },
                                HeaderToken()
                            )
                                .then(() => {
                                    toast.info("Ocorrência editada com sucesso!");
                                    setSubmitting(false);
                                    setActiveEdit();
                                    if (aux === false) {
                                        setAux(true);
                                    } else {
                                        setAux(false);
                                    }
                                })
                                .catch(error => {
                                    setLoad(false);
                                    setSubmitting(false);
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
                                <div className="flex justify-between mb-2">
                                    <div>
                                        <Back />
                                        <h3 className="font-light mb-1 mt-3">Informações gerais</h3>
                                    </div>
                                    <LoadSave isSubmitting={isSubmitting} />
                                </div>
                                <div className="flex flex-wrap">
                                    <div className="xs:w-full sm:w-full md:w-1/2 lg:w-1/2 pr-4">
                                        <div className="sm:w-full xs:w-full bg-tablerow flex justify-center items-center">
                                            <Label description="Início" />
                                            <div className="flex justify-between w-2/3">
                                                {activeEdit === "start" ? (
                                                    <>
                                                        <DatePickerWithHour
                                                            selected={values.start}
                                                            disabled={isSubmitting}
                                                            onChange={select =>
                                                                setFieldValue("start", select)
                                                            }
                                                        />
                                                        <Save handleSubmit={handleSubmit} />
                                                    </>
                                                ) : (
                                                    <>
                                                        <Information
                                                            description={moment(
                                                                values.start
                                                            ).format("DD/MM/YYYY HH:mm:ss")}
                                                        />
                                                        <Pencil
                                                            setInputActive={() =>
                                                                setInputActive("start")
                                                            }
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="sm:w-full xs:w-full flex justify-center items-center">
                                            <Label description="Término" />
                                            <div className="flex justify-between w-2/3">
                                                {activeEdit === "end" ? (
                                                    <>
                                                        <DatePickerWithHour
                                                            selected={values.end}
                                                            disabled={isSubmitting}
                                                            onChange={select =>
                                                                setFieldValue("end", select)
                                                            }
                                                        />
                                                        <Save handleSubmit={handleSubmit} />
                                                    </>
                                                ) : (
                                                    <>
                                                        <Information
                                                            description={values.end == '' ? "(Não cadastrado)" : moment(values.end).format(
                                                                "DD/MM/YYYY HH:mm"
                                                            ) }
                                                        />
                                                        <Pencil
                                                            setInputActive={() =>
                                                                setInputActive("end")
                                                            }
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="sm:w-full xs:w-full bg-tablerow flex justify-center items-center">
                                            <Label description="Veículo" />
                                            <div className="flex justify-between w-2/3">
                                                {activeEdit === "vehicle" ? (
                                                    <>
                                                        <SelectStyle
                                                            onChange={select => {
                                                                if (select && select.value) {
                                                                    setFieldValue("vehicle", {
                                                                        label: select.label,
                                                                        identifier: select.value,
                                                                    });
                                                                } else {
                                                                    setFieldValue("vehicle", {});
                                                                }
                                                            }}
                                                            name={"vehicle"}
                                                            id={"vehicle"}
                                                            value={
                                                                values.vehicle !== undefined && {
                                                                    label: values.vehicle.label,
                                                                    value:
                                                                        values.vehicle.identifier,
                                                                }
                                                            }
                                                            optionsMap={(() => {
                                                                let options = [];
                                                                vehicleList.map(vehicle =>
                                                                    options.push({
                                                                        value: vehicle.identifier,
                                                                        label: vehicle.label,
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
                                                                values.vehicle !== undefined
                                                                    ? `${values.vehicle.label}`
                                                                    : "Não definido"
                                                            }
                                                        />
                                                        <Pencil
                                                            setInputActive={() =>
                                                                setInputActive("vehicle")
                                                            }
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="sm:w-full xs:w-full flex justify-center items-center">
                                            <Label description="Setor" />
                                            <div className="flex justify-between w-2/3">
                                                {activeEdit === "sector" ? (
                                                    <>
                                                        <SelectStyle
                                                            onChange={select => {
                                                                if (select && select.value) {
                                                                    setFieldValue("sector", {
                                                                        description: select.label,
                                                                        identifier: select.value,
                                                                    });
                                                                    getOccurrenceTypeBySector(
                                                                        select
                                                                    );
                                                                } else {
                                                                    setFieldValue("sector", {});
                                                                    setEventCategory([]);
                                                                }
                                                                setFieldValue("category", {
                                                                    description: "",
                                                                    identifier: "",
                                                                });
                                                            }}
                                                            name={"sector"}
                                                            id={"sector"}
                                                            value={
                                                                values.sector !== undefined && {
                                                                    label:
                                                                        values.sector.description,
                                                                    value: values.sector.identifier,
                                                                }
                                                            }
                                                            optionsMap={(() => {
                                                                let options = [];

                                                                sectorList.map(sector =>
                                                                    options.push({
                                                                        value: sector.identifier,
                                                                        label: sector.description,
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
                                                                values.sector !== undefined
                                                                    ? values.sector.description
                                                                    : "-"
                                                            }
                                                        />
                                                        <Pencil
                                                            setInputActive={() =>
                                                                setInputActive("sector")
                                                            }
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="bg-tablerow sm:w-full xs:w-full flex justify-center items-center">
                                            <Label description="Status" />
                                            <div className="flex justify-between w-2/3">
                                                {activeEdit === "status" ? (
                                                    <>
                                                        <SelectStyle
                                                            onChange={select => {
                                                                if (select && select.value) {
                                                                    setFieldValue("status", {
                                                                        description: select.label,
                                                                        identifier: select.value,
                                                                    });
                                                                } else {
                                                                    setFieldValue("status", {});
                                                                }
                                                            }}
                                                            name={"status"}
                                                            id={"status"}
                                                            value={
                                                                values.status !== undefined && {
                                                                    label:
                                                                        values.status.description,
                                                                    value: values.status.identifier,
                                                                }
                                                            }
                                                            optionsMap={(() => {
                                                                let options = [];

                                                                eventStatus.map(status =>
                                                                    options.push({
                                                                        value: status.identifier,
                                                                        label: status.description,
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
                                                                values.status !== undefined
                                                                    ? values.status.description
                                                                    : ""
                                                            }
                                                        />
                                                        <Pencil
                                                            setInputActive={() =>
                                                                setInputActive("status")
                                                            }
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="sm:w-full xs:w-full flex justify-center items-center">
                                            <Label description="Linha" />
                                            <div className="flex justify-between w-2/3">
                                                {activeEdit === "line" ? (
                                                    <>
                                                        <SelectStyle
                                                            onChange={select => {
                                                                if (select && select.value) {
                                                                    setFieldValue("line", {
                                                                        code: select.label,
                                                                        identifier: select.value,
                                                                    });
                                                                } else {
                                                                    setFieldValue("line", {});
                                                                }
                                                            }}
                                                            name={"line"}
                                                            id={"line"}
                                                            value={
                                                                values.line !== undefined && {
                                                                    label: values.line.code,
                                                                    value: values.line.identifier,
                                                                }
                                                            }
                                                            optionsMap={(() => {
                                                                let options = [];

                                                                lineList.map(line =>
                                                                    options.push({
                                                                        value: line.identifier,
                                                                        label: line.code,
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
                                                                    ? values.line.code
                                                                    : "-"
                                                            }
                                                        />
                                                        <Pencil
                                                            setInputActive={() =>
                                                                setInputActive("line")
                                                            }
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="sm:w-full xs:w-full bg-tablerow flex justify-center items-center">
                                            <Label description="Viagem" />
                                            <div className="flex justify-between w-2/3">
                                                {activeEdit === "trip" ? (
                                                    <>
                                                        <SelectStyle
                                                            onChange={select => {
                                                                if (select && select.value) {
                                                                    setFieldValue("trip", {
                                                                        label: select.label,
                                                                        identifier: select.value,
                                                                    });
                                                                } else {
                                                                    setFieldValue("trip", {});
                                                                }
                                                            }}
                                                            name={"trip"}
                                                            id={"trip"}
                                                            value={
                                                                values.trip !== undefined && {
                                                                    label: values?.trip?.label,
                                                                    value: values?.trip?.identifier,
                                                                }
                                                            }
                                                            optionsMap={(() => {
                                                                let options = [];
                                                                trip.map(trip =>
                                                                    options.push({
                                                                        value:
                                                                            trip?.identifier,
                                                                        label:
                                                                            trip?.line
                                                                                ?.label +
                                                                            " - " +
                                                                            moment(
                                                                                trip.starts_at
                                                                            ).format(
                                                                                "DD/MM/YYYY HH:mm:ss"
                                                                            ),
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
                                                                values.trip !== undefined
                                                                    ? values.trip.line?.label +
                                                                      " - " +
                                                                      moment(values.trip.starts_at).format(
                                                                          "DD/MM/YYYY HH:mm:ss"
                                                                      )
                                                                    : "-"
                                                            }
                                                        />
                                                        <Pencil
                                                            setInputActive={() =>
                                                                setInputActive("trip")
                                                            }
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="xs:w-full sm:w-full md:w-1/2 lg:w-1/2 pr-4">
                                        <div className="sm:w-full xs:w-full bg-tablerow flex justify-center items-center">
                                            <Label description="Motorista" />
                                            <div className="flex justify-between w-2/3">
                                                {activeEdit === "driver" ? (
                                                    <>
                                                        <SelectStyle
                                                            onChange={select => {
                                                                if (select && select.value) {
                                                                    setFieldValue("driver", {
                                                                        name: select.label,
                                                                        identifier: select.value,
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
                                                                    value: values.driver.identifier,
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
                                                                            label: employee.name,
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
                                        <div className="sm:w-full xs:w-full flex justify-center items-center">
                                            <Label description="Cobrador" />
                                            <div className="flex justify-between w-2/3">
                                                {activeEdit === "collector" ? (
                                                    <>
                                                        <SelectStyle
                                                            onChange={select => {
                                                                if (select && select.value) {
                                                                    setFieldValue("collector", {
                                                                        name: select.label,
                                                                        identifier: select.value,
                                                                    });
                                                                } else {
                                                                    setFieldValue("collector", {});
                                                                }
                                                            }}
                                                            name={"collector"}
                                                            id={"collector"}
                                                            value={
                                                                values.collector !== undefined && {
                                                                    label: values.collector.name,
                                                                    value:
                                                                        values.collector.identifier,
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
                                                                            label: employee.name,
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
                                                                    ? values.collector.name
                                                                    : "-"
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
                                        <div className="sm:w-full xs:w-full bg-tablerow flex justify-center items-center">
                                            <Label description="Protocolo" />
                                            <div className="flex justify-between w-2/3">
                                                {activeEdit === "protocol" ? (
                                                    <>
                                                        <Input
                                                            value={values.protocol}
                                                            onChange={handleChange}
                                                            name="protocol"
                                                        />
                                                        <Save handleSubmit={handleSubmit} />
                                                    </>
                                                ) : (
                                                    <>
                                                        <Information
                                                            description={values.protocol}
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="sm:w-full xs:w-full flex justify-center items-center">
                                            <Label description="Categoria" />
                                            <div className="flex justify-between w-2/3">
                                                {activeEdit === "category" ? (
                                                    <>
                                                        <SelectStyle
                                                            onChange={select => {
                                                                if (select && select.value) {
                                                                    setFieldValue("category", {
                                                                        description: select.label,
                                                                        identifier: select.value,
                                                                    });
                                                                } else {
                                                                    setFieldValue("category", {});
                                                                }
                                                            }}
                                                            name={"category"}
                                                            id={"category"}
                                                            value={
                                                                values.category !== undefined && {
                                                                    label:
                                                                        values.category.description,
                                                                    value:
                                                                        values.category.identifier,
                                                                }
                                                            }
                                                            optionsMap={(() => {
                                                                let options = [];

                                                                eventCategory.map(category =>
                                                                    options.push({
                                                                        value: category.identifier,
                                                                        label: category.description,
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
                                                                values.category !== undefined
                                                                    ? `${values.category.description}`
                                                                    : ""
                                                            }
                                                        />
                                                        <Pencil
                                                            setInputActive={() =>
                                                                setInputActive("category")
                                                            }
                                                        />
                                                    </>
                                                )}
                                            </div>
                                            <ErrorFormik name="category" />
                                        </div>

                                        <div className=" items-center bg-tablerow pl-4 pb-4">
                                            <div className="flex justify-between ">
                                                <LabelFullDefault description="Descrição" />
                                                {activeEdit === "comment" ? (
                                                    <Save handleSubmit={handleSubmit} />
                                                ) : (
                                                    <Pencil
                                                        setInputActive={() =>
                                                            setInputActive("comment")
                                                        }
                                                    />
                                                )}
                                            </div>
                                            <div className="pr-2">
                                                {activeEdit === "comment" ? (
                                                    <>
                                                        <Input
                                                            type="textarea"
                                                            onChange={handleChange}
                                                            name="comment"
                                                            value={values.comment}
                                                        />
                                                    </>
                                                ) : (
                                                    <>
                                                        <Information description={values.comment} />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="items-center pl-4 pb-4">
                                            <div className="flex justify-between">
                                                <LabelFullDefault description="Ação adotada" />
                                                {activeEdit === "action" ? (
                                                    <Save handleSubmit={handleSubmit} />
                                                ) : (
                                                    <Pencil
                                                        setInputActive={() =>
                                                            setInputActive("action")
                                                        }
                                                    />
                                                )}
                                            </div>
                                            <div className="pr-2">
                                                {activeEdit === "action" ? (
                                                    <>
                                                        <Input
                                                            type="textarea"
                                                            onChange={handleChange}
                                                            name="action"
                                                            value={values.action}
                                                        />
                                                    </>
                                                ) : (
                                                    <>
                                                        <Information
                                                            description={
                                                                values.action ? values.action : "-"
                                                            }
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        )}
                    </Formik>
                )}
            </Card>
        </>
    );
};

export default ShowEvent;
