import React from "react";
const ButtonRed = props => {
    return (
        <button {...props} className="bg-red-600 text-white font-normal py-2 px-4 rounded" onClick={props.onClick}>
            <p className="text-white">{props.title}</p>
        </button>
    );
};
export default ButtonRed;
