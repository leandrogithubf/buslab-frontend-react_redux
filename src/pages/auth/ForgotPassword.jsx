import React, { useState } from "react";
import busSVG from "../../assets/svgs/bus.svg";
import busGray from "../../assets/svgs/BusLab_cinza.svg";
import ButtonDefault from "../../components/Buttons/default/ButtonDefault";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { Formik, ErrorMessage } from "formik";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-toastify";
import RuntimeEnv from "../../config/RuntimeEnv";
const yup = require("yup");

const schemaRecover = yup.object().shape({
    user: yup.string().email("E-mail inválido").required("Campo obrigatório"),
    recaptcha_token: yup.string().required("O campo é obrigatório"),
});

const schemaSend = yup.object().shape({
    password: yup.string().min(6, "A senha deve conter no mínimo 6 caracteres").required("Campo obrigatório"),
    confirmPassword: yup.string().min(6, "A senha deve conter no mínimo 6 caracteres").required("Campo obrigatório"),
    code: yup.string().required("Campo obrigatório"),
    recaptcha_token: yup.string().required("O campo é obrigatório"),
});
const ForgotPassword = () => {
    const recaptchaRef = React.createRef();

    const [stage, setStage] = useState(1);
    const nextStage = () => {
        setStage(stage + 1);
    };
    const requestRecover = values => {
        return api.post("api/recover/request", values);
    };

    const sendRecover = values => {
        return api.post("api/recover/send", values);
    };

    return (
        <div className="bg-buslab min-h-screen flex justify-center content-center flex-wrap">
            <div className="w-30">
                <div className="bg-white py-4 px-12 border-radius-5">
                    <div className="flex justify-center">
                        <img src={busSVG} className="mr-4" alt="ônibus" />
                        <img src={busGray} alt="logo buslab" width={90} />
                    </div>
                    {stage === 1 && (
                        <>
                            <p className="text-center md:px-16 lg:px-24 xl:px-24 mt-8  text-c7-14 text-14 font-medium">
                                Informe o e-mail cadastrado para receber instruções para a recuperação da sua conta
                            </p>
                            <Formik
                                initialValues={{
                                    user: "",
                                }}
                                validationSchema={schemaRecover}
                                onSubmit={(values, { setFieldError, setSubmitting }) => {
                                    setSubmitting(true);
                                    requestRecover(values)
                                        .then(response => {
                                            nextStage();
                                            setSubmitting(false);
                                        })
                                        .catch(error => {
                                            setSubmitting(false);
                                        });
                                }}>
                                {({
                                    handleChange,
                                    handleSubmit,
                                    isSubmitting,
                                    errors,
                                    values,
                                    touched,
                                    setFieldValue,
                                    handleBlur,
                                }) => (
                                    <form className="mt-10 px-6" onSubmit={handleSubmit}>
                                        <label className=" text-c7-14 text-14 font-medium mb-1">E-mail</label>
                                        <input
                                            onChange={handleChange}
                                            className="appearance-none block w-full text-c7-14 text-14 border border-gray-400 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                            type="text"
                                            name="user"
                                        />
                                        <ErrorMessage
                                            component="p"
                                            name="user"
                                            className="text-red-600 font-light text-14"
                                        />
                                        <ReCAPTCHA
                                            className="mt-3 g-recaptcha"
                                            ref={recaptchaRef}
                                            name="recaptcha_token"
                                            sitekey={RuntimeEnv.SITE_KEY}
                                            onChange={response => setFieldValue("recaptcha_token", response)}
                                        />
                                        <ErrorMessage
                                            component="p"
                                            name="recaptcha_token"
                                            className="text-red-600 mt-4 font-light text-14"
                                        />
                                        <div className="flex justify-between items-center mt-4">
                                            <Link to="/login">
                                                <p className="text-buslab mr-10 underline cursor-pointer">
                                                    Voltar
                                                </p>
                                            </Link>
                                            <ButtonDefault className="px-8" title="Enviar" type="submit" />
                                        </div>
                                    </form>
                                )}
                            </Formik>
                        </>
                    )}
                    {stage === 2 && (
                        <Formik
                            initialValues={{
                                code: "",
                                password: "",
                                confirmPassword: "",
                            }}
                            validationSchema={schemaSend}
                            onSubmit={(values, { setFieldError }) => {
                                if (values.password === values.confirmPassword) {
                                    delete values.confirmPassword;
                                    sendRecover(values)
                                        .then(response => {
                                            nextStage();
                                        })
                                        .catch(error => {
                                            toast.info("Algo deu errado ao recuperar a senha!");
                                        });
                                } else {
                                    setFieldError("confirmPassword", "As senhas não coincidem");
                                }
                            }}>
                            {({
                                handleChange,
                                handleSubmit,
                                isSubmitting,
                                errors,
                                values,
                                touched,
                                handleBlur,
                                setFieldValue,
                            }) => (
                                <form className="mt-10 px-6" onSubmit={handleSubmit}>
                                    <label className="text-c7-14 text-14 font-medium mb-1">
                                        Insira o código rebecido por email
                                    </label>
                                    <input
                                        className="appearance-none block w-full text-c7-14 border border-gray-400 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        type="text"
                                        onChange={handleChange}
                                        name="code"
                                    />
                                    <ErrorMessage
                                        component="p"
                                        name="code"
                                        className="text-red-600 font-light text-14"
                                    />

                                    <label className=" text-c7-14 text-14 font-medium mb-1 w-full">
                                        Insira sua nova senha (min. 8 caracteres)
                                    </label>
                                    <input
                                        className="appearance-none block w-full text-c7-14 border border-gray-400 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        type="password"
                                        autoComplete="current-password"
                                        onChange={handleChange}
                                        name="password"
                                    />
                                    <ErrorMessage
                                        component="p"
                                        name="password"
                                        className="text-red-600 font-light text-14"
                                    />
                                    <label className="text-c7-14 text-14 font-medium mb-1">Confirme a senha</label>
                                    <input
                                        className="appearance-none block w-full text-c7-14 border border-gray-400 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                        onChange={handleChange}
                                        type="password"
                                        name="confirmPassword"
                                        autoComplete="current-password"
                                    />
                                    <ErrorMessage
                                        component="p"
                                        name="confirmPassword"
                                        className="text-red-600 font-light text-14"
                                    />
                                    <ReCAPTCHA
                                        className="mt-3 g-recaptcha"
                                        ref={recaptchaRef}
                                        name="recaptcha"
                                        sitekey={RuntimeEnv.SITE_KEY}
                                        onChange={response => setFieldValue("recaptcha_token", response)}
                                    />
                                    <ErrorMessage
                                        component="p"
                                        name="recaptcha_token"
                                        className="text-red-600 font-light text-14"
                                    />

                                    <div className="flex justify-end">
                                        <ButtonDefault className="px-8" title="Salvar" type="submit" />
                                    </div>
                                </form>
                            )}
                        </Formik>
                    )}
                    {stage === 3 && (
                        <>
                            <p className="text-center  text-c7-14 text-14 mt-8 mb-8 font-medium">
                                Sua senha foi alterada com sucesso!
                            </p>
                            <div className="flex justify-center">
                                <Link to="/login">
                                    <ButtonDefault className="px-6" title="Fazer login" />
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
