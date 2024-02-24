module.exports = {
    theme: {
        screens: {
            xs: "280px",

            sm: "576px",

            md: "768px",

            lg: "992px",

            xl: "1280px",

            xxl: "2560px",
        },
        extend: {
            height: {
                "9": "2.30rem",
                "127": "27.50rem",
            },
            maxHeight: {
                "80vh": "80%",
            },
            width: {
                30: "30rem",
            },
            colors: {
                custom_c5: "#a6a6a6",
                custom_gray_light: "#e4e7ea",
                custom_gray_medium: "#6D6D6D",
                custom_c7: "#404040",
                custom_c3: "#EBEBEB",
            },
        },
        backgroundColor: theme => ({
            ...theme("colors"),
            tablerow: "#EDEDED",
        }),
        textColor: theme => ({
            ...theme("colors"),
            primary: "#305AAB",
        }),
    },
    variants: {
        opacity: ["responsive", "hover"],
    },
    plugins: [],
};
