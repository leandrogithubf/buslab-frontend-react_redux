import React from "react";

import Bus from "./Bus";

const BusLine = ({ list }) => {
    return (
        <div className="flex px-2">
            {list.map((list, index) => (
                <div key={index}>
                    <Bus list={list} />
                </div>
            ))}
        </div>
    );
};

export default BusLine;
