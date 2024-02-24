import Colors from "../../../../../assets/constants/Colors";
import { latLngObj } from "../../utils/formatValues";
import { lineInfo } from "../info";
import { Polygons } from "./polygons";

export const pushAreas = ({ map, areas, color = Colors.buslab }) => {
    const objPolygons = new Polygons();

    //  setLines(map, area);
    Object.entries(areas).forEach(([key, pathLine]) => {
        if (pathLine instanceof Array) {
            const line = objPolygons.addDrawnLine({
                line: {
                    path: pathLine.map(point => latLngObj(point)),
                    strokeColor: color,
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    editable: key === "temp",
                    fillColor: color,
                },
                key,
            });
            lineInfo(map, line, [{ text: key.split("||")[0] }]);
        }
    });
    objPolygons.lines.get("temp") &&
        objPolygons.lines.get("temp").addListener("mouseup", event => {
            areas["temp"] = objPolygons.lines
                .get("temp")
                ?.getPath()
                .getArray()
                .map(coord => ({ latitude: coord.lat(), longitude: coord.lng() }));
        });
    objPolygons.setMapOnAll(map);
};

export const isOnGarage = ({ areas, point, color = Colors.buslab }) => {
    if (!window.google) {
        return false;
    }
    // create polygons
    const objPolygons = new Polygons();
    Object.entries(areas).forEach(([key, pathLine]) => {
        if (pathLine instanceof Array) {
            objPolygons.addDrawnLine({
                line: {
                    path: pathLine.map(point => latLngObj(point)),
                    strokeColor: color,
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    editable: key === "temp",
                    fillColor: color,
                },
                key,
            });
        }
    });
    // get insiders

    let result = false;

    objPolygons.lines.forEach((polygon, key) => {
        if (!result) {
            const latLng = new window.google.maps.LatLng(point.latitude, point.longitude);
            const isInside = window.google.maps.geometry.poly.containsLocation(latLng, polygon);
            result = isInside ? key.split("||")[0] : false;
        }
    });
    return result;
};
