const yup = require("yup");

const Schema = yup.object().shape({
    consumption: yup.string().required("Campo obrigatório"),
    date: yup.string().required("Campo obrigatório"),
    company: yup.string().required("Campo obrigatório"),
});
export default Schema;
