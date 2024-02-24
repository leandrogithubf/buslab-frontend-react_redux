import React from "react";
import ModalForm from "../../../components/Modais/ModalForm";
import { Formik } from "formik";
import api from "../../../services/api";
import { toast } from "react-toastify";
import ButtonDefault from "../../../components/Buttons/default/ButtonDefault";
import ClipLoader from "react-spinners/ClipLoader";
import ReactInputMask from "react-input-mask";
import Colors from "../../../assets/constants/Colors";
import SchemaNumberCellphone from "../Schema";
import HeaderToken from "../../../services/headerToken";

const ModalCreate = ({ modalPost, actionModalPost, getList, setLoad }) => {
    return (
        <ModalForm
            size="w-1/4"
            onClose={actionModalPost}
            show={modalPost}
            title={<h4 className="mt-6 mb-4">Cadastrar número de telefone</h4>}>
            <Formik
                initialValues={{
                    number: "",
                }}
                validationSchema={SchemaNumberCellphone}
                onSubmit={(values, { setSubmitting }) => {
                    api.post(
                        `api/adm/cellphone/new`,
                        {
                            number: values.number.replace(/[^0-9]/g, ""),
                        },
                        HeaderToken()
                    )
                        .then(res => {
                            setSubmitting(false);
                            toast.info("Cadastro de celular concluído!");
                            actionModalPost();
                            getList();
                        })
                        .catch(error => {
                            setSubmitting(false);
                            error.response && error.response.data.errors.map(erro => {
                                return toast.info(erro.message);
                            });
                        });
                }}>
                {({ handleChange, handleSubmit, isSubmitting, errors, values, touched, handleBlur }) => (
                    <form className="w-fill" onSubmit={handleSubmit}>
                        <label className="block text-gray-700 text-sm font-medium mb-2">Número de telefone</label>
                        <ReactInputMask
                            className="appearance-none block text-gray-700 border border-gray-300 py-2 px-4 focus:outline-none w-full pr-2"
                            type="text"
                            mask="(99) 99999-9999"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            disabled={isSubmitting}
                            name="number"
                            value={values.number}
                        />
                        {touched.number && errors.number && (
                            <span className="text-red-600 text-sm">{errors.number}</span>
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

export default ModalCreate;
