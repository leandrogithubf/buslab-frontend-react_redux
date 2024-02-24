import produce from "immer";

const INITIAL_STATE = {
    value: [],
};

export default function notifications(state = INITIAL_STATE, action) {
    return produce(state, draft => {
        switch (action.type) {
            case "@notifications/UPDATE_SUCCESS":
                draft.value = action.payload;
                break;

            case "@notifications/UPDATE_FAILURE": {
                draft.value = state;
                break;
            }
            default:
        }
    });
}
