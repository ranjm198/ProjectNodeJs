import express from 'express';
import { db } from '../server.js'; // Connexion DB
import { authenticateJWT } from '../middlewares/auth.js'; // Importation du middleware pour authentifier l'utilisateur

const router = express.Router();

// Ajouter une tâche
router.post('/', authenticateJWT, (req, res) => {
  const { title, description, status } = req.body;
  const userId = req.user.id;

  const query = 'INSERT INTO tasks (title, description, status, user_id) VALUES (?, ?, ?, ?)';
  db.query(query, [title, description, status, userId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur lors de l\'ajout de la tâche', error: err });
    }
    res.status(201).json({ message: 'Tâche ajoutée avec succès' });
  });
});

// Récupérer toutes les tâches de l'utilisateur connecté
router.get('/', authenticateJWT, (req, res) => {
  const userId = req.user.id;

  const query = 'SELECT * FROM tasks WHERE user_id = ?';
  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur lors de la récupération des tâches', error: err });
    }
    res.status(200).json(results);
  });
});

// Mettre à jour une tâche
router.put('/:id', authenticateJWT, (req, res) => {
  const { id } = req.params;
  const { title, description, status } = req.body;
  const userId = req.user.id;

  const query = 'UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ? AND user_id = ?';
  db.query(query, [title, description, status, id, userId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur lors de la mise à jour de la tâche', error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Tâche non trouvée ou vous n\'êtes pas autorisé à la modifier' });
    }
    res.status(200).json({ message: 'Tâche mise à jour avec succès' });
  });
});

// Supprimer une tâche
router.delete('/:id', authenticateJWT, (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const query = 'DELETE FROM tasks WHERE id = ? AND user_id = ?';
  db.query(query, [id, userId], (err, result) => {
    if (err) {
      return res.status(500).json({ message: 'Erreur lors de la suppression de la tâche', error: err });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Tâche non trouvée ou vous n\'êtes pas autorisé à la supprimer' });
    }
    res.status(200).json({ message: 'Tâche supprimée avec succès' });
  });
});

export default router;
