import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import jwt_decode from "jwt-decode";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [userId, setUserId] = useState(null);
  const apiUrl = "http://localhost:3000/api";

  useEffect(() => {
    if (token) {
      const decoded = jwt_decode(token);
      setUserId(decoded.id);
    }
  }, [token]);

  const fetchUser = (id) => {
    fetch(`${apiUrl}/users/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((user) => {
        // Mettre à jour les informations utilisateur
      })
      .catch((error) =>
        console.error("Erreur lors du chargement de l’utilisateur :", error)
      );
  };

  const fetchTasks = () => {
    fetch(`${apiUrl}/tasks`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((tasks) => {
        // Mettre à jour la liste des tâches
      })
      .catch((error) =>
        console.error("Erreur lors du chargement des tâches :", error)
      );
  };

  const completeTask = (id, xp) => {
    fetch(`${apiUrl}/users/${userId}/xp`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ xp }),
    })
      .then((response) => response.json())
      .then((user) => {
        // Mettre à jour les points d'expérience utilisateur
      })
      .catch((error) =>
        console.error("Erreur lors de la complétion de la tâche :", error)
      );
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    fetch(`${apiUrl}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        setToken(data.token);
        localStorage.setItem("token", data.token);
      })
      .catch((error) => console.error("Erreur lors de la connexion :", error));
  };

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Navbar />
        <div>
          <Routes>
            {!token ? (
              <>
                <Route
                  path="/login"
                  element={<Login setToken={setToken} setUserId={setUserId} />}
                />
                <Route
                  path="/register"
                  element={
                    <Register setToken={setToken} setUserId={setUserId} />
                  }
                />
              </>
            ) : (
              <Route
                path="/"
                element={<Dashboard token={token} userId={userId} />}
              />
            )}
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
