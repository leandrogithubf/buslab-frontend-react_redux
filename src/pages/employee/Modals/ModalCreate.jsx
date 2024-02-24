import React from "react";
import { Formik } from "formik";
import api from "../../../services/api";
import { toast } from "react-toastify";
import ModalForm from "../../../components/Modais/ModalForm";
import ButtonDefault from "../../../components/Buttons/default/ButtonDefault";
import ClipLoader from "react-spinners/ClipLoader";
import Colors from "../../../assets/constants/Colors";
import Schema from "../Schema";
import HeaderToken from "../../../services/headerToken";
import Interceptor from "../../../services/interceptor";
import SelectStyle from "../../../components/Select";
import { Error, Input } from "../../../components/Formik";
import NumberFormat from "react-number-format";
import ReactInputMask from "react-input-mask";

const ModalCreate = ({ modalPost, actionModalPost, getList, modalityList, companyList }) => {
    return (
        <ModalForm onClose={actionModalPost} show={modalPost} title={<h4 className="mb-4">Cadastro de colaborador</h4>}>
            <Formik
                initialValues={{
                    name: "",
                    modality: "",
                    code: "",
                    company: "",
                    cnh: "",
                    cnhExpiration: "",
                    cellphone: "",
                }}
                validationSchema={Schema}
                onSubmit={(values, { setSubmitting }) => {
                    api.post(
                        "api/adm/employee/new",
                        {
                            ...values,
                            modality:
                                typeof values.modality === "object" ? values.modality.identifier : values.modality,
                            company: typeof values.company === "object" ? values.company.identifier : values.company,
                        },
                        HeaderToken()
                    )
                        .then(res => {
                            setSubmitting(false);
                            actionModalPost();
                            getList();
                            toast.info("Cadastro de colaborador concluído!");
                        })
                        .catch(error => {
                            setSubmitting(false);
                            Interceptor(error);
                        });
                }}>
                {({ handleChange, handleSubmit, isSubmitting, errors, values, touched, handleBlur, setFieldValue }) => (
                    <form onSubmit={handleSubmit}>
                        <div className="flex">
                            <div className="w-1/2 pr-2">
                                <label className="block text-gray-700 text-sm font-medium mt-3">Nome</label>
                                <Input
                                    placeholder="Digite um nome"
                                    onChange={handleChange}
                                    name="name"
                                    value={values.name}
                                />
                                {touched.name && errors.name && (
                                    <span className="text-red-600 text-sm">{errors.name}</span>
                                )}
                            </div>
                            <div className="w-1/2 pl-2">
                                <label className="block text-gray-700 text-sm font-medium mt-3">Código</label>
                                <Input
                                    placeholder="Digite o código de identificação"
                                    onChange={handleChange}
                                    name="code"
                                    value={values.code}
                                />
                                <Error name="code" />
                            </div>
                        </div>
                        <div className="flex">
                            <div className="w-1/2 pr-2">
                                <label className="block text-gray-700 text-sm font-medium mt-3">Empresa</label>
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
                                <Error name="company" />
                            </div>
                            <div className="w-1/2 pl-2">
                                <label className="block text-gray-700 text-sm font-medium mt-3">Função</label>
                                <SelectStyle
                                    onChange={select => {
                                        if (select && select.value) {
                                            setFieldValue("modality", {
                                                description: select.label,
                                                identifier: select.value,
                                            });
                                        } else {
                                            setFieldValue("modality", {});
                                        }
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
                                        let options = [];

                                        modalityList.map(modality =>
                                            options.push({
                                                value: modality.identifier,
                                                label: modality.description,
                                            })
                                        );
                                        return options;
                                    })()}
                                />

                                <Error name="modality" />
                            </div>
                        </div>
                        <div className="flex">
                            <div className="w-1/2 pr-2">
                                <label className="block text-gray-700 text-sm font-medium mt-3">CNH</label>
                                <NumberFormat
                                    className="w-full text-gray-700 border border-gray-300 py-2 px-2 h-9 focus:outline-none rounded "
                                    type="text"
                                    format="###########"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    name="cnh"
                                    value={values.cnh}
                                />
                                {touched.cnh && errors.cnh && (
                                    <span classcnh="text-red-600 text-sm">{errors.cnh}</span>
                                )}
                            </div>
                            <div className="w-1/2 pl-2">
                                <label className="block text-gray-700 text-sm font-medium mt-3">Vencimento da CNH</label>
                                <NumberFormat
                                    className="w-full text-gray-700 border border-gray-300 py-2 px-2 h-9 focus:outline-none rounded "
                                    type="text"
                                    format="##/####"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    name="cnhExpiration"
                                    value={values.cnhExpiration}
                                />
                                {touched.cnhExpiration && errors.cnhExpiration && (
                                    <span className="text-red-600 text-sm">{errors.cnhExpiration}</span>
                                )}
                            </div>
                        </div>
                        <div className="flex">
                            <div className="w-1/2 pr-2">
                                <label className="block text-gray-700 text-sm font-medium mt-3">Celular</label>
                                <ReactInputMask
                                    className="appearance-none block text-gray-700 border border-gray-300 py-2 px-4 focus:outline-none w-full pr-2"
                                    type="text"
                                    mask="(99) 99999-9999"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    disabled={isSubmitting}
                                    name="cellphone"
                                    value={values.cellphone}
                                />
                                {touched.cellphone && errors.cellphone && (
                                    <span classcellphone="text-red-600 text-sm">{errors.cellphone}</span>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-end mt-3">
                            <div className="ml-4">
                                {isSubmitting ? (
                                    <div className="w-full">
                                        <div className="flex justify-end">
                                            <ClipLoader size={20} color={Colors.buslab} loading={true} />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <ButtonDefault className="mr-2" title="Cancelar" onClick={actionModalPost} />
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
