const db = require('../models/db');

// Ajouter une tâche
exports.createTask = async (req, res) => {
  const { title, description, status } = req.body;
  const userId = req.user.id;
  try {
    const [result] = await db.execute('INSERT INTO tasks (title, description, status, user_id) VALUES (?, ?, ?, ?)', [title, description, status, userId]);
    res.status(201).json({ id: result.insertId, title, description, status });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Mettre à jour une tâche
exports.updateTask = async (req, res) => {
  const { id, status } = req.body;
  try {
    await db.execute('UPDATE tasks SET status = ? WHERE id = ?', [status, id]);
    res.status(200).json({ message: 'Tâche mise à jour' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Supprimer une tâche
exports.deleteTask = async (req, res) => {
  const { id } = req.params;
  try {
    await db.execute('DELETE FROM tasks WHERE id = ?', [id]);
    res.status(200).json({ message: 'Tâche supprimée' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Liste des tâches
exports.getTasks = async (req, res) => {
  try {
    const [tasks] = await db.execute('SELECT * FROM tasks WHERE user_id = ?', [req.user.id]);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
