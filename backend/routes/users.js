const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const db = require("../db");

// Clé secrète pour JWT (devrait être dans une variable d'environnement dans un vrai projet)
const JWT_SECRET = "monSuperSecret";

// Route pour l'inscription d'un nouvel utilisateur
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  // Vérifie si l'utilisateur existe déjà
  db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
    if (user) {
      return res.status(400).json({ message: "Utilisateur déjà existant" });
    }

    // Hash du mot de passe
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Insère l'utilisateur dans la base de données
    db.run(
      `INSERT INTO users (username, password) VALUES (?, ?)`,
      [username, hashedPassword],
      function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: "Utilisateur créé avec succès" });
      }
    );
  });
});

// Route pour la connexion
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
    if (err || !user) {
      return res
        .status(400)
        .json({ message: "Nom d'utilisateur ou mot de passe incorrect" });
    }

    // Comparer les mots de passe
    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
      return res
        .status(400)
        .json({ message: "Nom d'utilisateur ou mot de passe incorrect" });
    }

    // Générer un token JWT
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Connexion réussie", token });
  });
});

module.exports = router;

const authenticateToken = require("../middleware/auth");

// Route pour mettre à jour les points d'expérience et le niveau (protégée par JWT)
router.put("/:id/xp", authenticateToken, (req, res) => {
  const userId = req.params.id;
  const { xp } = req.body;

  if (userId != req.user.id) {
    return res.status(403).json({ message: "Accès refusé" });
  }

  // Le reste du code reste inchangé...
});
