import React from "react";
import ButtonDefault from "../Buttons/default/ButtonDefault";
import ModalBody from "./ModalBody";
import Switch from "react-switch";
import HeaderToken from "../../services/headerToken";
import api from "../../services/api";
import { toast } from "react-toastify";
import Colors from "../../assets/constants/Colors";
import ClipLoader from "react-spinners/ClipLoader";
import Interceptor from "../../services/interceptor";

const ModalOptionsNotifications = ({
    actionModal,
    modalBody,
    notificationList,
    load,
    checkedNotifications,
    setCheckedNotifications,
    isEnabledNotifications,
    setIsEnabledNotifications,
}) => {
    function handleChange(event) {
        let dataChecked = checkedNotifications;
        if (event.target.checked) {
            dataChecked = [...dataChecked, event.target.value];
        } else {
            dataChecked = checkedNotifications.filter(identifierChecked => identifierChecked !== event.target.value);
        }

        setCheckedNotifications(dataChecked);
    }

    function handleChangeAll(event) {
        let dataChecked = checkedNotifications;
        notificationList.map(notification => {
            if (event.target.checked) {
                return (dataChecked = [...dataChecked, notification.identifier]);
            } else {
                return (dataChecked = []);
            }
        });

        setCheckedNotifications(dataChecked);
    }

    function updatingNotifications(event) {
        event.preventDefault();

        api.post(
            "/api/profile/notifications/update",
            {
                eventCategory: checkedNotifications,
                isEnabled: isEnabledNotifications === false ? 0 : 1,
            },
            HeaderToken()
        )
            .then(() => {
                toast.info("Notificações foram atualizadas!");
                actionModal();
            })
            .catch(error => {
                Interceptor(error);
            });
    }

    function clearNotifications() {
        setCheckedNotifications([]);
    }

    return (
        <ModalBody
            onClose={actionModal}
            show={modalBody}
            title={<h4 className="mt-6 mb-4 font-medium text-custom_c7 text-18">Notificações</h4>}>
            <div className="pr-8 mb-4">
                <label className="flex items-center">
                    <Switch
                        onChange={select => setIsEnabledNotifications(select)}
                        checked={isEnabledNotifications}
                        onColor="#86d3ff"
                        onHandleColor="#2693e6"
                        handleDiameter={20}
                        uncheckedIcon={false}
                        checkedIcon={false}
                        boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                        activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                        height={15}
                        width={35}
                        className="react-switch"
                        id="material-switch"
                        name="silenceNotifications"
                    />
                    <span className="font-light text-14 text-custom_c7 ml-3">Silenciar notificações</span>
                </label>

                <h6 className="block text-custom_c7 text-14 font-bold mb-2 mt-4" htmlFor="grid-text">
                    Tipos de notificações a serem recebidas
                </h6>
                <div className="mt-3 mb-3">
                    <input
                        className="mr-2 leading-tight"
                        type="checkbox"
                        checked={notificationList.length === checkedNotifications.length}
                        onChange={handleChangeAll}
                    />{" "}
                    <span className="text-custom_gray_medium">Todas</span>
                </div>
                <div className="scroll-box border">
                    <table className="table-auto w-full">
                        <tbody>
                            {notificationList.map((notification, index) => {
                                return (
                                    <tr key={notification.identifier} className={index % 2 === 0 ? "bg-c2" : ""}>
                                        <td className="px-4 py-2  w-16">
                                            <input
                                                className="mr-2 leading-tight"
                                                type="checkbox"
                                                checked={checkedNotifications.includes(notification.identifier)}
                                                onChange={handleChange}
                                                value={notification.identifier}
                                            />
                                        </td>
                                        <td className="px-4 py-2 text-custom_gray_medium">
                                            {notification.description}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    <div className="w-full mt-4">
                        <div className="flex justify-center">
                            {notificationList.length === 0 && !load && (
                                <p className="center">Nenhuma linha encontrada </p>
                            )}
                            {load && <ClipLoader size={20} color={Colors.buslab} loading={load} />}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end mt-5 items-center">
                    <p className="text-buslab text-14 font-light underline cursor-pointer" onClick={clearNotifications}>
                        limpar filtros
                    </p>
                    <div className="ml-4">
                        <ButtonDefault title="Concluir" onClick={updatingNotifications} />
                    </div>
                </div>
            </div>
        </ModalBody>
    );
};

export default ModalOptionsNotifications;
