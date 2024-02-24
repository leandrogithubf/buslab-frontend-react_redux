const yup = require("yup");

const Schema = yup.object().shape({
    value: yup.string().required("Campo obrigatório"),
    date: yup.string().required("Campo obrigatório"),
    company: yup.string().required("Campo obrigatório"),
});
export default Schema;
