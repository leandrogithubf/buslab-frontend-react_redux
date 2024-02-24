import Colors from "../../../../assets/constants/Colors";

export const config = {
    averageTrip: {
        colors: {
            great: Colors.azul,
            good: Colors.amarelo,
            bad: Colors.vermelho,
        },
        legends: { good: "no horário", great: "adiantado", bad: "atrasado" },
        apiRoute: "/api/telemetry/average-consumption",
    },
};
