import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { db } from '../server.js';

const router = express.Router();

// Inscription d'un utilisateur
router.post('/signup', (req, res) => {
  const { username, password } = req.body;

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ message: 'Erreur de hachage du mot de passe' });

    const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.query(query, [username, hashedPassword], (err, result) => {
      if (err) return res.status(500).json({ message: 'Erreur lors de l\'inscription' });

      res.status(201).json({ message: 'Utilisateur créé avec succès' });
    });
  });
});

// Connexion de l'utilisateur
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], (err, result) => {
    if (err) return res.status(500).json({ message: 'Erreur lors de la connexion' });
    if (result.length === 0) return res.status(404).json({ message: 'Utilisateur non trouvé' });

    const user = result[0];
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ message: 'Erreur lors de la comparaison du mot de passe' });
      if (!isMatch) return res.status(401).json({ message: 'Mot de passe incorrect' });

      // Créer un token JWT
      const token = jwt.sign({ userId: user.id }, 'votre_clé_secrète', { expiresIn: '1h' });
      res.json({ token });
    });
  });
});

export default router;
