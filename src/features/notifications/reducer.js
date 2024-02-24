import { types } from "./actions";
import axios from "axios";
const INITIAL_STATE = [
    {
        title: "Paço Laura",
        id: 23947,

        status: "Atrasado",
    },
    {
        title: "Paço Laura",
        id: 23948,
        status: "Atrasado",
    },
    {
        title: "Paço Laura",
        id: 23949,
        status: "Atrasado",
    },
    {
        title: "Paço Laura",
        id: 23950,
        status: "Atrasado",
    },
    {
        title: "Paço Laura",
        id: 23951,
        status: "Atrasado",
    },
    {
        title: "Paço Laura",
        id: 23952,
        status: "Atrasado",
    },
    {
        title: "Paço Laura",
        id: 23953,
        status: "Atrasado",
    },
    {
        title: "Paço Laura",
        id: 23954,
        status: "Atrasado",
    },
    {
        title: "Paço Laura",
        id: 23955,
        status: "Atrasado",
    },
    {
        title: "Paço Laura - Atrasado",
        id: 23956,
        status: "Atrasado",
    },
];
export default function reducer(state = INITIAL_STATE, action) {
    switch (action.type) {
        case types.RELOAD:
            return axios.get().then();
        default:
            return state;
    }
}
