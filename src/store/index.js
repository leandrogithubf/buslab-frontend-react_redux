import { persistStore } from "redux-persist";
import createSagaMiddleware from "redux-saga";

import persistReducers from "./persistReducers";
import rootReducer from "./modules/rootReducer";
import createStore from "./modules/createStore";
import rootSaga from "./modules/rootSaga";
import RuntimeEnv from "../config/RuntimeEnv";

const sagaMonitor = RuntimeEnv.NODE_ENV === "development"
     ? console.tron.createSagaMonitor()
     : null;

const sagaMiddleware = createSagaMiddleware({ sagaMonitor });
const middlewares = [sagaMiddleware];

const store = createStore(persistReducers(rootReducer), middlewares);
const persistor = persistStore(store);

sagaMiddleware.run(rootSaga);

export { store, persistor };
