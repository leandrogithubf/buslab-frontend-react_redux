import React from "react";

export const MarkedBall = ({ number, onClick }) => {
    return (
        <>
    
            <div className={`rounded-sm h-8 w-8 absolute`} onClick={onClick}>
                <div className={`bg-buslab rounded-full h-8 -mt-1 flex items-center  justify-center`}>
                    <p className="text-white text-12 font-medium">{number}</p>
                </div>
            </div>
        </>
    );
};
