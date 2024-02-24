import React from "react";
import "./style.css";

const ModalOptions = props => {
    if (!props.show) {
        return null;
    }
    return (
        <div className="modal fixed w-full h-full top-0 left-0 flex items-center justify-center z-50">
            <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
            <div className="modal-container bg-white w-full md:max-w-md mx-auto rounded shadow-lg z-50">
                <div className="modal-content py-2 text-left px-4">
                    <div className="flex justify-end items-center pb-2">
                        <div className="modal-close cursor-pointer z-50" onClick={props.onClose}>
                            <svg
                                className="fill-current color-close"
                                xmlns="http://www.w3.org/2000/svg"
                                width="30"
                                height="30"
                                viewBox="0 0 18 18">
                                <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z"></path>
                            </svg>
                        </div>
                    </div>
                    {props.children}
                </div>
            </div>
        </div>
    );
};

export default ModalOptions;
