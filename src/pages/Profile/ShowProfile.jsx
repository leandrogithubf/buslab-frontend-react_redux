import React, { useState, useEffect } from "react";
import Title from "../../components/Title";
import Card from "../../components/Cards/Card";
import Back from "../../components/Back";
import api from "../../services/api";
import HeaderToken from "../../services/headerToken";
import { Label, Information, Pencil, Save, LoadSave } from "../../components/Details";
import { Formik } from "formik";
import Colors from "../../assets/constants/Colors";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import Interceptor from "../../services/interceptor";
import { Input } from "../../components/Formik";

const ShowProfile = props => {
    const [activeEdit, setActiveEdit] = useState();
    const [profile, setProfile] = useState({
        email: "",
        identifier: "",
        name: "",
        password: "",
        role: {},
    });
    const [load, setLoad] = useState();

    const setInputActive = value => {
        setActiveEdit(value);
    };

    useEffect(() => {
        setLoad(true);
        api.get(`api/profile/show`, HeaderToken())
            .then(response => {
                setProfile(response.data);
                setLoad(false);
            })
            .catch(error => {
                setLoad(false);
                Interceptor(error);
            });
    }, []);

    const saveProfile = dataProfile => {
        return api.post(`api/profile/edit`, dataProfile, HeaderToken());
    };

    return (
        <>
            <Title title="Perfil" crumbs={props.crumbs} />
            <Card>
                {load ? (
                    <div className="justify-center w-full">
                        <ClipLoader size={20} color={Colors.buslab} loading={true} />
                    </div>
                ) : (
                    <Formik
                        initialValues={{
                            name: profile.name,
                            email: profile.email,
                            password: "",
                        }}
                        enableReinitialize={true}
                        onSubmit={(values, { setSubmitting }) => {
                            saveProfile(values)
                                .then(() => {
                                    toast.info("Perfil alterado com sucesso!");
                                    setSubmitting(false);
                                    setInputActive("");
                                    window.localStorage.setItem("session-user-name", values.name);
                                    window.location.reload();
                                })
                                .catch((error) => {
                                    error.response.data.errors.forEach((error)=>{
                                        toast.warning(error.message);
                                    })
                                    setSubmitting(false);
                                    setInputActive("");
                                });
                        }}>
                        {({ handleChange, handleSubmit, values, handleBlur, isSubmitting }) => (
                            <form onSubmit={handleSubmit}>
                                <div className="flex justify-between mb-2">
                                    <div>
                                        <Back />
                                        <h3 className="font-light mb-1 mt-3">Informações gerais</h3>
                                    </div>
                                    <LoadSave isSubmitting={isSubmitting} />
                                </div>
                                <div className="flex">
                                    <div className="xs:w-full sm:w-full md:w-full lg:w-1/2">
                                        <div className="sm:w-full xs:w-full bg-tablerow flex justify-center items-center">
                                            <Label description="Nome" />
                                            <div className="flex justify-between w-2/3">
                                                {" "}
                                                {activeEdit === "name" ? (
                                                    <>
                                                        <Input
                                                            onChange={handleChange}
                                                            name="name"
                                                            value={values.name}
                                                        />
                                                        <Save handleSubmit={handleSubmit} />
                                                    </>
                                                ) : (
                                                    <>
                                                        <Information description={values.name} />
                                                        <Pencil setInputActive={() => setInputActive("name")} />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="sm:w-full xs:w-full flex justify-center items-center">
                                            <Label description="Email" />
                                            <div className="flex justify-between w-2/3">
                                                {" "}
                                                {activeEdit === "email" ? (
                                                    <>
                                                        <Input
                                                            onChange={handleChange}
                                                            name="email"
                                                            value={values.email}
                                                        />
                                                        <Save handleSubmit={handleSubmit} />
                                                    </>
                                                ) : (
                                                    <>
                                                        <Information description={values.email} />
                                                        <Pencil setInputActive={() => setInputActive("email")} />
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="sm:w-full xs:w-full bg-tablerow flex justify-center items-center">
                                            <Label description="Senha" />
                                            <div className="flex justify-between w-2/3">
                                                {" "}
                                                {activeEdit === "password" ? (
                                                    <>
                                                        <Input
                                                            type="password"
                                                            onChange={handleChange}
                                                            name="password"
                                                            value={values.password}
                                                        />
                                                        <Save handleSubmit={handleSubmit} />
                                                    </>
                                                ) : (
                                                    <>
                                                        <Information description={"*********"} />
                                                        <Pencil setInputActive={() => setInputActive("password")} />
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
export default ShowProfile;
