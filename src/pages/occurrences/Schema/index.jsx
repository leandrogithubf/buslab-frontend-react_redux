const yup = require("yup");

const Schema = yup.object().shape({
    comment: yup.string().required("Campo obrigatório"),
    action: yup.string(),
    local: yup.string(),
    start: yup.string().required("Campo obrigatório"),
    end: yup.string(),
    vehicle: yup.string(),
    category: yup.string().required("Campo obrigatório"),
    line: yup.string(),
    employee: yup.string(),
    sector: yup.string(),
});

export default Schema;
