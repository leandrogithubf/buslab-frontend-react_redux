import { takeLatest, call, put, all } from "redux-saga/effects";

import { updateNotificationsFailure, updateNotificationsSuccess } from "./actions";
import api from "../../../services/api";
import HeadToken from "../../../services/headerToken";

export function* updateNotifications() {
    try {
        const response = yield call(api.get, "/api/adm/event/list?page=1", HeadToken());

        yield put(updateNotificationsSuccess(response.data.data));
    } catch (error) {
        yield put(updateNotificationsFailure);
    }
}

export default all([
    takeLatest("@notifications/UPDATE_REQUEST", updateNotifications),
    takeLatest("persist/REHYDRATE", updateNotifications),
]);
