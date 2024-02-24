const Locale = {
    months: [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro",
    ],

    weekDays: [
        {
            name: "Domingo",
            short: "D",
            isWeekend: true,
        },
        {
            name: "Segunda",
            short: "S",
        },
        {
            name: "Terça",
            short: "T",
        },
        {
            name: "Quarta",
            short: "Q",
        },
        {
            name: "Quinta",
            short: "Q",
        },
        {
            name: "Sexta",
            short: "S",
        },
        {
            name: "Sábado",
            short: "S",
            isWeekend: true,
        },
    ],

    weekStartingIndex: 0,

    getToday(gregorainTodayObject) {
        return gregorainTodayObject;
    },

    // return a native JavaScript date here
    toNativeDate(date) {
        return new Date(date.year, date.month - 1, date.day);
    },

    // return a number for date's month length
    getMonthLength(date) {
        return new Date(date.year, date.month, 0).getDate();
    },

    // return a transformed digit to your locale
    transformDigit(digit) {
        return digit;
    },

    // texts in the date picker
    nextMonth: "Próximo mês",
    previousMonth: "Mês anterior",
    openMonthSelector: "Abrir mês selecionado",
    openYearSelector: "Abrir ano selecionado",
    closeMonthSelector: "Fechar mês selecionado",
    closeYearSelector: "Fechar ano selecionado",
    defaultPlaceholder: "Selecione...",

    // for input range value
    from: "de",
    to: "para",

    // used for input value when multi dates are selected
    digitSeparator: ",",

    // if your provide -2 for example, year will be 2 digited
    yearLetterSkip: 0,

    // is your language rtl or ltr?
    isRtl: false,
};

export default Locale;
