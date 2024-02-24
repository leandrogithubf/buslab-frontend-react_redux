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
import { Input, Error } from "../../../components/Formik";
const ModalCreate = ({ modalPost, actionModalPost, getList, vehicleList, modalityList, categoryList, statusList }) => {
    return (
        <ModalForm onClose={actionModalPost} show={modalPost} title={<h4 className="mb-3">Cadastro de evento</h4>}>
            <Formik
                initialValues={{
                    comment: "",
                    start: "",
                    end: "",
                    vehicle: "", 
                    category: "",
                    status: "",
                }}
                validationSchema={Schema}
                onSubmit={(values, { setSubmitting }) => {
                    api.post(
                        `api/adm/event/new`,
                        {
                            ...values,
                            start: moment(values.start).format("DD/MM/YYYY HH:mm:ss"),
                            end: moment(values.end).format("DD/MM/YYYY HH:mm:ss"),
                            category:
                                typeof values.category === "object" ? values.category.identifier : values.category,
                            modality:
                                typeof values.modality === "object" ? values.modality.identifier : values.modality,
                            status: typeof values.status === "object" ? values.status.identifier : values.status,
                            vehicle: typeof values.vehicle === "object" ? values.vehicle.identifier : values.vehicle,
                        },
                        HeaderToken()
                    )
                        .then(response => {
                            toast.info("Evento criado!");
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
                        <label className="block text-gray-700 text-sm font-medium">Descrição</label>
                        <Input type="textarea" onChange={handleChange} name="comment" value={values.comment} />
                        {touched.comment && errors.comment && (
                            <span className="text-red-600 text-sm mt-0">{errors.comment}</span>
                        )}
                        <div className="flex mt-4">
                            <div className="w-1/2 pr-2">
                                <label className="block text-gray-700 text-sm font-medium">Data de ínicio</label>
                                <DatePickerWithHour
                                    selected={values.start}
                                    className="appearance-none w-full block text-gray-700 border border-gray-300 py-2 px-4 focus:outline-none focus:bg-white"
                                    onChange={select => setFieldValue("start", select)}
                                />
                                <Error name="start" />
                            </div>
                            <div className="w-1/2 pl-2">
                                <label className="block text-gray-700 text-sm font-medium">Data de término</label>
                                <DatePickerWithHour
                                    selected={values.end}
                                    className="appearance-none w-full block text-gray-700 border border-gray-300 py-2 px-4 focus:outline-none focus:bg-white"
                                    onChange={select => setFieldValue("end", select)}
                                />
                                <Error name="end" />
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
                                <Error name="vehicle" />
                            </div>
                            <div className="w-1/2 pl-2">
                                <label className="block text-gray-700 text-sm font-medium">Selecione a categoria</label>
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
                                            label: values.category.description,
                                            value: values.category.identifier,
                                        }
                                    }
                                    optionsMap={(() => {
                                        let options = [{ label: "Selecione", value: "" }];

                                        categoryList.map(category =>
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
                        </div>
                        <div className="flex mt-4">
                            <div className="w-1/2 pr-2">
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
                                <Error name="status" />
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
