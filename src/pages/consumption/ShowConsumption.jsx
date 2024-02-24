import React, { useState, useEffect } from "react";
import Title from "../../components/Title";
import Card from "../../components/Cards/Card";
import Back from "../../components/Back";
import { toast } from "react-toastify";
import HeaderToken from "../../services/headerToken";
import api from "../../services/api";
import ClipLoader from "react-spinners/ClipLoader";
import { Label, Information, Pencil, LoadSave, Save } from "../../components/Details";
import Colors from "../../assets/constants/Colors";
import { Formik } from "formik";
import CurrencyInput from "react-currency-input";
import moment from "moment";
import Interceptor from "../../services/interceptor";
import SelectStyle from "../../components/Select";
import { DatePickerPeriod } from "../../components/Date/DatePickerPeriod";
const ShowConsumption = props => {
    const [load, setLoad] = useState(0);
    const [consumption, setConsumption] = useState([]);
    const [companyList, setCompanyList] = useState([]);
    const [activeEdit, setActiveEdit] = useState();

    useEffect(() => {
        getConsumption();
        getCompany();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getCompany = () => {
        api.get(`api/adm/company/list?page_size=9999999`, HeaderToken()).then(response => {
            setCompanyList(response.data.data);
        });
    };

    const getConsumption = () => {
        setLoad(true);
        api.get(`api/adm/consumption/${props.match.params.identifier}/show`, HeaderToken())
            .then(response => {
                setConsumption(response.data);
                setLoad(false);
            })
            .catch(error => {
                setLoad(false);
                Interceptor(error);
            });
    };

    const setInputActive = value => {
        setActiveEdit(value);
    };

    return (
        <>
            <Title title={"Detalhes da cotação de combustível"} crumbs={props.crumbs} />
            <Card>
                {load ? (
                    <div className="justify-center w-full">
                        <ClipLoader size={20} color={Colors.buslab} loading={true} />
                    </div>
                ) : (
                    <Formik
                        initialValues={{
                            consumption: consumption.consumption,
                            date: new Date(consumption.date),
                            company: consumption.company,
                        }}
                        enableReinitialize={true}
                        onSubmit={(values, { setSubmitting }) => {
                            api.post(
                                `api/adm/consumption/${props.match.params.identifier}/edit`,
                                {
                                    ...values,
                                    date: moment(values.date).format("DD/MM/YYYY"),
                                    company:
                                        typeof values.company === "object" ? values.company.identifier : values.company,
                                },
                                HeaderToken()
                            )
                                .then(() => {
                                    toast.info("Consumo editado com sucesso!");
                                    setSubmitting(false);
                                    setActiveEdit();
                                })
                                .catch(error => {
                                    setLoad(false);
                                    setSubmitting(false);
                                    Interceptor(error);
                                });
                        }}>
                        {({ handleChange, handleSubmit, values, handleBlur, setFieldValue, isSubmitting }) => (
                            <form onSubmit={handleSubmit}>
                                <div className="flex justify-between mb-2">
                                    <Back />
                                    <LoadSave isSubmitting={isSubmitting} />
                                </div>
                                <div className="flex flex-wrap">
                                    <div className="xs:w-full sm:w-full md:w-1/2 lg:w-1/2">
                                        <h2 className="mb-2 font-light">Informações gerais</h2>
                                        <div className="sm:w-full xs:w-full bg-tablerow flex justify-center items-center">
                                            <Label description="Valor" />
                                            <div className="flex justify-between w-2/3">
                                                {activeEdit === "consumption" ? (
                                                    <>
                                                        <CurrencyInput
                                                            className="appearance-none w-full block text-gray-700 border border-gray-300 py-2 px-2 focus:outline-none h-8 rounded focus:bg-white"
                                                            type="text"
                                                            disabled={isSubmitting}
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
                                                        <Save handleSubmit={handleSubmit} />
                                                    </>
                                                ) : (
                                                    <>
                                                        <Information description={values.consumption} />
                                                        <Pencil setInputActive={() => setInputActive("consumption")} />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="sm:w-full xs:w-full  flex justify-center items-center">
                                            <Label description="Data" />
                                            <div className="flex justify-between w-2/3">
                                                {activeEdit === "date" ? (
                                                    <>
                                                        <DatePickerPeriod
                                                            selected={values.date}
                                                            onChange={select => setFieldValue("date", select)}
                                                        />
                                                        <Save handleSubmit={handleSubmit} />
                                                    </>
                                                ) : (
                                                    <>
                                                        <Information
                                                            description={moment(values.date).format("DD/MM/YYYY")}
                                                        />
                                                        <Pencil setInputActive={() => setInputActive("date")} />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="sm:w-full xs:w-full bg-tablerow flex justify-center items-center">
                                            <Label description="Empresa" />
                                            <div className="flex justify-between w-2/3">
                                                {activeEdit === "company" ? (
                                                    <>
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
                                                        <Save handleSubmit={handleSubmit} />
                                                    </>
                                                ) : (
                                                    <>
                                                        <Information
                                                            description={
                                                                values.company !== undefined
                                                                    ? values.company.description
                                                                    : ""
                                                            }
                                                        />
                                                        <Pencil setInputActive={() => setInputActive("company")} />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        )}
                    </Formik>
                )}
            </Card>
        </>
    );
};

export default ShowConsumption;
