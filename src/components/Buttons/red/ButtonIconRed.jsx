import React from "react";

const ButtonIconRed = ({onClick, icon, className}) => {
    return (
        <>
            <button className={`bg-red-600 text-white font-normal py-2 px-4 rounded ${className}`} onClick={onClick}>
                {icon}
            </button>
        </>
    );
};
export default ButtonIconRed;
