import React from "react";
import PropTypes from "prop-types";

const Card = ({ children }) => {
    return (
        <div className="p-6 mb-n-6">
            <div className="bg-white full-width p-3">{children}</div>
        </div>
    );
};

Card.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Card;
