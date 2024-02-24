import React, { useState } from "react";
import { Formik } from "formik";
import api from "../../../services/api";
import { toast } from "react-toastify";
import ModalForm from "../../../components/Modais/ModalForm";
import ButtonDefault from "../../../components/Buttons/default/ButtonDefault";
import ClipLoader from "react-spinners/ClipLoader";
import Colors from "../../../assets/constants/Colors";
import NumberFormat from "react-number-format";
import { Schema } from "../Schema";
import HeaderToken from "../../../services/headerToken";
import Interceptor from "../../../services/interceptor";
import SelectStyle from "../../../components/Select";
import { Error, Input } from "../../../components/Formik";
import { SketchPicker } from 'react-color';

const ModalCreate = ({ modalPost, actionModalPost, getList, stateList }) => {
    const [citySelect, setCitySelect] = useState([]);
    const [color, setColor] = useState("");
    
    const handleSelectUf = option => {
        api.get(`/api/geolocation/state/${option.value}/cities?page_size=99999`, HeaderToken()).then(response => {
            setCitySelect(response.data);
        });
    };

    return (
        <ModalForm overflow onClose={actionModalPost} show={modalPost} title={<h4 className="mt-6 mb-4">Cadastrar Empresa</h4>}>
            <Formik
                initialValues={{
                    description: "",
                    streetName: "",
                    streetNumber: "",
                    streetComplement: "",
                    streetCode: "",
                    streetDistrict: "",
                    city: "",
                    color: "",
                }}
                validationSchema={Schema}
                onSubmit={(values, actions) => {
                    values.color = color.hex;
                    api.post(
                        "api/adm/company/new",
                        {
                            ...values,
                            city: typeof values.city === "object" ? values.city.identifier : values.city,
                            streetDistrict:
                                typeof values.streetDistrict === "object"
                                    ? values.streetDistrict.identifier
                                    : values.streetDistrict,
                        },
                        HeaderToken()
                    )
                        .then(res => {
                            actionModalPost();
                            getList();
                            toast.info("Cadastro de empresa concluído!");
                        })
                        .catch(error => {
                            Interceptor(error);
                            actions.setSubmitting(false);
                        });
                }}>
                {({ handleChange, handleSubmit, isSubmitting, errors, values, touched, handleBlur, setFieldValue }) => (
                    <form onSubmit={handleSubmit}>
                        <div className="w-full">
                            <label className="block text-gray-700 text-sm font-medium">Nome</label>
                            <Input
                                placeholder="Digite o nome da empresa"
                                onChange={handleChange}
                                name="description"
                                value={values.description}
                            />

                            <Error name="description" />
                        </div>
                        <div className="w-full">
                            <label className="block text-gray-700 text-sm font-medium mt-3">Endereço</label>
                            <Input
                                placeholder="Digite o nome da rua"
                                onChange={handleChange}
                                name="streetName"
                                value={values.streetName}
                            />
                            <Error name="streetName" />
                        </div>
                        <div className="flex">
                            <div className="w-2/6 pr-2">
                                <label className="block text-gray-700 text-sm font-medium mt-3">Número</label>
                                <Input
                                    placeholder="ex: 12"
                                    onChange={handleChange}
                                    name="streetNumber"
                                    value={values.streetNumber}
                                />
                                <Error name="streetNumber" />
                            </div>
                            <div className="w-2/6 pr-2 pl-2">
                                <label className="block text-gray-700 text-sm font-medium mt-3">Complemento</label>
                                <Input
                                    placeholder="ex: apto 25"
                                    onChange={handleChange}
                                    name="streetComplement"
                                    value={values.streetComplement}
                                />
                                <Error name="streetComplement" />
                            </div>
                            <div className="w-2/6 pl-2">
                                <label className="block text-gray-700 text-sm font-medium mt-3">CEP</label>
                                <NumberFormat
                                    className="appearance-none w-full block text-gray-700 rounded border h-9 border-gray-300 py-2 px-4 focus:outline-none focus:bg-white"
                                    value={values.streetCode}
                                    type="text"
                                    onChange={handleChange}
                                    name="streetCode"
                                    format="#####-###"
                                />
                                <Error name="streetCode" />
                            </div>
                        </div>
                        <div className="flex">
                            <div className="w-1/2 pr-2">
                                <label className="block text-gray-700 text-sm font-medium mt-3">Estado</label>
                                <SelectStyle
                                    onChange={select => {
                                        if (select && select.value) {
                                            setFieldValue("streetDistrict", {
                                                name: select.label,
                                                identifier: select.value,
                                            });
                                            setFieldValue("city", {});
                                            handleSelectUf(select);
                                        } else {
                                            setFieldValue("streetDistrict", {});
                                            setFieldValue("city", {});
                                        }
                                    }}
                                    name={"streetDistrict"}
                                    id={"streetDistrict"}
                                    value={
                                        values.streetDistrict !== undefined && {
                                            label: values.streetDistrict.name,
                                            value: values.streetDistrict.identifier,
                                        }
                                    }
                                    optionsMap={(() => {
                                        let options = [];

                                        stateList.map(state => {
                                            return options.push({
                                                value: state.identifier,
                                                label: state.name,
                                            });
                                        });
                                        return options;
                                    })()}
                                />
                                <Error name="streetDistrict" />
                            </div>
                            <div className="w-1/2 pl-2">
                                <label className="block text-gray-700 text-sm font-medium mt-3">Cidade</label>
                                <SelectStyle
                                    onChange={select => {
                                        if (select && select.value) {
                                            setFieldValue("city", {
                                            name: select.label,
                                            identifier: select.value,
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
                                            value: values.city.identifier,
                                        }
                                    }
                                    optionsMap={(() => {
                                        let options = [];

                                        citySelect.map(city =>
                                            options.push({
                                                value: city.identifier,
                                                label: city.name,
                                            })
                                        );
                                        return options;
                                    })()}
                                />
                                <Error name="city" />
                            </div>
                            <div className="w-1/2 pl-2">
                                <label className="block text-gray-700 text-sm font-medium mt-3">Cor da empresa</label>
                                <SketchPicker  
                                    name={"color"}
                                    color={color}   
                                    onChange={(color) => {setColor(color)}} 
                                />
                            </div>
                        </div>
                        <div className="flex justify-end pt-2">
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

export default ModalCreate;
