import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Formik } from "formik";
import ClipLoader from "react-spinners/ClipLoader";
import { IoIosAddCircle } from "react-icons/io";
import moment from "moment";

import Colors from "../../assets/constants/Colors";
import { getSelectValues, objToSelect } from "../../assets/utils/format/formValues";
import HeaderToken from "../../services/headerToken";
import api from "../../services/api";
import Interceptor from "../../services/interceptor";
import ButtonIconDefault from "../../components/Buttons/default/ButtonIconDefault";
import { DatePickerPeriod } from "../../components/Date/DatePickerPeriod";
import SelectStyle from "../../components/Select";
import { Input } from "../../components/Formik";
import Title from "../../components/Title";
import Card from "../../components/Cards/Card";
import Back from "../../components/Back";
import { Label, Information, Pencil, Save, LoadSave } from "../../components/Details";
import ButtonDefault from "../../components/Buttons/default/ButtonDefault";

const ShowScale = props => {
    const [load, setLoad] = useState(false);
    const [activeEdit, setActiveEdit] = useState();
    const [scale, setScale] = useState([]);
    const [vehicleList, setVehicleList] = useState([]);
    const [lineList, setLineList] = useState([]);
    const [employeeList, setEmployeeList] = useState([]);
    const [companyList, setCompanyList] = useState([]);

    useEffect(() => {
        getScale();
        getVehicle();
        getLine();
        getEmployee();
        getCompany();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    const getCompany = () => {
        api.get(`api/adm/company/list?page_size=9999999`, HeaderToken()).then(response => {
            setCompanyList(response.data.data);
        });
    };

    const getScale = () => {
        setLoad(true);
        api.get(`api/adm/schedule/${props.match.params.identifier}/show`, HeaderToken())
            .then(response => {
                setScale(response.data);
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
            <Title title={"Detalhes da Escala"} crumbs={props.crumbs} />

            <Card>
                {load ? (
                    <div className="justify-center w-full">
                        <ClipLoader size={20} color={Colors.buslab} loading={true} />
                    </div>
                ) : (
                    <Formik
                        initialValues={{
                            description: scale.description,
                            tableCode: scale.tableCode,
                            sequence: scale.sequence,
                            startsAt: moment(scale.startsAt).format("HH:mm"),
                            endsAt: moment(scale.endsAt).format("HH:mm"),
                            dataValidity: new Date(scale.dataValidity),
                            modality: { value: scale.modality },
                            weekInterval: { value: scale.weekInterval },
                            line: objToSelect(scale.line),
                            vehicle: objToSelect(scale.vehicle, "label"),
                            driver: objToSelect(scale.driver, "name"),
                            collector: objToSelect(scale.collector, "name"),
                            company: objToSelect(scale.company),
                            dates: scale.dates?.map(dt => ({
                                date: new Date(dt.date),
                                driver: objToSelect(dt.driver, "name"),
                                collector: objToSelect(dt.collector, "name"),
                                vehicle: objToSelect(dt.vehicle, "label"),
                            })),
                        }}
                        enableReinitialize={true}
                        onSubmit={(values, { setSubmitting }) => {
                            let aux = getSelectValues(values);
                            aux.dataValidity = moment(values.dataValidity).format("DD/MM/YYYY");

                            aux.dates = aux.dates.map(dt => {
                                dt = getSelectValues(dt);
                                dt.date = moment(dt.date).format("DD/MM/YYYY");
                                return dt;
                            });

                            api.post(
                                `/api/adm/schedule/${props.match.params.identifier}/edit`,
                                aux,
                                HeaderToken()
                            )
                                .then(() => {
                                    toast.info("Escala editada com sucesso!");
                                    setActiveEdit();
                                })
                                .catch(error => {
                                    Interceptor(error);
                                })
                                .finally(() => {
                                    setLoad(false);
                                    setSubmitting(false);
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
                                    <div className="xs:w-full sm:w-full md:w-full lg:w-1/2 pr-4">
                                        <div className="sm:w-full xs:w-full bg-tablerow flex justify-center items-center">
                                            <Label description="Descrição" />
                                            <div className="flex justify-between w-2/3">
                                                {activeEdit === "description" ? (
                                                    <>
                                                        <Input
                                                            onChange={handleChange}
                                                            disabled={isSubmitting}
                                                            name="description"
                                                            value={values.description}
                                                        />
                                                        <Save handleSubmit={handleSubmit} />
                                                    </>
                                                ) : (
                                                    <>
                                                        <Information
                                                            description={values.description}
                                                        />
                                                        <Pencil
                                                            setInputActive={() =>
                                                                setInputActive("description")
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
                                                                    setFieldValue("line", select);
                                                                } else {
                                                                    setFieldValue("line", {});
                                                                }
                                                            }}
                                                            name={"line"}
                                                            id={"line"}
                                                            value={values.line}
                                                            optionsMap={(() => {
                                                                let options = [];
                                                                lineList.map(line =>
                                                                    options.push({
                                                                        value: line.identifier,
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
                                        <div className="sm:w-full xs:w-full bg-tablerow  flex justify-center items-center">
                                            <Label description="Empresa" />

                                            <div className="flex justify-between w-2/3">
                                                {activeEdit === "company" ? (
                                                    <>
                                                        <SelectStyle
                                                            onChange={select => {
                                                                if (select && select.value) {
                                                                    setFieldValue(
                                                                        "company",
                                                                        select
                                                                    );
                                                                } else {
                                                                    setFieldValue("company", {});
                                                                }
                                                            }}
                                                            name={"company"}
                                                            id={"company"}
                                                            value={values.company}
                                                            optionsMap={(() => {
                                                                let options = [];
                                                                companyList.map(company =>
                                                                    options.push({
                                                                        value: company.identifier,
                                                                        label: company.description,
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
                                                                values.company !== undefined
                                                                    ? values.company.label
                                                                    : "-"
                                                            }
                                                        />
                                                        <Pencil
                                                            setInputActive={() =>
                                                                setInputActive("company")
                                                            }
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="sm:w-full xs:w-full flex justify-center items-center">
                                            <Label description="Modalidade" />
                                            <div className="flex justify-between w-2/3">
                                                {activeEdit === "modality" ? (
                                                    <>
                                                        <SelectStyle
                                                            onChange={select => {
                                                                if (select && select.value) {
                                                                    setFieldValue(
                                                                        "modality",
                                                                        select
                                                                    );
                                                                } else {
                                                                    setFieldValue("modality", {});
                                                                }
                                                            }}
                                                            name={"modality"}
                                                            id={"modality"}
                                                            value={
                                                                values.modality !== undefined && {
                                                                    label:values.modality.value ===
                                                                        "CLOSING_OPERATION"
                                                                        ? "ENCERRAMENTO DE OPERAÇÃO" 
                                                                        : values.modality.value ===
                                                                        "STARTING_OPERATION"
                                                                        ? "INÍCIO DE OPERAÇÂO"
                                                                        : values.modality.value ===
                                                                        "TRIP"
                                                                            ? "Viagem"
                                                                            : values.modality
                                                                                  .value ===
                                                                              "MOVEMENT"
                                                                            ? "Deslocamento"
                                                                            : "Reservado",
                                                                    value: values.modality.value,
                                                                }
                                                            }
                                                            optionsMap={[
                                                                {
                                                                    value: "STARTING_OPERATION",
                                                                    label: "Início de operação",
                                                                },
                                                                {
                                                                    value: "TRIP",
                                                                    label: "Viagem",
                                                                },
                                                                {
                                                                    value: "MOVEMENT",
                                                                    label: "Deslocamento",
                                                                },
                                                                {
                                                                    value: "RESERVED",
                                                                    label: "Reservado",
                                                                },
                                                                {
                                                                    value: "CLOSING_OPERATION",
                                                                    label: "Encerramento de operação",
                                                                },
                                                            ]}
                                                        />
                                                        <Save handleSubmit={handleSubmit} />
                                                    </>
                                                ) : (
                                                    <>
                                                        <Information
                                                            description={
                                                                values.modality !== undefined
                                                                    ? values.modality.value === 
                                                                    "CLOSING_OPERATION" 
                                                                    ? "ENCERRAMENTO DE OPERAÇÃO" 
                                                                    : values.modality.value === 
                                                                    "STARTING_OPERATION" 
                                                                    ? "INÍCIO DE OPERAÇÂO"
                                                                    : values.modality.value ===
                                                                      "TRIP"
                                                                        ? "Viagem"
                                                                        : values.modality.value ===
                                                                          "MOVEMENT"
                                                                        ? "Deslocamento"
                                                                        : "Reservado"
                                                                    : "-"
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

                                        <div className="sm:w-full xs:w-full bg-tablerow  flex justify-center items-center">
                                            <Label description="Intervalo" />
                                            <div className="flex justify-between w-2/3">
                                                {activeEdit === "weekInterval" ? (
                                                    <>
                                                        <SelectStyle
                                                            onChange={select => {
                                                                if (select && select.value) {
                                                                    setFieldValue(
                                                                        "weekInterval",
                                                                        select
                                                                    );
                                                                } else {
                                                                    setFieldValue(
                                                                        "weekInterval",
                                                                        {}
                                                                    );
                                                                }
                                                            }}
                                                            name={"weekInterval"}
                                                            id={"weekInterval"}
                                                            value={
                                                                values.weekInterval !==
                                                                    undefined && {
                                                                    label:
                                                                        values.weekInterval
                                                                            .value === "WEEKDAY"
                                                                            ? "Dia útil"
                                                                            : values.weekInterval
                                                                                  .value ===
                                                                              "SATURDAY"
                                                                            ? "Sábados"
                                                                            : "Domingos",
                                                                    value: values.weekInterval,
                                                                }
                                                            }
                                                            optionsMap={[
                                                                {
                                                                    value: "WEEKDAY",
                                                                    label: "Dia útil",
                                                                },
                                                                {
                                                                    value: "SATURDAY",
                                                                    label: "Sábados",
                                                                },
                                                                {
                                                                    value: "SUNDAY",
                                                                    label: "Domingos",
                                                                },
                                                            ]}
                                                        />
                                                        <Save handleSubmit={handleSubmit} />
                                                    </>
                                                ) : (
                                                    <>
                                                        <Information
                                                            description={
                                                                values.weekInterval !== undefined
                                                                    ? values.weekInterval.value ===
                                                                      "WEEKDAY"
                                                                        ? "Dia útil"
                                                                        : values.weekInterval
                                                                              .value === "SATURDAY"
                                                                        ? "Sábados"
                                                                        : "Domingos"
                                                                    : "-"
                                                            }
                                                        />
                                                        <Pencil
                                                            setInputActive={() =>
                                                                setInputActive("weekInterval")
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
                                                                if (select && select.value) {
                                                                    setFieldValue(
                                                                        "vehicle",
                                                                        select
                                                                    );
                                                                } else {
                                                                    setFieldValue("vehicle", {});
                                                                }
                                                            }}
                                                            name={"vehicle"}
                                                            id={"vehicle"}
                                                            value={values.vehicle}
                                                            optionsMap={(() => {
                                                                let options = [];
                                                                vehicleList &&
                                                                    vehicleList.map(vehicle =>
                                                                        options.push({
                                                                            value:
                                                                                vehicle.identifier,
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
                                                                values.vehicle?.label || "-"
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
                                            <Label description="Motorista" />
                                            <div className="flex justify-between w-2/3">
                                                {activeEdit === "driver" ? (
                                                    <>
                                                        <SelectStyle
                                                            onChange={select => {
                                                                if (select && select.value) {
                                                                    setFieldValue("driver", select);
                                                                } else {
                                                                    setFieldValue("driver", {});
                                                                }
                                                            }}
                                                            name={"driver"}
                                                            id={"driver"}
                                                            value={values.driver}
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
                                                                values.driver?.label || "-"
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
                                                                    setFieldValue(
                                                                        "collector",
                                                                        select
                                                                    );
                                                                } else {
                                                                    setFieldValue("collector", {});
                                                                }
                                                            }}
                                                            name={"collector"}
                                                            id={"collector"}
                                                            value={values.collector}
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
                                                                values.collector?.label || "-"
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
                                    </div>
                                    <div className="xs:w-full sm:w-full md:w-full lg:w-1/2 pr-4">
                                        <div className="sm:w-full xs:w-full bg-tablerow flex justify-center items-center">
                                            <Label description="Sequência" />
                                            <div className="flex justify-between w-2/3">
                                                {activeEdit === "sequence" ? (
                                                    <>
                                                        <Input
                                                            onChange={handleChange}
                                                            name="sequence"
                                                            value={values.sequence}
                                                        />
                                                        <Save handleSubmit={handleSubmit} />
                                                    </>
                                                ) : (
                                                    <>
                                                        <Information
                                                            description={values.sequence}
                                                        />
                                                        <Pencil
                                                            setInputActive={() =>
                                                                setInputActive("sequence")
                                                            }
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="sm:w-full xs:w-full flex justify-center items-center">
                                            <Label description="Código da tabela" />
                                            <div className="flex justify-between w-2/3">
                                                {activeEdit === "tableCode" ? (
                                                    <>
                                                        <Input
                                                            onChange={handleChange}
                                                            name="tableCode"
                                                            value={values.tableCode}
                                                        />
                                                        <Save handleSubmit={handleSubmit} />
                                                    </>
                                                ) : (
                                                    <>
                                                        <Information
                                                            description={values.tableCode}
                                                        />
                                                        <Pencil
                                                            setInputActive={() =>
                                                                setInputActive("tableCode")
                                                            }
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="sm:w-full xs:w-full bg-tablerow flex justify-center items-center">
                                            <Label description="Hora de início" />
                                            <div className="flex justify-between w-2/3">
                                                {activeEdit === "startsAt" ? (
                                                    <>
                                                        <Input
                                                            disabled={isSubmitting}
                                                            type="time"
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            name="startsAt"
                                                            value={values.startsAt}
                                                        />
                                                        <Save handleSubmit={handleSubmit} />
                                                    </>
                                                ) : (
                                                    <>
                                                        <Information
                                                            description={values.startsAt}
                                                        />
                                                        <Pencil
                                                            setInputActive={() =>
                                                                setInputActive("startsAt")
                                                            }
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="sm:w-full xs:w-full flex justify-center items-center">
                                            <Label description="Horário de fim" />
                                            <div className="flex justify-between w-2/3">
                                                {activeEdit === "endsAt" ? (
                                                    <>
                                                        <Input
                                                            disabled={isSubmitting}
                                                            type="time"
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            name="endsAt"
                                                            value={values.endsAt}
                                                        />
                                                        <Save handleSubmit={handleSubmit} />
                                                    </>
                                                ) : (
                                                    <>
                                                        <Information description={values.endsAt} />
                                                        <Pencil
                                                            setInputActive={() =>
                                                                setInputActive("endsAt")
                                                            }
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="sm:w-full xs:w-full bg-tablerow flex justify-center items-center">
                                            <Label description="Validade" />
                                            <div className="flex justify-between w-2/3">
                                                {activeEdit === "dataValidity" ? (
                                                    <>
                                                        <DatePickerPeriod
                                                            selected={values.dataValidity}
                                                            disabled={isSubmitting}
                                                            onChange={select => {
                                                                if (select) {
                                                                    setFieldValue(
                                                                        "dataValidity",
                                                                        select
                                                                    );
                                                                } else {
                                                                    setFieldValue(
                                                                        "dataValidity",
                                                                        {}
                                                                    );
                                                                }
                                                            }}
                                                        />
                                                        <Save handleSubmit={handleSubmit} />
                                                    </>
                                                ) : (
                                                    <>
                                                        <Information
                                                            description={moment(
                                                                values.dataValidity
                                                            ).format("DD/MM/YYYY")}
                                                        />
                                                        <Pencil
                                                            setInputActive={() =>
                                                                setInputActive("dataValidity")
                                                            }
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 border-t border-c1 pt-4">
                                    <div className="flex justify-between">
                                        <h5>Datas</h5>
                                        <ButtonIconDefault
                                            onClick={() => {
                                                setFieldValue("dates", [...values.dates, {}]);
                                            }}
                                            icon={<IoIosAddCircle />}
                                        />
                                    </div>
                                    {values.dates?.map((dt, index) => (
                                        <div
                                            key={index}
                                            className={`flex justify-between pb-3 ${
                                                index % 2 === 0 && "bg-tablerow"
                                            } `}>
                                            <div className="w-1/4 pr-2">
                                                <label className="block text-gray-700 text-sm font-medium ">
                                                    Data
                                                </label>
                                                {activeEdit === `dates[${index}].date` ? (
                                                    <div className="flex">
                                                        <DatePickerPeriod
                                                            name={`dates[${index}].date`}
                                                            selected={dt.date}
                                                            disabled={isSubmitting}
                                                            onChange={select =>
                                                                setFieldValue(
                                                                    `dates[${index}].date`,
                                                                    select
                                                                )
                                                            }
                                                        />
                                                        <Save handleSubmit={handleSubmit} />
                                                    </div>
                                                ) : (
                                                    <>
                                                        <Information
                                                            description={
                                                                dt.date &&
                                                                moment(dt.date).format("DD/MM/YYYY")
                                                            }
                                                        />
                                                        <Pencil
                                                            setInputActive={() =>
                                                                setInputActive(
                                                                    `dates[${index}].date`
                                                                )
                                                            }
                                                        />
                                                    </>
                                                )}
                                            </div>
                                            <div className="w-1/4 pl-2 pr-2">
                                                <label className="block text-gray-700 text-sm font-medium">
                                                    Veículo
                                                </label>
                                                {activeEdit === `dates[${index}].vehicle` ? (
                                                    <div className="flex">
                                                        <SelectStyle
                                                            onChange={select => {
                                                                setFieldValue(
                                                                    `dates[${index}].vehicle`,
                                                                    select
                                                                );
                                                            }}
                                                            name={`dates[${index}].vehicle`}
                                                            id={`dates[${index}].vehicle`}
                                                            value={dt.vehicle}
                                                            optionsMap={(() => {
                                                                let options = [];
                                                                vehicleList &&
                                                                    vehicleList.map(vehicle =>
                                                                        options.push({
                                                                            value:
                                                                                vehicle.identifier,
                                                                            label: vehicle.label,
                                                                        })
                                                                    );
                                                                return options;
                                                            })()}
                                                        />
                                                        <Save handleSubmit={handleSubmit} />
                                                    </div>
                                                ) : (
                                                    <>
                                                        <Information
                                                            description={dt.vehicle?.label || "-"}
                                                        />
                                                        <Pencil
                                                            setInputActive={() =>
                                                                setInputActive(
                                                                    `dates[${index}].vehicle`
                                                                )
                                                            }
                                                        />
                                                    </>
                                                )}
                                            </div>
                                            <div className="w-1/4 pl-2 pr-2">
                                                <label className="block text-gray-700 text-sm font-medium">
                                                    Motorista
                                                </label>
                                                {activeEdit === `dates[${index}].driver` ? (
                                                    <div className="flex">
                                                        <SelectStyle
                                                            onChange={select => {
                                                                setFieldValue(
                                                                    `dates[${index}].driver`,
                                                                    select
                                                                );
                                                            }}
                                                            name={`dates[${index}].driver`}
                                                            id={`dates[${index}].driver`}
                                                            value={dt.driver}
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
                                                    </div>
                                                ) : (
                                                    <>
                                                        <Information
                                                            description={dt.driver?.label || "-"}
                                                        />
                                                        <Pencil
                                                            setInputActive={() =>
                                                                setInputActive(
                                                                    `dates[${index}].driver`
                                                                )
                                                            }
                                                        />
                                                    </>
                                                )}
                                            </div>
                                            <div className="w-1/4 pl-2 pr-2">
                                                <label className="block text-gray-700 text-sm font-medium">
                                                    Cobrador
                                                </label>
                                                {activeEdit === `dates[${index}].collector` ? (
                                                    <div className="flex">
                                                        <SelectStyle
                                                            onChange={select => {
                                                                setFieldValue(
                                                                    `dates[${index}].collector`,
                                                                    select
                                                                );
                                                            }}
                                                            name={`dates[${index}].collector`}
                                                            id={`dates[${index}].collector`}
                                                            value={dt.collector}
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
                                                    </div>
                                                ) : (
                                                    <>
                                                        <Information
                                                            description={dt.collector?.label || "-"}
                                                        />
                                                        <Pencil
                                                            setInputActive={() =>
                                                                setInputActive(
                                                                    `dates[${index}].collector`
                                                                )
                                                            }
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    <div className="flex justify-end">
                                        <ButtonDefault
                                            onClick={handleSubmit}
                                            title="Salvar datas"></ButtonDefault>
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

export default ShowScale;
