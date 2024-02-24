import React, { useState } from "react";

import ModalImportBack from "../../../components/Modais/ModalImportBack";
import FormContent from "../../../components/Modais/ModalImportBack/FormContent";

const ModalImport = ({ modalPost, actionModalPost }) => {
    const fill = {
        columns: [
            "CSV",
            "Número",
        ],
        example: "/assets/csv/exempleCellphones.csv",
        uri: "/api/adm/cellphone/import",
    };

    return (
        <ModalImportBack
            overflow
            onClose={actionModalPost}
            show={modalPost}
            title={<h4 className="mb-4">Cadastro de números de celular</h4>}>
            <FormContent fill={fill} actionModalPost={actionModalPost} />
        </ModalImportBack>
    );
};

export default ModalImport;
