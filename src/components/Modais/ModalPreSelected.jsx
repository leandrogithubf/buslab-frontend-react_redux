import React from "react";
import ButtonDefault from "../Buttons/default/ButtonDefault";
import ModalBody from "./ModalBody";
import ClipLoader from "react-spinners/ClipLoader";
import Colors from "../../assets/constants/Colors";
import api from "../../services/api";
import HeaderToken from "../../services/headerToken";
import { toast } from "react-toastify";
import Interceptor from "../../services/interceptor";

const ModalPreSelected = ({ actionModal, modalBody, load, lineList, setCheckedLines, checkedLines }) => {
    function handleChange(event) {
        let dataChecked = checkedLines;
        if (event.target.checked) {
            dataChecked = [...dataChecked, event.target.value];
        } else {
            dataChecked = checkedLines.filter(identifierChecked => identifierChecked !== event.target.value);
        }

        setCheckedLines(dataChecked);
    }

    function updatingLines(event) {
        event.preventDefault();
        api.post("/api/profile/lines/update", { lines: checkedLines }, HeaderToken())
            .then(() => {
                toast.info("Linhas pré-selecionadas foram atualizadas!");
                actionModal();
            })
            .catch(error => {
                Interceptor(error);
            });
    }

    function clearLines() {
        setCheckedLines([]);
    }

    return (
        <ModalBody
            onClose={actionModal}
            show={modalBody}
            title={<h4 className="mt-6 mb-4">Linhas pré selecionadas para o usuário</h4>}>
            <div className="pr-8 mb-4">
                {/* <label className="block text-gray-700 text-xs font-bold mb-2" htmlFor="grid-text">
                    Grupos de linhas
                </label>
                <SelectStyle name="line" /> */}
                <label className="block text-gray-700 text-xs font-bold mb-2" htmlFor="grid-text">
                    Linhas
                </label>
                <div className="scroll-box border">
                    <table className="table-auto w-full">
                        <tbody>
                            {lineList.map((line, index) => {
                                return (
                                    <tr key={line.identifier} className={index % 2 === 0 ? "bg-c2" : ""}>
                                        <td className="px-4 py-2  w-16">
                                            <input
                                                className="mr-2 leading-tight"
                                                type="checkbox"
                                                checked={checkedLines.includes(line.identifier)}
                                                onChange={handleChange}
                                                value={line.identifier}
                                            />
                                        </td>
                                        <td className="px-4 py-2">{line.code}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <div className="w-full mt-4">
                        <div className="flex justify-center">
                            {lineList.length === 0 && !load && <p className="center">Nenhuma linha encontrada </p>}
                            {load && <ClipLoader size={20} color={Colors.buslab} loading={load} />}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end mt-5 items-center">
                    <p className="text-buslab text-14 font-light underline cursor-pointer" onClick={clearLines}>
                        limpar filtros
                    </p>
                    <div className="ml-4">
                        <ButtonDefault title="Concluir" onClick={updatingLines} />
                    </div>
                </div>
            </div>
        </ModalBody>
    );
};

export default ModalPreSelected;
