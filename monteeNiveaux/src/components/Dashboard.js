import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";
import jwt_decode from "jwt-decode";
import PropTypes from "prop-types";
import { TextField, Button, Container, Typography } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { AppBar, Toolbar, Typographys, Buttons } from "@mui/material";
import { Home, Login as LoginIcon, PersonAdd } from "@mui/icons-material";

const apiUrl = "http://localhost:3000/api";

function Dashboard({ token, userId }) {
  Dashboard.propTypes = {
    userId: PropTypes.func.isRequired,
    token: PropTypes.func.isRequired, // Définir le type de la prop
  };
  const [userXP, setUserXP] = useState(0);
  const [userLevel, setUserLevel] = useState(1);
  const [xpNeeded, setXpNeeded] = useState(100);
  const [tasks, setTasks] = useState([]);
  let [useEffect] = useState([]);

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
        setUserXP(user.xp);
        setUserLevel(user.level);
        setXpNeeded(100 * Math.pow(1.5, user.level - 1));
      })
      .catch((error) =>
        console.error("Erreur lors de la complétion de la tâche :", error)
      );
  };
  useEffect(() => {
    const fetchTasks = () => {
      fetch(`${apiUrl}/tasks`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((tasks) => setTasks(tasks))
        .catch((error) =>
          console.error("Erreur lors du chargement des tâches :", error)
        );
    };

    const fetchUser = (id) => {
      fetch(`${apiUrl}/users/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((user) => {
          setUserXP(user.xp);
          setUserLevel(user.level);
          setXpNeeded(100 * Math.pow(1.5, user.level - 1));
        })
        .catch((error) =>
          console.error("Erreur lors du chargement de l’utilisateur :", error)
        );
    };

    fetchTasks();
    fetchUser();
  }, [token]); // Le tableau de dépendances est vide car les fonctions sont définies à l'intérieur

  return (
    <div>
      <h2>Tableau de bord</h2>
      <div>
        <p>XP: {userXP}</p>
        <p>Niveau: {userLevel}</p>
        <p>XP nécessaire pour le prochain niveau: {xpNeeded}</p>
      </div>
      <h3>Tâches</h3>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <span>
              {task.title} - {task.xp} XP
            </span>
            <button onClick={() => completeTask(task.id, task.xp)}>
              Compléter
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
