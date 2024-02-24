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
import { Input, Error } from "../../../components/Formik";
import SelectStyle from "../../../components/Select";
import NumberFormat from "react-number-format";

const ModalCreate = ({ modalPost, actionModalPost, getList, companyList, cellphoneList }) => {
    return (
        <ModalForm onClose={actionModalPost} show={modalPost} title={<h4 className="mt-6 mb-4">Cadastrar OBD</h4>}>
            <Formik
                initialValues={{
                    serial: "",
                    version: "",
                    cellphoneNumber: "",
                    company: "",
                }}
                validationSchema={Schema}
                onSubmit={(values, { setSubmitting }) => {
                    api.post(
                        "api/adm/obd/new",
                        {
                            ...values,
                            company: typeof values.company === "object" ? values.company.identifier : values.company,
                            cellphoneNumber:
                                typeof values.cellphoneNumber === "object"
                                    ? values.cellphoneNumber.identifier
                                    : values.cellphoneNumber,
                        },
                        HeaderToken()
                    )
                        .then(res => {
                            setSubmitting(false);
                            toast.info("Obd criado com sucesso");
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
                }}>
                {({ handleChange, handleSubmit, isSubmitting, errors, values, touched, handleBlur, setFieldValue }) => (
                    <form onSubmit={handleSubmit}>
                        <div className="flex">
                            <div className="w-1/2 pr-2">
                                <label className="block text-gray-700 text-sm font-medium mt-2">Serial</label>
                                <Input onChange={handleChange} name="serial" value={values.serial} />
                                <Error name="serial" />
                            </div>
                            <div className="w-1/2 pl-2">
                                <label className="block text-gray-700 text-sm font-medium mt-2">Versão</label>
                                <Input onChange={handleChange} name="version" value={values.version} />
                                <Error name="version" />
                            </div>
                        </div>
                        <div className="flex">
                            <div className="w-1/2 pr-2">
                                <label className="block text-gray-700 text-sm font-medium mt-3">
                                    Número de telefone
                                </label>
                                <SelectStyle
                                    onChange={select => {
                                        if (select && select.value) {
                                            setFieldValue("cellphoneNumber", {
                                                number: select.label,
                                                identifier: select.value,
                                            });
                                        } else {
                                            setFieldValue("cellphoneNumber", {});
                                        }
                                    }}
                                    name={"cellphoneNumber"}
                                    id={"cellphoneNumber"}
                                    value={
                                        values.cellphoneNumber !== undefined && {
                                            label: values.cellphoneNumber.number,
                                            value: values.cellphoneNumber.identifier,
                                        }
                                    }
                                    optionsMap={(() => {
                                        let options = [{ label: "Selecione", value: "" }];
                                        cellphoneList.map(cellphoneNumber =>
                                            options.push({
                                                value: cellphoneNumber.identifier,
                                                label: <NumberFormat
                                                    disabled={isSubmitting}
                                                    className="appearance-none w-full pr-0 text-gray-700 "
                                                    displayType={'text'}
                                                    format="(##) #####-####"
                                                    onChange={handleChange}
                                                    name="number"
                                                    value={cellphoneNumber.number}
                                                />,
                                            })
                                        );
                                        return options;
                                    })()}
                                />
                                <Error name="cellphoneNumber" />
                            </div>
                            <div className="w-1/2 pl-2">
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
                            </div>
                        </div>
                        <div className="flex justify-end pt-2">
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
                    </form>
                )}
            </Formik>
        </ModalForm>
    );
};

export default ModalCreate;
