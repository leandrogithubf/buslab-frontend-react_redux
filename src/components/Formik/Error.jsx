import React from "react";
import { ErrorMessage } from "formik";

const ErrorFormik = ({ name }) => {
    return <ErrorMessage component="p" className="text-red-600 text-sm" name={name} />;
};
export default ErrorFormik;
