const yup = require("yup");

const Schema = yup.object().shape({
    description: yup.string().required("Campo obrigatório"),
    streetName: yup.string().required("Campo obrigatório"),
    streetNumber: yup.string().required("Campo obrigatório"),
    streetComplement: yup.string(),
    streetCode: yup.string().required("Campo obrigatório"),
    streetDistrict: yup.string().required("Campo obrigatório"),
    city: yup.string().required("Campo obrigatório"),
});

const SchemaFence = yup.object().shape({
    name: yup.string().required("Campo obrigatório"),
});

export { Schema, SchemaFence };
