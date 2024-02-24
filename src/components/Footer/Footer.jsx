import React from "react";
import "./style.css";

const date = new Date();
const currentYear = date.getFullYear();
const Footer = () => {
    return (
        <div className="flex-end footer">
            <footer className="bg-c5 text-center">
                <p className="text-white cabin">
                    <a href="https://buslab.com.br" target="_blank">BusLab © - 2018 - {currentYear}
                    </a>
                </p>
            </footer>
        </div>
    );
};
export default Footer;
