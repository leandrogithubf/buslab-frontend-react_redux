import React, { useState, useEffect } from "react";
import "./style.css";
import buslab from "../../assets/svgs/BusLab_branco.svg";
import notificationsSVG from "../../assets/svgs/notifications.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faTimes, faCheck } from "@fortawesome/free-solid-svg-icons";
import useNotifications from "../../hooks/useNotifications";
import { Link, useHistory } from "react-router-dom";
import ModalPreSelected from "../Modais/ModalPreSelected";
import ModalOptionsNotifications from "../Modais/ModalOptionsNotifications";
import HeaderToken from "../../services/headerToken";
import api from "../../services/api";
import Interceptor from "../../services/interceptor";
import { useSelector } from "react-redux";
import RuntimeEnv from "../../config/RuntimeEnv";

const TopMenu = () => {
    const [showMenu, setShowMenu] = useState(0);
    const [showNotifications, setShowNotifications] = useState(0);
    const [modalBody, setModalBody] = useState(false);
    const [modalNotifications, setModalNotifications] = useState(false);
    const notifications = useSelector(state => state.notifications.value);
    const [lineList, setLineList] = useState([]);
    const [notificationList, setNotificationList] = useState([]);
    const [load, setLoad] = useState(false);
    const [checkedLines, setCheckedLines] = useState([]);
    const [checkedNotifications, setCheckedNotifications] = useState([]);
    const [isEnabledNotifications, setIsEnabledNotifications] = useState(false);
    const history = new useHistory();

    function showMenuFunction(event) {
        event.preventDefault();
        if (showMenu) {
            setShowMenu(0);
            document.removeEventListener("click", closeMenuFunction);
        } else {
            setShowMenu(1);
            document.addEventListener("click", closeMenuFunction);
        }
    }

    function closeMenuFunction() {
        setShowMenu(0);
        document.removeEventListener("click", closeMenuFunction);
    }

    useEffect(() => {
        if (modalBody) {
            setLoad(true);
            api.get(`/api/profile/lines/list`, HeaderToken())
                .then(response => {
                    let dataLine = [];
                    let dataChecked = [];
                    Object.entries(response.data).map(res => {
                        if (res[1].isAttached) {
                            dataChecked = [...dataChecked, res[1].identifier];
                        }
                        return dataLine.push(...lineList, res[1]);
                    });
                    setLineList(dataLine);
                    setCheckedLines(dataChecked);
                    setLoad(false);
                })
                .catch(error => {
                    setLoad(false);
                    Interceptor(error);
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modalBody]);

    useEffect(() => {
        if (modalNotifications) {
            setLoad(true);
            api.get(`/api/profile/notifications/list`, HeaderToken())
                .then(response => {
                    let dataNotifications = [];
                    let dataCheckedNotifications = [];
                    Object.entries(response.data.eventCategories).map(res => {
                        if (res[1].isAttached) {
                            dataCheckedNotifications = [
                                ...dataCheckedNotifications,
                                res[1].identifier,
                            ];
                        }
                        return dataNotifications.push(...lineList, res[1]);
                    });
                    setIsEnabledNotifications(response.data.isEnabled);
                    setNotificationList(dataNotifications);
                    setCheckedNotifications(dataCheckedNotifications);
                    setLoad(false);
                })
                .catch(error => {
                    setLoad(false);
                    Interceptor(error);
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modalNotifications]);

    function showNotificationsFunction(event) {
        event.preventDefault();
        if (showNotifications) {
            setShowNotifications(0);
            document.removeEventListener("click", closeNotificationsFunction);
        } else {
            setShowNotifications(1);
            document.addEventListener("click", closeNotificationsFunction);
        }
    }

    function closeNotificationsFunction() {
        setShowNotifications(0);
        document.removeEventListener("click", closeNotificationsFunction);
    }

    const redirectPage = nav => {
        history.push(nav);
    };

    function toggleModalBody() {
        if (!modalBody) {
            setLineList([]);
            setCheckedLines([]);
        }
        setModalBody(!modalBody);
    }

    function toggleModalNotifications() {
        if (!modalBody) {
            setNotificationList([]);
            setCheckedNotifications([]);
        }
        setModalNotifications(!modalNotifications);
    }

    return (
        <>
            <ModalPreSelected
                actionModal={toggleModalBody}
                modalBody={modalBody}
                lineList={lineList}
                load={load}
                checkedLines={checkedLines}
                setCheckedLines={setCheckedLines}
            />
            <ModalOptionsNotifications
                actionModal={toggleModalNotifications}
                modalBody={modalNotifications}
                notificationList={notificationList}
                load={load}
                checkedNotifications={checkedNotifications}
                setCheckedNotifications={setCheckedNotifications}
                isEnabledNotifications={isEnabledNotifications}
                setIsEnabledNotifications={setIsEnabledNotifications}
            />
            <div className="flex justify-between full-width  topMenuBar pl-20 pr-10 ">
                <div className="p-2 self-center">
                    <Link to="/dashboard">
                        <img src={buslab} alt="logotipo buslab" width={95} />
                    </Link>
                </div>
                <div className="flex row">
                    <div
                        onClick={showNotificationsFunction}
                        className="p-2 self-center cursor-pointer unselect">
                        <img src={notificationsSVG} alt="botão de notificações" />
                    </div>
                    <div
                        onClick={showMenuFunction}
                        className="inline-flex items-center pl-5 pr-5 cursor-pointer unselect">
                        <span className="pr-3 text-c2 ">
                            {window.localStorage.getItem("session-user-name")}
                        </span>
                        <FontAwesomeIcon className="text-c2" icon={faChevronDown} />
                    </div>
                </div>
            </div>
            {showMenu ? (
                <div className="menu wrapper-dropdown-menu p-2 z-50">
                    {/* <p className="font-medium fontMenu cursor-pointer">
                        {window.localStorage.getItem("session-user-name")}
                    </p> */}
                    <Link to="/profile" className="font-light fontMenu cursor-pointer hover:underline">
                        <p className="pb-2 pt-4">Editar perfil</p>
                    </Link>
                    {window.localStorage.getItem("session-role") === "ROLE_COMPANY_OPERATOR" && (
                        <div
                            className="font-light fontMenu cursor-pointer"
                            onClick={toggleModalBody}>
                            <p className="pb-2 pt-2">Editar linhas pré-selecionadas</p>
                        </div>
                    )}
                    <div
                        className=" font-light fontMenu cursor-pointer hover:underline"
                        onClick={toggleModalNotifications}>
                        <p className="pb-2 pt-2">Editar configurações de notificação</p>
                    </div>
                    <div
                        className=" font-light fontMenu cursor-pointer hover:underline">
                        <a href={RuntimeEnv.BASE_URL + "/assets/Manual-Geral.pdf"} className="font-light fontMenu cursor-pointer" target="_blank">
                            <p className="pb-2 pt-4">Manual de usuário</p>
                        </a>
                    </div>
                    <div
                        className=" font-light fontMenu cursor-pointer hover:underline">
                        <p
                            onClick={() => {
                                window.localStorage.clear();
                                window.location.href = "/";
                            }}
                            className="pt-4 font-light fontMenu cursor-pointer">
                            Sair
                        </p>
                    </div>
                    
                </div>
            ) : null}
            {showNotifications ? (
                <div className="wrapper-dropdown-notifications z-50 p-2">
                    {notifications.slice(0, 6).map(notification => {
                        return (
                            <div
                                key={notification.identifier}
                                className="box-notifications mb-1 flex justify-between">
                                <div className="checkedLines-notifications p-2">
                                    <FontAwesomeIcon
                                        onClick={showNotificationsFunction}
                                        icon={faCheck}
                                        className="iconChecked"
                                    />
                                </div>
                                <div className="">
                                    <div className="p-2 w-64 text-c7-14 font-medium">
                                        {notification.vehicle
                                            ? `#${notification.vehicle.prefix} - `
                                            : ""}
                                        {notification.line
                                            ? `${notification.line.description} - `
                                            : ""}
                                        {notification.category
                                            ? notification.category.description
                                            : ""}
                                    </div>
                                    <Link
                                        to={`/event/show/${notification.identifier}`}
                                        className="underline text-buslab cursor-pointer">
                                        visualizar
                                    </Link>
                                </div>
                                <div className="p-2">
                                    <FontAwesomeIcon
                                        onClick={showNotificationsFunction}
                                        icon={faTimes}
                                        className="iconClose right-align cursor-pointer"
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : null}
        </>
    );
};
export default TopMenu;
