import Colors from "../../../../assets/constants/Colors";

export const config = {
    AverageHourlyCompliance: {
        colors: {
            background: {
                up: Colors.vermelho,
                middle: Colors.C2,
                down: Colors.laranja,
            },
            line: Colors.azul,
        },
        legends: {
            up: "atrasados",
            middle: "tolerância",
            down: "adiantados",
            line: "média de tempo",
        },
        apiRoute: "api/telemetry/time-performance",
    },
};
