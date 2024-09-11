const express = require("express");
const app = express();
const userRoutes = require("./routes/users");
const taskRoutes = require("./routes/tasks");

app.use(express.json());

// Routes pour les utilisateurs et les tâches
app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

// Démarrer le serveur
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
