const yup = require("yup");

const Schema = yup.object().shape({
    driver: yup.string().required("Campo obrigatório"),
    collector: yup.string().required("Campo obrigatório"),
    line: yup.string().required("Campo obrigatório"),
    vehicle: yup.string().required("Campo obrigatório"),
    company: yup.string().required("Campo obrigatório"),
    starts_at: yup.string().required("Campo obrigatório"),
    ends_at: yup.string().required("Campo obrigatório"),
    status: yup.string().required("Campo obrigatório"),
    modality: yup.string().required("Campo obrigatório"),
    schedule: yup.string().required("Campo obrigatório"),
    trip: yup.string().required("Campo obrigatório"),
});

export default Schema;

