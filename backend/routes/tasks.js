const express = require("express");
const router = express.Router();
const db = require("../db");

// Route pour obtenir toutes les tâches
router.get("/", (req, res) => {
  db.all(`SELECT * FROM tasks`, [], (err, tasks) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(tasks);
  });
});

// Route pour créer une tâche
router.post("/", (req, res) => {
  const { title, xp } = req.body;
  db.run(
    `INSERT INTO tasks (title, xp) VALUES (?, ?)`,
    [title, xp],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID, title, xp });
    }
  );
});

module.exports = router;
