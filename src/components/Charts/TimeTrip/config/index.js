import Colors from "../../../../assets/constants/Colors";

export const config = {
    timeTrip: {
        colors: {
            punctualityIndexPercent: Colors.buslab,
        },
        legends: { punctualityIndexPercent: "índice (%)" },
        apiRoute: "/api/telemetry/time-trip-table",
    },
};
