/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from "react";
import { slide as Menu } from "../../assets/library/react-burger-menu";
import busSVG from "../../assets/svgs/bus.svg";
import busLogoSVG from "../../assets/svgs/BusLab_cinza.svg";
import dashboardSVG from "../../assets/svgs/dashboard.svg";
import homeSVG from "../../assets/svgs/home.svg";
import documentSVG from "../../assets/svgs/document.svg";
import addOutlineSVG from "../../assets/svgs/add-outline.svg";
import { FiUsers, FiSettings } from "react-icons/fi";
import Colors from "../../assets/constants/Colors";
import "./style.css";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import Submenu from "./Submenu";
const SideMenu = () => {
    const [openMenu, setOpenMenu] = useState(false);
    const [openSubmenu, setOpenSubmenu] = useState("");

    useEffect(() => {
        if (openMenu) {
            setOpenMenu(!openMenu);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [window.location.pathname]);
    return (
        <Menu
            width={285}
            onClose={() => {
                setOpenMenu(!openMenu);
                if (openSubmenu !== "") {
                    setOpenSubmenu("");
                }
            }}
            isOpen={openMenu}
            onOpen={state => {
                setOpenMenu(!openMenu);
            }}
            disableCloseOnEsc
            customBurgerIcon={
                <div
                    onMouseOver={() => {
                        setOpenMenu(true);
                    }}>
                    <div className="bgIcon">
                        <img src={busSVG} className="pl-4 pt-2" />
                    </div>
                    <img src={homeSVG} className="mt-10 ml-1" />
                    <img src={documentSVG} className="mt-10 ml-1" />
                    <img src={dashboardSVG} className="mt-10 ml-1" />
                    <img src={addOutlineSVG} className="mt-10 ml-1" />
                    {window.localStorage.getItem("session-role") === "ROLE_SYSTEM_ADMIN" && (
                    <>
                        <FiSettings size={20} color={Colors.C6} className=" mt-10 ml-1" />
                        <FiUsers size={20} color={Colors.C6} className="ml-1 mt-10" />
                    </>
                    )}
                </div>
            }>
            <div
                className="focus:outline-none h-50 cursor-pointer"
                onClick={() => {
                    setOpenMenu(!openMenu);
                    if (openSubmenu !== "") {
                        setOpenSubmenu("");
                    }
                }}>
                <div className="flex justify-start">
                    <img src={busSVG} />
                    <img src={busLogoSVG} className="ml-4" width={95} />
                </div>
            </div>
            <div className="flex-item justify-between mt-4 ml-1 cursor-pointer focus:outline-none">
                <div className="flex-item">
                    <img src={homeSVG} className="mr-6" />
                    <Link to="/dashboard" className="text-c7-18 font-light hover:underline">
                        Dashboard
                    </Link>
                </div>
            </div>
            <div className="flex-item justify-between mt-8 ml-1 cursor-pointer focus:outline-none">
                <div className="flex-item">
                    <img src={documentSVG} className="mr-6" />
                    <Link to="/telemetry" className="text-c7-18 font-light hover:underline">
                        Telemetria
                    </Link>
                </div>
            </div>
            <Submenu
                header="Monitoramento"
                iconSVG={dashboardSVG}
                openSubmenu={openSubmenu}
                setOpenSubmenu={setOpenSubmenu}
                subItems={[
                    { name: "Tempo real / Sinótico", redirect: "/synoptic" },
                    { name: "Replay de trajetos", redirect: "/monitoring" },
                    { name: "Lista de viagens", redirect: "/trip" },
                    { name: "Lista de eventos", redirect: "/event" },
                ]}
            />
            <Submenu
                header="Cadastro de Operação"
                iconSVG={addOutlineSVG}
                openSubmenu={openSubmenu}
                setOpenSubmenu={setOpenSubmenu}
                subItems={[
                    { name: "Veículos", redirect: "/vehicles" },
                    { name: "Modelos de Chassi", redirect: "/vehicle/model" },
                    { name: "Fabricantes de Chassi", redirect: "/vehicle/brand" },
                    { name: "Linhas/Itinerários", redirect: "/lines" },
                    { name: "Escalas", redirect: "/scales" },
                    { name: "Ocorrências", redirect: "/occurrences" },
                    { name: "Cotação de Combustível", redirect: "/fuel" },
                    { name: "Consumo de combustível diário", redirect: "/consumption" },
                    // { name: "Programações", redirect: "/schedules" },
                    { name: "Colaboradores", redirect: "/employee" },
                ]}
            />
            
            {window.localStorage.getItem("session-role") === "ROLE_SYSTEM_ADMIN" && (
                <>
                    <Submenu
                        header="Dados de Sistema"
                        iconLib={<FiSettings size={20} color={Colors.C6} className="mt-1  mr-6" />}
                        openSubmenu={openSubmenu}
                        setOpenSubmenu={setOpenSubmenu}
                        subItems={[
                            { name: "Empresas", redirect: "/companies" },
                            { name: "Números de SIM", redirect: "/cellphone" },
                            { name: "OBD", redirect: "/obd" },
                            { name: "Monitoramento de obds", redirect: "/DataObd" },
                            { name: "Relatórios", redirect: "/reports" },
                        ]}
                    />
                    <Submenu
                        header="Cadastro de Usuários"
                        iconLib={<FiUsers size={20} color={Colors.C6} className="mt-1  mr-6" />}
                        openSubmenu={openSubmenu}
                        setOpenSubmenu={setOpenSubmenu}
                        subItems={[
                            { name: "Administradores de Sistema", redirect: "/users/system" },
                            { name: "Administradores de Empresa", redirect: "/users/company" },
                            { name: "Gerentes de Empresa", redirect: "/users/manager" },
                            { name: "Operadores de Empresa", redirect: "/users/operator" },
                        ]}
                    />
                </>
            )}
            
        </Menu>
    );
};
export default SideMenu;
