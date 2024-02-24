import React, { useState, useEffect } from "react";
import { isBefore } from "date-fns";
import NumberFormat from "react-number-format";
import CurrencyInput from "react-currency-input";
import { Formik } from "formik";
import ReactInputMask from "react-input-mask";

import api from "../../services/api";
import ButtonDefault from "../Buttons/default/ButtonDefault";
import Card from "../Cards/Card";
import HeaderToken from "../../services/headerToken";
import { LabelFullDefault } from "../Details";
import PeriodTabs from "./PeriodTabs";
import InputText from "./components/InputText";
import CardSelect from "./components/CardSelect";
import CalendarAndHour from "./components/CalendarAndHour";
import SelectDescription from "./Information/Selects/SelectDescription";
import { dateObjToString, dateToString } from "../../assets/utils/dates";
import { getSelectValues } from "../../assets/utils/format/formValues";

const SearchEngine = ({ type, setSearch, search, report }) => {
    const [initialSearch] = useState({ ...search });
    const [reset, setReset] = useState();
    const [period, setPeriod] = useState({ startsAt: search.startsAt, endsAt: search.endsAt });
    const [openTabTime, setOpenTabTime] = useState(
        Number(type.period) === 0 ? 0 : Number(type.period) || 1
    );
    const [obdList, setObdList] = useState([]);
    const [companyList, setCompanyList] = useState([]);
    const [collectorList, setCollectorList] = useState([]);
    const [driverList, setDriverList] = useState([]);
    const [vehicleList, setVehicleList] = useState([]);
    const [serialPrefixList, setSerialPrefixList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [sectorList, setSectorList] = useState([]);
    const [lineList, setLineList] = useState([]);
    const [brandList, setBrandList] = useState([]);
    const [modelList, setModelList] = useState([]);
    const [modalityEmployeeList, setModalityEmployeeList] = useState([]);
    const [collaboratorsList, setCollaboratorsList] = useState([]);
    const [occurrenceTypeList, setOccurrenceTypeList] = useState([]);
    const [cellphoneNumberList, setCellphoneNumberList] = useState([]);
    const [typeRef, setTypeRef] = useState(type);

    useEffect(() => {
        if (window.localStorage.getItem("session-role") === "ROLE_SYSTEM_ADMIN" && type.company) {
            getCompany();
        }
        if (type.obd) {
            getObd();
        }
        if (type.collector || type.driver) {
            getEmployee();
        }
        if (type.line) {
            getLine();
        }
        if (type.brand) {
            getBrand();
        }
        if (type.model) {
            getModel();
        }
        if (type.cellphoneNumber) {
            getCellphoneNumber();
        }
        if (type.vehicle) {
            getVehicle();
        }
        if (type.serialPrefix) {
            getSerialPrefix();
        }
        if (type.sector) {
            getSector();
        }
        if (type.modalityEmployee) {
            getModalityEmployee();
        }
        if (type.collaborators) {
            getCollaborators();
        }
        if (type.category) {
            getCategoryList();
        }
    }, [typeRef]);

    useEffect(() => {
        if (JSON.stringify(type) !== JSON.stringify(typeRef)) {
            setTypeRef(type);
        }
    }, [type]);

    const getLine = () => {
        api.get(`api/adm/line/list?page_size=9999999`, HeaderToken()).then(response => {
            setLineList(response.data.data);
        });
    };
    const getVehicle = () => {
        api.get(`api/adm/vehicle/list?page_size=9999999`, HeaderToken()).then(response => {
            setVehicleList(response.data.data);
        });
    };
    const getSerialPrefix = () => {
        api.get(`api/adm/vehicle/list?page_size=9999999`, HeaderToken()).then(response => {
            let options = [];
            response.data.data.map(data =>
                options.push({
                    identifier: data?.obd?.identifier ? data.obd.identifier : '-',
                    label: data.serialPrefix,
                })
            );
            setSerialPrefixList(options);
        });
    };
    const getSector = () => {
        api.get(`api/adm/sector/list?page_size=9999999`, HeaderToken()).then(response => {
            setSectorList(response.data.data);
        });
    };
    const getCellphoneNumber = () => {
        api.get(`api/adm/cellphone/list?page_size=9999999`, HeaderToken()).then(response => {
            setCellphoneNumberList(response.data.data);
        });
    };
    const getEmployee = () => {
        api.get(`api/adm/employee/list?page_size=9999999`, HeaderToken()).then(response => {
            let arrDriver = [];
            let arrCollector = [];
            response.data.data.forEach(response => {
                if (response.modality.description === "Motorista") {
                    arrDriver.push(response);
                } else {
                    arrCollector.push(response);
                }
            });
            setDriverList(arrDriver);
            setCollectorList(arrCollector);
        });
    };
    const getCollaborators = () => {
        api.get(`api/adm/employee/list?page_size=9999999`, HeaderToken()).then(response => {
            setCollaboratorsList(response.data.data);
        });
    };
    const getCompany = () => {
        api.get(`api/adm/company/list?page_size=9999999`, HeaderToken()).then(response => {
            setCompanyList(response.data.data);
        });
    };
    const getObd = () => {
        api.get(`api/adm/obd/list?page_size=9999999`, HeaderToken()).then(response => {
            setObdList(response.data.data);
        });
    };
    const getBrand = () => {
        api.get(`api/adm/vehicle/brand/list?page_size=9999999`, HeaderToken()).then(response => {
            setBrandList(response.data.data);
        });
    };
    const getModel = () => {
        api.get(`api/adm/vehicle/model/list?page_size=9999999`, HeaderToken()).then(response => {
            setModelList(response.data.data);
        });
    };
    const getModalityEmployee = () => {
        api.get(`api/adm/employee-modality/list?page_size=9999999`, HeaderToken()).then(
            response => {
                setModalityEmployeeList(response.data.data);
            }
        );
    };

    const getCategoryList = () => {
        api.get(`api/adm/event/list?page_size=9999999`, HeaderToken()).then(response => {
            setCategoryList(response.data.data.map(response => response.category));
        });
    };

    // event
    const getOccurrenceTypeBySector = e => {
        const value = e?.value;
        value &&
            api
                .get(`api/event/category/list?page_size=9999999&sector=${value}`, HeaderToken())
                .then(response => {
                    setOccurrenceTypeList(response.data.data);
                });
    };

    return (
        <Card>
            <Formik
                initialValues={{
                    brand: { value: "", label: "" },
                    cellphone: "",
                    cellphoneNumber: { value: "", label: "" },
                    city: "",
                    code: "",
                    collaborators: { value: "", label: "" },
                    collector: { value: "", label: "" },
                    company: { value: "", label: "" },
                    date: "",
                    event: { value: "", label: "" },
                    description: "",
                    descriptionName: "",
                    direction: { value: "", label: "" },
                    driver: { value: "", label: "" },
                    employeeCode: "",
                    line: { value: "", label: "" },
                    lineCode: "",
                    manufacturer: "",
                    modalityEmployee: { value: "", label: "" },
                    model: { value: "", label: "" },
                    name: "",
                    occurrenceType: { value: "", label: "" },
                    obd: { value: "", label: "" },
                    plate: "",
                    protocol: "",
                    sector: { value: "", label: "" },
                    category: { value: "", label: "" },
                    serial: "",
                    state: "",
                    value: "",
                    vehicle: { value: "", label: "" },
                    serialPrefix: { value: "", label: "" },
                    version: "",
                }}
                onSubmit={values => {
                    // some route need fields
                    let searchObject = Object.entries(getSelectValues(values)).reduce(
                        (acc, [key, value]) => {
                            if (type[key]) {
                                acc[key] = value || "";
                            }

                            return acc;
                        },
                        {}
                    );
                    if (type.period || type.period > -1) {
                        let { endsAt, startsAt, sequence } = period;
                        if (sequence && sequence.length > 0) {
                            searchObject = {
                                ...searchObject,
                                sequence,
                                start: null,
                                end: null,
                            };
                        } else if (startsAt && startsAt.toString() !== "Invalid Date") {
                            if (isBefore(endsAt, startsAt)) {
                                const aux = startsAt;
                                startsAt = endsAt;
                                endsAt = aux;
                                setPeriod({ ...period, startsAt, endsAt });
                            }
                            searchObject = {
                                ...searchObject,
                                sequence: null,
                                start: dateToString(startsAt) + " 00:01:00",
                                end: dateToString(endsAt) + " 23:59:00",
                            };
                        }
                    }
                    if (type.dateAndHour) {
                        let { startsAt, endsAt } = period;

                        if (isBefore(endsAt, startsAt)) {
                            const aux = startsAt;
                            startsAt = endsAt;
                            endsAt = aux;
                            setPeriod({ ...period, startsAt, endsAt });
                        }
                        searchObject = {
                            ...searchObject,
                            startsAt: dateObjToString(startsAt),
                            endsAt: dateObjToString(endsAt),
                        };
                    }
                    setSearch({
                        ...searchObject,
                    });
                    setReset(true);
                }}>
                {({ values, handleSubmit, setFieldValue, handleChange, resetForm }) => (
                    <form onSubmit={handleSubmit}>
                        <h2 className="mb-5 font-light">Filtro de busca</h2>
                        {type.period && (
                            <>
                                <LabelFullDefault description="Selecione o período" />
                                <PeriodTabs
                                    setPeriod={setPeriod}
                                    period={period}
                                    color="buslab"
                                    openTabTime={openTabTime}
                                    setOpenTabTime={setOpenTabTime}
                                />
                            </>
                        )}
                        {type.dateAndHour && (
                            <CalendarAndHour setPeriod={setPeriod} period={period} />
                        )}
                        <div className="flex flex-wrap">
                            {type.description && (
                                <CardSelect
                                    children={
                                        <>
                                            <LabelFullDefault description="Nome do modelo" />
                                            <InputText
                                                onChange={handleChange}
                                                type="text"
                                                name="description"
                                                value={values.description}
                                            />
                                        </>
                                    }
                                />
                            )}
                            {type.descriptionName && (
                                <CardSelect
                                    children={
                                        <>
                                            <LabelFullDefault description="Nome" />
                                            <InputText
                                                onChange={handleChange}
                                                type="text"
                                                name="descriptionName"
                                                value={values.descriptionName}
                                            />
                                        </>
                                    }
                                />
                            )}
                            {type.manufacturer && (
                                <CardSelect
                                    children={
                                        <>
                                            <LabelFullDefault description="Fabricante" />
                                            <InputText
                                                onChange={handleChange}
                                                type="text"
                                                name="manufacturer"
                                                value={values.manufacturer}
                                            />
                                        </>
                                    }
                                />
                            )}
                            {type.serial && (
                                <CardSelect
                                    children={
                                        <>
                                            <LabelFullDefault description="Serial" />
                                            <InputText
                                                onChange={handleChange}
                                                type="text"
                                                name="serial"
                                                value={values.serial}
                                            />
                                        </>
                                    }
                                />
                            )}
                            {type.version && (
                                <CardSelect
                                    children={
                                        <>
                                            <LabelFullDefault description="Versão" />
                                            <InputText
                                                onChange={handleChange}
                                                type="text"
                                                name="version"
                                                value={values.version}
                                            />
                                        </>
                                    }
                                />
                            )}
                            {type.cellphone && (
                                <CardSelect
                                    children={
                                        <>
                                            <LabelFullDefault description="Celular" />
                                            <ReactInputMask
                                                onChange={handleChange}
                                                value={values.cellphone}
                                                id="cellphone"
                                                className="w-full text-gray-700 border border-gray-300 py-2 px-2 h-9 focus:outline-none rounded "
                                                type="text"
                                                name="cellphone"
                                                mask="(99) 99999-9999"
                                            />
                                        </>
                                    }
                                />
                            )}
                            {type.employeeCode && (
                                <CardSelect
                                    children={
                                        <>
                                            <LabelFullDefault description="Código" />
                                            <InputText
                                                onChange={handleChange}
                                                type="text"
                                                name="employeeCode"
                                                value={values.employeeCode}
                                            />
                                        </>
                                    }
                                />
                            )}
                            {type.lineCode && (
                                <CardSelect
                                    children={
                                        <>
                                            <LabelFullDefault description="Código da Linha" />
                                            <InputText
                                                onChange={handleChange}
                                                type="text"
                                                name="lineCode"
                                                value={values.lineCode}
                                            />
                                        </>
                                    }
                                />
                            )}
                            {type.code && (
                                <CardSelect
                                    children={
                                        <>
                                            <LabelFullDefault description="Prefixo" />
                                            <InputText
                                                onChange={handleChange}
                                                type="text"
                                                name="code"
                                                value={values.code}
                                            />
                                        </>
                                    }
                                />
                            )}
                            {type.protocol && (
                                <CardSelect
                                    children={
                                        <>
                                            <LabelFullDefault description="Protocolo" />
                                            <InputText
                                                onChange={handleChange}
                                                type="text"
                                                name="protocol"
                                                value={values.protocol}
                                            />
                                        </>
                                    }
                                />
                            )}
                            {type.line && (
                                <CardSelect
                                    children={
                                        <>
                                            <LabelFullDefault description="Linha" />
                                            <SelectDescription
                                                name="line"
                                                type="label"
                                                setData={setFieldValue}
                                                data={values.line}
                                                list={lineList}
                                            />
                                        </>
                                    }
                                />
                            )}
                            {type.driver && (
                                <CardSelect
                                    children={
                                        <>
                                            <LabelFullDefault description="Motorista" />
                                            <SelectDescription
                                                name="driver"
                                                type="name"
                                                setData={setFieldValue}
                                                data={values.driver}
                                                list={driverList}
                                            />
                                        </>
                                    }
                                />
                            )}
                            {type.collector && (
                                <CardSelect
                                    children={
                                        <>
                                            <LabelFullDefault description="Cobrador" />
                                            <SelectDescription
                                                name="collector"
                                                type="name"
                                                setData={setFieldValue}
                                                data={values.collector}
                                                list={collectorList}
                                            />
                                        </>
                                    }
                                />
                            )}
                            {type.vehicle && (
                                <CardSelect
                                    children={
                                        <>
                                            <LabelFullDefault description="Veículo" />
                                            <SelectDescription
                                                name="vehicle"
                                                type="label"
                                                setData={setFieldValue}
                                                data={values.vehicle}
                                                list={vehicleList}
                                            />
                                        </>
                                    }
                                />
                            )}
                            {type.serialPrefix && (
                                <CardSelect
                                    children={
                                        <>
                                            <LabelFullDefault description="Veículo" />
                                            <SelectDescription
                                                name="serialPrefix"
                                                type="label"
                                                setData={setFieldValue}
                                                data={values.serialPrefix}
                                                list={serialPrefixList}
                                            />
                                        </>
                                    }
                                />
                            )}
                            {type.modalityEmployee && (
                                <CardSelect
                                    children={
                                        <>
                                            <LabelFullDefault description="Função" />
                                            <SelectDescription
                                                name="modalityEmployee"
                                                type="description"
                                                setData={setFieldValue}
                                                data={values.modalityEmployee}
                                                list={modalityEmployeeList}
                                            />
                                        </>
                                    }
                                />
                            )}
                            {type.collaborators && (
                                <CardSelect
                                    children={
                                        <>
                                            <LabelFullDefault description="Colaboradores" />
                                            <SelectDescription
                                                name="collaborators"
                                                type="name"
                                                setData={setFieldValue}
                                                data={values.collaborators}
                                                list={collaboratorsList}
                                            />
                                        </>
                                    }
                                />
                            )}
                            {type.plate && (
                                <CardSelect
                                    children={
                                        <>
                                            <LabelFullDefault description="Placa" />
                                            <ReactInputMask
                                                value={values.plate}
                                                onChange={handleChange}
                                                className="w-full text-gray-700 border border-gray-300 py-2 px-2 h-9 focus:outline-none rounded "
                                                type="text"
                                                mask="aaa-9#99"
                                                formatChars={{
                                                    "9": "[0-9]",
                                                    a: "[A-Za-z]",
                                                    "#": "[A-Fa-f0-9]",
                                                }}
                                                name="plate"
                                                id="plate"
                                            />
                                        </>
                                    }
                                />
                            )}
                            {type.brand && (
                                <CardSelect
                                    children={
                                        <>
                                            <LabelFullDefault description="Fabricante de Chassi" />
                                            <SelectDescription
                                                name="brand"
                                                type="description"
                                                setData={setFieldValue}
                                                data={values.brand}
                                                list={brandList}
                                            />
                                        </>
                                    }
                                />
                            )}
                            {type.model && (
                                <CardSelect
                                    children={
                                        <>
                                            <LabelFullDefault description="Modelo de Chassi" />
                                            <SelectDescription
                                                name="model"
                                                type="description"
                                                setData={setFieldValue}
                                                data={values.model}
                                                list={modelList}
                                            />
                                        </>
                                    }
                                />
                            )}
                            {type.direction && (
                                <CardSelect
                                    children={
                                        <>
                                            <LabelFullDefault description="Sentido" />
                                            <SelectDescription
                                                name="direction"
                                                type="description"
                                                setData={setFieldValue}
                                                data={values.direction}
                                                list={[
                                                    {
                                                        identifier: "GOING",
                                                        description: "Ida",
                                                    },
                                                    {
                                                        identifier: "RETURN",
                                                        description: "Volta",
                                                    },
                                                    {
                                                        identifier: "CIRCULATE",
                                                        description: "Circular",
                                                    },
                                                ]}
                                            />
                                        </>
                                    }
                                />
                            )}
                            {type.name && (
                                <CardSelect
                                    children={
                                        <>
                                            <LabelFullDefault description="Nome" />
                                            <InputText
                                                onChange={handleChange}
                                                type="text"
                                                name="name"
                                                value={values.name}
                                            />
                                        </>
                                    }
                                />
                            )}
                            {type.obd && (
                                <CardSelect
                                    children={
                                        <>
                                            <LabelFullDefault description="OBD" />
                                            <SelectDescription
                                                name="obd"
                                                type="serial"
                                                setData={setFieldValue}
                                                data={values.obd}
                                                list={obdList}
                                            />
                                        </>
                                    }
                                />
                            )}
                            {type.city && (
                                <CardSelect
                                    children={
                                        <>
                                            <LabelFullDefault description="Cidade" />
                                            <InputText
                                                onChange={handleChange}
                                                type="text"
                                                name="city"
                                                value={values.city}
                                            />
                                        </>
                                    }
                                />
                            )}
                            {type.state && (
                                <CardSelect
                                    children={
                                        <>
                                            <LabelFullDefault description="Estado" />
                                            <InputText
                                                onChange={handleChange}
                                                type="text"
                                                name="state"
                                                value={values.state}
                                            />
                                        </>
                                    }
                                />
                            )}
                            {type.cellphoneNumber && (
                                <CardSelect
                                    children={
                                        <>
                                            <LabelFullDefault description="Celular" />
                                            <SelectDescription
                                                name="cellphoneNumber"
                                                type="number"
                                                setData={setFieldValue}
                                                data={values.cellphoneNumber}
                                                list={cellphoneNumberList}
                                            />
                                        </>
                                    }
                                />
                            )}

                            {type.date && (
                                <CardSelect
                                    children={
                                        <>
                                            <LabelFullDefault description="Data" />
                                            <NumberFormat
                                                format="##/##/####"
                                                className="w-full text-gray-700 border border-gray-300 py-2 px-2 h-9 focus:outline-none rounded "
                                                id="date"
                                                name="date"
                                                value={values.date}
                                                onChange={handleChange}
                                            />
                                        </>
                                    }
                                />
                            )}
                            {type.value && (
                                <CardSelect
                                    children={
                                        <>
                                            <LabelFullDefault description="Valor" />
                                            <CurrencyInput
                                                className="w-full text-gray-700 border border-gray-300 py-2 px-2 h-9 focus:outline-none rounded "
                                                type="text"
                                                decimalSeparator=","
                                                thousandSeparator="."
                                                precision="2"
                                                allowEmpty={true}
                                                name="value"
                                                id="value"
                                                value={values.value}
                                                onChange={value => {
                                                    setFieldValue("value", value);
                                                }}
                                            />
                                        </>
                                    }
                                />
                            )}
                            {window.localStorage.getItem("session-role") === "ROLE_SYSTEM_ADMIN" &&
                                type.company && (
                                    <CardSelect
                                        children={
                                            <>
                                                <LabelFullDefault description="Empresa" />
                                                <SelectDescription
                                                    name="company"
                                                    type="description"
                                                    setData={setFieldValue}
                                                    data={values.company}
                                                    list={companyList}
                                                />
                                            </>
                                        }
                                    />
                                )}
                            {type.sector && (
                                <CardSelect
                                    children={
                                        <>
                                            <LabelFullDefault description="Setor da ocorrência" />
                                            <SelectDescription
                                                name="sector"
                                                type="description"
                                                setData={setFieldValue}
                                                data={values.sector}
                                                list={sectorList}
                                                onChange={e => {
                                                    setFieldValue("occurrenceType", { value: "" });
                                                    if (type.occurrenceType) {
                                                        getOccurrenceTypeBySector(e);
                                                    }
                                                }}
                                            />
                                        </>
                                    }
                                />
                            )}
                            {type.category && (
                                <CardSelect
                                    children={
                                        <>
                                            <LabelFullDefault description="Categoria do evento" />
                                            <SelectDescription
                                                name="category"
                                                type="description"
                                                setData={setFieldValue}
                                                data={values.category}
                                                list={categoryList}
                                            />
                                        </>
                                    }
                                />
                            )}
                            {type.occurrenceType && (
                                <CardSelect
                                    children={
                                        <>
                                            <LabelFullDefault description="Categoria da ocorrência" />
                                            <SelectDescription
                                                name="occurrenceType"
                                                type="description"
                                                setData={setFieldValue}
                                                data={values.occurrenceType}
                                                list={occurrenceTypeList}
                                            />
                                        </>
                                    }
                                />
                            )}
                        </div>
                        {/*{report ? (
                            <div className="flex justify-between border-t-2 mt-5 pt-4">
                                <div className="px-3 flex flex-wrap w-2/3">
                                    <div className="w-full md:w-1/3 lg:w-1/3 ">
                                        <div className="checkbox-container">
                                            <label className="checkbox-label">
                                                <input type="checkbox" />
                                                <span className="checkbox-custom rectangular"></span>
                                            </label>
                                            <div className="ml-8 text-c7-14 text-14">Consumo de combustível</div>
                                        </div>
                                    </div>
                                    <div className="w-full md:w-1/3 lg:w-1/3 ">
                                        <div className="checkbox-container">
                                            <label className="checkbox-label">
                                                <input type="checkbox" />
                                                <span className="checkbox-custom rectangular"></span>
                                            </label>
                                            <div className="ml-8 text-c7-14 text-14">Histórico de Veículos</div>
                                        </div>
                                    </div>
                                    <div className="w-full md:w-1/3 lg:w-1/3 ">
                                        <div className="checkbox-container">
                                            <label className="checkbox-label">
                                                <input type="checkbox" />
                                                <span className="checkbox-custom rectangular"></span>
                                            </label>
                                            <div className="ml-8 text-c7-14 text-14">Tempo de viagem</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-1/3 text-right">
                                    <ButtonDefault title={"Gerar relatórios"} type="submit" />
                                </div>
                            </div>
                        ) : (*/}

                        <div className="text-right border-t-2 mt-5 pt-4">
                            {reset && (
                                <ButtonDefault
                                    className="px-8 mr-2 bg-vermelho"
                                    title={"Limpar Filtros"}
                                    onClick={() => {
                                        resetForm();
                                        setSearch({ ...initialSearch });
                                        setOpenTabTime(
                                            type.period === 0 ? 0 : Number(type.period) || 1
                                        );
                                        setPeriod({
                                            startsAt: initialSearch.startsAt,
                                            endsAt: initialSearch.endsAt,
                                        });
                                        setReset();
                                    }}
                                    type="button"
                                />
                            )}
                            <ButtonDefault className="px-8" title={"Filtrar"} type="submit" />
                        </div>
                        {/*)}*/}
                    </form>
                )}
            </Formik>
        </Card>
    );
};

export default SearchEngine;
