import React from "react";
import SelectStyle from "../../../Select";

const SelectDescription = ({ setData, data, list, id, type, name, onChange }) => {
    // console.log(data);
    const LabelType = data => {
        // eslint-disable-next-line default-case
        switch (type) {
            case "description":
                return data.description;
            case "name":
                return data.name;
            case "comment":
                return data.comment;
            case "number":
                return data.number;
            case "plate":
                return data.plate;
            case "label":
                return data.label;
            case "serial":
                return data.serial;
            case "protocol":
                return data.protocol;
            case "sector":
                return data.protocol;
            case "serialPrefix":
                return data.serialPrefix;
        }
    };

    return (
        <SelectStyle
            onChange={select => {
                name ? setData(name, select) : setData(select);
                onChange && onChange(select);
            }}
            name={"description"}
            id={id}
            value={data}
            optionsMap={(() => {
                let options = [];

                if (list) {
                    list.map(data =>
                        options.push({
                            value: data.identifier,
                            label: LabelType(data),
                        })
                    );
                }
                return options;
            })()}
        />
    );
};
export default SelectDescription;
