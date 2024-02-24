import React, { useState, useEffect } from "react";
import Card from "../../components/Cards/Card";
import Title from "../../components/Title";
import api from "../../services/api";
import { toast } from "react-toastify";
import Colors from "../../assets/constants/Colors";
import ClipLoader from "react-spinners/ClipLoader";
import Back from "../../components/Back";
import { Formik } from "formik";
import NumberFormat from "react-number-format";
import { Label, Information, Pencil, InformationMask, LoadSave, Save } from "../../components/Details";
import HeaderToken from "../../services/headerToken";
import Interceptor from "../../services/interceptor";
import { Input } from "../../components/Formik";
import SelectStyle from "../../components/Select";

const ShowUser = props => {
    const [load, setLoad] = useState(false);
    const [user, setUser] = useState(false);
    const [companyList, setCompanyList] = useState(false);
    const [activeEdit, setActiveEdit] = useState();
    const [breadcrumbs, setBreadcrumbs] = useState([]);

    useEffect(() => {
        getUserDetail();
        getCompany();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getUserDetail = () => {
        setLoad(true);
        api.get(`api/adm/user/${props.match.params.id}/show`, HeaderToken())
            .then(response => {
                setUser(response.data);
                let crumbs = props.crumbs[props.crumbs.length - 1];
                crumbs["name"] = response.data.name;
                setBreadcrumbs([...props.crumbs]);
                setLoad(false);
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

    const setInputActive = value => {
        setActiveEdit(value);
    };

    return (
        <>
            <Title title={"Detalhes do usuário"} crumbs={breadcrumbs} />
            <Card>
                <>
                    {load ? (
                        <div className="justify-center w-full">
                            <ClipLoader size={20} color={Colors.buslab} loading={true} />
                        </div>
                    ) : (
                        <Formik
                            initialValues={{
                                name: user.name,
                                email: user.email,
                                cellphone: user.cellphone,
                                documentNumber: user.documentNumber,
                                company: user.company,
                            }}
                            enableReinitialize={true}
                            onSubmit={(values, { setSubmitting }) => {
                                api.post(
                                    `api/adm/user/${props.match.params.id}/edit`,
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
                                        toast.info("Usuário editado com sucesso");
                                        setSubmitting(false);
                                        setInputActive();
                                    })
                                    .catch(error => {
                                        setLoad(false);
                                        setSubmitting(false);
                                        error.response &&
                                            error.response.data.errors.map(erro => {
                                                return toast.info(erro.message);
                                            });
                                    });
                            }}>
                            {({ handleChange, handleSubmit, values, handleBlur, setFieldValue, isSubmitting }) => (
                                <form onSubmit={handleSubmit}>
                                    <div className="flex flex-wrap justify-between">
                                        <Back />
                                        <LoadSave isSubmitting={isSubmitting} />
                                    </div>
                                    <h3 className="font-light mb-1 mt-4">Informações gerais</h3>
                                    <div className="lg:w-2/3 md:w-full sm:w-full xs:w-full bg-tablerow flex justify-center">
                                        <Label description="Nome" />
                                        <div className="flex justify-between w-2/3 items-center">
                                            {activeEdit === "name" ? (
                                                <>
                                                    <Input
                                                        disabled={isSubmitting}
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
                                    <div className="lg:w-2/3 md:w-full sm:w-full xs:w-full flex justify-center">
                                        <Label description="Email" />
                                        <div className="flex justify-between w-2/3 items-center">
                                            {activeEdit === "email" ? (
                                                <>
                                                    <Input
                                                        disabled={isSubmitting}
                                                        onChange={handleChange}
                                                        name="email"
                                                        value={values.email}
                                                    />
                                                    <Save handleSubmit={handleSubmit} />
                                                </>
                                            ) : (
                                                <>
                                                    <Information description={values.email} />
                                                    <Pencil setInputActive={() => setInputActive("email")} />
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="lg:w-2/3 md:w-full sm:w-full xs:w-full bg-tablerow flex justify-center">
                                        <Label description="Celular" />
                                        <div className="flex justify-between w-2/3 items-center">
                                            {activeEdit === "cellphone" ? (
                                                <>
                                                    <NumberFormat
                                                        className="appearance-none w-full block text-gray-700 border rounded  border-gray-300 px-1 focus:outline-none h-9 resize-none"
                                                        type="text"
                                                        disabled={isSubmitting}
                                                        format="(##) #####-####"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        name="cellphone"
                                                        value={values.cellphone}
                                                    />
                                                    <Save handleSubmit={handleSubmit} />
                                                </>
                                            ) : (
                                                <>
                                                    <InformationMask
                                                        mask={"(##) #####-####"}
                                                        description={values.cellphone}
                                                    />
                                                    <Pencil setInputActive={() => setInputActive("cellphone")} />
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className="lg:w-2/3 md:w-full sm:w-full xs:w-full flex justify-center">
                                        <Label description="CPF" />
                                        <div className="flex justify-between w-2/3 items-center">
                                            {activeEdit === "documentNumber" ? (
                                                <>
                                                    <NumberFormat
                                                        className="appearance-none w-full block text-gray-700 border rounded  border-gray-300 px-1 focus:outline-none h-9  resize-none"
                                                        type="text"
                                                        format="###.###.###-##"
                                                        onChange={handleChange}
                                                        disabled={isSubmitting}
                                                        onBlur={handleBlur}
                                                        name="documentNumber"
                                                        value={values.documentNumber}
                                                    />
                                                    <Save handleSubmit={handleSubmit} />
                                                </>
                                            ) : (
                                                <>
                                                    <InformationMask
                                                        mask={"###.###.###-##"}
                                                        description={values.documentNumber}
                                                    />
                                                    <Pencil setInputActive={() => setInputActive("documentNumber")} />
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    {props.match.params.type !== "system" && (
                                        <>
                                            <div className="lg:w-2/3 md:w-full sm:w-full bg-tablerow xs:w-full flex justify-center">
                                                <Label description="Empresa" />
                                                <div className="flex justify-between w-2/3 items-center">
                                                    {activeEdit === "company" ? (
                                                        <>
                                                            <SelectStyle
                                                                onChange={select => {
                                                                    setFieldValue("company", {
                                                                        description: select.label,
                                                                        identifier: select.value,
                                                                    });
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
                                        </>
                                    )}
                                </form>
                            )}
                        </Formik>
                    )}
                </>
            </Card>
        </>
    );
};

export default ShowUser;
