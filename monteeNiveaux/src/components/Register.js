import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import jwt_decode from "jwt-decode";
import { apiUrl } from "../config";
import PropTypes from "prop-types";
import { TextField, Button, Container, Typography } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typographys, Buttons } from "@mui/material";
import { Home, Login as LoginIcon, PersonAdd } from "@mui/icons-material";

function Register({ setToken, setUserId }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();

    fetch(`${apiUrl}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.token) {
          localStorage.setItem("token", data.token);
          const decoded = jwt_decode(data.token);
          setUserId(decoded.id);
          setToken(data.token);
        } else {
          alert(data.message); // Message d'erreur ou de succès
        }
      })
      .catch((error) => console.error("Erreur lors de l'inscription :", error));
  };

  return (
    <div>
      <h2>Inscription</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">S&apos;inscrire</button>
      </form>
    </div>
  );
}

export default Register;
