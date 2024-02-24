import React from "react";
import ModalForm from "../../../components/Modais/ModalForm";
import { Formik } from "formik";
import api from "../../../services/api";
import { toast } from "react-toastify";
import ButtonDefault from "../../../components/Buttons/default/ButtonDefault";
import ClipLoader from "react-spinners/ClipLoader";
import Colors from "../../../assets/constants/Colors";
import HeaderToken from "../../../services/headerToken";
import Schema from "../Schema";
import moment from "moment";
import Interceptor from "../../../services/interceptor";
import { DatePickerWithHour } from "../../../components/Date/DatePickerPeriod";
import SelectStyle from "../../../components/Select";
const ModalCreate = ({
    modalPost,
    actionModalPost,
    getList,
    vehicleList,
    lineList,
    employeeList,
    statusList,
    modalityList,
    companyList,
    scaleList,
    obdList,
}) => {
    return (
        <ModalForm onClose={actionModalPost} show={modalPost} title={<h4 className="mb-3">Cadastro de evento</h4>}>
            <Formik
                initialValues={{
                    starts_at: "",
                    ends_at: "",
                    modality: "",
                    company: "",
                    driver: "",
                    collector: "",
                    vehicle: "",
                    line: "",
                    status: "",
                    schedule: "",
                    obd: "",
                }}
                validationSchema={Schema}
                onSubmit={(values, { setSubmitting }) => {
                    api.post(
                        `api/adm/trip/new`,
                        {
                            ...values,
                            starts_at: moment(values.starts_at).format("DD/MM/YYYY HH:mm:ss"),
                            ends_at: moment(values.ends_at).format("DD/MM/YYYY HH:mm:ss"),
                            modality:
                                typeof values.modality === "object" ? values.modality.identifier : values.modality,
                            company: typeof values.company === "object" ? values.company.identifier : values.company,
                            driver: typeof values.driver === "object" ? values.driver.identifier : values.driver,
                            collector:
                                typeof values.collector === "object" ? values.collector.identifier : values.collector,
                            vehicle: typeof values.vehicle === "object" ? values.vehicle.identifier : values.vehicle,
                            line: typeof values.line === "object" ? values.line.identifier : values.line,
                            status: typeof values.status === "object" ? values.status.identifier : values.status,
                            schedule:
                                typeof values.schedule === "object" ? values.schedule.identifier : values.schedule,
                            obd: typeof values.obd === "object" ? values.obd.identifier : values.obd,
                        },
                        HeaderToken()
                    )
                        .then(response => {
                            toast.info("Viagem adicionada!");
                            actionModalPost();
                            getList();
                        })
                        .catch(error => {
                            actionModalPost();
                            Interceptor(error);
                        });
                }}>
                {({ handleChange, handleSubmit, isSubmitting, errors, values, touched, handleBlur, setFieldValue }) => (
                    <form onSubmit={handleSubmit}>
                        <div className="flex mt-4">
                            <div className="w-1/2 pr-2">
                                <label className="block text-gray-700 text-sm font-medium">Data de ínicio</label>
                                <DatePickerWithHour
                                    selected={values.starts_at}
                                    className="appearance-none w-full block text-gray-700 border border-gray-300 py-2 px-4 focus:outline-none focus:bg-white"
                                    onChange={select => setFieldValue("starts_at", select)}
                                />

                                {touched.starts_at && errors.starts_at && (
                                    <span className="text-red-600 text-sm">{errors.starts_at}</span>
                                )}
                            </div>
                            <div className="w-1/2 pl-2">
                                <label className="block text-gray-700 text-sm font-medium">Data de término</label>
                                <DatePickerWithHour
                                    selected={values.ends_at}
                                    className="appearance-none w-full block text-gray-700 border border-gray-300 py-2 px-4 focus:outline-none focus:bg-white"
                                    onChange={select => setFieldValue("ends_at", select)}
                                />
                                {touched.ends_at && errors.ends_at && (
                                    <span className="text-red-600 text-sm">{errors.ends_at}</span>
                                )}
                            </div>
                        </div>
                        <div className="flex mt-4">
                            <div className="w-1/2 pr-2">
                                <label className="block text-gray-700 text-sm font-medium">Selecione o motorista</label>
                                <SelectStyle
                                    onChange={select => {
                                        setFieldValue("driver", {
                                            name: select.label,
                                            identifier: select.value,
                                        });
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
                                        let options = [{ label: "Selecione", value: "" }];
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
                                {touched.driver && errors.driver && (
                                    <span className="text-red-600 text-sm mt-0">{errors.driver}</span>
                                )}
                            </div>
                            <div className="w-1/2 pl-2">
                                <label className="block text-gray-700 text-sm font-medium">Selecione o cobrador</label>
                                <SelectStyle
                                    onChange={select => {
                                        setFieldValue("collector", {
                                            name: select.label,
                                            identifier: select.value,
                                        });
                                    }}
                                    name={"collector"}
                                    id={"collector"}
                                    value={
                                        values.collector !== undefined && {
                                            label: values.collector.name,
                                            value: values.collector.identifier,
                                        }
                                    }
                                    optionsMap={(() => {
                                        let options = [{ label: "Selecione", value: "" }];
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
                                {touched.collector && errors.collector && (
                                    <span className="text-red-600 text-sm mt-0">{errors.collector}</span>
                                )}
                            </div>
                        </div>
                        <div className="flex mt-4">
                            <div className="w-1/2 pr-2">
                                <label className="block text-gray-700 text-sm font-medium">Selecione o veículo</label>
                                <SelectStyle
                                    onChange={select => {
                                        setFieldValue("vehicle", {
                                            label: select.label,
                                            identifier: select.value,
                                        });
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
                                        let options = [{ label: "Selecione", value: "" }];
                                        vehicleList.map(vehicle =>
                                            options.push({
                                                value: vehicle.identifier,
                                                label: vehicle.label,
                                            })
                                        );
                                        return options;
                                    })()}
                                />
                                {touched.vehicle && errors.vehicle && (
                                    <span className="text-red-600 text-sm mt-0">{errors.vehicle}</span>
                                )}
                            </div>
                            <div className="w-1/2 pl-2">
                                <label className="block text-gray-700 text-sm font-medium">Selecione a linha</label>
                                <SelectStyle
                                    onChange={select => {
                                        setFieldValue("line", {
                                            label: select.label,
                                            identifier: select.value,
                                        });
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
                                        let options = [{ label: "Selecione", value: "" }];
                                        lineList.map(line =>
                                            options.push({
                                                value: line.identifier,
                                                label: line.code,
                                            })
                                        );
                                        return options;
                                    })()}
                                />
                                {touched.line && errors.line && (
                                    <span className="text-red-600 text-sm mt-0">{errors.line}</span>
                                )}
                            </div>
                        </div>
                        <div className="flex mt-4">
                            <div className="w-1/2 pr-2">
                                <label className="block text-gray-700 text-sm font-medium">Selecione a empresa</label>
                                <SelectStyle
                                    onChange={select => {
                                        setFieldValue("company", {
                                            description: select.label,
                                            identifier: select.value,
                                        });
                                    }}
                                    name={"company"}
                                    id={"company"}
                                    value={
                                        values.company !== undefined && {
                                            label: values.company.description,
                                            value: values.company.identifier,
                                        }
                                    }
                                    optionsMap={(() => {
                                        let options = [{ label: "Selecione", value: "" }];
                                        companyList.map(company =>
                                            options.push({
                                                value: company.identifier,
                                                label: company.description,
                                            })
                                        );
                                        return options;
                                    })()}
                                />
                                {touched.company && errors.company && (
                                    <span className="text-red-600 text-sm mt-0">{errors.company}</span>
                                )}
                            </div>
                            <div className="w-1/2 pl-2">
                                <label className="block text-gray-700 text-sm font-medium">Selecione o status</label>
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
                                            label: values.status.description,
                                            value: values.status.identifier,
                                        }
                                    }
                                    optionsMap={(() => {
                                        let options = [{ label: "Selecione", value: "" }];
                                        statusList.map(status =>
                                            options.push({
                                                value: status.identifier,
                                                label: status.description,
                                            })
                                        );
                                        return options;
                                    })()}
                                />
                                {touched.status && errors.status && (
                                    <span className="text-red-600 text-sm mt-0">{errors.status}</span>
                                )}
                            </div>
                        </div>
                        <div className="flex mt-4">
                            <div className="w-1/2 pr-2">
                                <label className="block text-gray-700 text-sm font-medium">
                                    Selecione o modalidade
                                </label>
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
                                            label: values.modality.description,
                                            value: values.modality.identifier,
                                        }
                                    }
                                    optionsMap={(() => {
                                        let options = [{ label: "Selecione", value: "" }];
                                        modalityList.map(modality =>
                                            options.push({
                                                value: modality.identifier,
                                                label: modality.description,
                                            })
                                        );
                                        return options;
                                    })()}
                                />
                                {touched.modality && errors.modality && (
                                    <span className="text-red-600 text-sm mt-0">{errors.modality}</span>
                                )}
                            </div>
                            <div className="w-1/2 pl-2">
                                <label className="block text-gray-700 text-sm font-medium">Selecione a escala</label>
                                <SelectStyle
                                    onChange={select => {
                                        setFieldValue("schedule", {
                                            table_code: select.label,
                                            identifier: select.value,
                                        });
                                    }}
                                    name={"schedule"}
                                    id={"schedule"}
                                    value={
                                        values.schedule !== undefined && {
                                            label: values.schedule.table_code,
                                            value: values.schedule.identifier,
                                        }
                                    }
                                    optionsMap={(() => {
                                        let options = [{ label: "Selecione", value: "" }];
                                        scaleList.map(schedule =>
                                            options.push({
                                                value: schedule.identifier,
                                                label: schedule.table_code,
                                            })
                                        );
                                        return options;
                                    })()}
                                />
                                {touched.schedule && errors.schedule && (
                                    <span className="text-red-600 text-sm mt-0">{errors.schedule}</span>
                                )}
                            </div>
                        </div>
                        <div className="flex mt-4">
                            <div className="w-1/2 pr-2">
                                <label className="block text-gray-700 text-sm font-medium">Selecione o OBD</label>
                                <SelectStyle
                                    onChange={select => {
                                        setFieldValue("obd", {
                                            serial: select.label,
                                            identifier: select.value,
                                        });
                                    }}
                                    name={"obd"}
                                    id={"obd"}
                                    value={
                                        values.obd !== undefined && {
                                            label: values.obd.serial,
                                            value: values.obd.identifier,
                                        }
                                    }
                                    optionsMap={(() => {
                                        let options = [{ label: "Selecione", value: "" }];
                                        obdList.map(obd =>
                                            options.push({
                                                value: obd.identifier,
                                                label: obd.serial,
                                            })
                                        );
                                        return options;
                                    })()}
                                />
                                {touched.obd && errors.obd && (
                                    <span className="text-red-600 text-sm mt-0">{errors.obd}</span>
                                )}
                            </div>
                        </div>
                        {isSubmitting ? (
                            <div className="w-full mt-2">
                                <div className="flex justify-end">
                                    <ClipLoader size={20} color={Colors.buslab} loading={true} />
                                </div>
                            </div>
                        ) : (
                            <ButtonDefault title="Salvar" type="submit" className="fa-pull-right mb-2 mt-2" />
                        )}
                    </form>
                )}
            </Formik>
        </ModalForm>
    );
};

export default ModalCreate;
