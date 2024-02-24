import { getColorByBgColor } from "../../../../../assets/constants/Colors";
import { latLngObj } from "../../utils/formatValues";
import { markerInfo } from "../info";

export function setMarkers({ map, points, icon, iconTextField, bound, message }) {
    const bounds = new window.google.maps.LatLngBounds();
    if (points instanceof Array) {
        points.forEach((point, index) => {
            if (isNaN(point.latitude) || isNaN(point.longitude)) {
                return;
            }
            const marker = new window.google.maps.Marker({
                position: latLngObj(point),
                icon,
                map: map,
                label: {
                    color: getColorByBgColor({
                        bgColor: icon?.fillColor,
                        darkColor: "#000",
                        lightColor: "#fff",
                    }),
                    text: point[iconTextField]?.toString(),
                    fontSize: "12px",
                },
            });
            message && markerInfo({ map, marker, rows: [{ text: message }] });
            bound && bounds.extend(latLngObj(point));
        });
        bound && points.length > 0 && map.fitBounds(bounds);
    }
}
