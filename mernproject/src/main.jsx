import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App.jsx";
import "./index.css";
import { Toast, ToastProvider } from "@radix-ui/react-toast";

const root = document.getElementById("root");

ReactDOM.createRoot(root).render(
  
  <BrowserRouter>
    
    <ToastProvider>
      <App />
      <Toast />
    </ToastProvider>
  </BrowserRouter>,
);
