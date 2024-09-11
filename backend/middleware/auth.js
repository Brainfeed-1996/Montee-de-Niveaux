const jwt = require("jsonwebtoken");

const JWT_SECRET = "monSuperSecret"; // Devrait être mis dans une variable d'environnement

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401); // Si aucun token n'est fourni

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Si le token est invalide
    req.user = user;
    next(); // Si tout va bien, on passe à la prochaine fonction
  });
}

module.exports = authenticateToken;
