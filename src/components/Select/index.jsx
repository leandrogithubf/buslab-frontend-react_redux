import React from "react";
import Select from "react-select";

const SelectStyle = ({ onChange, name, optionsMap, value, id, isClearable = "true" }) => {
    const selectStyles = {
        control: (provided, state) => ({
            ...provided,
            borderColor: state.isFocused ? "#8ad4ee" : "#e4e7ea",
            boxShadow: state.isFocused ? "0 0 0 0.2rem rgba(32, 168, 216, 0.25)" : "",
        }),
        dropdownIndicator: provided => ({
            ...provided,
            padding: "6px",
        }),
    };
    return (
        <Select
            className="w-full"
            menuPosition="fixed"
            name={id}
            placeholder="Selecione"
            id={id}
            styles={selectStyles}
            noOptionsMessage={() => "Nenhuma opção disponível"}
            value={value}
            onChange={onChange}
            options={optionsMap}
            isClearable={isClearable ? "false" : "true"}
        />
    );
};

export default SelectStyle;
