import { getColorByBgColor } from "../../../../../assets/constants/Colors";
import { latLngObj } from "../../utils/formatValues";

export class Markers {
    constructor(map) {
        this.markers = new Map();
        this.map = map;
    }
    // This event listener will call addMarker() when the map is clicked.
    listemClick(cb) {
        this.map.addListener("click", event => {
            const { lat, lng } = event.latLng;
            cb({ latitude: lat().toFixed(6), longitude: lng().toFixed(6) });
        });
    }
    addDrawnMarker({ point, icon, labelColor, text = "", draggable }) {
        if (isNaN(point.latitude) || isNaN(point.longitude)) {
            if (point.lat && point.lng) {
            } else {
                return;
            }
        }
        const marker = new window.google.maps.Marker({
            position: latLngObj(point),
            icon,
            draggable,
            label: {
                color: getColorByBgColor({
                    bgColor: icon?.fillColor,
                    darkColor: "#000",
                    lightColor: "#fff",
                }),
                fontSize: "12px",
                fontWeight: "bold",
                text,
            },
        });
        this.markers.set(point.key || marker, marker);

        return marker;
    }

    setBounds(arr) {
        const bounds = new window.google.maps.LatLngBounds();
        arr.forEach(point => {
            if (isNaN(point.latitude) || isNaN(point.longitude)) {
                return;
            }
            bounds.extend(latLngObj(point));
        });
        arr.length > 0 && this.map.fitBounds(bounds);
    }

    // Adds a marker to the map and push to the array.
    addMarker({ point, icon = "", text }) {
        if (isNaN(point?.latitude) || isNaN(point?.longitude)) {
            return;
        }

        const marker = new window.google.maps.Marker({
            position: latLngObj(point),
            icon,
            label: {
                color: getColorByBgColor({
                    bgColor: icon?.fillColor,
                    darkColor: "#000",
                    lightColor: "#fff",
                }),
                fontSize: "12px",
                text,
            },
        });
        //prefix socket, identifier replay
        this.markers.set(point.key, marker);
        return marker;
    }

    setMapOnAll(map) {
        this.markers.forEach(mk => {
            mk.setMap(map);
        });
    }

    // Removes the markers from the map, but keeps them in the array.
    clearMarkers() {
        this.setMapOnAll(null);
    }

    // Shows any markers currently in the array.
    showMarkers() {
        this.setMapOnAll(this.map);
    }

    // Deletes all markers in the array by removing references to them.
    deleteMarkers() {
        this.clearMarkers();
        this.markers = new Map();
    }
}
