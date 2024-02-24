import React from "react";

import { latLngObj } from "./utils/formatValues";
import Maps from "./Maps";
import DrawMap from "./DrawnMap";

function GoogleMaps({
    areas,
    setAreas,
    viewport,
    setPoints,
    points,
    checkpoints,
    occurrences,
    vehiclesMap,
    type,
    draw,
}) {
    return (
        <>
            {type === "draw" ? (
                <DrawMap
                    id="maps"
                    points={points}
                    setPoints={setPoints}
                    setAreas={setAreas}
                    areas={areas}
                    draw={draw}
                    options={
                        viewport && {
                            center: latLngObj(viewport),
                            zoom: viewport.zoom,
                        }
                    }
                />
            ) : (
                <Maps
                    id="maps"
                    points={points}
                    checkpoints={checkpoints}
                    vehiclesMap={vehiclesMap}
                    occurrences={occurrences}
                    options={
                        viewport && {
                            center: latLngObj(viewport),
                            zoom: viewport.zoom,
                        }
                    }
                />
            )}
        </>
    );
}

export default GoogleMaps;
