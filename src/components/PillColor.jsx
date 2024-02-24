import React from "react";
const PillColor = ({ list, styled }) => {
    return list.map((list, index) => (
        <div key={index} className={`flex items-center ${styled}`}>
            <div className={`${list.color} mr-2 rounded-full h-4 w-4`}></div>
            <p className="font-light">{list.text}</p>
        </div>
    ));
};

export const PillColorBetween = ({ list }) => {
    return list.map((list, index) => (
        <div key={index} className="md:w-1/2 xs:w-full flex">
            <div className={`${list.color} mr-2 rounded-full w-4 h-4`}></div>
            <p className="font-light">{list.text}</p>
        </div>
    ));
};

export default PillColor;
