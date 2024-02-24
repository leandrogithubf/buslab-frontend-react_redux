import React from "react";
import { Formik } from "formik";
import { toast } from "react-toastify";

import api from "../../../services/api";
import ButtonDefault from "../../../components/Buttons/default/ButtonDefault";
import ClipLoader from "react-spinners/ClipLoader";
import Colors from "../../../assets/constants/Colors";
import { Schema } from "../Schema";
import HeaderToken from "../../../services/headerToken";
import NumberFormat from "react-number-format";
import ReactInputMask from "react-input-mask";
import CurrencyInput from "react-currency-input";
import SelectStyle from "../../../components/Select";
import ModalForm from "../../../components/Modais/ModalForm";
import { Input } from "../../../components/Formik";

const ModalCreate = ({ modalPost, actionModalPost, getList, modelList, obdList, companyList, statusList }) => {
    return (
        <ModalForm
            overflow
            onClose={actionModalPost}
            show={modalPost}
            title={<h4 className="mt-6 mb-4">Cadastro de Veículo</h4>}>
            <Formik
                initialValues={{
                    company: "",
                    obd: "",
                    prefix: "",
                    plate: "",
                    bodywork: "",
                    consumptionTarget: "",
                    startOperation: "",
                    model: "",
                    manufacture: "",
                    chassi: "",
                    manufactoreBodywork: "",
                    doorsNumber: "",
                    seats: "",
                    standing: "",
                    periodicInspection: "",
                    status: "",
                }}
                validationSchema={Schema}
                onSubmit={(values, { setSubmitting }) => {
                    api.post(
                        "api/adm/vehicle/new",
                        {
                            ...values,
                            model:
                                typeof values.model === "object"
                                    ? values.model.identifier
                                    : values.model,
                            company:
                                typeof values.company === "object"
                                    ? values.company.identifier
                                    : values.company,
                            obd:
                                typeof values.obd === "object" ? values.obd.identifier : values.obd,
                            status:
                                typeof values.status === "object" ? values.status.id : values.status,
                        },
                        HeaderToken()
                    )
                        .then(res => {
                            actionModalPost();
                            setSubmitting(false);
                            getList();
                            toast.info("Veículo cadastrado com sucesso!");
                        })
                        .catch(error => {
                            setSubmitting(false);
                            error.response &&
                                error.response.data.errors.map(erro => {
                                    return toast.info(erro.message);
                                });
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
                        <div className="flex">
                            <div className="w-1/2  pr-2">
                                <label className="block mt-3 text-gray-700 text-sm font-medium ">
                                    Prefixo
                                </label>

                                <Input
                                    placeholder="ex: 222"
                                    onChange={handleChange}
                                    name="prefix"
                                    value={values.prefix}
                                />
                                {touched.prefix && errors.prefix && (
                                    <span className="text-red-600 text-sm">{errors.prefix}</span>
                                )}
                            </div>
                            <div className="w-1/2 pl-2">
                                <label className="block mt-3 text-gray-700 text-sm font-medium ">
                                    Placa
                                </label>
                                <ReactInputMask
                                    className="w-full text-gray-700 border border-gray-300 py-2 px-2 h-9 focus:outline-none rounded "
                                    type="text"
                                    mask="aaa-9#99"
                                    onChange={handleChange}
                                    formatChars={{
                                        "9": "[0-9]",
                                        a: "[A-Za-z]",
                                        "#": "[A-Fa-f0-9]",
                                    }}
                                    onBlur={handleBlur}
                                    name="plate"
                                    value={values.plate}
                                />
                                {touched.plate && errors.plate && (
                                    <span className="text-red-600 text-sm">{errors.plate}</span>
                                )}
                            </div>
                        </div>
                        <div className="flex">
                            <div className="w-1/2  pr-2">
                                <label className="block mt-3 text-gray-700 text-sm font-medium ">
                                    Número do Chassi (opcional)
                                </label>
                                <ReactInputMask
                                    className="w-full text-gray-700 border border-gray-300 py-2 px-2 h-9 focus:outline-none rounded "
                                    type="text"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    name="chassi"
                                    value={values.chassi}
                                    maxLength="17"
                                />
                                {touched.chassi && errors.chassi && (
                                    <span className="text-red-600 text-sm">{errors.chassi}</span>
                                )}
                            </div>
                            <div className="w-1/2  pl-2">
                                <label className="block mt-3 text-gray-700 text-sm font-medium ">
                                    Ano do chassi (opcional)
                                </label>
                                <NumberFormat
                                    className="w-full text-gray-700 border border-gray-300 py-2 px-2 h-9 focus:outline-none rounded "
                                    type="text"
                                    format="####"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    name="manufacture"
                                    value={values.manufacture}
                                />
                                {touched.manufacture && errors.manufacture && (
                                    <span className="text-red-600 text-sm">
                                        {errors.manufacture}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex">
                            <div className="w-1/2  pr-2">
                                <label className="block mt-3 text-gray-700 text-sm font-medium ">
                                    Modelo do Chassi
                                </label>
                                <SelectStyle
                                    onChange={select => {
                                        if (select && select.value) {
                                            setFieldValue("model", {
                                                label: select.label,
                                                identifier: select.value,
                                            });
                                        } else {
                                            setFieldValue("model", {});
                                        }
                                    }}
                                    name={"model"}
                                    id={"model"}
                                    value={
                                        values.model !== undefined && {
                                            label: values.model.label,
                                            value: values.model.identifier,
                                        }
                                    }
                                    optionsMap={(() => {
                                        let options = [];
                                        modelList.map(model =>
                                            options.push({
                                                value: model.identifier,
                                                label: model.label,
                                            })
                                        );
                                        return options;
                                    })()}
                                />
                                {touched.model && errors.model && (
                                    <span className="text-red-600 text-sm">{errors.model}</span>
                                )}
                            </div>
                            <div className="w-1/2  pl-2">
                                <label className="block mt-3 text-gray-700 text-sm font-medium ">
                                    Modelo da Carroceria (opcional)
                                </label>
                                <Input
                                    onChange={handleChange}
                                    name="bodywork"
                                    value={values.bodywork}
                                />
                                {touched.bodywork && errors.bodywork && (
                                    <span className="text-red-600 text-sm">{errors.bodywork}</span>
                                )}
                            </div>
                        </div>
                        <div className="flex">
                            <div className="w-1/2  pr-2">
                                <label className="block mt-3 text-gray-700 text-sm font-medium ">
                                    Ano da Carroceria (opcional)
                                </label>
                                <NumberFormat
                                    className="w-full text-gray-700 border border-gray-300 py-2 px-2 h-9 focus:outline-none rounded "
                                    type="text"
                                    format="####"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    name="manufactoreBodywork"
                                    value={values.manufactoreBodywork}
                                />
                                {touched.manufactoreBodywork && errors.manufactoreBodywork && (
                                    <span className="text-red-600 text-sm">
                                        {errors.manufactoreBodywork}
                                    </span>
                                )}
                            </div>
                            <div className="w-1/2  pl-2">
                                <label className="block mt-3 text-gray-700 text-sm font-medium ">
                                    Número de portas (opcional)
                                </label>
                                <NumberFormat
                                    className="w-full text-gray-700 border border-gray-300 py-2 px-2 h-9 focus:outline-none rounded "
                                    type="text"
                                    format="####"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    name="doorsNumber"
                                    value={values.doorsNumber}
                                />
                                {touched.doorsNumber && errors.doorsNumber && (
                                    <span className="text-red-600 text-sm">
                                        {errors.doorsNumber}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex">
                            <div className="w-1/2  pr-2">
                                <label className="block mt-3 text-gray-700 text-sm font-medium ">
                                    Número de assentos
                                </label>

                                <Input
                                    placeholder=""
                                    onChange={handleChange}
                                    name="seats"
                                    value={values.seats}
                                />
                                {touched.seats && errors.seats && (
                                    <span className="text-red-600 text-sm">{errors.seats}</span>
                                )}
                            </div>
                            <div className="w-1/2 pl-2">
                                <label className="block mt-3 text-gray-700 text-sm font-medium ">
                                    Número de lugares em pé
                                </label>
                                <Input
                                    placeholder=""
                                    onChange={handleChange}
                                    name="standing"
                                    value={values.standing}
                                />
                                {touched.standing && errors.standing && (
                                    <span className="text-red-600 text-sm">{errors.standing}</span>
                                )}
                            </div>
                        </div>
                        <div className="flex">
                            <div className="w-1/2  pr-2">
                                <label className="block mt-3 text-gray-700 text-sm font-medium ">
                                    Meta de consumo (km/l)
                                </label>
                                <CurrencyInput
                                    className="w-full text-gray-700 border border-gray-300 py-2 px-2 h-9 focus:outline-none rounded "
                                    type="text"
                                    decimalSeparator="."
                                    precision="2"
                                    onChangeEvent={event => {
                                        handleChange(event);
                                    }}
                                    onBlur={handleBlur}
                                    allowEmpty={true}
                                    value={values.consumptionTarget}
                                    name="consumptionTarget"
                                />
                                {touched.consumptionTarget && errors.consumptionTarget && (
                                    <span className="text-red-600 text-sm">
                                        {errors.consumptionTarget}
                                    </span>
                                )}
                            </div>
                            <div className="w-1/2  pl-2">
                                <label className="block mt-3 text-gray-700 text-sm font-medium ">
                                    Início da operação (mm/aaaa)
                                </label>
                                <NumberFormat
                                    className="w-full text-gray-700 border border-gray-300 py-2 px-2 h-9 focus:outline-none rounded "
                                    type="text"
                                    format="##/####"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    name="startOperation"
                                    value={values.startOperation}
                                />
                                {touched.startOperation && errors.startOperation && (
                                    <span className="text-red-600 text-sm">
                                        {errors.startOperation}
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="flex">
                            <div className="w-1/2  pr-2">
                                <label className="block mt-3 text-gray-700 text-sm font-medium ">
                                    OBD
                                </label>
                                <SelectStyle
                                    onChange={select => {
                                        if (select && select.value) {
                                            setFieldValue("obd", {
                                                serial: select.label,
                                                identifier: select.value,
                                            });
                                        } else {
                                            setFieldValue("obd", {});
                                        }
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
                                        let options = [];
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
                                    <span className="text-red-600 text-sm">{errors.obd}</span>
                                )}
                            </div>
                            <div className="w-1/2  pl-2">
                                <label className="block mt-3 text-gray-700 text-sm font-medium ">
                                    Empresa
                                </label>
                                <SelectStyle
                                    onChange={select => {
                                        if (select && select.value) {
                                            setFieldValue("company", {
                                                description: select.label,
                                                identifier: select.value,
                                            });
                                        } else {
                                            setFieldValue("company", {});
                                        }
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
                                {touched.company && errors.company && (
                                    <span className="text-red-600 text-sm">{errors.company}</span>
                                )}
                            </div>
                        </div>
                        <div className="flex">
                            <div className="w-1/2  pr-2">
                                <label className="block mt-3 text-gray-700 text-sm font-medium ">
                                Última inspeção
                                </label>
                                <ReactInputMask
                                    className="w-full text-gray-700 border border-gray-300 py-2 px-2 h-9 focus:outline-none rounded "
                                    type="text"
                                    mask="99/99/9999"
                                    onChange={handleChange}
                                    formatChars={{
                                        "9": "[0-9]",
                                        a: "[A-Za-z]",
                                        "#": "[A-Fa-f0-9]",
                                    }}
                                    onBlur={handleBlur}
                                    name="periodicInspection"
                                    value={values.periodicInspection}
                                />
                                {touched.periodicInspection && errors.periodicInspection && (
                                    <span className="text-red-600 text-sm">{errors.periodicInspection}</span>
                                )}
                            </div>
                            <div className="w-1/2  pl-2">
                                <label className="block mt-3 text-gray-700 text-sm font-medium ">
                                    Status do veículo
                                </label>
                                <SelectStyle
                                    onChange={select => {
                                        if (select && select.value) {
                                            setFieldValue("status", {
                                                status: select.label,
                                                id: select.value,
                                            });
                                        } else {
                                            setFieldValue("status", {});
                                        }
                                    }}
                                    name={"status"}
                                    id={"status"}
                                    value={
                                        values.status !== undefined && {
                                            label: values.status.status,
                                            value: values.status.id,
                                        }
                                    }
                                    optionsMap={(() => {
                                        let options = [];
                                        statusList.map(status =>
                                            options.push({
                                                value: status.id,
                                                label: status.status,
                                            })
                                        );
                                        return options;
                                    })()}
                                />
                                {touched.status && errors.status && (
                                    <span className="text-red-600 text-sm">{errors.status}</span>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-end mt-3">
                            <div className="ml-4">
                                {isSubmitting ? (
                                    <div className="w-full">
                                        <div className="flex justify-end">
                                            <ClipLoader
                                                size={20}
                                                color={Colors.buslab}
                                                loading={true}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <ButtonDefault
                                            className="mr-2"
                                            title="Cancelar"
                                            onClick={actionModalPost}
                                        />
                                        <ButtonDefault title="Cadastrar" type="submit" />
                                    </>
                                )}
                            </div>
                        </div>
                    </form>
                )}
            </Formik>
        </ModalForm>
    );
};

export default ModalCreate;
