/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import MapGL, { FullscreenControl, NavigationControl } from "@urbica/react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import ButtonDefault from "../Buttons/default/ButtonDefault";
import RuntimeEnv from "../../config/RuntimeEnv";

const Maps = ({ children, latitude, longitude, onClick, zoom }) => {
    
    const [viewport, setViewport] = useState({
        latitude: latitude,
        longitude: longitude,
        zoom: zoom,
    });
    const [mapStyle, setMapStyle] = useState("mapbox://styles/mapbox/streets-v11");

    const actionMapStyle = () => {
        if (mapStyle === "mapbox://styles/mapbox/streets-v11") {
            setMapStyle("mapbox://styles/mapbox/satellite-streets-v11");
        } else {
            setMapStyle("mapbox://styles/mapbox/streets-v11");
        }
    };

    useEffect(() => {
        setViewport({
            latitude: latitude,
            longitude: longitude,
            zoom: zoom,
        });
    }, [latitude, longitude, zoom]);

    return (
        <>
            <div className="w-full flex justify-end mb-2">
                <ButtonDefault title="Alterar visualização do mapa" onClick={actionMapStyle} />
            </div>

            <MapGL
                style={{ width: "100%", height: "600px" }}
                onClick={onClick}
                mapStyle={mapStyle}
                accessToken={RuntimeEnv.KEY_MAPBOX}
                onViewportChange={setViewport}
                {...viewport}>
                <NavigationControl showCompass showZoom position="top-left" />

                <FullscreenControl position="top-right" />
                {children}
            </MapGL>
        </>
    );
};

export default Maps;
