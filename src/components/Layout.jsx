import React from "react";
import PropTypes from "prop-types";
import TopMenu from "./TopMenu/TopMenu";
import SideMenu from "./SideMenu/SideMenu";
import Footer from "./Footer/Footer";
import ToastAnimated from "../assets/library/toast/toast";
import mapboxgl from "mapbox-gl"; // or "const mapboxgl = require('mapbox-gl');"

const Layout = ({ children }) => {
 
    return (
        <div className="bg-c2">
            <ToastAnimated />
            <SideMenu />
            <TopMenu className="z-10" />
            <div className="ignoreSideMenu bg-c3 min-h-screen">{children}</div>
            <Footer />
        </div>
    );
};

Layout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Layout;
