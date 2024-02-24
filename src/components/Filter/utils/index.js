import { subDays } from "date-fns/esm";
import { dateObjToString } from "../../../assets/utils/dates";

export function getPastDays(numDays) {
    return {
        start: dateObjToString(subDays(new Date(), numDays)).split(" ")[0] + " 00:00:00",
        end: dateObjToString(new Date()),
    };
}
