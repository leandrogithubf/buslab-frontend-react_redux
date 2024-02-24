import React from "react";
import Breadcrumbs from "./Breadcrumbs";
const Title = props => {
    return (
        <div className="bg-white full-width h-20 p-3">
            <Breadcrumbs crumbs={props.crumbs} />
            <h2>{props.title}</h2>
        </div>
    );
};
export default Title;
