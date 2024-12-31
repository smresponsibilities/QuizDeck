import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App.jsx";
import "./index.css";
import { Toaster } from "./components/ui/toaster.jsx";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(

  <BrowserRouter>
    <App />
    <Toaster />
  </BrowserRouter>,
);
