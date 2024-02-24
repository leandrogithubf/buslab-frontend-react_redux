const yup = require("yup");

const Schema = yup.object().shape({
    name: yup.string().required("Campo obrigatório"),
    email: yup.string().email('Digite um email válido').required("Campo obrigatório"),
    documentNumber: yup.string().required("Campo obrigatório"),
    password: yup.string().required("Campo obrigatório"),
    cellphone: yup.string().required("Campo obrigatório"),
    passwordConfirm: yup.string().required("Campo obrigatório"),
});

export default Schema;
