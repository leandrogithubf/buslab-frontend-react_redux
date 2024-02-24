const yup = require("yup");

const Schema = yup.object().shape({
    description: yup.string(),
    tableCode: yup.string().required("Campo obrigatório"),
    sequence: yup.string().required("Campo obrigatório"),
    startsAt: yup.string().required("Campo obrigatório"),
    endsAt: yup.string().required("Campo obrigatório"),
    dataValidity: yup.string().required("Campo obrigatório"),
    modality: yup.string().required("Campo obrigatório"),
    weekInterval: yup.string().required("Campo obrigatório"),
    line: yup.string().required("Campo obrigatório"),
    vehicle: yup.string(),
    driver: yup.string(),
    collector: yup.string(),
    company: yup.string().required("Campo obrigatório"),
});

export default Schema;
