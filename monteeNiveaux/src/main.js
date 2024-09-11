// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Appp from "./Appp";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme"; // Assure-toi que ce chemin est correct

// Création du root pour React 18+
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Router>
        <App />
      </Router>
    </ThemeProvider>
  </React.StrictMode>
);
