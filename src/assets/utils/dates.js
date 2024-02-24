import { format } from "date-fns";

export const dateObjToString = date => {
    if (date instanceof Date) {
        return format(date, "yyyy-MM-dd HH:mm:ss");
    }
};
export const dateToString = date => {
    if (date instanceof Date) {
        return format(date, "yyyy-MM-dd");
    }
};
