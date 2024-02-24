import ReactInputMask from "react-input-mask";
import React, { useState, useEffect } from "react";
import Card from "../../components/Cards/Card";
import Title from "../../components/Title";
import api from "../../services/api";
import { toast } from "react-toastify";
import Colors from "../../assets/constants/Colors";
import ClipLoader from "react-spinners/ClipLoader";
import Back from "../../components/Back";
import SchemaNumberCellphone from "./Schema";
import { InformationMask, Pencil, LoadSave, Save } from "../../components/Details";
import { Formik } from "formik";
import HeaderToken from "../../services/headerToken";
import { Input } from "../../components/Formik";
import Interceptor from "../../services/interceptor";
const ShowCellphone = props => {
    let [load, setLoad] = useState(false);
    let [cellphone, setCellphone] = useState(false);
    let [activeEdit, setActiveEdit] = useState();
    let [breadcrumbs, setBreadcrumbs] = useState([]);

    useEffect(() => {
        getCellphoneDetail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getCellphoneDetail = () => {
        setLoad(true);
        api.get(`api/adm/cellphone/${props.match.params.id}/show`, HeaderToken())
            .then(response => {
                setCellphone(response.data);
                setLoad(false);
                let crumbs = props.crumbs[props.crumbs.length - 1];
                crumbs["name"] = response.data.number;
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
            <Title title={"Detalhes do número de celular"} crumbs={breadcrumbs} />
            <Card>
                <>
                    {load ? (
                        <div className="justify-center w-full">
                            <ClipLoader size={20} color={Colors.buslab} loading={load} />
                        </div>
                    ) : (
                        <Formik
                            initialValues={{
                                number: cellphone.number,
                            }}
                            enableReinitialize={true}
                            validationSchema={SchemaNumberCellphone}
                            onSubmit={(values, { setSubmitting }) => {
                                api.post(
                                    `api/adm/cellphone/${cellphone.identifier}/edit`,
                                    {
                                        number: values.number.replace(/[^0-9]/g, ""),
                                    },
                                    HeaderToken()
                                )
                                    .then(res => {
                                        toast.info("Celular alterado com sucesso!");
                                        setSubmitting(false);
                                        setActiveEdit();
                                    })
                                    .catch(error => {
                                        setLoad(false);
                                        setSubmitting(false);
                                        Interceptor(error);
                                    });
                            }}>
                            {({ handleChange, handleSubmit, isSubmitting, values, handleBlur }) => (
                                <form onSubmit={handleSubmit}>
                                    <div className="flex flex-wrap justify-between">
                                        <Back />
                                        <LoadSave isSubmitting={isSubmitting} />
                                    </div>
                                    <h3 className="font-light mb-1">Informações gerais</h3>
                                    <div className="w-1/2 bg-tablerow flex justify-center">
                                        <h3 className="text-14 text-c7-14 font-medium py-4 mr-2 w-1/3 text-right">
                                            Número de celular
                                        </h3>
                                        <div className="flex justify-between w-2/3">
                                            {activeEdit === "number" ? (
                                                <>
                                                    <ReactInputMask
                                                        type="text"
                                                        mask="(99) 99999-9999"
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        disabled={isSubmitting}
                                                        name="number"
                                                        value={values.number}
                                                        className={`appearance-none w-full block text-gray-700 border rounded  border-gray-300 px-1 focus:outline-none h-9}`}
                                                    />
                                                    {/*<Input onChange={handleChange} name="number" value={values.number} />*/}
                                                    <Save handleSubmit={handleSubmit} />
                                                </>
                                            ) : (
                                                <>
                                                    <InformationMask
                                                        mask="(##) #####-####"
                                                        description={values.number}
                                                    />
                                                    <Pencil setInputActive={() => setInputActive("number")} />
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </form>
                            )}
                        </Formik>
                    )}
                </>
            </Card>
        </>
    );
};

export default ShowCellphone;
