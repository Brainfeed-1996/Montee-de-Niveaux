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

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Mon Application
        </Typography>
        <Button color="inherit" component={Link} to="/">
          <Home /> Accueil
        </Button>
        <Button color="inherit" component={Link} to="/login">
          <LoginIcon /> Connexion
        </Button>
        <Button color="inherit" component={Link} to="/register">
          <PersonAdd /> Inscription
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
