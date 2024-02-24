/* eslint-disable no-cond-assign */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Formik } from "formik";
import { SketchPicker } from "react-color";
import ClipLoader from "react-spinners/ClipLoader";

import HeaderToken from "../../services/headerToken";
import Interceptor from "../../services/interceptor";
import api from "../../services/api";
import Colors from "../../assets/constants/Colors";
import trashSVG from "../../assets/svgs/trash.svg";
import "../../assets/styles/checkbox.css";
import Card from "../../components/Cards/Card";
import Title from "../../components/Title";
import Back from "../../components/Back";
import { Label, Information, Pencil, Save, LoadSave } from "../../components/Details";
import SelectStyle from "../../components/Select";
import { Input } from "../../components/Formik";
import Collapse from "../../components/Collapse";
import Paginate from "../../components/Paginate";
import ModalFence from "./Modals/ModalFence";
import CompanyMap from "./CompanyMap";

const yup = require("yup");

const schemaCompany = yup.object().shape({
    city: yup.string().required("O campo de cidade é obrigatório"),
});

const ShowCompanies = props => {
    const [mode, setMode] = useState("simple_select");
    const [load, setLoad] = useState(false);
    const [modalFence, setModalFence] = useState(false);
    const [company, setCompany] = useState(false);
    const [cityList, setCityList] = useState(false);
    const [stateList, setStateList] = useState(false);
    const [placeList, setPlaceList] = useState(false);
    const [activeEdit, setActiveEdit] = useState();
    const [breadcrumbs, setBreadcrumbs] = useState([]);
    const [openCollapse, setOpenCollapse] = useState("");
    const [vehicleList, setVehicleList] = useState([]);
    const [meta, setMeta] = useState({
        current_page: 1,
    });
    const [data, setData] = useState({});
    const [action, setAction] = useState(1);
    const [actionFence, setActionFence] = useState(false);

    useEffect(() => {
        getCompany();
        getState();
        getVehicles();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [action]);

    const getVehicles = () => {
        api.get(`/api/adm/company/${props.match.params.identifier}/vehicle/list`, HeaderToken())
            .then(response => {
                setLoad(false);
                setVehicleList(response.data.data);
                setMeta(response.data.meta);
            })
            .catch(error => {
                setLoad(false);
                Interceptor(error);
            });
        //TODO api de pontos vinculados a linha -> props.match.params.id
    };

    const getPlaces = () => {
        setLoad(true);
        api.get(`api/adm/company/${props.match.params.identifier}/place/list`, HeaderToken())
            .then(response => {
                setPlaceList(response.data.data);
                setData(
                    response.data.data.reduce(
                        (acc, fence) => ({
                            ...acc,
                            [`${fence.description}||${fence.identifier}`]: JSON.parse(
                                fence.markers
                            ),
                        }),
                        {}
                    )
                );

                setLoad(false);
            })
            .catch(error => {
                setLoad(false);
                Interceptor(error);
            });
    };

    const getCompany = () => {
        api.get(`api/adm/company/${props.match.params.identifier}/show`, HeaderToken())
            .then(response => {
                setCompany(response.data);
                getCity(response.data.city.state.identifier);
                setLoad(false);
                let crumbs = props.crumbs[props.crumbs.length - 1];
                crumbs["name"] = response.data.description;
                setBreadcrumbs([...props.crumbs]);
                getPlaces(response.data);

                const companyStorage = JSON.parse(localStorage.getItem("session-user-company"));
                companyStorage?.identifier === response.data.identifier &&
                    localStorage.setItem("session-user-company", JSON.stringify(response.data));
            })
            .catch(error => {
                setLoad(false);
                Interceptor(error);
            });
    };

    const getCity = identifier => {
        api.get(`/api/geolocation/state/${identifier}/cities`, HeaderToken())
            .then(response => {
                setCityList(response.data);
            })
            .catch(error => {
                Interceptor(error);
            });
    };

    const getState = () => {
        api.get(`/api/geolocation/state/list?page_size=9999999`, HeaderToken())
            .then(response => {
                setStateList(response.data.data);
            })
            .catch(error => {
                setLoad(false);
                Interceptor(error);
            });
    };

    const setInputActive = value => {
        setActiveEdit(value);
    };

    useEffect(() => {
        if (actionFence) {
            handleChangeModal();
        }
    }, [actionFence]);

    const handleChangeModal = () => {
        setModalFence(!modalFence);
        setActionFence(false);
    };

    const handleChangeState = (identifier, setFieldValue) => {
        setInputActive("city");
        getCity(identifier);
        setFieldValue("city", undefined);
    };

    const removePlace = idPlace => {
        api.delete(
            `api/adm/company/${props.match.params.identifier}/place/${idPlace}/remove`,
            HeaderToken()
        )
            .then(() => {
                toast.info("A cerca foi excluída com sucesso!");
                getPlaces();
            })
            .catch(() => {
                toast.info("Algo deu errado ao excluir a cerca ");
            });
    };

    return (
        <>
            <Title title={"Detalhes da Empresa"} crumbs={breadcrumbs} />
            <ModalFence
                actionModalPost={handleChangeModal}
                modalFence={modalFence}
                data={data}
                identifier={props.match.params.identifier}
                setMode={setMode}
                getList={getPlaces}
                setActionFence={setActionFence}
            />
            {load ? (
                <Card className="justify-center w-full">
                    <ClipLoader size={20} color={Colors.buslab} loading={true} />
                </Card>
            ) : (
                <>
                    <Card>
                        <Formik
                            initialValues={{
                                description: company.description,
                                streetCode: company.streetCode,
                                streetComplement: company.streetComplement,
                                state: company.city !== undefined ? company.city.state : "",
                                streetName: company.streetName,
                                streetNumber: company.streetNumber,
                                city: company.city,
                                color: company.color || Colors.buslab,
                            }}
                            validationSchema={schemaCompany}
                            onSubmit={(values, { setSubmitting }) => {
                                api.post(
                                    `api/adm/company/${props.match.params.identifier}/edit`,
                                    {
                                        ...values,
                                        city:
                                            typeof values.city === "object"
                                                ? values.city.identifier
                                                : values.city,
                                    },
                                    HeaderToken()
                                )
                                    .then(() => {
                                        toast.info("Empresa editada com sucesso!");
                                        setSubmitting(false);
                                        getCompany();
                                        setInputActive();
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
                                values,
                                setFieldValue,
                                touched,
                                errors,
                                isSubmitting,
                            }) => (
                                <form onSubmit={handleSubmit}>
                                    <div className="flex justify-between mb-2">
                                        <Back />
                                        <LoadSave isSubmitting={isSubmitting} />
                                    </div>
                                    <h2 className="mb-2 font-light">Informações gerais</h2>

                                    <div className="flex flex-wrap mb-4">
                                        <div className="xs:w-full sm:w-full md:w-1/2 lg:w-1/3 lg:pr-4">
                                            <div className="sm:w-full xs:w-full bg-tablerow flex justify-center items-center">
                                                <Label description="Nome" />
                                                <div className="flex justify-between w-2/3">
                                                    {activeEdit === "description" ? (
                                                        <>
                                                            <Input
                                                                onChange={handleChange}
                                                                name="description"
                                                                value={values.description}
                                                            />
                                                            <Save handleSubmit={handleSubmit} />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Information
                                                                description={values.description}
                                                            />
                                                            <Pencil
                                                                setInputActive={() =>
                                                                    setInputActive("description")
                                                                }
                                                            />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="sm:w-full xs:w-full flex justify-center items-center">
                                                <Label description="Endereço" />
                                                <div className="flex justify-between w-2/3">
                                                    {activeEdit === "streetName" ? (
                                                        <>
                                                            <Input
                                                                onChange={handleChange}
                                                                name="streetName"
                                                                value={values.streetName}
                                                            />
                                                            <Save handleSubmit={handleSubmit} />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Information
                                                                description={values.streetName}
                                                            />
                                                            <Pencil
                                                                setInputActive={() =>
                                                                    setInputActive("streetName")
                                                                }
                                                            />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="sm:w-full xs:w-full flex bg-tablerow justify-center items-center">
                                                <Label description="Número" />
                                                <div className="flex justify-between w-2/3">
                                                    {activeEdit === "streetNumber" ? (
                                                        <>
                                                            <Input
                                                                onChange={handleChange}
                                                                name="streetNumber"
                                                                value={values.streetNumber}
                                                            />
                                                            <Save handleSubmit={handleSubmit} />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Information
                                                                description={values.streetNumber}
                                                            />
                                                            <Pencil
                                                                setInputActive={() =>
                                                                    setInputActive("streetNumber")
                                                                }
                                                            />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="sm:w-full xs:w-full flex justify-center items-center">
                                                <Label description="Complemento" />
                                                <div className="flex justify-between w-2/3">
                                                    {activeEdit === "streetComplement" ? (
                                                        <>
                                                            <Input
                                                                onChange={handleChange}
                                                                name="streetComplement"
                                                                value={values.streetComplement}
                                                            />
                                                            <Save handleSubmit={handleSubmit} />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Information
                                                                description={
                                                                    values.streetComplement
                                                                }
                                                            />
                                                            <Pencil
                                                                setInputActive={() =>
                                                                    setInputActive(
                                                                        "streetComplement"
                                                                    )
                                                                }
                                                            />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="sm:w-full xs:w-full bg-tablerow flex justify-center items-center">
                                                <Label description="CEP" />
                                                <div className="flex justify-between w-2/3">
                                                    {activeEdit === "streetCode" ? (
                                                        <>
                                                            <Input
                                                                onChange={handleChange}
                                                                name="streetCode"
                                                                value={values.streetCode}
                                                            />
                                                            <Save handleSubmit={handleSubmit} />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Information
                                                                description={values.streetCode}
                                                            />
                                                            <Pencil
                                                                setInputActive={() =>
                                                                    setInputActive("streetCode")
                                                                }
                                                            />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="sm:w-full xs:w-full flex justify-center items-center">
                                                <Label description="Estado" />
                                                <div className="flex justify-between w-2/3">
                                                    {activeEdit === "state" ? (
                                                        <>
                                                            <SelectStyle
                                                                onChange={select => {
                                                                    if (select && select.value) {
                                                                        setFieldValue("state", {
                                                                            name: select.label,
                                                                            identifier:
                                                                                select.value,
                                                                        });
                                                                        handleChangeState(
                                                                            select.value,
                                                                            setFieldValue
                                                                        );
                                                                    } else {
                                                                        setFieldValue("state", {});
                                                                    }
                                                                }}
                                                                name={"state"}
                                                                id={"state"}
                                                                value={
                                                                    values.state !== undefined && {
                                                                        label: values.state.name,
                                                                        value:
                                                                            values.state.identifier,
                                                                    }
                                                                }
                                                                optionsMap={(() => {
                                                                    let options = [
                                                                        {
                                                                            label: "Selecione",
                                                                            value: "",
                                                                        },
                                                                    ];

                                                                    stateList.map(state =>
                                                                        options.push({
                                                                            value: state.identifier,
                                                                            label: state.name,
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
                                                                    values.state !== undefined
                                                                        ? values.state.name
                                                                        : ""
                                                                }
                                                            />
                                                            <Pencil
                                                                setInputActive={() =>
                                                                    setInputActive("state")
                                                                }
                                                            />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="sm:w-full xs:w-full bg-tablerow flex justify-center items-center">
                                                <Label description="Cidade" />
                                                <div className="flex justify-between w-2/3">
                                                    {activeEdit === "city" ? (
                                                        <>
                                                            <SelectStyle
                                                                isClearable={"false"}
                                                                onChange={select => {
                                                                    if (select && select.value) {
                                                                        setFieldValue("city", {
                                                                            name: select.label,
                                                                            identifier:
                                                                                select.value,
                                                                        });
                                                                    } else {
                                                                        setFieldValue("city", {});
                                                                    }
                                                                }}
                                                                name={"city"}
                                                                id={"city"}
                                                                value={
                                                                    values.city !== undefined && {
                                                                        label: values.city.name,
                                                                        value:
                                                                            values.city.identifier,
                                                                    }
                                                                }
                                                                optionsMap={(() => {
                                                                    let options = [
                                                                        {
                                                                            label: "Selecione",
                                                                            value: "",
                                                                        },
                                                                    ];

                                                                    cityList.map(city =>
                                                                        options.push({
                                                                            value: city.identifier,
                                                                            label: city.name,
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
                                                                    values.city !== undefined
                                                                        ? values.city.name
                                                                        : ""
                                                                }
                                                            />
                                                            <Pencil
                                                                setInputActive={() =>
                                                                    setInputActive("city")
                                                                }
                                                            />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="sm:w-full xs:w-full flex justify-center items-center">
                                                <Label description="Cor" />
                                                <div className="flex justify-between w-2/3">
                                                    {activeEdit === "color" ? (
                                                        <>
                                                            <SketchPicker
                                                                color={values.color}
                                                                onChange={select => {
                                                                    setFieldValue(
                                                                        "color",
                                                                        select.hex
                                                                    );
                                                                }}
                                                            />
                                                            <Save handleSubmit={handleSubmit} />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div
                                                                style={{
                                                                    backgroundColor: values.color,
                                                                    width: "30px",
                                                                    height: "30px",
                                                                    borderRadius: "90px",
                                                                }}
                                                            />
                                                            <Pencil
                                                                setInputActive={() =>
                                                                    setInputActive("color")
                                                                }
                                                            />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            {errors.city && (
                                                <span className="text-red-600 text-sm">
                                                    {errors.city}
                                                </span>
                                            )}
                                            <Link
                                                as="/settings/:identifierCompany"
                                                to={`/settings/${props.match.params.identifier}`}>
                                                <p className="text-buslab text-14 font-light underline cursor-pointer mt-3">
                                                    Acessar parâmetros do sistema
                                                </p>
                                            </Link>
                                        </div>
                                        <CompanyMap
                                            company={company}
                                            setData={setData}
                                            data={data}
                                            setActionFence={setActionFence}
                                        />
                                    </div>
                                    <Collapse
                                        defaultActive
                                        title={`Áreas marcadas`}
                                        openCollapse={openCollapse}
                                        setOpenCollapse={setOpenCollapse}>
                                        {placeList.length > 0 &&
                                            !load &&
                                            placeList.map((value, index) => {
                                                return (
                                                    <div
                                                        key={index}
                                                        className={`sm:w-full xs:w-full items-center flex justify-between py-4 px-2 ${
                                                            index % 2 === 0 ? "" : "bg-tablerow"
                                                        } `}>
                                                        <p className="text-light text-custom_gray_medium">
                                                            {value.description}
                                                        </p>
                                                        <img
                                                            className="cursor-pointer font-light w-4 text-primary inline"
                                                            alt="Remover"
                                                            src={trashSVG}
                                                            onClick={() => {
                                                                removePlace(value.identifier);
                                                            }}
                                                        />
                                                    </div>
                                                );
                                            })}
                                        {placeList.length === 0 && (
                                            <p className="text-light text-center text-custom_gray_medium mt-3">
                                                Ainda não tem nenhuma área marcada
                                            </p>
                                        )}
                                    </Collapse>
                                </form>
                            )}
                        </Formik>
                    </Card>
                    <Card>
                        <div className="flex justify-between">
                            <h2 className="mb-5 font-light">Veículos da empresa</h2>
                        </div>
                        <div className="overflow-auto">
                            <table className="table-auto w-full">
                                <thead>
                                    <tr className="text-primary">
                                        <th className="py-2 text-left font-medium text-14">
                                            Placa
                                        </th>
                                        <th className="py-2 text-left font-medium text-14">
                                            Prefixo
                                        </th>
                                        <th className="py-2 text-left font-medium text-14">
                                            Marca
                                        </th>
                                        <th className="py-2 text-left font-medium text-14">
                                            Modelo
                                        </th>
                                        <th className="py-2 text-left font-medium text-14">
                                            Empresa
                                        </th>
                                        <th className="py-2 text-left font-medium text-14">Meta</th>
                                        <th className="py-2 text-left font-medium text-14">OBD</th>
                                    </tr>
                                </thead>
                                {vehicleList.length > 0 && !load && (
                                    <tbody>
                                        {vehicleList.map((value, index) => {
                                            return (
                                                <tr
                                                    className={index % 2 === 0 ? "bg-tablerow" : ""}
                                                    key={value.identifier}>
                                                    <td className="py-5 font-light text-c8 text-14 text-left">
                                                        {value.plate}
                                                    </td>
                                                    <td className="py-5 font-light text-c8 text-14 text-left">
                                                        {value.prefix}
                                                    </td>
                                                    <td className="py-5 font-light text-c8 text-14 text-left">
                                                        {value.model.brand.description}
                                                    </td>
                                                    <td className="py-5 font-light text-c8 text-14 text-left">
                                                        {value.model.description}
                                                    </td>
                                                    <td className="py-5 font-light text-c8 text-14 text-left">
                                                        {value.company.description}
                                                    </td>
                                                    <td className="py-5 font-light text-c8 text-14 text-left">
                                                        {value.consumptionTarget}
                                                    </td>
                                                    <td className="py-5 font-light text-c8 text-14 text-left">
                                                        {value.obd?.serial}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                )}
                            </table>
                        </div>
                        <div className="w-full">
                            <div className="flex justify-center">
                                {vehicleList.length === 0 && !load && (
                                    <p className="center">Nenhum veículo vinculado</p>
                                )}
                                {load && (
                                    <ClipLoader size={20} color={Colors.buslab} loading={load} />
                                )}
                            </div>
                        </div>
                        {meta.total_pages > 1 && (
                            <Paginate
                                meta={meta}
                                setMeta={setMeta}
                                action={action}
                                setAction={setAction}
                            />
                        )}
                    </Card>
                </>
            )}
        </>
    );
};

export default ShowCompanies;
