import React from "react";
import ModalForm from "../../../components/Modais/ModalForm";
import { Formik } from "formik";
import api from "../../../services/api";
import { toast } from "react-toastify";
import ButtonDefault from "../../../components/Buttons/default/ButtonDefault";
import ClipLoader from "react-spinners/ClipLoader";
import HeaderToken from "../../../services/headerToken";
import Schema from "../Schema";
import Colors from "../../../assets/constants/Colors";
import CurrencyInput from "react-currency-input";
import Interceptor from "../../../services/interceptor";
import SelectStyle from "../../../components/Select";
import { Input, Error } from "../../../components/Formik";
const ModalCreate = ({ modalPost, actionModalPost, getList, companyList }) => {
    return (
        <ModalForm onClose={actionModalPost} show={modalPost} title={<h4 className="mt-6 mb-4">Cadastrar Linha</h4>}>
            <Formik
                initialValues={{
                    code: "",
                    description: "",
                    direction: "",
                    passage: "",
                    company: "",
                    maxSpeed: "",
                }}
                validationSchema={Schema}
                onSubmit={(values, { setSubmitting }) => {
                    values.passage = parseFloat(values.passage.replace(/\./g, "").replace(",", "."));
                    api.post(
                        `api/adm/line/new`,
                        {
                            ...values,
                            company: typeof values.company === "object" ? values.company.identifier : values.company,
                        },
                        HeaderToken()
                    )
                        .then(res => {
                            actionModalPost();
                            getList();
                            toast.info("Cadastro de linha concluído!");
                        })
                        .catch(error => {
                            setSubmitting(false);
                            Interceptor(error);
                        });
                }}>
                {({ handleChange, handleSubmit, isSubmitting, errors, values, touched, handleBlur, setFieldValue }) => (
                    <form className="w-fill" onSubmit={handleSubmit}>
                        <div className="flex">
                            <div className="w-1/2 pr-2">
                                <label className="block text-gray-700 text-sm font-medium mt-2">Código da linha</label>
                                <Input placeholder="91B" onChange={handleChange} name="code" value={values.code} />
                                <Error name="code" />
                            </div>
                            <div className="w-1/2 pl-2">
                                <label className="block text-gray-700 text-sm font-medium mt-2">Nome</label>
                                <Input
                                    placeholder="ex. Terra Nova/Lagoinha"
                                    onChange={handleChange}
                                    name="description"
                                    value={values.description}
                                />
                                {touched.description && errors.description && (
                                    <span className="text-red-600 text-sm mt-0">{errors.description}</span>
                                )}
                            </div>
                        </div>
                        <div className="flex">
                            <div className="w-1/2 pr-2">
                                <label className="block text-gray-700 text-sm font-medium mt-2">Sentido</label>
                                <SelectStyle
                                    onChange={select => {
                                        if (select && select.value) {
                                            setFieldValue("direction", select.value);
                                        } else {
                                            setFieldValue("direction", '');
                                        }
                                    }}
                                    name={"direction"}
                                    id={"direction"}
                                    value={{
                                        value: values.direction,
                                        label:
                                            values.direction === "GOING"
                                                ? "Ida"
                                                : values.direction === ""
                                                ? ""
                                                : values.direction === "RETURN"
                                                ? "Volta"
                                                : "Circular",
                                    }}
                                    optionsMap={(() => {
                                        let options = [
                                            { label: "Ida", value: "GOING" },
                                            { label: "Volta", value: "RETURN" },
                                            { label: "Circular", value: "CIRCULATE" },
                                        ];

                                        return options;
                                    })()}
                                />
                                {touched.direction && errors.direction && (
                                    <span className="text-red-600 text-sm mt-0">{errors.direction}</span>
                                )}
                            </div>
                            <div className="w-1/2 pl-2">
                                <label className="block text-gray-700 text-sm font-medium mt-2">
                                    Valor da passagem
                                </label>
                                <CurrencyInput
                                    className="appearance-none w-full block text-gray-700 border border-gray-300 py-2 px-2 focus:outline-none h-8 rounded focus:bg-white"
                                    type="text"
                                    decimalSeparator=","
                                    thousandSeparator="."
                                    precision="2"
                                    onChangeEvent={event => {
                                        handleChange(event);
                                    }}
                                    onBlur={handleBlur}
                                    allowEmpty={true}
                                    value={values.passage}
                                    name="passage"
                                />
                                {touched.passage && errors.passage && (
                                    <span className="text-red-600 text-sm mt-0">{errors.passage}</span>
                                )}
                            </div>
                        </div>
                        <div className="flex">
                            <div className="w-1/2 pr-2">
                                <label className="block text-gray-700 text-sm font-medium mt-2">Limite de velocidade</label>
                                <CurrencyInput
                                    className="appearance-none w-full block text-gray-700 border border-gray-300 py-2 px-2 focus:outline-none h-8 rounded focus:bg-white"
                                    type="text"
                                    decimalSeparator=","
                                    thousandSeparator="."
                                    precision="0"
                                    onChangeEvent={event => {
                                        handleChange(event);
                                    }}
                                    onBlur={handleBlur}
                                    allowEmpty={true}
                                    name="maxSpeed"
                                    value={values.maxSpeed}
                                />
                                {touched.maxSpeed && errors.maxSpeed && (
                                    <span className="text-red-600 text-sm mt-0">{errors.maxSpeed}</span>
                                )}
                            </div>
                            <div className="w-1/2 pl-2">
                                <label className="block text-gray-700 text-sm font-medium mt-2">Empresa</label>
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
                                    <span className="text-red-600 text-sm mt-0">{errors.company}</span>
                                )}
                            </div>
                        </div>
                        {isSubmitting ? (
                            <div className="w-full mt-2 mb-2">
                                <div className="flex justify-end">
                                    <ClipLoader size={20} color={Colors.buslab} loading={true} />
                                </div>
                            </div>
                        ) : (
                            <ButtonDefault title="Salvar" type="submit" className="fa-pull-right mt-2 mb-2" />
                        )}
                    </form>
                )}
            </Formik>
        </ModalForm>
    );
};

export default ModalCreate;
