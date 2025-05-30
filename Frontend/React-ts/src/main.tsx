import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";

const root = document.getElementById("root");

ReactDOM.createRoot(root!).render(
  <React.StrictMode>
    {/* Para identificar posibles problemas y errores en el código de React */}
    <BrowserRouter>
      {/* Habilita el enrutamiento */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
