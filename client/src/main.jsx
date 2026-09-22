import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { BasketProvider } from "./context/BasketContext";

import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BasketProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </BasketProvider>
  </React.StrictMode>
);