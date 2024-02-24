import React from "react";
const InputText = ({ name, type, onChange, value }) => {
    return (
        <input
            className="w-full text-gray-700 border border-gray-300 py-2 px-2 h-9 focus:outline-none rounded "
            id={name}
            type={type}
            name={name}
            onChange={onChange}
            value={value}
        />
    );
};

export default InputText;
