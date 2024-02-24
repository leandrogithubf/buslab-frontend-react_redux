import React, { useState } from "react";
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
import { Input, Error } from "../../../components/Formik";
const ModalCreate = ({
    modalPost,
    actionModalPost,
    getList,
    vehicleList,
    sectorList,
    tripList,
    lineList,
    employeeList,
    categoryList,
}) => {
    const [filteredCategoryList, setFilteredCategoryList] = useState([]);
    const [load, setLoad] = useState(false);

    const filterCategoryBySector = sectorIdentifier => {
        setLoad(true);
        api.get(
            `api/event/category/list?page_size=9999999&sector=${sectorIdentifier}`,
            HeaderToken()
        ).then(response => {
            setFilteredCategoryList(response.data.data);
            setLoad(false);
        });
    };

    return (
        <ModalForm
            overflow
            onClose={actionModalPost}
            show={modalPost}
            title={<h4 className="mb-3">Cadastro de Ocorrências</h4>}>
            <Formik
                initialValues={{
                    comment: "",
                    action: "",
                    start: "",
                    end: "",
                    vehicle: "",
                    category: "",
                    line: "",
                    trip: "",
                    driver: "",
                    collector: "",
                    sector: "",
                }}
                validationSchema={Schema}
                onSubmit={(values, { setSubmitting }) => {
                    api.post(
                        `api/adm/occurrences/new`,
                        {
                            ...values,
                            start: moment(values.start).format("DD/MM/YYYY HH:mm:ss"),
                            end:
                                values.end === ""
                                    ? ""
                                    : moment(values.end).format("DD/MM/YYYY HH:mm:ss"),
                            category:
                                typeof values.category === "object"
                                    ? values.category.identifier
                                    : values.category,
                            vehicle:
                                typeof values.vehicle === "object"
                                    ? values.vehicle.identifier
                                    : values.vehicle,
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
                            line:
                                typeof values.line === "object"
                                    ? values.line.identifier
                                    : values.line,
                            sector:
                                typeof values.sector === "object"
                                    ? values.sector.identifier
                                    : values.sector,
                        },
                        HeaderToken()
                    )
                        .then(response => {
                            toast.info("Ocorrência criada!");
                            actionModalPost();
                            getList();
                        })
                        .catch(error => {
                            actionModalPost();
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
                        <div className="flex mt-4">
                            <div className="w-1/2 pr-2">
                                <label className="block text-gray-700 text-sm font-medium">
                                    Data de ínicio
                                </label>
                                <DatePickerWithHour
                                    selected={values.start}
                                    className="appearance-none w-full block text-gray-700 border border-gray-300 py-2 px-4 focus:outline-none focus:bg-white"
                                    onChange={select => setFieldValue("start", select)}
                                />
                                {touched.start && errors.start && (
                                    <span className="text-red-600 text-sm">{errors.start}</span>
                                )}
                            </div>
                            <div className="w-1/2 pl-2">
                                <label className="block text-gray-700 text-sm font-medium">
                                    Setor
                                </label>
                                <SelectStyle
                                    onChange={select => {
                                        if (select && select.value) {
                                            setFieldValue("sector", {
                                                description: select.label,
                                                identifier: select.value,
                                            });
                                            filterCategoryBySector(select.value);
                                            setFieldValue("category", {});
                                        } else {
                                            setFieldValue("sector", {});
                                            setFieldValue("category", {});
                                            setFilteredCategoryList([]);
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
                                        sectorList.map(sector =>
                                            options.push({
                                                value: sector.identifier,
                                                label: sector.description,
                                            })
                                        );
                                        return options;
                                    })()}
                                />
                                {touched.sector && errors.sector && (
                                    <span className="text-red-600 text-sm mt-0">
                                        {errors.sector}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex mt-4">
                            <div className="w-1/2 pr-2">
                                <label className="block text-gray-700 text-sm font-medium">
                                    Categoria{" "}
                                    {load && <ClipLoader size={12} color={Colors.buslab} />}
                                </label>
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
                                        if (
                                            filteredCategoryList &&
                                            filteredCategoryList.length > 0
                                        ) {
                                            filteredCategoryList.map(category =>
                                                options.push({
                                                    value: category.identifier,
                                                    label: category.description,
                                                })
                                            );
                                        }
                                        return options;
                                    })()}
                                />

                                {touched.category && errors.category && (
                                    <span className="text-red-600 text-sm mt-0">
                                        {errors.category}
                                    </span>
                                )}
                            </div>
                            <div className="w-1/2 pl-2">
                                <label className="block text-gray-700 text-sm font-medium">
                                    Veículo
                                </label>

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
                                {touched.vehicle && errors.vehicle && (
                                    <span className="text-red-600 text-sm mt-0">
                                        {errors.vehicle}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex mt-4">
                            <div className="w-1/2 pr-2">
                                <label className="block text-gray-700 text-sm font-medium">
                                    Motorista (Opcional)
                                </label>
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
                            <div className="w-1/2 pl-2">
                                <label className="block text-gray-700 text-sm font-medium">
                                    Cobrador (Opcional)
                                </label>
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
                        </div>
                        <div className="flex mt-4">
                            <div className="w-1/2 pr-2">
                                <label className="block text-gray-700 text-sm font-medium">
                                    Linha (Opcional)
                                </label>
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
                                                value: line.identifier,
                                                label: line.label,
                                            })
                                        );
                                        return options;
                                    })()}
                                />
                                {touched.line && errors.line && (
                                    <span className="text-red-600 text-sm mt-0">{errors.line}</span>
                                )}
                            </div>
                            <div className="w-1/2 pl-2">
                                <label className="block text-gray-700 text-sm font-medium">
                                    Viagem (Opcional)
                                </label>
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
                                    optionsMap={tripList
                                        .filter(trip => !!trip?.trip?.identifier)
                                        .map(trip => ({
                                            value: trip?.trip?.identifier,
                                            label:
                                                trip?.trip?.line?.label +
                                                " - " +
                                                moment(trip.starts_at).format(
                                                    "DD/MM/YYYY HH:mm:ss"
                                                ),
                                        }))}
                                />
                                {touched.trip && errors.trip && (
                                    <span className="text-red-600 text-sm mt-0">{errors.trip}</span>
                                )}
                            </div>
                        </div>
                        <div className="flex mt-4">
                            <div className="w-1/2 pr-2">
                                <label className="block text-gray-700 text-sm font-medium">
                                    Local
                                </label>
                                <Input
                                    placeholder="Digite o local da ocorrência"
                                    onChange={handleChange}
                                    name="name"
                                    value={values.name}
                                />
                                {touched.name && errors.name && (
                                    <span className="text-red-600 text-sm">{errors.name}</span>
                                )}
                            </div>
                        </div>
                        <br></br>
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

                        <label className="block text-gray-700 text-sm font-medium mt-4">
                            Ações adotadas (Opcional)
                        </label>
                        <textarea
                            className="resize-none w-full border text-gray-700 rounded focus:outline-none focus:bg-white -mb-2 p-2"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            name="action"
                            value={values.action}></textarea>
                        {touched.action && errors.action && (
                            <span className="text-red-600 text-sm mt-0">{errors.action}</span>
                        )}
                        <div className="flex mt-4">
                            <div className="w-1/2 pr-2">
                                <label className="block text-gray-700 text-sm font-medium">
                                    Data de término (Opcional)
                                </label>
                                {errors.end}
                                <DatePickerWithHour
                                    selected={values.end}
                                    className="appearance-none w-full block text-gray-700 border border-gray-300 py-2 px-4 focus:outline-none focus:bg-white"
                                    onChange={select => setFieldValue("end", select)}
                                />
                                {touched.end && errors.end && (
                                    <span className="text-red-600 text-sm">{errors.end}</span>
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
                            <ButtonDefault
                                title="Salvar"
                                type="submit"
                                className="fa-pull-right mb-2 mt-2"
                            />
                        )}
                    </form>
                )}
            </Formik>
        </ModalForm>
    );
};

export default ModalCreate;
