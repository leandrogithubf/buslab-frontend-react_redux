import React from "react";

export const SmallBall = ({ number, onClick }) => {
    return <div className={`bg-buslab rounded-full h-3 w-3`} onClick={onClick} />;
};
