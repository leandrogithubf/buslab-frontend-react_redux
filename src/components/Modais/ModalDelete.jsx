import React from "react";
import ModalBody from "../Modais/ModalBody";
import ButtonDefault from "../Buttons/default/ButtonDefault";
import ButtonIconTextRed from "../Buttons/red/ButtonIconTextRed";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import api from "../../services/api";
import { useHistory } from "react-router-dom";
import HeaderToken from "../../services/headerToken";

const ModalDelete = ({ actionModalDelete, modalDelete, getList, identifier, type, name, url, redirect, data }) => {
    const history = new useHistory();
    const removeItem = () => {
        api.delete(`api/adm/${url}/${identifier}/remove`, HeaderToken())
            .then(response => {
                toast.info(`A exclusão de ${name} foi bem sucedida!`);
                actionModalDelete();
                type === "create" && getList();
                type === "edit" && history.push(redirect);
            })
            .catch(error => {
                if (error.response.data.message !== undefined) {
                    return toast.info(error.response.data.message);
                }
            });
    };

    return (
        <ModalBody onClose={actionModalDelete} show={modalDelete}>
            <div className="mb-4">
                <h4 className="mb-2 flex justify-center">Excluir?</h4>
                <p className="mb-4 flex justify-center">Esta ação não poderá ser desfeita</p>
                {data && (
                    <p className="mb-4 flex justify-center">Os seguintes dados serão desvinculados e /ou excluídos</p>
                )}
                {data?.map((item, index) => {
                    return (
                        <p className="mb-4 flex justify-center">{item}</p>
                    )                    
                })}
                <div className="flex justify-center">
                    <ButtonDefault title="Cancelar" onClick={actionModalDelete} />
                    <div className="ml-4">
                        <ButtonIconTextRed
                            title="Excluir"
                            onClick={removeItem}
                            icon={<FontAwesomeIcon icon={faTrash} />}
                        />
                    </div>
                </div>
            </div>
        </ModalBody>
    );
};

export default ModalDelete;
