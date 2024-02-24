import React from "react";
const ButtonDefault = props => {
    return (
        <button
            {...props}
            className={`bg-buslab text-white font-normal py-2 px-4 rounded ${props.className} `}
            type={props.type ? props.type : "button"}>
            <p className="text-white">{props.title}</p>
        </button>
    );
};
export default ButtonDefault;
