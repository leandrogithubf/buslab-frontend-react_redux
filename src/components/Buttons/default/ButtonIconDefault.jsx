import React from "react";

const ButtonIcon = ({ onClick, icon, type, className }) => {
    const buttonType = type ? type : "button";
    return (
        <>
            <button className={`bg-buslab text-white font-normal py-2 px-4 rounded ${className}`} type={buttonType} onClick={onClick}>
                {icon}
            </button>
        </>
    );
};
export default ButtonIcon;
