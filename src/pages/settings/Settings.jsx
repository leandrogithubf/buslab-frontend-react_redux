/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Title from "../../components/Title";
import Card from "../../components/Cards/Card";
import Back from "../../components/Back";
import api from "../../services/api";
import HeaderToken from "../../services/headerToken";
import { Formik } from "formik";
import { Label } from "../../components/Details";
import Input from "../../components/Formik/Input";
import ButtonDefault from "../../components/Buttons/default/ButtonDefault";
import { toast } from "react-toastify";

const Settings = props => {
    const [parameters, setParameters] = useState([]);
    const [initialParameters, setInitialParameters] = useState([]);

    useEffect(() => {
        api.get(
            `/api/adm/company/${props.match.params.identifierCompany}/parameter-configuration/list`,
            HeaderToken()
        ).then(response => {
            let arrInitialParams = [];
            setParameters(response.data);
            Object.entries(response.data).map(parameter => {
                arrInitialParams = {
                    ...arrInitialParams,
                    [`min-${parameter[1].description}`]:
                        parameter[1]["minAllowed"] !== undefined ? parameter[1].minAllowed : "",
                };
                return (arrInitialParams = {
                    ...arrInitialParams,
                    [`max-${parameter[1].description}`]:
                        parameter[1]["maxAllowed"] !== undefined ? parameter[1].maxAllowed : "",
                });
            });

            setInitialParameters(arrInitialParams);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Title title={"Parâmetros do sistema"} crumbs={props.crumbs} />
            <Card>
                <Back />
                <h3 className="font-light mb-1 mt-3">Informações gerais</h3>
                <Formik
                    initialValues={initialParameters}
                    enableReinitialize={true}
                    onSubmit={(values, { setSubmitting }) => {
                        let arrParameters = [];
                        let arrBody = [];
                        Object.entries(values).map((value, index) => {
                            return Object.entries(parameters).map((parameter, index) => {
                                if (value[0] === `max-${parameter[1].description}`) {
                                    return (arrParameters[parameter[0]] = {
                                        ...arrParameters[parameter[0]],
                                        parameter: parameter[0],
                                        maxAllowed: value[1],
                                    });
                                }
                                if (value[0] === `min-${parameter[1].description}`) {
                                    return (arrParameters[parameter[0]] = {
                                        ...arrParameters[parameter[0]],
                                        parameter: parameter[0],
                                        minAllowed: value[1],
                                    });
                                }
                                return null;
                            });
                        });
                        Object.entries(arrParameters).map(parameter => {
                            return arrBody.push(parameter[1]);
                        });
                        api.post(
                            `/api/adm/company/${props.match.params.identifierCompany}/parameter-configuration/update`,
                            { values: arrBody },
                            HeaderToken()
                        )
                            .then(response => {
                                toast.info("Os parâmetros de configurações foram atualizados");
                                setSubmitting(false);
                            })
                            .catch(() => {
                                toast.info("Algo deu errado ao salvar as configurações");
                                setSubmitting(false);
                            });
                    }}>
                    {({ handleChange, handleSubmit, values, handleBlur, setFieldValue, isSubmitting }) => (
                        <form onSubmit={handleSubmit}>
                            {parameters &&
                                Object.entries(parameters).map((parameter, index) => {
                                    if(index < 3){
                                        return (
                                            <div key={parameter[1].identifier}>
                                                <div
                                                    className={`sm:w-full p-2 xs:w-full ${
                                                        index % 2 === 0 ? "bg-tablerow" : ""
                                                    } flex justify-center items-center`}>
                                                    <Label description={parameter[1].description} />
                                                    <div className="w-1/2 pr-2">
                                                        <Input
                                                            placeholder="valor mínimo"
                                                            onChange={handleChange}
                                                            name={`min-${parameter[1].description}`}
                                                        />
                                                    </div>
                                                    <div className="w-1/2 pl-2">
                                                        <Input
                                                            placeholder="valor máximo"
                                                            onChange={handleChange}
                                                            name={`max-${parameter[1].description}`}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }else{
                                        return (
                                            <div key={parameter[1].identifier}>
                                                <div
                                                    className={`sm:w-full p-2 xs:w-full ${
                                                        index % 2 === 0 ? "bg-tablerow" : ""
                                                    } flex justify-center items-center`}>
                                                    <Label description={parameter[1].description} />
                                                    <div className="w-1/4 pl-2">
                                                        <Input
                                                            placeholder="valor máximo"
                                                            onChange={handleChange}
                                                            name={`max-${parameter[1].description}`}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                    
                                })}
                            <div className="flex justify-end mt-4">
                                <ButtonDefault title="Salvar" type="submit" />
                            </div>
                        </form>
                    )}
                </Formik>
            </Card>
        </>
    );
};

export default Settings;
