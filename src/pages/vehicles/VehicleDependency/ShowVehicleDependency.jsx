import React, { useState, useEffect } from "react";
import Title from "../../../components/Title";
import Card from "../../../components/Cards/Card";
import Back from "../../../components/Back";
import HeaderToken from "../../../services/headerToken";
import api from "../../../services/api";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import Colors from "../../../assets/constants/Colors";
import { Formik } from "formik";
import { Label, Information, Pencil, LoadSave, Save } from "../../../components/Details";
import Interceptor from "../../../services/interceptor";
import SelectStyle from "../../../components/Select";
import { Input } from "../../../components/Formik";

const ShowVehicleDependency = props => {
    const [load, setLoad] = useState(false);
    const [vehicleDependency, setVehicleDependency] = useState(false);
    const [brandList, setBrandList] = useState([]);
    const [activeEdit, setActiveEdit] = useState();
    const [breadcrumbs, setBreadcrumbs] = useState([]);

    let initialValuesBrand = { description: vehicleDependency.description };

    let initialValuesModel = {
        fuelDensity: vehicleDependency.fuelDensity,
        brand: vehicleDependency.brand,
        airFuelRatio: vehicleDependency.airFuelRatio,
        efficiency: vehicleDependency.efficiency,
        description: vehicleDependency.description,
        volume: vehicleDependency.volume,
        ect: vehicleDependency.ect,
        iat: vehicleDependency.iat,
    };

    useEffect(() => {
        getVehicleDependency();
        getBrand();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getBrand = () => {
        setLoad(true);
        api.get(`api/adm/vehicle/brand/list`, HeaderToken())
            .then(response => {
                setLoad(false);
                setBrandList(response.data.data);
            })
            .catch(error => {
                setLoad(false);
                Interceptor(error);
            });
    };
    const getVehicleDependency = () => {
        setLoad(true);
        api.get(`api/adm/vehicle/${props.match.params.type}/${props.match.params.id}/show`, HeaderToken())
            .then(response => {
                setVehicleDependency(response.data);
                setLoad(false);
                let crumbs = props.crumbs[props.crumbs.length - 1];
                crumbs["name"] = response.data.description;
                setBreadcrumbs([...props.crumbs]);
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
            <Title title={`Detalhes ${props.match.params.type === "brand" ? 'do fabricante do ' : 'do modelo do '}veículo`} crumbs={breadcrumbs} />

            <Card>
                {load ? (
                    <div className="justify-center w-full">
                        <ClipLoader size={20} color={Colors.buslab} loading={true} />
                    </div>
                ) : (
                    <Formik
                        initialValues={props.match.params.type === "brand" ? initialValuesBrand : initialValuesModel}
                        enableReinitialize={true}
                        onSubmit={(values, { setSubmitting }) => {
                            let brand = {};
                            if (props.match.params.type === "model") {
                                if (typeof values.brand === "object") {
                                    brand = values.brand.identifier;
                                }
                            }
                            api.post(
                                `/api/adm/vehicle/${props.match.params.type}/${props.match.params.id}/edit`,
                                {
                                    ...values,
                                    brand,
                                },
                                HeaderToken()
                            )
                                .then(() => {
                                    toast.info(
                                        `${
                                            props.match.params.type === "brand" ? "Fabricante editado " : "Modelo editado "
                                        } com sucesso!`
                                    );
                                    setSubmitting(false);
                                    setActiveEdit();
                                })
                                .catch(error => {
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
                                <h2 className="mb-2 font-light">Informações gerais</h2>
                                <div className="flex flex-wrap">
                                    <div className="xs:w-full sm:w-full md:w-1/2 lg:w-1/2 pr-4">
                                        <div className="sm:w-full xs:w-full bg-tablerow flex justify-center items-center">
                                            <Label description="Descrição" />
                                            <div className="flex justify-between w-2/3">
                                                {" "}
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
                                                        <Information description={values.description} />
                                                        <Pencil setInputActive={() => setInputActive("description")} />
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        {props.match.params.type === "model" && (
                                            <>
                                                <div className="sm:w-full xs:w-full flex justify-center items-center">
                                                    <Label description="Relação ar-combustível" />
                                                    <div className="flex justify-between w-2/3">
                                                        {" "}
                                                        {activeEdit === "airFuelRatio" ? (
                                                            <>
                                                                <Input
                                                                    onChange={handleChange}
                                                                    name="airFuelRatio"
                                                                    value={values.airFuelRatio}
                                                                />
                                                                <Save handleSubmit={handleSubmit} />
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Information description={values.airFuelRatio} />
                                                                <Pencil
                                                                    setInputActive={() =>
                                                                        setInputActive("airFuelRatio")
                                                                    }
                                                                />
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="sm:w-full xs:w-full bg-tablerow flex justify-center items-center">
                                                    <Label description="Densidade do combustível" />

                                                    <div className="flex justify-between w-2/3">
                                                        {" "}
                                                        {activeEdit === "fuelDensity" ? (
                                                            <>
                                                                <Input
                                                                    onChange={handleChange}
                                                                    name="fuelDensity"
                                                                    value={values.fuelDensity}
                                                                />
                                                                <Save handleSubmit={handleSubmit} />
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Information description={values.fuelDensity} />
                                                                <Pencil
                                                                    setInputActive={() => setInputActive("fuelDensity")}
                                                                />
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="sm:w-full xs:w-full flex justify-center items-center">
                                                    <Label description="Eficiência" />
                                                    <div className="flex justify-between w-2/3">
                                                        {" "}
                                                        {activeEdit === "efficiency" ? (
                                                            <>
                                                                <Input
                                                                    onChange={handleChange}
                                                                    name="efficiency"
                                                                    value={values.efficiency}
                                                                />
                                                                <Save handleSubmit={handleSubmit} />
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Information description={values.efficiency} />
                                                                <Pencil
                                                                    setInputActive={() => setInputActive("efficiency")}
                                                                />
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="sm:w-full xs:w-full bg-tablerow flex justify-center items-center">
                                                    <Label description="Volume" />

                                                    <div className="flex justify-between w-2/3">
                                                        {" "}
                                                        {activeEdit === "volume" ? (
                                                            <>
                                                                <Input
                                                                    onChange={handleChange}
                                                                    name="volume"
                                                                    value={values.volume}
                                                                />
                                                                <Save handleSubmit={handleSubmit} />
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Information description={values.volume} />
                                                                <Pencil
                                                                    setInputActive={() => setInputActive("volume")}
                                                                />
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="sm:w-full xs:w-full flex justify-center items-center">
                                                    <Label description="Temperatura do líquido de arrefecimento do motor" />

                                                    <div className="flex justify-between w-2/3">
                                                        {" "}
                                                        {activeEdit === "ect" ? (
                                                            <>
                                                                <Input
                                                                    onChange={handleChange}
                                                                    name="ect"
                                                                    value={values.ect}
                                                                />
                                                                <Save handleSubmit={handleSubmit} />
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Information description={values.ect} />
                                                                <Pencil
                                                                    setInputActive={() => setInputActive("ect")}
                                                                />
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="sm:w-full xs:w-full bg-tablerow flex justify-center items-center">
                                                    <Label description="Temperatura do ar de adminissão" />

                                                    <div className="flex justify-between w-2/3">
                                                        {" "}
                                                        {activeEdit === "iat" ? (
                                                            <>
                                                                <Input
                                                                    onChange={handleChange}
                                                                    name="iat"
                                                                    value={values.iat}
                                                                />
                                                                <Save handleSubmit={handleSubmit} />
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Information description={values.iat} />
                                                                <Pencil
                                                                    setInputActive={() => setInputActive("iat")}
                                                                />
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="sm:w-full xs:w-full flex justify-center">
                                                    <Label description="Fabricante" />
                                                    <div className="flex justify-between w-2/3">
                                                        {" "}
                                                        {activeEdit === "brand" ? (
                                                            <>
                                                                <SelectStyle
                                                                    onChange={select => {
                                                                        if (select && select.value) {
                                                                            setFieldValue("brand", {
                                                                                description: select.label,
                                                                                identifier: select.value,
                                                                            });
                                                                        } else {
                                                                            setFieldValue("brand", {});
                                                                        }
                                                                    }}
                                                                    name={"brand"}
                                                                    id={"brand"}
                                                                    value={
                                                                        values.brand !== undefined && {
                                                                            label: values.brand.description,
                                                                            value: values.brand.identifier,
                                                                        }
                                                                    }
                                                                    optionsMap={(() => {
                                                                        let options = [];
                                                                        brandList.map(brand =>
                                                                            options.push({
                                                                                value: brand.identifier,
                                                                                label: brand.description,
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
                                                                        values.brand !== undefined
                                                                            ? values.brand.description
                                                                            : ""
                                                                    }
                                                                />
                                                                <Pencil
                                                                    setInputActive={() => setInputActive("brand")}
                                                                />
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </>
                                        )}
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

export default ShowVehicleDependency;
