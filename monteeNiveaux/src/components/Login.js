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

function Login({ setToken, setUserId }) {
  let [username, setUsername] = useState("");
  let [password, setPassword] = useState("");
  Login.propTypes = {
    setUserId: PropTypes.func.isRequired, // Définir le type de la prop
    setToken: PropTypes.func.isRequired, // Définir le type de la prop
  };

  const handleLogin = (e) => {
    e.preventDefault();

    fetch(`${apiUrl}/users/login`, {
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
          toast.success("Connexion réussie !");
        } else {
          toast.error(data.message);
        }
      })
      .catch((error) => {
        toast.error("Erreur de connexion");
        console.error("Erreur de connexion :", error);
      });
  };

  return (
    <>
      return (
      <Container maxWidth="xs">
        <ToastContainer />
        <Typography variant="h4" gutterBottom>
          Connexion
        </Typography>
        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="Nom d'utilisateur"
            variant="outlined"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            fullWidth
            type="password"
            label="Mot de passe"
            variant="outlined"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button fullWidth variant="contained" color="primary" type="submit">
            Se connecter
          </Button>
        </form>
      </Container>
      );
    </>
  );
}
