import React from "react";
import { Marker } from "@urbica/react-map-gl";
import { MarkedBall } from "./markerStyles/MarkedBall";
import { MarkedPoint } from "./markerStyles/MarkedPoint";
import { LinePoints } from "./markerStyles/MarkedLinePoints";
import { SmallBall } from "./markerStyles/SmallBall";
import "mapbox-gl/dist/mapbox-gl.css";

const Marked = ({ number, latitude, longitude, type, coordinates, id, onClick }) => {
    let icon = "";

    switch (type) {
        case "ball":
            icon = <MarkedBall number={number} onClick={onClick} />;
            break;
        case "small-ball":
            icon = <SmallBall onClick={onClick} />;
            break;
        case "point":
            icon = <MarkedPoint number={number} />;
            break;
        case "line-point":
            icon = <LinePoints coordinates={coordinates} id={id} />;
            break;
        default:
            icon = "";
    }

    if (type !== "line-point") {
        return (
            <Marker longitude={longitude} latitude={latitude}>
                {icon}
            </Marker>
        );
    } else {
        return icon;
    }
};

export default Marked;
