import { infoWindowTemplate } from "./infoWindowTemplate";
import popup from "./popup";

export function lineInfo(map, poly, rows, title) {
    const infoWindow = new window.google.maps.InfoWindow();
    if (!rows.length && !title) {
        return;
    }
    window.google.maps.event.addListener(poly, "click", event => {
        infoWindow.setContent(infoWindowTemplate({ rows, title }));
        infoWindow.setPosition(event.latLng);
        infoWindow.open(map);
    });
}
export function markerInfo({ map, marker, rows, title = "" }) {
    if (!map || !marker) {
        return;
    }
    const pointInfo = new window.google.maps.InfoWindow();
    pointInfo.setContent(infoWindowTemplate({ rows, title }));

    marker.addListener("mouseover", () => {
        pointInfo.open(map, marker);
    });
    marker.addListener("mouseout", () => {
        pointInfo.close();
    });
}

export function busLineInfo({ map, marker, content }) {
    if (!map || !marker) {
        return;
    }
    const pop = popup(marker.position, content);

    pop.setMap(map);
    // const pointInfo = new window.google.maps.InfoWindow({
    //     content: infoLine({ text }),
    //     disableAutoPan: true,
    //     maxWidth: 20,
    // });

    // pointInfo.open(map, marker);
}
