/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";

import api from "../../../services/api";
import HeaderToken from "../../../services/headerToken";
import Interceptor from "../../../services/interceptor";
import GoogleMaps from "../../../components/Maps/GoogleMaps";

const MapSynoptic = ({ itineraries, search, lastReceivedTimestamp }) => {
    const [line, setLine] = useState();
    const viewport = {
        latitude: -23.6956019,
        longitude: -46.6297295,
        zoom: 11,
    };

    useEffect(() => {
        if (search.line) {
            api.get(`/api/adm/line/${search.line}/points`, HeaderToken())
                .then(response => {
                    setLine(response.data);
                })
                .catch(error => {
                    Interceptor(error);
                });
        }
    }, [search]);
    return (
        <>
            <section style={{ height: "600px" }}>
                <GoogleMaps viewport={viewport} checkpoints={line} vehiclesMap={itineraries} />
            </section>
            <hr />
            <small>
                Último dado recebido em:{" "}
                {lastReceivedTimestamp?.length ? lastReceivedTimestamp : "buscando..."}
            </small>
        </>
    );
};
export default MapSynoptic;
