import React from "react";
import PropTypes from "prop-types";
const ButtonPaginate = ({ children, type, className, disabled, onClick }) => {
    return (
        <button
            disabled={disabled}
            onClick={onClick}
            className={`${
                disabled ? "bg-c6" : "bg-buslab"
            } text-white font-normal py-2 px-4 rounded ml-1 mr-1 ${className} `}
            type={type ? type : "button"}>
            {children}
        </button>
    );
};

ButtonPaginate.propTypes = {
    children: PropTypes.node.isRequired,
};

export default ButtonPaginate;
