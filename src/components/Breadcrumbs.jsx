import React from "react";
import { Link } from "react-router-dom";
const Breadcrumbs = ({ crumbs }) => {
    if (crumbs === undefined || crumbs.length === 0) {
        return null;
    }
    return (
        window.location.pathname !== "/dashboard" && (
            <div>
                {crumbs.length === 1 && (
                    <Link to={"/dashboard"} className="text-buslab cursor-pointer text-14">
                        Dashboard
                    </Link>
                )}

                {crumbs.map(({ name, path }, key) => {
                    return key + 1 === crumbs.length ? (
                        <span className="text-buslab text-14" key={key}>
                            {" / "}
                            {name}
                        </span>
                    ) : (
                        <Link key={key} to={path} className="text-buslab cursor-pointer text-14">
                            {key > 0 && " / "}
                            {name}
                        </Link>
                    );
                })}
            </div>
        )
    );
};
export default Breadcrumbs;
