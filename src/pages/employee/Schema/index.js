const yup = require("yup");

const Schema = yup.object().shape({
    name: yup.string().required("Campo obrigatório"),
    modality: yup.string().required("Campo obrigatório"),
    code: yup.string().min(1).max(9, "O limite de caracteres é 9").required("Campo obrigatório"),
    company: yup.string().required("Campo obrigatório"),
});

export default Schema;
