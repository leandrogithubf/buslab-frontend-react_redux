import React from "react";

const Bus = ({ list }) => {
    return (
        <div className=" mr-4 items-center w-10 flex">
            <img className="cursor-pointer font-light inline w-10" alt="ônibus" src={list.img} />
            <p className="absolute text-white text-12 font-medium ml-2">{list.number}</p>
        </div>
    );
};

export default Bus;
