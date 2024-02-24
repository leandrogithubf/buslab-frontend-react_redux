const yup = require("yup");

const Schema = yup.object().shape({
    serial: yup.string().required("Campo obrigatório"),
    version: yup.string().required("Campo obrigatório"),
    cellphoneNumber: yup.string().required("Campo obrigatório"),
    company: yup.string().required("Campo obrigatório"),
});
export default Schema;
