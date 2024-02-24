import React from "react";
import { Source, Layer } from "@urbica/react-map-gl";

export const LinePoints = ({ coordinates, id }) => {
    const data = {
        type: "Feature",
        geometry: {
            type: "LineString",
            coordinates: [],
        },
    };

    if (data.geometry.coordinates.length === 0) {
        coordinates.map(coords => {
            if (coords.longitude && coords.latitude) {
                return data.geometry.coordinates.push([coords.longitude, coords.latitude]);
            }
            return null;
        });
    }

    return (
        <>
            <Source id={id} type="geojson" data={data} />
            <Layer
                id={id}
                type="line"
                source={id}
                layout={{
                    "line-join": "round",
                    "line-cap": "round",
                }}
                paint={{
                    "line-color": "#305AAB",
                    "line-width": 2,
                }}
            />
        </>
    );
};
