const yup = require("yup");

const Schema = yup.object().shape({
    code: yup.string().required("Campo obrigatório").max(20, "Atingiu o limite de caracteres"),
    description: yup.string().required("Campo obrigatório").max(255, "Atingiu o limite de caracteres"),
    direction: yup.string().required("Campo obrigatório"),
    passage: yup.string().max(17, "Atingiu o limite de caracteres"),
    company: yup.string().required("Campo obrigatório"),
});

export default Schema;
