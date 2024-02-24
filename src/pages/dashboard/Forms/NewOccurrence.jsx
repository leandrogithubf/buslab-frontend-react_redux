import React, { useState, useEffect } from "react";
import ButtonDefault from "../../../components/Buttons/default/ButtonDefault";
import { Link } from "react-router-dom";
import Card from "../../../components/Cards/Card";
import { Input, Error } from "../../../components/Formik";
import { Formik } from "formik";
import Interceptor from "../../../services/interceptor";
import { toast } from "react-toastify";
import HeaderToken from "../../../services/headerToken";
import api from "../../../services/api";
import moment from "moment";
import Schema from "../../occurrences/Schema";
import { DatePickerWithHour } from "../../../components/Date/DatePickerPeriod";
import SelectStyle from "../../../components/Select";
import Colors from "../../../assets/constants/Colors";
import ClipLoader from "react-spinners/ClipLoader";

const NewOccurrence = ({ setActionQuote }) => {
    const [lineList, setLine] = useState([]);
    const [tripList, setTrip] = useState([]);
    const [employeeList, setEmployeeList] = useState([]);
    const [vehicleList, setVehicleList] = useState([]);
    const [eventCategory, setEventCategory] = useState([]);
    const [eventStatus, setEventStatus] = useState([]);
    const [sector, setSector] = useState([]);

    useEffect(() => {
        getLine();
        getTrip();
        getEmployee();
        getVehicle();
        getSector();
    }, []);

    const getLine = () => {
        api.get(`api/adm/line/list?page_size=9999999`, HeaderToken()).then(response => {
            setLine(response.data.data);
        });
    };

    const getTrip = () => {
        api.get(`api/adm/trip/list-day?page_size=9999999`, HeaderToken()).then(response => {
            setTrip(response.data);
        });
    };

    const getSector = () => {
        api.get(`api/adm/sector/list?page_size=9999999`, HeaderToken()).then(response => {
            setSector(response.data.data);
        });
    };

    const getVehicle = () => {
        api.get(`api/adm/vehicle/list?page_size=9999999`, HeaderToken()).then(response => {
            setVehicleList(response.data.data);
        });
    };

    const getEmployee = () => {
        api.get(`api/adm/employee/list?page_size=9999999`, HeaderToken()).then(response => {
            setEmployeeList(response.data.data);
        });
    };

    const getEventCategory = () => {
        api.get(`api/event/category/list?page_size=9999999`, HeaderToken()).then(response => {
            setEventCategory(response.data.data);
        });
    };

    const filterEventCategoryBySector = (sectorIdentifier) => {
        api.get(`api/event/category/list?page_size=9999999&sector=${sectorIdentifier}`, HeaderToken()).then(response => {
            setEventCategory(response.data.data);
        });
    }

    return (
        <Card className="p-4 mb-10">
            <Formik
                initialValues={{
                    action: "",
                    comment: "",
                    start: "",
                    end: "",
                    vehicle: "",
                    category: "",
                    line: "",
                    trip: "",
                    driver: "",
                    collector: "",
                    status: "",
                    sector: "",
                }}
                validationSchema={Schema}
                onSubmit={(values, { setSubmitting }) => {
                    api.post(
                        `api/adm/occurrences/new`,
                        {
                            ...values,
                            start: moment(values.start).format("DD/MM/YYYY HH:mm:ss"),
                            end: values.end === "" ? "" : moment(values.end).format("DD/MM/YYYY HH:mm:ss"),
                            category:
                                typeof values.category === "object" ? values.category.identifier : values.category,
                            line: typeof values.line === "object" ? values.line.identifier : values.line,
                            trip: typeof values.trip === "object" ? values.trip.identifier : values.trip,
                            driver:
                                typeof values.driver === "object" ? values.driver.identifier : values.driver,
                            collector:
                                typeof values.collector === "object" ? values.collector.identifier : values.collector,
                            status: typeof values.status === "object" ? values.status.identifier : values.status,
                            vehicle: typeof values.vehicle === "object" ? values.vehicle.identifier : values.vehicle,
                            sector: typeof values.sector === "object" ? values.sector.identifier : values.sector,
                        },
                        HeaderToken()
                    )
                        .then(response => {
                            toast.info("Ocorrência criada!");
                            setActionQuote(true);
                            setSubmitting(false);
                        })
                        .catch(error => {
                            Interceptor(error);
                            setSubmitting(false);
                        });
                }}>
                {({ handleChange, handleSubmit, isSubmitting, errors, values, touched, handleBlur, setFieldValue }) => (
                    <form onSubmit={handleSubmit}>
                        <h4 className="font-medium">Cadastro de Ocorrências</h4>
                        <div className="flex mt-4">
                            <div className="w-full md:w-3/12 pr-1 mb-6 md:mb-0">
                                <label className="block text-gray-700 text-sm font-medium">
                                    Data de ínicio
                                </label>
                                <DatePickerWithHour
                                    selected={values.start}
                                    className="appearance-none w-full block text-gray-700 border border-gray-300 py-2 px-4 focus:outline-none focus:bg-white"
                                    onChange={select => setFieldValue("start", select)}
                                />
                                <Error name="start" />
                            </div>
                            <div className="w-full md:w-3/12 pl-1 mb-6 md:mb-0">
                                <label className="block text-gray-700 text-sm font-medium">Setor</label>
                                <SelectStyle
                                    onChange={select => {
                                        if (select && select.value) {
                                            setFieldValue("sector", {
                                                description: select.label,
                                                identifier: select.value,
                                            });
                                            filterEventCategoryBySector(select.value);
                                            setFieldValue("category", {});
                                        } else {
                                            setFieldValue("sector", {});
                                            setFieldValue("category", {});
                                            setEventCategory([]);
                                        }
                                    }}
                                    name={"sector"}
                                    id={"sector"}
                                    value={
                                        values.sector !== undefined && {
                                            label: values.sector.description,
                                            value: values.sector.identifier,
                                        }
                                    }
                                    optionsMap={(() => {
                                        let options = [];
                                        sector.map(sector =>
                                            options.push({
                                                value: sector.identifier,
                                                label: sector.description,
                                            })
                                        );
                                        return options;
                                    })()}
                                />
                                {touched.sector && errors.sector && (
                                    <span className="text-red-600 text-sm mt-0">{errors.sector}</span>
                                )}
                            </div>
                            <div className="w-full md:w-3/12 pl-2 mb-6 md:mb-0">
                                <label className="block text-gray-700 text-sm font-medium">Categoria</label>
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
                                            label: values.category.description,
                                            value: values.category.identifier,
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
                                <Error name="category" />
                            </div>
                            <div className="w-full md:w-3/12 pl-2 mb-6 md:mb-0">
                                <label className="block text-gray-700 text-sm font-medium">Veículo</label>
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
                        </div>
                        <div className="flex justify-between mt-4">

                            <div className="md:w-3/12 pr-1">
                                <label className="block text-gray-700 text-sm font-medium">Motorista (Opcional)</label>
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
                            <div className="md:w-3/12 pl-1">
                                <label className="block text-gray-700 text-sm font-medium">Cobrador (Opcional)</label>
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
                                            value: values.collector.identifier,
                                        }
                                    }
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
                            <div className="w-full md:w-3/12 pl-2 mb-6 md:mb-0">
                                <label className="block text-gray-700 text-sm font-medium">Linha (Opcional)</label>
                                <SelectStyle
                                    onChange={select => {
                                        if (select && select.value) {
                                            setFieldValue("line", {
                                                label: select.label,
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
                                            label: values.line.label,
                                            value: values.line.identifier,
                                        }
                                    }
                                    optionsMap={(() => {
                                        let options = [];
                                        lineList.map(line =>
                                            options.push({
                                                label: line.label,
                                                value: line.identifier,
                                            })
                                        );
                                        return options;
                                    })()}
                                />
                                <Error name="line" />
                            </div>
                            <div className="w-full md:w-3/12 pl-2 mb-6 md:mb-0">
                                <label className="block text-gray-700 text-sm font-medium">Viagem (Opcional)</label>
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
                                            label: values.trip.label,
                                            value: values.trip.identifier,
                                        }
                                    }
                                    optionsMap={(() => {
                                        let options = [];
                                        tripList.map(trip =>
                                            options.push({
                                                value: trip.identifier,
                                                label: trip.line.label+" - "+moment(trip.starts_at).format("DD/MM/YYYY HH:mm:ss"),
                                            })
                                        );
                                        return options;
                                    })()}
                                />
                                <Error name="trip" />
                            </div>
                        </div>
                        <div className="flex justify-between mt-4">
                            <div className="w-full">
                                <div className="flex flex-wrap mb-5">
                                    <div className="w-1/2 pr-4">
                                        <label className="block text-gray-700 text-sm font-medium">Descrição</label>
                                        <textarea
                                            className="resize-none w-full border text-gray-700 rounded focus:outline-none focus:bg-white -mb-2 p-2"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            name="comment"
                                            value={values.comment}></textarea>
                                        {touched.comment && errors.comment && (
                                            <span className="text-red-600 text-sm mt-0">{errors.comment}</span>
                                        )}
                                    </div>
                                    <div className="w-1/2 pl-4">
                                        <label className="block text-gray-700 text-sm font-medium">Ação adotadas (Opcional)</label>
                                        <textarea
                                            className="resize-none w-full border text-gray-700 rounded focus:outline-none focus:bg-white -mb-2 p-2"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            name="action"
                                            value={values.action}></textarea>
                                        {touched.action && errors.action && (
                                            <span className="text-red-600 text-sm mt-0">{errors.action}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-wrap mb-5">
                                    <div className="w-full md:w-2/12 pr-3 mb-6 md:mb-0">
                                        <label className="block text-gray-700 text-sm font-medium">
                                            Data de término (Opcional)
                                        </label>
                                        <DatePickerWithHour
                                            selected={values.end}
                                            className="appearance-none w-full block text-gray-700 border border-gray-300 py-2 px-4 focus:outline-none focus:bg-white"
                                            onChange={select => setFieldValue("end", select)}
                                        />
                                        <Error name="end" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-between mt-8">
                            <p className="underline text-buslab">
                                <Link to="/occurrences">Listagem de ocorrências</Link>
                            </p>
                            {isSubmitting ? (
                                <div className="flex justify-end">
                                    <ClipLoader size={20} color={Colors.buslab} loading={true} />
                                </div>
                            ) : (
                                <ButtonDefault type="submit" title="Cadastrar" />
                            )}
                        </div>
                    </form>
                )}
            </Formik>
        </Card>
    );
};
export default NewOccurrence;
