// move marker from position current to moveto in t seconds
export default function animatedMove(marker, t, current, moveto) {
    const deltaLat = (moveto.lat() - current.lat()) / 100;
    const deltaLng = (moveto.lng() - current.lng()) / 100;
    let lat = marker.position.lat();
    let lng = marker.position.lng();

    const delay = 10 * t;

    function timer(ind) {
        setTimeout(() => {
            lat += deltaLat;
            lng += deltaLng;
            marker.setPosition({ lat, lng });
        }, delay * ind);
    }

    for (let i = 0; i < 100; i++) {
        if (delay) {
            timer(i);
        } else {
            marker.setPosition({
                lat: moveto.lat(),
                lng: moveto.lng(),
            });
        }
    }
}
