import React, { useState } from "react";
import moment from "moment";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import { Formik } from "formik";
import { IoIosAddCircle } from "react-icons/io";

import HeaderToken from "../../../services/headerToken";
import Interceptor from "../../../services/interceptor";
import api from "../../../services/api";
import ModalForm from "../../../components/Modais/ModalForm";
import ButtonDefault from "../../../components/Buttons/default/ButtonDefault";
import { DatePickerPeriod } from "../../../components/Date/DatePickerPeriod";
import SelectStyle from "../../../components/Select";
import { Input, Error } from "../../../components/Formik";
import ButtonIconDefault from "../../../components/Buttons/default/ButtonIconDefault";
import Colors from "../../../assets/constants/Colors";
import Schema from "../Schema";
import { getSelectValues } from "../../../assets/utils/format/formValues";
import ModalStyled from "../../../components/Modais/ModalStyled";

const ModalCreate = ({
    modalPost,
    actionModalPost,
    getList,
    vehicleList,
    lineList,
    employeeList,
    companyList,
}) => {
    return (
        <ModalStyled
            overflow
            onClose={actionModalPost}
            show={modalPost}
            title={<h4 className="mb-3">Cadastro de Escala</h4>}>
            <Formik
                initialValues={{
                    description: "",
                    tableCode: "",
                    sequence: "",
                    startsAt: "",
                    endsAt: "",
                    dataValidity: "",
                    modality: "",
                    weekInterval: "",
                    line: "",
                    vehicle: "",
                    driver: "",
                    collector: "",
                    company: "",
                    dates: [],
                }}
                validationSchema={Schema}
                onSubmit={(values, { setFieldError, setSubmitting }) => {
                    const aux = getSelectValues(values);

                    aux.dates = values.dates.map(dt => ({
                        ...getSelectValues(dt),
                        date: moment(dt.date).format("DD/MM/YYYY"),
                    }));
                    aux["startsAt"] = `${values.startsAt}:00`;
                    aux["endsAt"] = `${values.endsAt}:00`;
                    aux["horOutCollected"] = `${values.horOutCollected}:00`;
                    aux["dataValidity"] = moment(values.dataValidity).format("DD/MM/YYYY");

                    api.post(`api/adm/schedule/new`, aux, HeaderToken())
                        .then(() => {
                            toast.info("Escala adicionada!");
                            actionModalPost();
                            getList();
                            setSubmitting(false);
                        })
                        .catch(error => {
                            Interceptor(error);
                        });
                }}>
                {({
                    handleChange,
                    handleSubmit,
                    isSubmitting,
                    errors,
                    values,
                    touched,
                    handleBlur,
                    setFieldValue,
                }) => (
                    <form onSubmit={handleSubmit}>
                        <label className="block text-gray-700 text-sm font-medium">
                            Descrição (opcional)
                        </label>
                        <Input
                            type="text"
                            onChange={handleChange}
                            name="description"
                            value={values.description}
                        />
                        <Error name="description" />
                        <div className="flex mt-2">
                            <div className="w-1/2 pr-2">
                                <label className="block text-gray-700 text-sm font-medium">
                                    Código da tabela
                                </label>
                                <Input
                                    placeholder="ex: 1A"
                                    onChange={handleChange}
                                    name="tableCode"
                                    value={values.tableCode}
                                />
                                <Error name="tableCode" />
                            </div>
                            <div className="w-1/2 pl-2">
                                <label className="block text-gray-700 text-sm font-medium">
                                    Sequência
                                </label>
                                <Input
                                    placeholder="ex: 10"
                                    onChange={handleChange}
                                    name="sequence"
                                    value={values.sequence}
                                />
                                <Error name="sequence" />
                            </div>
                        </div>
                        <div className="flex mt-3">
                            <div className="w-1/3 pr-2">
                                <label className="block text-gray-700 text-sm font-medium ">
                                    Horário de início
                                </label>
                                <input
                                    disabled={isSubmitting}
                                    className="w-full text-gray-700 border border-gray-300 py-2 px-2 h-9 focus:outline-none rounded "
                                    type="time"
                                    placeholder="ex: 15:00"
                                    format="##:##"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    name="startsAt"
                                    value={values.startsAt}
                                />
                                <Error name="startsAt" />
                            </div>
                            <div className="w-1/3 pl-2 pr-2">
                                <label className="block text-gray-700 text-sm font-medium ">
                                    Horário de fim
                                </label>
                                <input
                                    disabled={isSubmitting}
                                    className="w-full text-gray-700 border border-gray-300 py-2 px-2 h-9 focus:outline-none rounded "
                                    type="time"
                                    placeholder="ex: 15:00"
                                    format="##:##"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    name="endsAt"
                                    value={values.endsAt}
                                />
                                <Error name="endsAt" />
                            </div>
                            <div className="w-1/3 pl-2">
                                <label className="block text-gray-700 text-sm font-medium ">
                                    Validade
                                </label>
                                <DatePickerPeriod
                                    name="dataValidity"
                                    selected={values.dataValidity}
                                    calendarPopperPosition="bottom"
                                />
                                <Error name="dataValidity" />
                            </div>
                        </div>
                        <div className="flex mt-2">
                            <div className="w-1/2 pr-2">
                                <label className="block text-gray-700 text-sm font-medium">
                                    Modalidade
                                </label>
                                <SelectStyle
                                    onChange={select => {
                                        if (select && select.value) {
                                            setFieldValue("modality", select);
                                        } else {
                                            setFieldValue("modality", {});
                                        }
                                    }}
                                    name={"modality"}
                                    id={"modality"}
                                    value={
                                        values.modality !== undefined && {
                                            label: values.modality.label,
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
                                <Error name="modality" />
                            </div>
                            <div className="w-1/2 pl-2">
                                <label className="block text-gray-700 text-sm font-medium">
                                    Intervalo
                                </label>
                                <SelectStyle
                                    onChange={select => {
                                        if (select && select.value) {
                                            setFieldValue("weekInterval", select);
                                        } else {
                                            setFieldValue("weekInterval", {});
                                        }
                                    }}
                                    name={"weekInterval"}
                                    id={"weekInterval"}
                                    value={
                                        values.weekInterval !== undefined && {
                                            label: values.weekInterval.label,
                                            value: values.weekInterval.value,
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
                                <Error name="weekInterval" />
                            </div>
                        </div>
                        <div className="flex mt-3">
                            <div className="w-full pr-2">
                                <label className="block text-gray-700 text-sm font-medium">
                                    Selecione a linha
                                </label>
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
                                    value={
                                        values.line !== undefined && {
                                            label: values.line.label,
                                            value: values.line.identifier,
                                        }
                                    }
                                    optionsMap={(() => {
                                        let options = [];

                                        lineList.map(line => {
                                            return options.push({
                                                value: line.identifier,
                                                label: line.label,
                                            });
                                        });

                                        return options;
                                    })()}
                                />
                                <Error name="line" />
                            </div>
                        </div>
                        <div className="flex mt-3">
                            <div className="w-1/2 pr-2">
                                <label className="block text-gray-700 text-sm font-medium">
                                    Selecione o veículo (opcional)
                                </label>
                                <SelectStyle
                                    onChange={select => {
                                        if (select && select.value) {
                                            setFieldValue("vehicle", select);
                                        } else {
                                            setFieldValue("vehicle", {});
                                        }
                                    }}
                                    name={"vehicle"}
                                    id={"vehicle"}
                                    value={
                                        values.vehicle !== undefined && {
                                            label: values.vehicle.label,
                                            value: values.vehicle.identifier,
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
                                <Error name="vehicle" />
                            </div>
                            <div className="w-1/2 pl-2">
                                <label className="block text-gray-700 text-sm font-medium">
                                    Selecione o motorista (opcional)
                                </label>
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
                                                employee.modality.description === "Motorista" &&
                                                options.push({
                                                    value: employee.identifier,
                                                    label: employee.name,
                                                })
                                        );
                                        return options;
                                    })()}
                                />
                                <Error name="driver" />
                            </div>
                        </div>
                        <div className="flex mt-3">
                            <div className="w-1/2 pr-2">
                                <label className="block text-gray-700 text-sm font-medium">
                                    Selecione o cobrador (opcional)
                                </label>
                                <SelectStyle
                                    onChange={select => {
                                        if (select && select.value) {
                                            setFieldValue("collector", select);
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
                                                employee.modality.description === "Cobrador" &&
                                                options.push({
                                                    value: employee.identifier,
                                                    label: employee.name,
                                                })
                                        );
                                        return options;
                                    })()}
                                />
                                <Error name="collector" />
                            </div>
                            <div className="w-1/2 pl-2">
                                <label className="block text-gray-700 text-sm font-medium">
                                    Selecione a empresa
                                </label>
                                <SelectStyle
                                    onChange={select => {
                                        if (select && select.value) {
                                            setFieldValue("company", select);
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
                                <Error name="company" />
                            </div>
                        </div>
                        <div className="my-6 border-t border-solid border-bg-custom_c3 pt-2">
                            <div className="flex justify-between">
                                <h5>Datas</h5>
                                <ButtonIconDefault
                                    onClick={() => setFieldValue("dates", [...values.dates, {}])}
                                    icon={<IoIosAddCircle color="#fff" />}
                                />
                            </div>
                            {values.dates.map((dateItem, index) => {
                                return (
                                    <div key={index} className="flex mb-3">
                                        <div className="w-1/4 pr-2">
                                            <label className="block text-gray-700 text-sm font-medium ">
                                                Data
                                            </label>
                                            <DatePickerPeriod
                                                name={`dates[${index}].date`}
                                                selected={dateItem.date}
                                                onChange={e =>
                                                    setFieldValue(`dates[${index}].date`, e)
                                                }
                                            />
                                        </div>
                                        <Error name={`dates[${index}].date`} />
                                        <div className="w-1/4 pl-2 pr-2">
                                            <label className="block text-gray-700 text-sm font-medium">
                                                Veículo
                                            </label>
                                            <SelectStyle
                                                onChange={select => {
                                                    setFieldValue(
                                                        `dates[${index}].vehicle`,
                                                        select
                                                    );
                                                }}
                                                name="vehicle"
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
                                        </div>
                                        <Error name={`dates[${index}].vehicle`} />
                                        <div className="w-1/4 pl-2 pr-2">
                                            <label className="block text-gray-700 text-sm font-medium">
                                                Motorista
                                            </label>
                                            <SelectStyle
                                                onChange={select => {
                                                    setFieldValue(`dates[${index}].driver`, select);
                                                }}
                                                name={"driver"}
                                                id={"driver"}
                                                optionsMap={(() => {
                                                    let options = [];
                                                    employeeList.map(
                                                        employee =>
                                                            employee.modality.description ===
                                                                "Motorista" &&
                                                            options.push({
                                                                value: employee.identifier,
                                                                label: employee.name,
                                                            })
                                                    );
                                                    return options;
                                                })()}
                                            />
                                        </div>
                                        <Error name={`dates[${index}].driver`} />
                                        <div className="w-1/4 pl-2 pr-2">
                                            <label className="block text-gray-700 text-sm font-medium">
                                                Cobrador
                                            </label>
                                            <SelectStyle
                                                onChange={select => {
                                                    setFieldValue(
                                                        `dates[${index}].collector`,
                                                        select
                                                    );
                                                }}
                                                name={"collector"}
                                                id={"collector"}
                                                optionsMap={(() => {
                                                    let options = [];
                                                    employeeList.map(
                                                        employee =>
                                                            employee.modality.description ===
                                                                "Cobrador" &&
                                                            options.push({
                                                                value: employee.identifier,
                                                                label: employee.name,
                                                            })
                                                    );
                                                    return options;
                                                })()}
                                            />
                                        </div>
                                        <Error name={`dates[${index}].collector`} />
                                    </div>
                                );
                            })}
                        </div>

                        {isSubmitting ? (
                            <div className="w-full mt-2">
                                <div className="flex justify-end">
                                    <ClipLoader size={20} color={Colors.buslab} loading={true} />
                                </div>
                            </div>
                        ) : (
                            <ButtonDefault
                                title="Salvar"
                                type="submit"
                                className="fa-pull-right mb-2 mt-2"
                            />
                        )}
                    </form>
                )}
            </Formik>
        </ModalStyled>
    );
};

export default ModalCreate;
