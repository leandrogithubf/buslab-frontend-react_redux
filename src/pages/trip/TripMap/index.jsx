import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";

import { centroid } from "../../../services/centroidGeolocalization";
import api from "../../../services/api";
import HeaderToken from "../../../services/headerToken";
import GoogleMaps from "../../../components/Maps/GoogleMaps";
import Colors from "../../../assets/constants/Colors";

function TripMap({ schedule, trip }) {
    const [points, setPoints] = useState([]);
    const [checkpoints, setCheckpoints] = useState([]);
    const [occurrences, setOccurrence] = useState([]);
    const [load, setLoad] = useState(true);

    const [viewport, setViewport] = useState({
        latitude: -23.6956019,
        longitude: -46.6297295,
        zoom: 11,
    });

    const getTripPoints = () => {
        api.get(`/api/adm/trip/${trip?.identifier}/checkpoints`, HeaderToken()).then(response => {
            setCheckpoints(response.data);
            setLoad(false);
        });
    };

    const getLinePoints = () => {
        api.get(`/api/adm/line/${schedule?.line.identifier}/points`, HeaderToken()).then(
            response => {
                setPoints(response.data);
                const allMarkers = [];
                for (const key in response.data) {
                    allMarkers.push({
                        latitude: response.data[key].latitude,
                        longitude: response.data[key].longitude,
                    });
                }

                if (allMarkers.length > 0) {
                    const currentCentroid = centroid(allMarkers);
                    setViewport({
                        latitude: currentCentroid.latitude,
                        longitude: currentCentroid.longitude,
                        zoom: 10,
                    });
                }
            }
        );
    };

    const getOccurrencesPoints = () => {
        api.get(`/api/adm/occurrences/${trip?.identifier}/list-trip`, HeaderToken()).then(
            response => {
                setOccurrence(response.data);
            }
        );
    };

    useEffect(() => {
        setLoad(true);
        if (schedule && trip) {
            getOccurrencesPoints();
            getLinePoints();
            getTripPoints();
        }
    }, [schedule, trip]);

    return (
        <>
            {load && <ClipLoader size={20} color={Colors.buslab} loading={load} />}
            <GoogleMaps viewport={viewport} occurrences={occurrences} points={points} checkpoints={checkpoints} />
        </>
    );
}

export default TripMap;
