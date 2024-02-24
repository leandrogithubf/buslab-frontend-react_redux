import { toast } from "react-toastify";

function apiDirections(map) {
    //   Dynamic lines
    const directionsService = new window.google.maps.DirectionsService();
    const directionsDisplay = new window.google.maps.DirectionsRenderer({
        map: map,
        preserveViewport: true,
    });

    directionsService.route(
        {
            origin: "Chicago, IL",
            destination: "Los Angeles, CA",
            waypoints: [
                {
                    location: "Joplin, MO",
                    stopover: false,
                },
                {
                    location: "Oklahoma City, OK",
                    stopover: true,
                },
            ],
            provideRouteAlternatives: false,
            travelMode: "DRIVING",
            drivingOptions: {
                departureTime: new Date(/* now, or future date */),
                trafficModel: "pessimistic",
            },
            unitSystem: window.google.maps.UnitSystem.IMPERIAL,
        },
        (response, status) => {
            if (status === window.google.maps.DirectionsStatus.OK) {
                // directionsDisplay.setDirections(response);
                const polyline = new window.google.maps.Polyline({
                    path: [],
                    strokeColor: "#0000FF",
                    strokeWeight: 3,
                });
                const bounds = new window.google.maps.LatLngBounds();

                const legs = response.routes[0].legs;
                for (let i = 0; i < legs.length; i++) {
                    var steps = legs[i].steps;
                    for (let j = 0; j < steps.length; j++) {
                        var nextSegment = steps[j].path;
                        for (let k = 0; k < nextSegment.length; k++) {
                            polyline.getPath().push(nextSegment[k]);
                            bounds.extend(nextSegment[k]);
                        }
                    }
                }

                polyline.setMap(map);
            } else {
                toast.error("Directions request failed due to " + status);
            }
        }
    );
}

export default apiDirections;
