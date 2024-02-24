export function updateNotificationsRequest() {
    return {
        type: "@notifications/UPDATE_REQUEST",
    };
}
export function updateNotificationsSuccess(data) {
    return {
        type: "@notifications/UPDATE_SUCCESS",
        payload: data,
    };
}
export function updateNotificationsFailure() {
    return {
        type: "@notifications/UPDATE_FAILURE",
    };
}
