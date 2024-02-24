import React from "react";
import ModalOptions from "../../../components/Modais/ModalOptions";
import ButtonDefault from "../../../components/Buttons/default/ButtonDefault";
import { useHistory } from "react-router-dom";
const ModalNewPoints = ({ modalOption, actionModalOption, idLine }) => {
    const history = useHistory();

    const handleRedirectPage = page => {
        history.push(page);
    };

    return (
        <ModalOptions onClose={actionModalOption} show={modalOption}>
            <div className="mb-4">
                <h4 className="mb-2 flex justify-center">Adicionar nova linha</h4>
                <p className="mb-4 text-center px-8">
                    É possível adicionar uma linha através do cadastro individual de endereços, do upload de um arquivo
                    em CSV ou através da marcação pela geolocalização deste dispositivo.
                </p>
                <div className="mb-2 flex justify-center">
                    <ButtonDefault
                        title="Cadastro de endereços"
                        className="w-1/2"
                        onClick={() => {
                            handleRedirectPage(`/lines/${idLine}/points/address/new`);
                        }}
                    />
                </div>
                <div className="mb-2 flex justify-center">
                    <ButtonDefault
                        title="Geolocalização"
                        className="w-1/2"
                        onClick={() => {
                            handleRedirectPage(`/lines/${idLine}/points/geolocation/new`);
                        }}
                    />
                </div>
            </div>
        </ModalOptions>
    );
};

export default ModalNewPoints;
