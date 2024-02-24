import React from "react";
import { Formik } from "formik";
import api from "../../../services/api";
import { toast } from "react-toastify";
import ModalForm from "../../../components/Modais/ModalForm";
import ButtonDefault from "../../../components/Buttons/default/ButtonDefault";
import ClipLoader from "react-spinners/ClipLoader";
import Colors from "../../../assets/constants/Colors";
import { SchemaBrand, SchemaModel } from "../Schema";
import HeaderToken from "../../../services/headerToken";
import Interceptor from "../../../services/interceptor";
import SelectStyle from "../../../components/Select";
import { Input } from "../../../components/Formik";
const DependencyModalCreate = ({ modalPost, actionModalPost, getList, type, brandList }) => {
    let initialValuesBrand = { description: "" };

    let initialValuesModel = {
        fuelDensity: "",
        airFuelRatio: "",
        efficiency: "",
        volume: "",
        ect: "",
        iat: "",
        description: "",
        brand: "",
    };

    return (
        <ModalForm
            size={type === "brand" ? "w-1/4" : "w-1/3" }
            onClose={actionModalPost}
            show={modalPost}
            title={<h4 className="mb-3">Cadastro de {type === "brand" ? " Fabricante" : " Modelo"}</h4>}>
            <Formik
                initialValues={type === "brand" ? initialValuesBrand : initialValuesModel}
                validationSchema={type === "brand" ? SchemaBrand : SchemaModel}
                onSubmit={(values, { setSubmitting }) => {
                    api.post(
                        `api/adm/vehicle/${type}/new`,
                        { ...values, brand: typeof values.brand === "object" ? values.brand.identifier : values.brand },
                        HeaderToken()
                    )
                        .then(res => {
                            setSubmitting(false);
                            getList !== undefined && getList();
                            toast.info(`${type === "brand" ? "Fabricante cadastrado" : "Modelo cadastrado"} com sucesso!`);
                            actionModalPost();
                        })
                        .catch(error => {
                            setSubmitting(false);
                            Interceptor(error);
                        });
                }}>
                {({ handleChange, handleSubmit, isSubmitting, errors, values, touched, handleBlur, setFieldValue }) => (
                    <form onSubmit={handleSubmit}>
                        <div className="flex">
                            <div className={type === "brand" ? "w-full pr-2" : "w-1/2 pr-2"}>
                                <label className="block mt-3 text-gray-700 text-sm font-medium ">Descrição</label>
                                <Input
                                    placeholder="Digite a descrição"
                                    onChange={handleChange}
                                    name="description"
                                    value={values.description}
                                />
                                {touched.description && errors.description && (
                                    <span className="text-red-600 text-sm">{errors.description}</span>
                                )}
                            </div>
                            {type === "model" && (
                                <>
                                    <div className="w-1/2 pr-2">
                                        <label className="block mt-3 text-gray-700 text-sm font-medium">Fabricante</label>
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
                                        {touched.brand && errors.brand && (
                                            <span className="text-red-600 text-sm">{errors.brand}</span>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                        {type === "model" && (
                            <>
                                <div className="flex">
                                    <div className="w-1/2 pr-2">
                                        <label className="block mt-3 text-gray-700 text-sm font-medium ">
                                            Eficiência
                                        </label>
                                        <Input
                                            placeholder="ex: 10"
                                            onChange={handleChange}
                                            name="efficiency"
                                            value={values.efficiency}
                                        />
                                        {touched.efficiency && errors.efficiency && (
                                            <span className="text-red-600 text-sm">{errors.efficiency}</span>
                                        )}
                                    </div>
                                    <div className="w-1/2 pr-2">
                                        <label className="block mt-3 text-gray-700 text-sm font-medium ">
                                            Relação ar-combustível
                                        </label>
                                        <Input
                                            placeholder="ex: 20.5"
                                            onChange={handleChange}
                                            name="airFuelRatio"
                                            value={values.airFuelRatio}
                                        />
                                        {touched.airFuelRatio && errors.airFuelRatio && (
                                            <span className="text-red-600 text-sm">{errors.airFuelRatio}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex">
                                    <div className="w-1/2 pr-2">
                                        <label className="block mt-3 text-gray-700 text-sm font-medium ">
                                            Densidade do combustível
                                        </label>
                                        <Input
                                            placeholder="ex: 20.5"
                                            onChange={handleChange}
                                            name="fuelDensity"
                                            value={values.fuelDensity}
                                        />
                                        {touched.fuelDensity && errors.fuelDensity && (
                                            <span className="text-red-600 text-sm">{errors.fuelDensity}</span>
                                        )}
                                    </div>
                                    <div className="w-1/2 pr-2">
                                        <label className="block mt-3 text-gray-700 text-sm font-medium ">Volume</label>
                                        <Input
                                            placeholder="ex: 10"
                                            onChange={handleChange}
                                            name="volume"
                                            value={values.volume}
                                        />
                                        {touched.volume && errors.volume && (
                                            <span className="text-red-600 text-sm">{errors.volume}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex">
                                    <div className="w-1/2 pr-2">
                                        <label className="block mt-3 text-gray-700 text-sm font-medium ">
                                            Temp. máxima do liquido de arrefecimento do motor
                                        </label>
                                        <Input
                                            placeholder="ex: 95.0"
                                            onChange={handleChange}
                                            name="ect"
                                            value={values.ect}
                                        />
                                        {touched.ect && errors.fuelDensity && (
                                            <span className="text-red-600 text-sm">{errors.ect}</span>
                                        )}
                                    </div>
                                    <div className="w-1/2 pr-2">
                                        <label className="block mt-3 text-gray-700 text-sm font-medium ">Temp. máxima do ar de admissão</label>
                                        <Input
                                            placeholder="ex: 99.0"
                                            onChange={handleChange}
                                            name="iat"
                                            value={values.iat}
                                        />
                                        {touched.iat && errors.iat && (
                                            <span className="text-red-600 text-sm">{errors.iat}</span>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                        <div className="flex justify-end mt-3">
                            <div className="ml-4">
                                {isSubmitting ? (
                                    <div className="w-full">
                                        <div className="flex justify-end">
                                            <ClipLoader size={20} color={Colors.buslab} loading={true} />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <ButtonDefault className="mr-2" title="Cancelar" onClick={actionModalPost} />
                                        <ButtonDefault title="Cadastrar" type="submit" />
                                    </>
                                )}
                            </div>
                        </div>
                    </form>
                )}
            </Formik>
        </ModalForm>
    );
};

export default DependencyModalCreate;
