function App() {
  let [token, setToken] = useState(localStorage.getItem("token") || null);
  let [userId, setUserId] = useState(null);
  let [useEffect, setUseEffect] = useState(false);

  useEffect(() => {
    if (token) {
      const decoded = jwt_decode(token);
      setUserId(decoded.id);
    }
  }, [token]);

  const apiUrl = "http://localhost:3000/api";
  // Variables pour l'utilisateur
  let userXP = 0;
  let userLevel = 1;
  let xpNeeded = 100;

  document.addEventListener("DOMContentLoaded", () => {
    token = localStorage.getItem("token");
    if (token) {
      const decoded = jwt_decode(token);
      userId = decoded.id;
      fetchUser(userId);
      fetchTasks();
    } else {
      // Affiche le formulaire de connexion si aucun token n'est trouvé
      document.getElementById("login-form").style.display = "block";
    }

    // Gérer la connexion
    document
      .getElementById("login-form")
      .addEventListener("submit", handleLogin);
    document
      .getElementById("register-link")
      .addEventListener("click", showRegisterForm);
    document
      .getElementById("register-form")
      .addEventListener("submit", handleRegister);
  });

  // Mise à jour du profil utilisateur
  function updateProfile() {
    document.getElementById("user-xp").textContent = userXP;
    document.getElementById("user-level").textContent = userLevel;
    document.getElementById("xp-needed").textContent = xpNeeded;
  }

  // Récupération des informations de l'utilisateur
  function fetchUser(id) {
    fetch(`${apiUrl}/users/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(handleFetchErrors)
      .then((response) => response.json())
      .then((user) => {
        userXP = user.xp;
        userLevel = user.level;
        xpNeeded = 100 * Math.pow(1.5, userLevel - 1); // Calcul du nouvel XP requis pour le prochain niveau
        updateProfile();
      })
      .catch((error) =>
        console.error("Erreur lors du chargement de l’utilisateur :", error)
      );
  }

  // Récupération des tâches
  function fetchTasks() {
    fetch(`${apiUrl}/tasks`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(handleFetchErrors)
      .then((response) => response.json())
      .then((tasks) => {
        const taskList = document.getElementById("task-list");
        taskList.innerHTML = ""; // Réinitialiser la liste des tâches
        tasks.forEach((task) => {
          const li = document.createElement("li");
          li.innerHTML = `
              <span>${task.title} - ${task.xp} XP</span>
              <button class="complete-btn" onclick="completeTask(${task.id}, ${task.xp})">Compléter</button>
          `;
          taskList.appendChild(li);
        });
      })
      .catch((error) =>
        console.error("Erreur lors du chargement des tâches :", error)
      );
  }

  // Compléter une tâche et mettre à jour les points d'expérience
  function completeTask(id, xp) {
    fetch(`${apiUrl}/users/${userId}/xp`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ xp }),
    })
      .then(handleFetchErrors)
      .then((response) => response.json())
      .then((user) => {
        userXP = user.xp;
        userLevel = user.level;
        xpNeeded = 100 * Math.pow(1.5, userLevel - 1); // Mise à jour de l'XP requis pour le prochain niveau
        updateProfile();
      })
      .catch((error) =>
        console.error("Erreur lors de la complétion de la tâche :", error)
      );
  }

  // Gérer la connexion
  function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

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
          token = data.token;
          localStorage.setItem("token", token);
          userId = jwt_decode(token).id; // On décode le token pour récupérer l'ID utilisateur
          fetchUser(userId);
          fetchTasks();
        } else {
          alert(data.message);
        }
      })
      .catch((error) => console.error("Erreur de connexion :", error));
  }

  // Gérer l'inscription
  function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById("new-username").value;
    const password = document.getElementById("new-password").value;

    fetch(`${apiUrl}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          alert(data.message);
        }
      })
      .catch((error) => console.error("Erreur d’inscription :", error));
  }

  // Afficher le formulaire d'inscription
  function showRegisterForm() {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("register-form").style.display = "block";
  }

  // Déconnexion de l'utilisateur
  function logout() {
    localStorage.removeItem("token");
    token = null;
    userId = null;
    location.reload();
  }

  // Gérer les erreurs de requête
  function handleFetchErrors(response) {
    if (!response.ok) {
      if (response.status === 403) {
        alert("Session expirée. Veuillez vous reconnecter.");
        logout();
      } else {
        throw Error(response.statusText);
      }
    }
    return response;
  }