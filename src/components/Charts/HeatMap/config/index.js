import Colors from "../../../../assets/constants/Colors";

export const config = {
    averageConsumption: {
        colors: {
            great: Colors.verde,
            good: Colors.azul,
            bad: Colors.vermelho,
        },
        legends: {
            great: "consumo ótimo",
            good: "dentro da média",
            bad: "consumo excessivo",
        },
        apiRoute: "api/telemetry/consumption-time",
    },

    averageTrip: {
        colors: {
            great: Colors.azul,
            good: Colors.amarelo,
            bad: Colors.vermelho,
        },
        legends: { good: "no horário", great: "adiantado", bad: "atrasado" },
        apiRoute: "http://localhost:3333",
    },
};
