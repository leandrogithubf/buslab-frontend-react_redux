export const centroid = coordinates => {
    if (!coordinates?.length) {
        return {};
    }
    let latXTotal = 0;
    let latYTotal = 0;
    let lonDegreesTotal = 0;

    coordinates.forEach(({ latitude, longitude }) => {
        const latRadians = (Math.PI * latitude) / 180;
        latXTotal += Math.cos(latRadians);
        latYTotal += Math.sin(latRadians);
        lonDegreesTotal += longitude;
    });

    const finalLatRadians = Math.atan2(latYTotal, latXTotal);
    const finalLatDegrees = (finalLatRadians * 180) / Math.PI;
    const finalLonDegrees = lonDegreesTotal / coordinates.length;

    return {
        latitude: finalLatDegrees,
        longitude: finalLonDegrees,
    };
};
