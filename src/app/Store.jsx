import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import "../config/ReactotronConfig";
import { store, persistor } from "../store";

export default function Store({ children }) {
    return (
        <Provider store={store}>
            <PersistGate persistor={persistor}>{children}</PersistGate>
        </Provider>
    );
}
