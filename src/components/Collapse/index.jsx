import React from "react";
import { AiFillCaretUp, AiFillCaretDown } from "react-icons/ai";
import { useEffect } from "react";

const Collapse = ({ title, children, openCollapse, setOpenCollapse, defaultActive }) => {
    const isOpen = description => {
        setOpenCollapse(description);
    };

    useEffect(() => {
        if (defaultActive) {
            setOpenCollapse(title);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="mb-5">
            <div
                className="bg-custom_c3 py-4 px-3 flex justify-between cursor-pointer rounded"
                onClick={() => isOpen(openCollapse === title ? "" : title)}>
                <h5 className="text-custom_c7 font-medium">{title}</h5>
                <div className="flex">
                    <div className="self-center">
                        {openCollapse === title ? <AiFillCaretUp /> : <AiFillCaretDown />}
                    </div>
                </div>
            </div>
            {title === openCollapse && <div className="bg-custom_beige pb-4">{children}</div>}
        </div>
    );
};
export default Collapse;
