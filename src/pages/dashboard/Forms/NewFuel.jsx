import React, { useState, useEffect } from "react";
import ButtonDefault from "../../../components/Buttons/default/ButtonDefault";
import Card from "../../../components/Cards/Card";
import { Formik } from "formik";
import { toast } from "react-toastify";
import HeaderToken from "../../../services/headerToken";
import Interceptor from "../../../services/interceptor";
import { Error } from "../../../components/Formik";
import CurrencyInput from "react-currency-input";
import { DatePickerPeriod } from "../../../components/Date/DatePickerPeriod";
import api from "../../../services/api";
import moment from "moment";
import Schema from "../../fuel/Schema";
import SelectStyle from "../../../components/Select";
import Colors from "../../../assets/constants/Colors";
import ClipLoader from "react-spinners/ClipLoader";

const NewFuel = () => {
    const [load, setLoad] = useState(false);
    const [companyList, setCompanyList] = useState([]);

    useEffect(() => {
        getCompany();
    }, []);

    const getCompany = () => {
        api.get(`api/adm/company/list?page_size=9999999`, HeaderToken()).then(response => {
            setCompanyList(response.data.data);
        });
    };

    return (
            <Formik
                initialValues={{
                    value: "",
                    date: "",
                    company: "",
                }}
                validationSchema={Schema}
                onSubmit={(values, { setSubmitting }) => {
                    api.post(
                        "api/adm/fuel-quote/new",
                        {
                            ...values,
                            date: moment(values.date).format("DD/MM/YYYY"),
                            company: typeof values.company === "object" ? values.company.identifier : values.company,
                        },
                        HeaderToken()
                    )
                        .then(response => {
                            toast.info("Cotação criada!");
                            setSubmitting(false);
                        })
                        .catch(error => {
                            Interceptor(error);
                            setSubmitting(false);
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
                                <label className="block text-gray-700 text-sm font-medium mt-3">Valor</label>
                                <CurrencyInput
                                    className="w-full text-gray-700 border border-gray-300 py-2 px-2 h-9 focus:outline-none rounded "
                                    type="text"
                                    decimalSeparator=","
                                    thousandSeparator="."
                                    precision="2"
                                    onChange={(maskedvalue, floatvalue, event) => {
                                        handleChange(event);
                                    }}
                                    onBlur={handleBlur}
                                    allowEmpty={true}
                                    value={values.value}
                                    name="value"
                                />
                                <Error name="value" />
                            </div>
                        </div>
                        <div className="flex">
                            <div className="w-full">
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
                                    <div className="flex justify-end">
                                        <ClipLoader size={20} color={Colors.buslab} loading={true} />
                                    </div>
                                ) : (
                                    <ButtonDefault type="submit" title="Cadastrar" />
                                )}
                            </div>
                        </div>
                    </form>
                )}
            </Formik>
    );
};
export default NewFuel;
