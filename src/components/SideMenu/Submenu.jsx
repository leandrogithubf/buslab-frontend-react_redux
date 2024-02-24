import React, { useEffect } from "react";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import Colors from "../../assets/constants/Colors";
import { Link } from "react-router-dom";
import Fade from "react-reveal/Fade";
import { useLocation } from "react-router-dom";

const Submenu = ({ header, iconSVG, iconLib, subItems, openSubmenu, setOpenSubmenu }) => {
    let location = useLocation();

    const handleClick = type => {
        if (type === openSubmenu) {
            return setOpenSubmenu("");
        }
        setOpenSubmenu(type);
    };

    useEffect(() => {
        if (openSubmenu === "") {
            subItems.map(items => {
                if (location.pathname.includes(items.redirect)) {
                    return setOpenSubmenu(header);
                } else return null;
            });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname, openSubmenu]);

    return (
        <div>
            <div
                onClick={() => handleClick(header)}
                className="flex-item justify-between mt-8 ml-1 cursor-pointer focus:outline-none">
                <div className="flex flex-grow items-center">
                    {iconSVG && <img src={iconSVG} className="mr-6 h-5" alt={header} />}
                    {iconLib && iconLib}
                    <span className="text-c7-18 mt-1 font-light hover:underline">{header}</span>
                </div>

                {openSubmenu === header ? (
                    <RiArrowDropUpLine size={30} color={Colors.C6} className="mt-1" />
                ) : (
                    <RiArrowDropDownLine size={30} color={Colors.C6} className="mt-1" />
                )}
            </div>
            {openSubmenu === header &&
                subItems.map((subItem, index) => (
                    <Fade key={index}>
                        <div className="flex-item">
                            <Link
                                to={subItem.redirect}
                                className="text-c7-15 ml-12 mt-4 font-normal hover:underline">
                                {subItem.name}
                            </Link>
                        </div>
                    </Fade>
                ))}
        </div>
    );
};

export default Submenu;
