import React, { useState } from "react";
import MapGL from "@urbica/react-map-gl";
import { MapBoxDraw } from "../../assets/library/mapbox-draw/styled";
import "mapbox-gl/dist/mapbox-gl.css";
import ButtonDefault from "../Buttons/default/ButtonDefault";
import RuntimeEnv from "../../config/RuntimeEnv";

const MapDraw = ({ children, mode, setMode, data, setData, setActionFence, viewport, setViewport }) => {
    const [mapStyle, setMapStyle] = useState("mapbox://styles/mapbox/streets-v11");

    const actionMapStyle = () => {
        if (mapStyle === "mapbox://styles/mapbox/streets-v11") {
            setMapStyle("mapbox://styles/mapbox/satellite-streets-v11");
        } else {
            setMapStyle("mapbox://styles/mapbox/streets-v11");
        }
    };

    return (
        <>
            <MapGL
                style={{ width: "100%", height: "400px" }}
                mapStyle={mapStyle}
                accessToken={RuntimeEnv.KEY_MAPBOX}
                latitude={viewport.latitude}
                longitude={viewport.longitude}
                zoom={viewport.zoom}
                keyboard={true}
                onViewportChange={setViewport}>
                {children}
                <MapBoxDraw
                    mode={mode}
                    data={data}
                    onDrawModeChange={({ mode }) => setMode(mode)}
                    onChange={data => {
                        setData(data);
                        setActionFence(true);
                    }}
                />
            </MapGL>
            <div className="w-full flex justify-end mt-2">
                <ButtonDefault title="Alterar visualização do mapa" onClick={actionMapStyle} />
            </div>
        </>
    );
};
export default MapDraw;
