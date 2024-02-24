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
import CurrencyInput from "react-currency-input";
import { DatePickerPeriod } from "../../../components/Date/DatePickerPeriod";
import Interceptor from "../../../services/interceptor";
import SelectStyle from "../../../components/Select";
import moment from "moment";
import { Error } from "../../../components/Formik";
const ModalCreate = ({ modalPost, actionModalPost, getList, companyList }) => {
    return (
        <ModalForm onClose={actionModalPost} show={modalPost} title={<h4 className="mb-4">Consumo de combustível</h4>}>
            <Formik
                initialValues={{
                    consumption: "",
                    date: "",
                    company: "",
                }}
                validationSchema={Schema}
                onSubmit={(values, { setSubmitting }) => {
                    api.post(
                        "api/adm/consumption/new",
                        {
                            ...values,
                            date: moment(values.date).format("DD/MM/YYYY"),
                            company: typeof values.company === "object" ? values.company.identifier : values.company,
                        },
                        HeaderToken()
                    )
                        .then(res => {
                            getList();
                            toast.info("Consumo de combustível cadastrado!");
                            actionModalPost();
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
                                <label className="block text-gray-700 text-sm font-medium mt-3">Data</label>
                                <DatePickerPeriod
                                    selected={values.date}
                                    onChange={select => setFieldValue("date", select)}
                                />
                                <Error name="date" />
                            </div>
                            <div className="w-1/2 pl-2">
                                <label className="block text-gray-700 text-sm font-medium mt-3">Consumo</label>
                                <CurrencyInput
                                    className="w-full text-gray-700 border border-gray-300 py-2 px-2 h-9 focus:outline-none rounded "
                                    type="text"
                                    decimalSeparator="."
                                    precision="1"
                                    onChange={(maskedvalue, floatvalue, event) => {
                                        handleChange(event);
                                    }}
                                    onBlur={handleBlur}
                                    allowEmpty={true}
                                    value={values.consumption}
                                    name="consumption"
                                />
                                <Error name="consumption" />
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
