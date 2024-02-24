import { Link, useHistory } from "react-router-dom";
import { Formik, Field, ErrorMessage } from "formik";
import React, { useEffect, useState } from "react";
import ButtonDefault from "../../components/Buttons/default/ButtonDefault";
import busGray from "../../assets/svgs/BusLab_cinza.svg";
import busSVG from "../../assets/svgs/bus.svg";
import api from "../../services/api";
import ReCAPTCHA from "react-google-recaptcha";
import HeaderToken from "../../services/headerToken";
import { FaTimes } from "react-icons/fa";
import RuntimeEnv from "../../config/RuntimeEnv";
const yup = require("yup");

const Login = () => {
    const [showCaptcha, setShowCaptcha] = useState(false);
    let history = new useHistory();

    const recaptchaRef = React.createRef();

    const requestLogin = values => {
        return api.post("api/login/check", values);
    };

    const getProfile = token => {
        return api.get("api/profile/show", token);
    };

    useEffect(() => {
        verifyAuth();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const verifyAuth = () => {
        const token = window.localStorage.getItem("session-token");
        if (token !== undefined || token !== null) {
            getProfile(HeaderToken())
                .then(() => {
                    history.push("/dashboard");
                })
                .catch(function (error) {
                    console.log("Session present, but expired");
                });
        }
    };

    return (
        <div className="bg-buslab min-h-screen flex justify-center content-center flex-wrap">
            <div className="bg-white py-4 px-4 border-radius-5 w-30">
                <div className="flex justify-center">
                    <img src={busSVG} className="mr-4" alt="ônibus" />
                    <img src={busGray} alt="logo buslab" width={95} />
                </div>
                <Formik
                    initialValues={{
                        username: "",
                        password: "",
                    }}
                    validationSchema={yup.object().shape({
                        password: yup
                            .string()
                            .min(6, "A senha deve conter no mínimo 6 caracteres")
                            .required("Campo obrigatório"),
                        username: yup.string().email("E-mail inválido").required("Campo obrigatório"),
                    })}
                    onSubmit={(values, { setFieldError, setSubmitting }) => {
                        setSubmitting(true);
                        requestLogin(values)
                            .then(resLogin => {
                                var token = resLogin.data.token;
                                window.localStorage.setItem("session-token", token);
                                getProfile({
                                    headers: {
                                        Authorization: `Bearer ${token}`,
                                    },
                                }).then(resProfile => {
                                    window.localStorage.setItem(
                                        "session-user-name",
                                        resProfile.data.name
                                    );
                                    window.localStorage.setItem(
                                        "session-role",
                                        resProfile.data.role
                                    );

                                    resProfile.data.company &&
                                        window.localStorage.setItem(
                                            "session-user-company",
                                            JSON.stringify(resProfile.data.company)
                                        );

                                    history.push("/dashboard");
                                    setSubmitting(false);
                                });
                            })
                            .catch(error => {
                                setSubmitting(false);

                                if (error.response.data.message == 'INVALID_RECAPTCHA') {
                                    setShowCaptcha(true);
                                    return;
                                } else {
                                    setFieldError(
                                        "general",
                                        "Não foi possível realizar o login. Insira o e-mail e senha válidos"
                                    );
                                }
                            });
                    }}>
                    {({
                        handleSubmit,
                        isSubmitting,
                        errors,
                        setFieldValue,
                    }) => (
                        <form className="mt-10" onSubmit={handleSubmit}>
                            <label className="block text-14 text-c7-14 font-medium mb-2">
                                Email
                            </label>
                            <Field
                                type="text"
                                className="appearance-none block w-full text-gray-700 border border-gray-400 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                autoComplete="username"
                                name="username"
                            />
                            <ErrorMessage
                                component="p"
                                className="text-red-600 mb-4 font-light text-14"
                                name="username"
                            />
                            <label
                                className="block  text-14 text-c7-14 font-medium mb-2 mt-4"
                                htmlFor="password">
                                Senha
                            </label>
                            <Field
                                type="password"
                                className="appearance-none block w-full text-gray-700 border border-gray-400 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                autoComplete="current-password"
                                name="password"
                            />
                            <ErrorMessage
                                component="p"
                                className="text-red-600 mb-4 font-light text-14"
                                name="password"
                            />
                            {showCaptcha && (
                                <div className="modal-captcha h-100vh">
                                    <div className="captcha m-auto p-4 text-center align-middle">
                                        <div
                                            className="cursor-pointer m-2 float-right"
                                            onClick={() => {
                                                setShowCaptcha(false);
                                            }}
                                        >
                                            <FaTimes />
                                        </div>
                                        <ReCAPTCHA
                                            className="mt-4 g-recaptcha mb-2"
                                            ref={recaptchaRef}
                                            name="recaptcha_token"
                                            size="normal"
                                            sitekey={RuntimeEnv.SITE_KEY}
                                            onChange={response => {
                                                setFieldValue("recaptcha_token", response)
                                                setShowCaptcha(false);
                                                handleSubmit();
                                            }}
                                        />
                                    </div>
                                </div>
                            )}
                            <div className="flex justify-between items-center mt-4">
                                <Link to="/recuperacao">
                                    <p className="text-buslab mr-10 underline cursor-pointer">
                                        Esqueci a minha senha
                                    </p>
                                </Link>
                                <ButtonDefault
                                    disabled={isSubmitting}
                                    className="px-8"
                                    title={!isSubmitting ? "Entrar" : "carregando..."}
                                    type="submit"
                                />
                            </div>
                            {errors.general && (
                                <p className="text-red-600 mt-4 font-light text-14">
                                    {errors.general}
                                </p>
                            )}
                        </form>
                    )}
                </Formik>
            </div>
        </div>
    );
};

export default Login;
