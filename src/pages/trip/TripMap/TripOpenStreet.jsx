import React, { useState } from "react";
import { Popup } from "@urbica/react-map-gl";

import Marked from "../../../components/Maps/Marker";
import Maps from "../../../components/Maps";

function TripOpenStreet({ viewport, points, checkpoints }) {
    const [onClicked, setOnClicked] = useState(false);
    const [selected, setSelected] = useState({
        latitude: 0,
        longitude: 0,
    });
    const handleClickedPopup = location => {
        setSelected(location);
        setOnClicked(!onClicked);
    };

    return (
        <Maps {...viewport}>
            {/*{onClicked && (
        <Popup
            className="p-2"
            closeButton={true}
            longitude={selected.longitude}
            latitude={selected.latitude}>
            {selected.address !== undefined
                ? selected.address
                : `Latitude: ${selected.latitude} \nLongitude: ${selected.longitude}`}
        </Popup>
    )}*/}
            {points &&
                points.map((location, index) => (
                    <div key={index}>
                        <Marked
                            key={index}
                            latitude={location.latitude}
                            longitude={location.longitude}
                            type="ball"
                            number={index + 1}
                        />
                        {/*onClick={handleClickedPopup(location)}*/}
                    </div>
                ))}

            <Marked id={"line"} coordinates={checkpoints} type="line-point" />
            {checkpoints &&
                checkpoints.map((location, index) => (
                    <div key={index}>
                        <Marked
                            key={index}
                            latitude={location.latitude}
                            longitude={location.longitude}
                            type="small-ball"
                        />
                    </div>
                ))}
        </Maps>
    );
}

export default TripOpenStreet;
