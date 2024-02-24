import React from "react";

import ModalImportBack from "../../../components/Modais/ModalImportBack";
import FormContent from "../../../components/Modais/ModalImportBack/FormContent";

const ModalImport = ({ modalPost, actionModalPost }) => {
    const fill = {
        columns: [
            "CSV",
            "Nome",
            "Código",
            "Empresa",
            "Função",
            "CNH",
            "Vencimento da CNH",
            "Celular",
        ],
        example: "/assets/csv/exempleColaboradores.csv",
        uri: "/api/adm/employee/import",
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
