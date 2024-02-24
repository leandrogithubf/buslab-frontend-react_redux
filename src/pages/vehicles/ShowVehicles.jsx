import React, { useState, useEffect } from "react";
import Title from "../../components/Title";
import Card from "../../components/Cards/Card";
import Back from "../../components/Back";
import HeaderToken from "../../services/headerToken";
import api from "../../services/api";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import Colors from "../../assets/constants/Colors";
import { Formik } from "formik";
import { Label, Information, Pencil, LoadSave, Save } from "../../components/Details";
import NumberFormat from "react-number-format";
import moment from "moment";
import Interceptor from "../../services/interceptor";
import ReactInputMask from "react-input-mask";
import CurrencyInput from "react-currency-input";
import SelectStyle from "../../components/Select";
import { Input } from "../../components/Formik";
const ShowVehicles = props => {
    const [load, setLoad] = useState(false);
    //const [loadOBDList, setLoadOBDList] = useState(false);
    const [vehicle, setVehicle] = useState(false);
    const [modelList, setModelList] = useState(false);
    const [companyList, setCompanyList] = useState(false);
    const [obdList, setObdList] = useState(false);
    const [statusList, setStatusList] = useState(false);
    let [activeEdit, setActiveEdit] = useState();

    useEffect(() => {
        getVehicles();
        getModel();
        getCompany();
        getObd();
        getStatus();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getVehicles = () => {
        setLoad(true);
        api.get(`api/adm/vehicle/${props.match.params.identifier}/show`, HeaderToken())
            .then(response => {
                setVehicle(response.data);
                setLoad(false);
            })
            .catch(error => {
                Interceptor(error);
                setLoad(false);
            });
    };

    const getModel = () => {
        api.get(`api/adm/vehicle/model/list`, HeaderToken())
            .then(response => {
                setModelList(response.data.data);
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

    const getObd = () => {
        api.get(`api/adm/obd/list-free/?page_size=999999`, HeaderToken())
            .then(response => {
                setObdList(response.data.data);                               
            })
            .catch(error => {
                setLoad(false);
                Interceptor(error);
            });
    };

    const getStatus = () => {
        api.get(`api/adm/vehicle/status/list?page_size=999999`, HeaderToken())
            .then(response => {
                setStatusList(response.data.data);
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
            <Title title={"Detalhes do Veículo"} crumbs={props.crumbs} />
            <Card>
                {load ? (
                    <div className="justify-center w-full">
                        <ClipLoader size={20} color={Colors.buslab} loading={true} />
                    </div>
                ) : (
                    <Formik
                        initialValues={{
                            company: vehicle.company,
                            obd: vehicle.obd,
                            prefix: vehicle.prefix,
                            plate: vehicle.plate,
                            consumptionTarget: vehicle.consumptionTarget,
                            startOperation: moment(vehicle.startOperation).format("MM/YYYY"),
                            model: vehicle.model,
                            manufacture: vehicle.manufacture,
                            chassi: vehicle.chassi,
                            manufactoreBodywork: vehicle.manufactoreBodywork,
                            doorsNumber: vehicle.doorsNumber,
                            bodywork: vehicle.bodywork,
                            seats: vehicle.seats,
                            standing: vehicle.standing,
                            periodicInspection: vehicle.periodicInspection ? moment(vehicle.periodicInspection).format("DD/MM/YYYY") : "",
                            status: vehicle.status,
                        }}
                        enableReinitialize={true}
                        onSubmit={(values, { setSubmitting }) => {
                            api.post(
                                `/api/adm/vehicle/${props.match.params.identifier}/edit`,
                                {
                                    ...values,
                                    model: typeof values.model === "object" ? values.model.identifier : values.model,
                                    company:
                                        typeof values.company === "object" ? values.company.identifier : values.company,
                                    obd: typeof values.obd === "object" ? values.obd.identifier : values.obd,
                                    status: typeof values.status === "object" ? values.status.id : values.status,
                                },
                                HeaderToken()
                            )
                                .then(() => {
                                    toast.info("Veículo editado com sucesso!");
                                    setSubmitting(false);
                                    setInputActive("");
                                    window.location.reload();
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
                                <h2 className="mb-2 font-light">Informações gerais</h2>

                                <div className="flex flex-wrap">
                                    <div className="xs:w-full sm:w-full md:w-1/2 lg:w-1/2 pr-4">
                                        <div className="sm:w-full xs:w-full bg-tablerow flex justify-center items-center">
                                            <Label description="Empresa" />
                                            <div className="flex justify-between w-2/3">
                                                {" "}
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
                                            <Label description="Modelo do chassi" />
                                            <div className="flex justify-between w-2/3">
                                                {activeEdit === "model" ? (
                                                    <>
                                                        <SelectStyle
                                                            onChange={select => {
                                                                if (select && select.value) {
                                                                    setFieldValue("model", {
                                                                        description: select.label,
                                                                        identifier: select.value,
                                                                    });
                                                                } else {
                                                                    setFieldValue("model", {});
                                                                }
                                                            }}
                                                            name={"model"}
                                                            id={"model"}
                                                            value={
                                                                values.model !== undefined && {
                                                                    label: values.model.description,
                                                                    value: values.model.identifier,
                                                                }
                                                            }
                                                            optionsMap={(() => {
                                                                let options = [];
                                                                modelList.map(model =>
                                                                    options.push({
                                                                        value: model.identifier,
                                                                        label: model.description,
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
                                                                values.model !== undefined ? values.model.description : ""
                                                            }
                                                        />
                                                        <Pencil setInputActive={() => setInputActive("model")} />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="sm:w-full xs:w-full bg-tablerow flex justify-center items-center">
                                            <Label description="Ano do chassi" />
                                            <div className="flex justify-between w-2/3">
                                                {" "}
                                                {activeEdit === "manufacture" ? (
                                                    <>
                                                        <NumberFormat
                                                            disabled={isSubmitting}
                                                            className="appearance-none w-full block text-gray-700 border rounded  border-gray-300 px-1 focus:outline-none h-9 resize-none"
                                                            type="text"
                                                            format="####"
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            name="manufacture"
                                                            value={values.manufacture}
                                                        />
                                                        <Save handleSubmit={handleSubmit} />
                                                    </>
                                                ) : (
                                                    <>
                                                        <Information description={values.manufacture} />
                                                        <Pencil setInputActive={() => setInputActive("manufacture")} />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="sm:w-full xs:w-full flex justify-center items-center">
                                            <Label description="Prefixo" />
                                            <div className="flex justify-between w-2/3">
                                                {" "}
                                                {activeEdit === "prefix" ? (
                                                    <>
                                                        <Input
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            name="prefix"
                                                            value={values.prefix}
                                                        />
                                                        <Save handleSubmit={handleSubmit} />
                                                    </>
                                                ) : (
                                                    <>
                                                        <Information description={values.prefix} />
                                                        <Pencil setInputActive={() => setInputActive("prefix")} />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="sm:w-full xs:w-full bg-tablerow flex justify-center items-center">
                                            <Label description="Placa" />
                                            <div className="flex justify-between w-2/3">
                                                {" "}
                                                {activeEdit === "plate" ? (
                                                    <>
                                                        <ReactInputMask
                                                            disabled={isSubmitting}
                                                            className="appearance-none w-full block text-gray-700 border rounded  border-gray-300 px-1 focus:outline-none h-9 resize-none"
                                                            type="text"
                                                            mask="aaa-9#99"
                                                            onChange={handleChange}
                                                            name="plate"
                                                            formatChars={{
                                                                "9": "[0-9]",
                                                                "a": "[A-Za-z]",
                                                                "#": "[A-Fa-f0-9]",
                                                            }}
                                                            value={values.plate}
                                                        />
                                                        <Save handleSubmit={handleSubmit} />
                                                    </>
                                                ) : (
                                                    <>
                                                        <Information description={values.plate} />
                                                        <Pencil setInputActive={() => setInputActive("plate")} />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="sm:w-full xs:w-full flex justify-center items-center">
                                            <Label description="Número do Chassi" />
                                            <div className="flex justify-between w-2/3">
                                                {" "}
                                                {activeEdit === "chassi" ? (
                                                    <>
                                                        <Input
                                                            onChange={handleChange}
                                                            name="chassi"
                                                            value={values.chassi}
                                                            maxLength="17"
                                                        />
                                                        <Save handleSubmit={handleSubmit} />
                                                    </>
                                                ) : (
                                                    <>
                                                        <Information
                                                            description={
                                                                values.chassi ? values.chassi : "Sem chassi definido"
                                                            }
                                                        />
                                                        <Pencil setInputActive={() => setInputActive("chassi")} />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="sm:w-full xs:w-full bg-tablerow flex justify-center items-center">
                                            <Label description="Ano da carroceria" />
                                            <div className="flex justify-between w-2/3">
                                                {" "}
                                                {activeEdit === "manufactoreBodywork" ? (
                                                    <>
                                                        <Input
                                                            onChange={handleChange}
                                                            name="manufactoreBodywork"
                                                            value={values.manufactoreBodywork}
                                                            maxLength="17"
                                                        />
                                                        <Save handleSubmit={handleSubmit} />
                                                    </>
                                                ) : (
                                                    <>
                                                        <Information
                                                            description={
                                                                values.manufactoreBodywork ? values.manufactoreBodywork : "Sem ano da carroceria definido"
                                                            }
                                                        />
                                                        <Pencil setInputActive={() => setInputActive("manufactoreBodywork")} />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="sm:w-full xs:w-full flex justify-center items-center">
                                            <Label description="OBD" />
                                            <div className="flex justify-between w-2/3">
                                                {activeEdit === "obd" ? (
                                                    <>
                                                        <SelectStyle
                                                            onChange={select => {
                                                                if (select && select.value) {
                                                                    setFieldValue("obd", {
                                                                        serial: select.label,
                                                                        identifier: select.value,
                                                                    });
                                                                } else {
                                                                    setFieldValue("obd", {});
                                                                }
                                                            }}
                                                            name={"obd"}
                                                            id={"obd"}
                                                            value={
                                                                values.obd !== undefined && {
                                                                    label: values.obd.serial,
                                                                    value: values.obd.identifier,
                                                                }
                                                            }
                                                            optionsMap={(() => {
                                                                let options = [];
                                                                if(obdList){
                                                                    obdList.map(obd =>
                                                                        options.push({
                                                                            value: obd.identifier,
                                                                            label: obd.serial,
                                                                        })
                                                                    );
                                                                }                                                                
                                                                return options;
                                                            })()}
                                                        />
                                                        <Save handleSubmit={handleSubmit} />
                                                    </>
                                                ) : (
                                                    <>
                                                        <Information
                                                            description={
                                                                values.obd !== undefined ? values.obd.serial : ""
                                                            }
                                                        />
                                                        <Pencil setInputActive={() => setInputActive("obd")} />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="xs:w-full sm:w-full md:w-1/2 lg:w-1/2 pl-4">
                                        <div className="sm:w-full xs:w-full bg-tablerow flex justify-center items-center">
                                            <Label description="Meta de consumo (km/l)" />
                                            <div className="flex justify-between w-2/3">
                                                {" "}
                                                {activeEdit === "consumptionTarget" ? (
                                                    <>
                                                        <CurrencyInput
                                                        className="appearance-none w-full block text-gray-700 border rounded  border-gray-300 px-1 focus:outline-none h-9 resize-none"
                                                        type="text"
                                                            decimalSeparator="."
                                                            precision="2"
                                                            onChangeEvent={event => {
                                                                handleChange(event);
                                                            }}
                                                            onBlur={handleBlur}
                                                            allowEmpty={true}
                                                            value={values.consumptionTarget}
                                                            name="consumptionTarget"
                                                        />
                                                        <Save handleSubmit={handleSubmit} />
                                                    </>
                                                ) : (
                                                    <>
                                                        <Information description={values.consumptionTarget} />
                                                        <Pencil
                                                            setInputActive={() => setInputActive("consumptionTarget")}
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="sm:w-full xs:w-full flex justify-center items-center">
                                            <Label description="Início da Operação" />
                                            <div className="flex justify-between w-2/3">
                                                {activeEdit === "startOperation" ? (
                                                    <>
                                                        <NumberFormat
                                                            disabled={isSubmitting}
                                                            className="appearance-none w-full block text-gray-700 border rounded  border-gray-300 px-1 focus:outline-none h-9 resize-none"
                                                            type="text"
                                                            format="##/####"
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            name="startOperation"
                                                            value={values.startOperation}
                                                        />
                                                        <Save handleSubmit={handleSubmit} />
                                                    </>
                                                ) : (
                                                    <>
                                                        <Information description={values.startOperation} />
                                                        <Pencil
                                                            setInputActive={() => setInputActive("startOperation")}
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="sm:w-full xs:w-full bg-tablerow flex justify-center items-center">
                                            <Label description="Número de portas" />
                                            <div className="flex justify-between w-2/3">
                                                {" "}
                                                {activeEdit === "doorsNumber" ? (
                                                    <>
                                                        <NumberFormat
                                                            className="w-full text-gray-700 border border-gray-300 py-2 px-2 h-9 focus:outline-none rounded "
                                                            type="text"
                                                            format="####"
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            name="doorsNumber"
                                                            value={values.doorsNumber}
                                                        />
                                                        <Save handleSubmit={handleSubmit} />
                                                    </>
                                                ) : (
                                                    <>
                                                        <Information
                                                            description={
                                                                values.doorsNumber ? values.doorsNumber : "Sem número de portas definido."
                                                            }
                                                        />
                                                        <Pencil setInputActive={() => setInputActive("doorsNumber")} />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="sm:w-full xs:w-full flex justify-center items-center">
                                            <Label description="Modelo da carroceria" />
                                            <div className="flex justify-between w-2/3">
                                                {" "}
                                                {activeEdit === "bodywork" ? (
                                                    <>
                                                        <Input
                                                            onChange={handleChange}
                                                            name="bodywork"
                                                            value={values.bodywork}
                                                        />
                                                        <Save handleSubmit={handleSubmit} />
                                                    </>
                                                ) : (
                                                    <>
                                                        <Information
                                                            description={
                                                                values.bodywork ? values.bodywork : "Sem modelo de carroceria definido"
                                                            }
                                                        />
                                                        <Pencil setInputActive={() => setInputActive("bodywork")} />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="sm:w-full xs:w-full flex bg-tablerow justify-center items-center">
                                            <Label description="Lugares sentados" />
                                            <div className="flex justify-between w-2/3">
                                                {" "}
                                                {activeEdit === "seats" ? (
                                                    <>
                                                        <Input
                                                            onChange={handleChange}
                                                            name="seats"
                                                            value={values.seats}
                                                        />
                                                        <Save handleSubmit={handleSubmit} />
                                                    </>
                                                ) : (
                                                    <>
                                                        <Information
                                                            description={
                                                                values.seats ? values.seats : "Sem valor cadastrado"
                                                            }
                                                        />
                                                        <Pencil setInputActive={() => setInputActive("seats")} />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="sm:w-full xs:w-full flex justify-center items-center">
                                            <Label description="Lugares em pé" />
                                            <div className="flex justify-between w-2/3">
                                                {" "}
                                                {activeEdit === "standing" ? (
                                                    <>
                                                        <Input
                                                            onChange={handleChange}
                                                            name="standing"
                                                            value={values.standing}
                                                        />
                                                        <Save handleSubmit={handleSubmit} />
                                                    </>
                                                ) : (
                                                    <>
                                                        <Information
                                                            description={
                                                                values.standing ? values.standing : "Sem valor cadastrado"
                                                            }
                                                        />
                                                        <Pencil setInputActive={() => setInputActive("standing")} />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="sm:w-full xs:w-full flex bg-tablerow  justify-center items-center">
                                            <Label description="Última inspeção" />
                                            <div className="flex justify-between w-2/3">
                                                {" "}
                                                {activeEdit === "periodicInspection" ? (
                                                    <>
                                                        <NumberFormat
                                                            disabled={isSubmitting}
                                                            className="appearance-none w-full block text-gray-700 border rounded  border-gray-300 px-1 focus:outline-none h-9 resize-none"
                                                            type="text"
                                                            format="##/##/####"
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            name="periodicInspection"
                                                            value={values.periodicInspection}
                                                        />
                                                        <Save handleSubmit={handleSubmit} />
                                                    </>
                                                ) : (
                                                    <>
                                                        <Information description={values.periodicInspection} />
                                                        <Pencil
                                                            setInputActive={() => setInputActive("periodicInspection")}
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="sm:w-full xs:w-full flex justify-center items-center">
                                            <Label description="Status do veículo" />
                                            <div className="flex justify-between w-2/3">
                                                {activeEdit === "status" ? (
                                                    <>
                                                        <SelectStyle
                                                            onChange={select => {
                                                                if (select && select.value) {
                                                                    setFieldValue("status", {
                                                                        status: select.label,
                                                                        id: select.value,
                                                                    });
                                                                } else {
                                                                    setFieldValue("status", {});
                                                                }
                                                            }}
                                                            name={"status"}
                                                            id={"status"}
                                                            value={
                                                                values.status !== undefined && {
                                                                    label: values.status.status,
                                                                    value: values.status.id,
                                                                }
                                                            }
                                                            optionsMap={(() => {
                                                                let options = [];
                                                                statusList.map(status =>
                                                                    options.push({
                                                                        value: status.id,
                                                                        label: status.status,
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
                                                                values.status !== undefined ? values.status.status : ""
                                                            }
                                                        />
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

export default ShowVehicles;
