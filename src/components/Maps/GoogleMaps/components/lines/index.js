import Colors from "../../../../../assets/constants/Colors";
import { latLngObj } from "../../utils/formatValues";
import { lineInfo } from "../info";

export function setLines(map, checks) {
    checks instanceof Array &&
        checks.forEach((point, index) => {
            if (index === checks.length - 1) {
                return;
            }
            if (isNaN(point.latitude) && isNaN(point.longitude)) {
                return;
            }
            let color = Colors.buslab;
            let message = [];

            if (point.speed > point.trip?.line?.maxSpeed) {
                color = Colors.vermelho;
                message.push({ strong: "Velocidade:", text: `${point.speed} Km/h` });
            }
            if (point.rpm > 2300) {
                color = Colors.vermelho;
                message.push({ strong: "RPM:", text: `${point.rpm}` });
            }

            const pathLine = new window.google.maps.Polyline({
                path: [latLngObj(checks[index]), latLngObj(checks[index + 1])],
                geodesic: true,
                strokeColor: color,
                strokeOpacity: 0.6,
                strokeWeight: 4,
            });
            message && lineInfo(map, pathLine, message, point.description);

            pathLine.setMap(map);
        });
}
