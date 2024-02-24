import { action } from "typesafe-actions";

export const types = {
    RELOAD: "@notifications/RELOAD",
};

const reload = () => action(types.RELOAD);

export const actions = { reload };
