import React, { useState, useEffect } from "react";
import { Formik } from "formik";
import { toast } from "react-toastify";
import { IoIosAddCircle } from "react-icons/io";
import { MdFileDownload } from "react-icons/md";
import ClipLoader from "react-spinners/ClipLoader";
import CurrencyInput from "react-currency-input";

import HeaderToken from "../../services/headerToken";
import api from "../../services/api";
import Interceptor from "../../services/interceptor";
import { centroid } from "../../services/centroidGeolocalization";
import Colors from "../../assets/constants/Colors";
import Back from "../../components/Back";
import { Label, Information, Pencil, LoadSave, Save } from "../../components/Details";
import { Input } from "../../components/Formik";
import SelectStyle from "../../components/Select";
import Title from "../../components/Title";
import Card from "../../components/Cards/Card";
import Paginate from "../../components/Paginate";
import ButtonIconTextDefault from "../../components/Buttons/default/ButtonIconTextDefault";
import GoogleMaps from "../../components/Maps/GoogleMaps";
import Schema from "./Schema";
import ModalNewPoints from "./Modals/ModalNewPoints";
import { fileDownload } from "../../services/requests";

const ShowLine = props => {
    const [viewport, setViewport] = useState({
        latitude: -23.6956019,
        longitude: -46.6297295,
        zoom: 11,
    });

    const [load, setLoad] = useState(false);
    const [line, setLine] = useState(false);
    const [companyList, setCompanyList] = useState(false);
    const [activeEdit, setActiveEdit] = useState();
    const [points, setPoints] = useState([]);
    const [modalOption, setModalOption] = useState(0);
    const [meta, setMeta] = useState({
        current_page: 1,
    });
    const [action, setAction] = useState(1);

    useEffect(() => {
        getCompany();
        getLine();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

    useEffect(() => {
        getPoints();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [action]);

    const getLine = () => {
        setLoad(true);
        api.get(`api/adm/line/${props.match.params.id}/show`, HeaderToken())
            .then(response => {
                setLoad(false);
                setLine(response.data);
            })
            .catch(error => {
                setLoad(false);
                Interceptor(error);
            });
    };

    const getPoints = () => {
        setLoad(true);
        api.get(`/api/adm/line/${props.match.params.id}/points` , HeaderToken()).then(response => {
            setPoints(response.data);
            let allMarkers = [];
            for (let key in response.data) {
                allMarkers.push({
                    latitude: response.data[key].latitude,
                    longitude: response.data[key].longitude,
                });
            }

            if (allMarkers.length > 0) {
                let currentCentroid = centroid(allMarkers);
                setViewport({
                    latitude: currentCentroid.latitude,
                    longitude: currentCentroid.longitude,
                    zoom: 15,
                });
            }
        });
    };

    const setInputActive = value => {
        setActiveEdit(value);
    };

    const actionModalOption = () => {
        setModalOption(!modalOption);
    };

    return (
        <>
            <Title title={"Detalhes da linha"} crumbs={props.crumbs} />
            <ModalNewPoints
                actionModalOption={actionModalOption}
                modalOption={modalOption}
                idLine={props.match.params.id}
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
                                code: line.code,
                                description: line.description,
                                passage: line.passage,
                                direction: line.direction,
                                company: line.company,
                                maxSpeed: line.maxSpeed,
                            }}
                            enableReinitialize={true}
                            validationSchema={Schema}
                            onSubmit={(values, { setSubmitting }) => {
                                values.passage = values.passage.toString().replace(",", ".");
                                api.post(
                                    `api/adm/line/${line.identifier}/edit`,
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
                                        toast.info("Linha editada com sucesso!");
                                        setSubmitting(false);
                                        setActiveEdit();
                                    })
                                    .catch(error => {
                                        setSubmitting(false);
                                        Interceptor(error);
                                    });
                            }}>
                            {({
                                handleChange,
                                handleSubmit,
                                values,
                                handleBlur,
                                setFieldValue,
                                isSubmitting,
                            }) => (
                                <form onSubmit={handleSubmit}>
                                    <div className="flex justify-between mb-2">
                                        <Back />
                                        <LoadSave isSubmitting={isSubmitting} />
                                    </div>
                                    <h2 className="mb-2 font-light">Informações gerais</h2>
                                    <div className="flex flex-wrap">
                                        <div className="xs:w-full sm:w-full md:w-1/2 lg:w-1/3 lg:pr-4">
                                            <div className="sm:w-full xs:w-full bg-tablerow flex justify-center items-center">
                                                <Label description="Código da Linha" />
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
                                                            <Information
                                                                description={values.code}
                                                            />
                                                            <Pencil
                                                                setInputActive={() =>
                                                                    setInputActive("code")
                                                                }
                                                            />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="sm:w-full xs:w-full flex justify-center items-center">
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
                                            <div className="sm:w-full xs:w-full bg-tablerow flex justify-center items-center">
                                                <Label description="Sentido" />
                                                <div className="flex justify-between w-2/3">
                                                    {activeEdit === "direction" ? (
                                                        <>
                                                            <SelectStyle
                                                                placeholder={"Selecione"}
                                                                onChange={select => {
                                                                    if (select && select.value) {
                                                                        setFieldValue(
                                                                            "direction",
                                                                            select.value
                                                                        );
                                                                    } else {
                                                                        setFieldValue(
                                                                            "direction",
                                                                            ""
                                                                        );
                                                                    }
                                                                }}
                                                                name={"direction"}
                                                                id={"direction"}
                                                                value={{
                                                                    value: values.direction,
                                                                    label:
                                                                        values.direction === "GOING"
                                                                            ? "Ida"
                                                                            : values.direction ===
                                                                              "RETURN"
                                                                            ? "Volta"
                                                                            : "Circular",
                                                                }}
                                                                optionsMap={(() => {
                                                                    let options = [
                                                                        {
                                                                            label: "Ida",
                                                                            value: "GOING",
                                                                        },
                                                                        {
                                                                            label: "Volta",
                                                                            value: "RETURN",
                                                                        },
                                                                        {
                                                                            label: "Circular",
                                                                            value: "CIRCULATE",
                                                                        },
                                                                    ];

                                                                    return options;
                                                                })()}
                                                            />
                                                            <Save handleSubmit={handleSubmit} />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Information
                                                                description={
                                                                    values.direction
                                                                        ? values.direction ===
                                                                          "GOING"
                                                                            ? "Ida"
                                                                            : values.direction ===
                                                                              "RETURN"
                                                                            ? "Volta"
                                                                            : "Circular"
                                                                        : "-"
                                                                }
                                                            />
                                                            <Pencil
                                                                setInputActive={() =>
                                                                    setInputActive("direction")
                                                                }
                                                            />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="sm:w-full xs:w-full flex justify-center items-center">
                                                <Label description="Valor da passagem" />
                                                <div className="flex justify-between w-2/3">
                                                    {activeEdit === "passage" ? (
                                                        <>
                                                            <CurrencyInput
                                                                className="appearance-none w-full block text-gray-700 border border-gray-300 py-2 px-2 focus:outline-none h-8 rounded focus:bg-white"
                                                                type="text"
                                                                decimalSeparator=","
                                                                thousandSeparator="."
                                                                precision="2"
                                                                onChangeEvent={event => {
                                                                    handleChange(event);
                                                                }}
                                                                onBlur={handleBlur}
                                                                allowEmpty={true}
                                                                value={values.passage}
                                                                name="passage"
                                                            />
                                                            <Save handleSubmit={handleSubmit} />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Information
                                                                description={`R$ ${values.passage}`}
                                                            />
                                                            <Pencil
                                                                setInputActive={() =>
                                                                    setInputActive("passage")
                                                                }
                                                            />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="sm:w-full xs:w-full bg-tablerow flex justify-center items-center">
                                                <Label description="Limite de velocidade" />
                                                <div className="flex justify-between w-2/3">
                                                    {activeEdit === "maxSpeed" ? (
                                                        <>
                                                            <CurrencyInput
                                                                className="appearance-none w-full block text-gray-700 border border-gray-300 py-2 px-2 focus:outline-none h-8 rounded focus:bg-white"
                                                                type="text"
                                                                decimalSeparator=","
                                                                thousandSeparator="."
                                                                precision="0"
                                                                onChangeEvent={event => {
                                                                    handleChange(event);
                                                                }}
                                                                onBlur={handleBlur}
                                                                allowEmpty={true}
                                                                name="maxSpeed"
                                                                value={values.maxSpeed}
                                                            />
                                                            <Save handleSubmit={handleSubmit} />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Information
                                                                description={values.maxSpeed}
                                                            />
                                                            <Pencil
                                                                setInputActive={() =>
                                                                    setInputActive("maxSpeed")
                                                                }
                                                            />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="sm:w-full xs:w-full flex justify-center items-center">
                                                <Label description="Empresa" />
                                                <div className="flex justify-between w-2/3">
                                                    {activeEdit === "company" ? (
                                                        <>
                                                            <SelectStyle
                                                                onChange={select => {
                                                                    if (select && select.value) {
                                                                        setFieldValue("company", {
                                                                            description:
                                                                                select.label,
                                                                            identifier:
                                                                                select.value,
                                                                        });
                                                                    } else {
                                                                        setFieldValue(
                                                                            "company",
                                                                            {}
                                                                        );
                                                                    }
                                                                }}
                                                                name={"company"}
                                                                id={"company"}
                                                                value={
                                                                    values.company !==
                                                                        undefined && {
                                                                        label:
                                                                            values.company
                                                                                .description,
                                                                        value:
                                                                            values.company
                                                                                .identifier,
                                                                    }
                                                                }
                                                                optionsMap={(() => {
                                                                    let options = [];
                                                                    companyList.map(company =>
                                                                        options.push({
                                                                            value:
                                                                                company.identifier,
                                                                            label:
                                                                                company.description,
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
                                                                    values.company !== undefined &&
                                                                    `${values.company.description}`
                                                                }
                                                            />
                                                            <Pencil
                                                                setInputActive={() =>
                                                                    setInputActive("company")
                                                                }
                                                            />
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="xs:w-full sm:w-full md:w-1/2 lg:w-2/3 lg:pl-4">
                                            <GoogleMaps
                                                viewport={viewport}
                                                points={points}
                                                checkpoints={points}
                                            />
                                        </div>
                                    </div>
                                </form>
                            )}
                        </Formik>
                    </Card>
                    <Card>
                        <div className="flex justify-between">
                            <h2 className="mb-5 font-light">Pontos</h2>
                            <div>
                                <ButtonIconTextDefault
                                    className="mr-3"
                                    title="Adicionar"
                                    onClick={actionModalOption}
                                    icon={<IoIosAddCircle />}
                                />

                                <ButtonIconTextDefault
                                    title="Baixar"
                                    icon={<MdFileDownload />}
                                    onClick={() =>
                                        fileDownload({
                                            route: `/api/adm/line/${line.identifier}/export`,
                                            filename: line.label,
                                            ext: "csv",
                                        })
                                    }
                                />
                            </div>
                        </div>
                        <div className="overflow-auto">
                            <table className="table-auto w-full">
                                <thead>
                                    <tr className="text-primary">
                                        <th className="pr-4 py-2 text-left font-medium text-14 w-10">
                                            Pontos
                                        </th>
                                        <th className="px-3 py-2 text-left font-medium text-14">
                                            Coordenadas
                                        </th>
                                        {/* <th className="px-3 py-2 text-center font-medium text-14 w-8">Reordenar</th> */}
                                    </tr>
                                </thead>
                                {points.length > 0 && !load && (
                                    <tbody>
                                        {points.map((point, index) => {
                                            return (
                                                <tr
                                                    className={index % 2 === 0 ? "bg-tablerow" : ""}
                                                    key={point.identifier}>
                                                    <td className="pr-4 py-5 font-light text-c8 text-14 text-center w-10">
                                                        {point.sequence}
                                                    </td>
                                                    <td className="px-4 py-5 font-light text-c8 text-14 text-left">
                                                        {point.latitude}, {point.longitude}
                                                    </td>
                                                    {/* <td className="px-4 py-5 font-light text-c8 text-14 text-center flex justify-between">
                                                        <IoMdArrowDown />
                                                        <IoMdArrowUp />
                                                    </td> */}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                )}
                            </table>
                        </div>
                        <div className="w-full">
                            <div className="flex justify-center">
                                {points.length === 0 && !load && (
                                    <p className="center">Nenhum ponto encontrado</p>
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

export default ShowLine;
