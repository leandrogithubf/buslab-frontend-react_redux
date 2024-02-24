import { latLngObj } from "../../utils/formatValues";

export class Lines {
    constructor(map) {
        this.lines = new Map();
        this.map = map;
    }
    // This event listener will call addLine() when the map is clicked.
    listemClick(cb) {
        this.map.addListener("click", event => {
            const { lat, lng } = event.latLng;
            cb({ latitude: lat().toFixed(6), longitude: lng().toFixed(6) });
        });
    }
    addDrawnLine({ line: { path, strokeColor, strokeOpacity, strokeWeight, editable }, key }) {
        const pathLine = new window.google.maps.Polyline({
            path,
            strokeColor,
            strokeOpacity,
            strokeWeight,
            editable,
            geodesic: true,
        });
        //prefix socket, identifier replay
        this.lines.set(key, pathLine);
        return pathLine;
    }

    setBounds(arr) {
        const bounds = new window.google.maps.LatLngBounds();
        arr.forEach(point => {
            bounds.extend(latLngObj(point));
        });
        arr.length > 0 && this.map.fitBounds(bounds);
    }

    // Adds a line to the map and push to the array.
    addLine({ checkPoint, color, key }) {
        const pathLine = new window.google.maps.Polyline({
            path: checkPoint,
            geodesic: true,
            strokeColor: color,
            strokeOpacity: 0.6,
            strokeWeight: 4,
        });
        this.lines.set(key, pathLine);

        return pathLine;
    }
    setMapOnAll(map) {
        this.lines.forEach(ln => {
            ln.setMap(map);
        });
    }

    // Removes the lines from the map, but keeps them in the array.
    clearLines() {
        this.setMapOnAll(null);
    }

    // Shows any lines currently in the array.
    showLines() {
        this.setMapOnAll(this.map);
    }

    // Deletes all lines in the array by removing references to them.
    deleteLines() {
        this.clearLines();
        this.lines = new Map();
    }
}
