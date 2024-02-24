import React, { useState } from "react";

import ModalImportBack from "../../../components/Modais/ModalImportBack";
import FormContent from "../../../components/Modais/ModalImportBack/FormContent";

const ModalImport = ({ modalPost, actionModalPost }) => {
    const fill = {
        columns: [
            "CSV",
            "Prefixo",
            "Placa",
            "Número do chassi",
            "Ano do chassi",
            "Modelo do chassi",
            "Modelo da carroceria",
            "Ano da carroceria",
            "Número de portas",
            "Meta de consumo",
            "Início da operação",
            "OBD",
            "Empresa",
            "Número de assentos",
            "Número de lugares em pé",
            "Última inspeção",
            "Status do veículo",
        ],
        example: "/assets/csv/exempleVeiculos.csv",
        uri: "/api/adm/vehicle/import",
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
