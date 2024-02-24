import React from "react";
import FormContent from "../../../components/Modais/ModalImportBack/FormContent";
import ModalImportBack from "../../../components/Modais/ModalImportBack";
const ModalImport = ({ modalPost, actionModalPost }) => {
    const fill = {
        columns: [
            "CSV",
            "Código da linha",
            "Nome",
            "Sentido",
            "Valor da passagem",
            "Limite de velocidade",
            "Empresa",
        ],
        example: "/assets/csv/exempleLinhas.csv",
        uri: "/api/adm/line/import",
    };

    return (
        <ModalImportBack
            overflow
            onClose={actionModalPost}
            show={modalPost}
            title={<h4 className="mb-4">Cadastro de veículos</h4>}>
            <FormContent fill={fill} actionModalPost={actionModalPost} />
        </ModalImportBack>
    );
};

export default ModalImport;
