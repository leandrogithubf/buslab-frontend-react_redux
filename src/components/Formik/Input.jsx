import React from "react";
import { Field } from "formik";

const InputFormik = ({ name, type, placeholder, onChange }) => {
    const component = type === "textarea" ? "textarea" : "input";
    return (
        <Field
            type={type}
            component={component}
            className={`appearance-none w-full block text-gray-700 border rounded  border-gray-300 px-1 focus:outline-none ${
                type === "textarea" ? "h-20 resize-none" : "h-9"
            }`}
            name={name}
            onChange={onChange}
            placeholder={placeholder}
        />
    );
};
export default InputFormik;
