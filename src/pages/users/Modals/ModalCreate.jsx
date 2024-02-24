import React from "react";
import ModalForm from "../../../components/Modais/ModalForm";
import { Formik } from "formik";
import api from "../../../services/api";
import { toast } from "react-toastify";
import ButtonDefault from "../../../components/Buttons/default/ButtonDefault";
import ClipLoader from "react-spinners/ClipLoader";
import Colors from "../../../assets/constants/Colors";
import Schema from "../Schema";
import NumberFormat from "react-number-format";
import HeaderToken from "../../../services/headerToken";
import { Error, Input } from "../../../components/Formik";
import SelectStyle from "../../../components/Select";

const ModalCreate = ({ modalPost, actionModalPost, getList, type, companyList }) => {
    return (
        <ModalForm
            overflow
            onClose={actionModalPost}
            show={modalPost}
            title={<h4 className="mt-6 mb-4">Cadastrar novo usuário</h4>}>
            <Formik
                initialValues={{
                    name: "",
                    email: "",
                    documentNumber: "",
                    password: "",
                    cellphone: "",
                    passwordConfirm: "",
                    company: "",
                }}
                validationSchema={Schema}
                onSubmit={(values, { setFieldError, setSubmitting }) => {
                    if (values.password === values.passwordConfirm) {
                        api.post(
                            `api/adm/user/${type}/new`,
                            {
                                ...values,
                                company:
                                    typeof values.company === "object"
                                        ? values.company.identifier
                                        : values.company,
                            },
                            HeaderToken()
                        )
                            .then(res => {
                                toast.info("Cadastro de usuário concluído com sucesso");
                                actionModalPost();
                                getList();
                            })
                            .catch(error => {
                                setSubmitting(false);
                                error.response &&
                                    error.response.data.errors.map(erro => {
                                        return toast.info(erro.message);
                                    });
                            });
                    } else {
                        setFieldError("password", "As senhas não coincidem");
                    }
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
                        <label className="block text-gray-700 text-sm font-medium ">Nome</label>
                        <Input onChange={handleChange} name="name" value={values.name} />

                        {touched.name && errors.name && (
                            <span className="text-red-600 text-sm">{errors.name}</span>
                        )}

                        <label className="block text-gray-700 text-sm font-medium mt-4">
                            Email
                        </label>
                        <Input
                            type="email"
                            onChange={handleChange}
                            name="email"
                            value={values.email}
                        />

                        {touched.email && errors.email && (
                            <span className="text-red-600 text-sm">{errors.email}</span>
                        )}

                        {type !== "system" && (
                            <>
                                <label className="block text-gray-700 text-sm font-medium mt-3">
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
                                <Error name="company" />
                            </>
                        )}

                        <label className="block text-gray-700 text-sm font-medium mt-4">CPF</label>
                        <NumberFormat
                            className="appearance-none block text-gray-700 border w-full border-gray-300 py-2 px-4 focus:outline-none"
                            type="text"
                            format="###.###.###-##"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            name="documentNumber"
                            value={values.documentNumber}
                        />
                        {touched.documentNumber && errors.documentNumber && (
                            <span className="text-red-600 text-sm">{errors.documentNumber}</span>
                        )}
                        <label className="block text-gray-700 text-sm font-medium mt-4">
                            Celular
                        </label>
                        <NumberFormat
                            className="appearance-none block text-gray-700 border w-full border-gray-300 py-2 px-4 focus:outline-none"
                            type="text"
                            format="(##) #####-####"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            name="cellphone"
                            value={values.cellphone}
                        />
                        {touched.cellphone && errors.cellphone && (
                            <span className="text-red-600 text-sm">{errors.cellphone}</span>
                        )}

                        <label className="block text-gray-700 text-sm font-medium mt-4">
                            Senha
                        </label>
                        <Input
                            type="password"
                            onChange={handleChange}
                            name="password"
                            value={values.password}
                        />
                        {touched.password && errors.password && (
                            <span className="text-red-600 text-sm">{errors.password}</span>
                        )}
                        <label className="block text-gray-700 text-sm font-medium mt-4">
                            Confirmar senha
                        </label>
                        <Input
                            type="password"
                            onChange={handleChange}
                            name="passwordConfirm"
                            value={values.passwordConfirm}
                        />
                        {touched.passwordConfirm && errors.passwordConfirm && (
                            <span className="text-red-600 text-sm">{errors.passwordConfirm}</span>
                        )}
                        {isSubmitting ? (
                            <div className="w-full mt-2">
                                <div className="flex justify-end ">
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
