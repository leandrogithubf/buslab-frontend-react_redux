import React from "react";

import ModalImportBack from "../../../components/Modais/ModalImportBack";
import FormContent from "../../../components/Modais/ModalImportBack/FormContent";

const ModalImport = ({ modalPost, actionModalPost }) => {
    const fill = {
        columns: [
            "CSV",
            "Código da tabela",
            "Sequência",
            "Horário de início",
            "Horário de fim",
            "Validade",
            "Modalidade",
            "Intervalo",
            "Código da linha",
            "Sentido da linha",
            "Prefixo do veículo",
            "Código do motorista",
            "Código do cobrador",
            "Empresa",
        ],
        example: "/assets/csv/exempleEscalas.csv",
        uri: "/api/adm/schedule/import",
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
