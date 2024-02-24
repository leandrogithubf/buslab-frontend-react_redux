import React from "react";

const ButtonIconText = props => {
    return (
        <>
            <button
                {...props}
                className={`bg-yellow-600 text-white font-normal py-2 px-4 rounded
                    ${props.className} ${props.disabled ? "cursor-not-allowed" : ""} `}
                onClick={!props.disabled && props.onClick}
                disabled={props.disabled}>
                <div className="flex justify-between items-center">
                    {props.icon}
                    <span className="text-white ml-2">{props.title}</span>
                </div>
            </button>
        </>
    );
};
export default ButtonIconText;
