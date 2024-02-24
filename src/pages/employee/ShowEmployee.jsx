import React, { useState, useEffect } from "react";
import Title from "../../components/Title";
import Card from "../../components/Cards/Card";
import Back from "../../components/Back";
import { toast } from "react-toastify";
import HeaderToken from "../../services/headerToken";
import api from "../../services/api";
import ClipLoader from "react-spinners/ClipLoader";
import { Label, Information, InformationMask, Pencil, LoadSave, Save } from "../../components/Details";
import Colors from "../../assets/constants/Colors";
import { Formik } from "formik";
import Interceptor from "../../services/interceptor";
import SelectStyle from "../../components/Select";
import { Input } from "../../components/Formik";
import moment from "moment";
import NumberFormat from "react-number-format";
import ReactInputMask from "react-input-mask";

const ShowEmployee = props => {
    const [load, setLoad] = useState(0);
    const [employee, setEmployee] = useState([]);
    const [companyList, setCompanyList] = useState(false);
    const [modalityList, setModalityList] = useState(false);
    const [activeEdit, setActiveEdit] = useState();
    const [breadcrumbs, setBreadcrumbs] = useState([]);

    useEffect(() => {
        getEmployee();
        getCompany();
        getModalities();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getModalities = () => {
        api.get(`api/adm/employee-modality/list?page_size=9999999`, HeaderToken())
            .then(response => {
                setModalityList(response.data.data);
            })
            .catch(error => {
                setLoad(false);
                Interceptor(error);
            });
    };

    const getCompany = () => {
        api.get(`api/adm/company/list`, HeaderToken())
            .then(response => {
                setCompanyList(response.data.data);
            })
            .catch(error => {
                setLoad(false);
                Interceptor(error);
            });
    };
    const getEmployee = () => {
        setLoad(true);
        api.get(`api/adm/employee/${props.match.params.identifier}/show`, HeaderToken())
            .then(response => {
                setEmployee(response.data);
                let crumbs = props.crumbs[props.crumbs.length - 1];
                crumbs["name"] = response.data.name;
                crumbs["cnh"] = response.data.cnh;
                crumbs["cnhExpiration"] = response.data.cnhExpiration;
                crumbs["cellphone"] = response.data.cellphone;
                setBreadcrumbs([...props.crumbs]);
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
            <Title title={"Detalhes do Colaborador"} crumbs={breadcrumbs} />
            <Card>
                {load ? (
                    <div className="justify-center w-full">
                        <ClipLoader size={20} color={Colors.buslab} loading={true} />
                    </div>
                ) : (
                    <Formik
                        initialValues={{
                            name: employee.name,
                            code: employee.code,
                            modality: employee.modality,
                            company: employee.company,
                            cnh: employee.cnh,
                            cnhExpiration: moment(employee.cnhExpiration).format("MM/YYYY"),
                            cellphone: employee.cellphone,
                        }}
                        enableReinitialize={true}
                        onSubmit={(values, { setSubmitting }) => {
                            api.post(
                                `api/adm/employee/${props.match.params.identifier}/edit`,
                                {
                                    ...values,
                                    modality:
                                        typeof values.modality === "object"
                                            ? values.modality.identifier
                                            : values.modality,
                                    company:
                                        typeof values.company === "object" ? values.company.identifier : values.company,
                                },
                                HeaderToken()
                            )
                                .then(() => {
                                    toast.info("Colaborador editado com sucesso!");
                                    setSubmitting(false);
                                    setInputActive();
                                })
                                .catch(error => {
                                    setSubmitting(false);
                                    setLoad(false);
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
                                    <h2 className="mb-2 font-light">Informações gerais</h2>
                                </div>
                                <div className="flex flex-wrap">
                                    <div className="xs:w-full sm:w-full md:w-1/2 lg:w-1/2 pr-4">
                                        <div className="sm:w-full xs:w-full bg-tablerow flex justify-center items-center">
                                            <Label description="Nome" />
                                            <div className="flex justify-between w-2/3">
                                                {activeEdit === "name" ? (
                                                    <>
                                                        <Input
                                                            onChange={handleChange}
                                                            name="name"
                                                            value={values.name}
                                                        />
                                                        <Save handleSubmit={handleSubmit} />
                                                    </>
                                                ) : (
                                                    <>
                                                        <Information description={values.name} />
                                                        <Pencil setInputActive={() => setInputActive("name")} />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="sm:w-full xs:w-full flex justify-center items-center">
                                            <Label description="Código" />
                                            <div className="flex justify-between w-2/3">
                                                {activeEdit === "code" ? (
                                                    <>
                                                        <Input
                                                            onChange={handleChange}
                                                            name="code"
                                                            value={values.code}
                                                        />
                                                        <Save handleSubmit={handleSubmit} />
                                                    </>
                                                ) : (
                                                    <>
                                                        <Information description={values.code} />
                                                        <Pencil setInputActive={() => setInputActive("code")} />
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
                                        <div className="sm:w-full xs:w-full flex justify-center items-center">
                                            <Label description="Função" />
                                            <div className="flex justify-between w-2/3">
                                                {activeEdit === "modality" ? (
                                                    <>
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
                                                        <Save handleSubmit={handleSubmit} />
                                                    </>
                                                ) : (
                                                    <>
                                                        <Information
                                                            description={
                                                                values.modality !== undefined
                                                                    ? values.modality.description
                                                                    : ""
                                                            }
                                                        />
                                                        <Pencil setInputActive={() => setInputActive("modality")} />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="xs:w-full sm:w-full md:w-1/2 lg:w-1/2">
                                        <div className="sm:w-full xs:w-full bg-tablerow flex justify-center items-center">
                                            <Label description="CNH" />
                                            <div className="flex justify-between w-2/3">
                                                {activeEdit === "cnh" ? (
                                                    <>
                                                        <Input
                                                            onChange={handleChange}
                                                            name="cnh"
                                                            value={values.cnh}
                                                        />
                                                        <Save handleSubmit={handleSubmit} />
                                                    </>
                                                ) : (
                                                    <>
                                                        <Information description={values.cnh} />
                                                        <Pencil setInputActive={() => setInputActive("cnh")} />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="sm:w-full xs:w-full flex justify-center items-center">
                                            <Label description="Vencimento da CNH" />
                                            <div className="flex justify-between w-2/3">
                                                {activeEdit === "cnhExpiration" ? (
                                                    <>
                                                        <Input
                                                            onChange={handleChange}
                                                            name="cnhExpiration"
                                                            value={values.cnhExpiration}
                                                        />
                                                        <Save handleSubmit={handleSubmit} />
                                                    </>
                                                ) : (
                                                    <>
                                                        <Information description={values.cnhExpiration} />
                                                        <Pencil setInputActive={() => setInputActive("cnhExpiration")} />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="sm:w-full xs:w-full bg-tablerow flex justify-center items-center">
                                            <Label description="Celular" />
                                            <div className="flex justify-between w-2/3">
                                                {activeEdit === "cellphone" ? (
                                                    <>
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
                                                    <Save handleSubmit={handleSubmit} />
                                                </>
                                            ) : (
                                                <>
                                                    <InformationMask
                                                        mask="(##) #####-####"
                                                        description={values.cellphone} 
                                                    />
                                                    <Pencil setInputActive={() => setInputActive("cellphone")} />
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

export default ShowEmployee;
