import React from "react";
import ReactDOM from "react-dom";
import Store from "./app/Store";
import * as serviceWorker from "./serviceWorker";
import "./assets/styles/index.css";
import "mapbox-gl/dist/mapbox-gl.css";

import App from "./App";

ReactDOM.render(
    <React.StrictMode>
        <Store>
            <App />
        </Store>
    </React.StrictMode>,
    document.getElementById("root")
);

serviceWorker.register();
