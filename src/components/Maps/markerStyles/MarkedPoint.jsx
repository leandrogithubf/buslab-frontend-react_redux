import React from "react";
import { FaMapMarker } from "react-icons/fa";

export const MarkedPoint = ({ number }) => {
    return (
        <div className="flex absolute">
            <FaMapMarker size={35} color={"#E65250"} />
            <p className="text-white text-12 font-bold z-50 -ml-5">{number}</p>
        </div>
    );
};
