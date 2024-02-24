import React from "react";
import pencilSVG from "../../assets/svgs/pencil.svg";
import saveSVG from "../../assets/svgs/save-disk.svg";
import addSVG from "../../assets/svgs/add-outline.svg";
import NumberFormat from "react-number-format";
import Colors from "../../assets/constants/Colors";
import ClipLoader from "react-spinners/ClipLoader";

const Label = ({ description }) => {
    return <label className="text-14 text-c7-14 font-medium py-4 pr-10 w-1/3 text-right">{description}</label>;
};

const LabelFull = ({ description }) => {
    return <label className="text-14 text-c7-14 font-medium py-4 pr-10 pl-4">{description}</label>;
};

const LabelFullDefault = ({ description }) => {
    return <label className="text-14 text-c7-14 font-medium py-4">{description}</label>;
};

const Pencil = ({ setInputActive }) => {
    return (
        <img
            className="font-light cursor-pointer text-14 w-4 text-primary inline mr-4 ml-4"
            title="Editar"
            onClick={setInputActive}
            alt="Editar"
            src={pencilSVG}
        />
    );
};

const AddOutline = ({ setInputActive }) => {
    return (
        <img
            className="font-light cursor-pointer text-14 w-4 text-primary inline mr-4 ml-4"
            title="Gerar"
            onClick={setInputActive}
            alt="Gerar"
            src={addSVG}
        />
    );
};

const Save = ({ handleSubmit }) => {
    return (
        <img
            className="font-light cursor-pointer text-14 w-4 text-primary inline mr-4 ml-4"
            title="Salvar"
            onClick={handleSubmit}
            alt="Salvar"
            src={saveSVG}
        />
    );
};

const LoadSave =({isSubmitting}) => {
    return(
        isSubmitting && (
            <div className="flex justify-end">
                <span className="mr-2 text-buslab text-14">Salvando dados</span>{" "}
                <ClipLoader size={20} color={Colors.buslab} loading={true} />
            </div>
        )
    )
}


const Information = ({ description }) => {
    return <label className="font-light text-14 text-c8 py-4">{description}</label>;
};

const InformationMask = ({ description, mask }) => {
    return (
        <NumberFormat
            className="font-light text-14 text-c8 py-4"
            value={description}
            displayType={"text"}
            format={mask}
        />
    );
};

export { Label, LabelFull, Pencil, Information, InformationMask, Save, LoadSave, LabelFullDefault, AddOutline };
