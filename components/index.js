import React, { useState } from "react";
import ReactDOM from "react-dom";
import Header from "./Header";

import App from "./App";

window.token = null;
function Main() {
    return (
        <App />
    );
}

ReactDOM.render(<Main />, document.getElementById("root"));
