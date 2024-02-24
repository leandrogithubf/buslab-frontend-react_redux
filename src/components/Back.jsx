import React from "react";
import { useHistory } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";

const Back = props => {
    let history = new useHistory();

    return (
        <p
            className="underline text-buslab flex cursor-pointer"
            onClick={() => {
                history.goBack();
            }}>
            <IoIosArrowBack className="mt-1" /> voltar
        </p>
    );
};

export default Back;
