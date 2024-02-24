const yup = require("yup");

const Schema = yup.object().shape({
    company: yup.string().required("Campo obrigatório"),
    obd: yup.string().required("Campo obrigatório"),
    prefix: yup.string().required("Campo obrigatório"),
    plate: yup.string().required("Campo obrigatório"),
    consumptionTarget: yup.string().required("Campo obrigatório"),
    startOperation: yup.string().required("Campo obrigatório"),
    model: yup.string(),
    manufacture: yup.string(),
    chassi: yup.string()
});

const SchemaBrand = yup.object().shape({
    description: yup.string().required("Campo obrigatório"),
});

const SchemaModel = yup.object().shape({
    description: yup.string().required("Campo obrigatório"),
    brand: yup.string().required("Campo obrigatório"),
});

export { Schema, SchemaBrand, SchemaModel };
export default Schema;
