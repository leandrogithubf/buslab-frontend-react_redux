const yup = require("yup");

const Schema = yup.object().shape({
    comment: yup.string().required("Campo obrigatório").min(0).max(255, "Você atingiu o limite de caracteres"),
    start: yup.string().required("Campo obrigatório"),
    end: yup.string().required("Campo obrigatório"),
    vehicle: yup.string().required("Campo obrigatório"),
    category: yup.string().required("Campo obrigatório"),
    status: yup.string().required("Campo obrigatório"),
});

export default Schema;
