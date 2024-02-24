/* eslint-disable default-case */
import React, { useState, useEffect } from "react";
import Title from "../../components/Title";
import Card from "../../components/Cards/Card";
import Back from "../../components/Back";
import HeaderToken from "../../services/headerToken";
import api from "../../services/api";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import Colors from "../../assets/constants/Colors";
import { Formik } from "formik";
import {
    Label,
    Information,
    Pencil,
    Save,
    LoadSave,
    LabelFullDefault,
} from "../../components/Details";
import moment from "moment";
import Interceptor from "../../services/interceptor";
import { DatePickerWithHour } from "../../components/Date/DatePickerPeriod";
import SelectStyle from "../../components/Select";
import { Input } from "../../components/Formik";
const ShowEvent = props => {
    const [load, setLoad] = useState(false);
    const [event, setEvent] = useState(false);
    const [vehicleList, setVehicleList] = useState(false);
    const [eventModality, setEventModality] = useState([]);
    const [eventCategory, setEventCategory] = useState([]);
    const [eventStatus, setEventStatus] = useState([]);
    const [activeEdit, setActiveEdit] = useState();
    const [trip, setTrip] = useState([]);
    const [breadcrumbs, setBreadcrumbs] = useState([]);

    useEffect(() => {
        getEvent();
        getVehicle();
        getEventByType("modality");
        getEventByType("status");
        getEventByType("category");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    useEffect(() => {
        getTrip();
    }, [props.match.params.id]);

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

    const getEventByType = type => {
        api.get(`api/adm/event-${type}/list`, HeaderToken())
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

    const getTrip = () => {
        setLoad(true);
        api.get(`api/adm/trip/list-form?page_size=9999999`, HeaderToken()).then(response => {
            setLoad(false);
            setTrip(response.data.data);
        });
    };

    const getEvent = () => {
        setLoad(true);
        api.get(`api/adm/event/${props.match.params.id}/show`, HeaderToken())
            .then(response => {
                setEvent(response.data);
                let crumbs = props.crumbs[props.crumbs.length - 1];
                crumbs["name"] = response.data.comment;
                setBreadcrumbs([...props.crumbs]);
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
            <Title title={"Detalhes do Evento"} crumbs={breadcrumbs} />

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
                            end: new Date(event.end),
                            vehicle: event.vehicle,
                            modality: event.modality,
                            category: event.category,
                            status: event.status,
                            trip: event.trip,
                        }}
                        enableReinitialize={true}
                        onSubmit={(values, { setSubmitting }) => {
                            api.post(
                                `/api/adm/event/${props.match.params.id}/edit`,
                                {
                                    ...values,
                                    start: moment(values.start).format("DD/MM/YYYY HH:mm:ss"),
                                    end: moment(values.end).format("DD/MM/YYYY HH:mm:ss"),
                                    category:
                                        typeof values.category === "object"
                                            ? values.category.identifier
                                            : values.category,
                                    trip:
                                        typeof values.trip === "object"
                                            ? values.trip.identifier
                                            : values.trip,
                                    modality:
                                        typeof values.modality === "object"
                                            ? values.modality.identifier
                                            : values.modality,
                                    status:
                                        typeof values.status === "object"
                                            ? values.status.identifier
                                            : values.status,
                                    vehicle:
                                        typeof values.vehicle === "object"
                                            ? values.vehicle.identifier
                                            : values.vehicle,
                                },
                                HeaderToken()
                            )
                                .then(() => {
                                    toast.info("Evento editado com sucesso!");
                                    setSubmitting(false);
                                    setInputActive(false);
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
                                    <div className="xs:w-full sm:w-full md:w-1/2 lg:w-1/2 pr-4 pl-4">
                                        <div className="sm:w-full xs:w-full flex justify-center items-center">
                                            <Label description="Início" />
                                            <div className="flex justify-between w-2/3">
                                                {activeEdit === "start" ? (
                                                    <>
                                                        <DatePickerWithHour
                                                            selected={values.start}
                                                            disabled={isSubmitting}
                                                            className="appearance-none w-full block text-gray-700 border border-gray-300 py-2 px-4 focus:outline-none focus:bg-white"
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
                                                            ).format("DD/MM/YYYY HH:mm")}
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
                                        <div className="sm:w-full xs:w-full bg-tablerow flex justify-center items-center">
                                            <Label description="Término" />
                                            <div className="flex justify-between w-2/3">
                                                {activeEdit === "end" ? (
                                                    <>
                                                        <DatePickerWithHour
                                                            selected={values.end}
                                                            disabled={isSubmitting}
                                                            className="appearance-none w-full block text-gray-700 border border-gray-300 py-2 px-4 focus:outline-none focus:bg-white"
                                                            onChange={select =>
                                                                setFieldValue("end", select)
                                                            }
                                                        />
                                                        <Save handleSubmit={handleSubmit} />
                                                    </>
                                                ) : (
                                                    <>
                                                        <Information
                                                            description={moment(values.end).format(
                                                                "DD/MM/YYYY HH:mm"
                                                            )}
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
                                        <div className="sm:w-full xs:w-full flex justify-center items-center">
                                            <Label description="Veículo" />
                                            <div className="flex justify-between w-2/3">
                                                {activeEdit === "vehicle" ? (
                                                    <>
                                                        <SelectStyle
                                                            onChange={select => {
                                                                setFieldValue("vehicle", {
                                                                    plate: select.label,
                                                                    identifier: select.value,
                                                                });
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
                                                                let options = [
                                                                    {
                                                                        label: "Selecione",
                                                                        value: "",
                                                                    },
                                                                ];

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
                                                                values.vehicle !== undefined &&
                                                                values.vehicle.prefix + ' (' +values.vehicle.plate + ')'
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
                                        <div className="sm:w-full xs:w-full bg-tablerow flex justify-center items-center">
                                            <Label description="Status" />
                                            <div className="flex justify-between w-2/3">
                                                {activeEdit === "status" ? (
                                                    <>
                                                        <SelectStyle
                                                            onChange={select => {
                                                                setFieldValue("status", {
                                                                    description: select.label,
                                                                    identifier: select.value,
                                                                });
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
                                                                let options = [
                                                                    {
                                                                        label: "Selecione",
                                                                        value: "",
                                                                    },
                                                                ];

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
                                            <Label description="Categoria" />
                                            <div className="flex justify-between w-2/3">
                                                {activeEdit === "category" ? (
                                                    <>
                                                        <SelectStyle
                                                            onChange={select => {
                                                                setFieldValue("category", {
                                                                    description: select.label,
                                                                    identifier: select.value,
                                                                });
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
                                                                let options = [
                                                                    {
                                                                        label: "Selecione",
                                                                        value: "",
                                                                    },
                                                                ];

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
                                        </div>
                                        <div className="sm:w-full xs:w-full bg-tablerow flex justify-center items-center">
                                            <Label description="Modalidade" />
                                            <div className="flex justify-between w-2/3">
                                                {activeEdit === "modality" ? (
                                                    <>
                                                        <SelectStyle
                                                            onChange={select => {
                                                                setFieldValue("modality", {
                                                                    description: select.label,
                                                                    identifier: select.value,
                                                                });
                                                            }}
                                                            name={"modality"}
                                                            id={"modality"}
                                                            value={
                                                                values.modality !== undefined && {
                                                                    label:
                                                                        values.modality.description,
                                                                    value:
                                                                        values.modality.identifier,
                                                                }
                                                            }
                                                            optionsMap={(() => {
                                                                let options = [
                                                                    {
                                                                        label: "Selecione",
                                                                        value: "",
                                                                    },
                                                                ];
                                                                eventModality.map(modality =>
                                                                    options.push({
                                                                        value: modality.identifier,
                                                                        label: modality.description,
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
                                                                values.modality !== undefined
                                                                    ? values.modality.description
                                                                    : ""
                                                            }
                                                        />
                                                        <Pencil
                                                            setInputActive={() =>
                                                                setInputActive("modality")
                                                            }
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="sm:w-full xs:w-full flex justify-center items-center">
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
                                                                        value: trip?.identifier,
                                                                        label:
                                                                            trip?.line?.label +
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
                                                                values?.trip !== undefined
                                                                    ? values?.trip.line?.label +
                                                                      " - " +
                                                                      moment(
                                                                          values?.trip?.starts_at
                                                                      ).format(
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
                                    <div className="xs:w-full sm:w-full md:w-1/2 lg:w-1/2 pr-4 pl-4">
                                        <div className="bg-tablerow items-center pl-4 pb-4">
                                            <div className="flex justify-between">
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
                                                <LabelFullDefault description="Ações tomadas" />
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
                                                        <Information description={values.action} />
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
