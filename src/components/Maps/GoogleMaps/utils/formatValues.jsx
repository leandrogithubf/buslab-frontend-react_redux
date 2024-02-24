export function latLngObj(obj) {
    if (isNaN(obj.latitude) || isNaN(obj.longitude)) {
        return null;
    }
    return {
        lat: Number(obj.latitude),
        lng: Number(obj.longitude),
    };
}
