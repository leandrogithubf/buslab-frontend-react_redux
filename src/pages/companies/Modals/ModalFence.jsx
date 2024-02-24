import React from "react";
import { Field, Formik } from "formik";
import api from "../../../services/api";
import { toast } from "react-toastify";
import ModalForm from "../../../components/Modais/ModalForm";
import ButtonDefault from "../../../components/Buttons/default/ButtonDefault";
import { SchemaFence } from "../Schema";
import HeaderToken from "../../../services/headerToken";
import Interceptor from "../../../services/interceptor";
import { Error } from "../../../components/Formik";
import { ClipLoader } from "react-spinners";
const ModalFence = ({
    modalFence,
    actionModalPost,
    data,
    identifier,
    getList,
    setMode,
    setActionFence,
}) => {
    return (
        <ModalForm
            onClose={actionModalPost}
            show={modalFence}
            title={<h4 className="mt-6 mb-4">Cadastrar cerca</h4>}>
            <Formik
                initialValues={{
                    name: "",
                }}
                validationSchema={SchemaFence}
                onSubmit={(values, { setSubmitting }) => {
                    api.post(
                        `/api/adm/company/${identifier}/place/new`,
                        {
                            description: values.name,
                            markers: JSON.stringify(data.temp),
                        },
                        HeaderToken()
                    )
                        .then(res => {
                            actionModalPost();
                            setActionFence(false);
                            getList();
                            toast.info("Cadastro de cerca concluído!");
                        })
                        .catch(error => {
                            Interceptor(error);
                            setActionFence(false);
                        })
                        .finally(() => setSubmitting(false));
                }}>
                {({ handleSubmit, isSubmitting }) => (
                    <form onSubmit={handleSubmit}>
                        <div className="flex justify-between mb-2">
                            <div className="w-10/12 pr-3">
                                <Field
                                    name="name"
                                    className="appearance-none w-full block text-gray-700 border rounded  border-gray-300 px-1 focus:outline-none h-9"
                                    placeholder="Nome da nova área"
                                />
                                <Error name="name" />
                            </div>
                            <div className="flex justify-end">
                                <ButtonDefault
                                    title={
                                        isSubmitting ? (
                                            <ClipLoader size={10} color="#fff" />
                                        ) : (
                                            "Adicionar"
                                        )
                                    }
                                    type="submit"
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </form>
                )}
            </Formik>
        </ModalForm>
    );
};

export default ModalFence;
