import { useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actions } from "../features/notifications/actions";

export default function useNotifications() {
    const notification = useSelector(state => state.notifications);
    const dispatch = useDispatch();

    const api = useMemo(
        () => ({
            reload: () => dispatch(actions.reload()),
        }),
        [dispatch]
    );

    return [notification, api];
}
