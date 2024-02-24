import React, { useState, useEffect } from "react";
import Card from "../../components/Cards/Card";
import { Formik } from "formik";
import Back from "../../components/Back";
import { toast } from "react-toastify";
import api from "../../services/api";
import HeaderToken from "../../services/headerToken";
import ClipLoader from "react-spinners/ClipLoader";
import Colors from "../../assets/constants/Colors";
import {
    Pencil,
    Label,
    Information,
    InformationMask,
    LoadSave,
    Save,
} from "../../components/Details";
import Title from "../../components/Title";
import Interceptor from "../../services/interceptor";
import { Input } from "../../components/Formik";
import SelectStyle from "../../components/Select";
import NumberFormat from "react-number-format";
import moment from "moment";

import { notifyObdCurrent, activeSocket } from "../../services/socket";

const ShowObd = props => {
    const [load, setLoad] = useState(false);
    const [obd, setObd] = useState({});
    const [realtimeData, setRealtimeData] = useState({});
    const [obdCompany, setObdCompany] = useState({});
    const [obdCellphone, setObdCellpone] = useState({});
    const [companies, setCompanies] = useState([]);
    const [activeEdit, setActiveEdit] = useState();
    const [cellphoneList, setCellphoneList] = useState([]);
    const [lastDate, setLastDate] = useState([]);

    const getCompany = () => {
        api.get(`api/adm/company/list`, HeaderToken())
            .then(response => {
                setCompanies(response.data.data);
            })
            .catch(error => {
                setLoad(false);
                Interceptor(error);
            });
    };

    const getLastDate = () => {
        setLoad(true);
        api.get(`api/adm/obd/${props.match.params.identifier}/last-checkpoint`, HeaderToken())
            .then(response => {
                setLoad(false);
                setLastDate(response.data);            
            })
            .catch(error => {
                setLoad(false);
                Interceptor(error);
            });
    };

    const getCellphone = () => {
        api.get(`api/adm/cellphone/list/free?page_size=999999`, HeaderToken())
            .then(response => {
                setCellphoneList(response.data.data);
            })
            .catch(error => {
                setLoad(false);
                Interceptor(error);
            });
    };

    const getObd = () => {
        setLoad(true);
        api.get(`api/adm/obd/${props.match.params.identifier}/show`, HeaderToken())
            .then(response => {
                setLoad(false);
                setObd(response.data);
                setObdCellpone(response.data.cellphoneNumber);
                setObdCompany(response.data.company);
            })
            .catch(error => {
                setLoad(false);
                Interceptor(error);
            });
    };

    useEffect(() => {
        getObd();
        getCompany();
        getCellphone();
        getLastDate();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!obd || !obd.serial) {
            return;
        }

        const socket = activeSocket();

        notifyObdCurrent(obd.serial, socket, (err, data) => {
            setRealtimeData(JSON.parse(data));
        });

        return () => {
            socket.disconnect();
        };
    }, [obd]);

    const setInputActive = value => {
        setActiveEdit(value);
    };

    return (
        <>
            <Title title={"Detalhes do OBD"} crumbs={props.crumbs} />
            <Card>
                {load ? (
                    <div className="justify-center w-full">
                        <ClipLoader size={20} color={Colors.buslab} loading={true} />
                    </div>
                ) : (
                    <Formik
                        initialValues={{
                            cellphoneNumber: {
                                value: obdCellphone?.identifier,
                                label: obdCellphone?.number,
                            },
                            company: obdCompany,
                            serial: obd.serial,
                            version: obd.version,
                            status: obd.status,
                        }}
                        enableReinitialize={true}
                        onSubmit={(values, { setSubmitting }) => {
                            const aux = { ...values };

                            aux.cellphoneNumber = values.cellphoneNumber.value;

                            api.post(
                                `api/adm/obd/${obd.identifier}/edit`,
                                {
                                    ...aux,
                                    company:
                                        typeof values.company === "object"
                                            ? values.company.identifier
                                            : values.company,
                                },

                                HeaderToken()
                            )
                                .then(() => {
                                    toast.info("OBD editado com sucesso");
                                    setSubmitting(false);
                                    setInputActive("");
                                })
                                .catch(error => {
                                    setLoad(false);
                                    setSubmitting(false);
                                    Interceptor(error);
                                });
                        }}>
                        {({
                            handleChange,
                            handleSubmit,
                            isSubmitting,
                            values,
                            handleBlur,
                            setFieldValue,
                            onValueChange,
                            inputChangedHandler,
                        }) => (
                            <form onSubmit={handleSubmit}>
                                <div className="flex flex-wrap justify-between">
                                    <Back />
                                    <LoadSave isSubmitting={isSubmitting} />
                                </div>
                                <h3 className="font-light mb-1 mt-4">Informações gerais</h3>
                                <div className="lg:w-1/2 md:w-full sm:w-full xs:w-full bg-tablerow flex justify-center items-center">
                                    <Label description="Serial" />
                                    <div className="flex justify-between w-2/3">
                                        {activeEdit === "serial" ? (
                                            <>
                                                <Input
                                                    onChange={handleChange}
                                                    name="serial"
                                                    value={values.serial}
                                                />
                                                <Save handleSubmit={handleSubmit} />
                                            </>
                                        ) : (
                                            <>
                                                <Information description={values.serial} />
                                                <Pencil
                                                    setInputActive={() => setInputActive("serial")}
                                                />
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="lg:w-1/2 md:w-full sm:w-full xs:w-full flex justify-center items-center">
                                    <Label description="Versão" />
                                    <div className="flex justify-between w-2/3">
                                        {activeEdit === "version" ? (
                                            <>
                                                <Input
                                                    onChange={handleChange}
                                                    name="version"
                                                    value={values.version}
                                                />
                                                <Save handleSubmit={handleSubmit} />
                                            </>
                                        ) : (
                                            <>
                                                <Information description={values.version} />
                                                <Pencil
                                                    setInputActive={() => setInputActive("version")}
                                                />
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="lg:w-1/2 md:w-full sm:w-full xs:w-full bg-tablerow flex justify-center items-center">
                                    <Label description="Número de telefone" />
                                    <div className="flex justify-between w-2/3">
                                        {activeEdit === "cellphoneNumber" ? (
                                            <>
                                                <SelectStyle
                                                    onChange={select => {
                                                        if (select && select.value) {
                                                            setFieldValue("cellphoneNumber", {
                                                                ...select,
                                                                label: select.label.props.value,
                                                            });
                                                        } else {
                                                            setFieldValue("cellphoneNumber", {});
                                                        }
                                                    }}
                                                    name={"cellphoneNumber"}
                                                    id={"cellphoneNumber"}
                                                    value={values.cellphoneNumber}
                                                    optionsMap={(() => {
                                                        let options = [];
                                                        cellphoneList.map(cellphoneNumber =>
                                                            options.push({
                                                                value: cellphoneNumber.identifier,
                                                                label: (
                                                                    <NumberFormat
                                                                        disabled={isSubmitting}
                                                                        className="appearance-none w-full block text-gray-700  px-1 mt-1 mb-1 focus:outline-none"
                                                                        displayType={"text"}
                                                                        format="(##) #####-####"
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        name="number"
                                                                        value={
                                                                            cellphoneNumber.number
                                                                        }
                                                                    />
                                                                ),
                                                            })
                                                        );
                                                        return options;
                                                    })()}
                                                />
                                                <Save handleSubmit={handleSubmit} />
                                            </>
                                        ) : (
                                            <>
                                                <InformationMask
                                                    mask="(##) #####-####"
                                                    description={values.cellphoneNumber?.label}
                                                />
                                                <Pencil
                                                    setInputActive={() =>
                                                        setInputActive("cellphoneNumber")
                                                    }
                                                />
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="lg:w-1/2 md:w-full sm:w-full xs:w-full flex justify-center items-center">
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
                                                        let options = [
                                                            { label: "Selecione", value: "" },
                                                        ];
                                                        companies.map(company =>
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
                                                            : "-"
                                                    }
                                                />
                                                <Pencil
                                                    setInputActive={() => setInputActive("company")}
                                                />
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="lg:w-1/2 md:w-full sm:w-full xs:w-full bg-tablerow flex justify-center items-center">
                                    <Label description="Último pacote" />
                                    <div className="font-light text-14 text-c8 py-4 flex justify-between w-2/3">
                                        {lastDate ? moment(lastDate.date).format("DD/MM/YYYY - HH:mm:ss") : '-'}
                                    </div>
                                </div>
                                <div className="lg:w-1/2 md:w-full sm:w-full xs:w-full flex justify-center items-center">
                                    <Label description="Status" />
                                    <div className="font-light text-14 text-c8 py-4 flex justify-between w-2/3">
                                        {values.status == true ? "Alocado" : "Não alocado"}
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

export default ShowObd;