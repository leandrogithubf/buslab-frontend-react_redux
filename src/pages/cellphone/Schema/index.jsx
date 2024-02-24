const yup = require("yup");

const SchemaNumberCellphone = yup.object().shape({
    number: yup.string().required("Campo obrigatório"),
});

export default SchemaNumberCellphone;
