import express from 'express';
import { db } from '../models/db.js';
import { authenticateJWT } from '../middlewares/auth.js';

const router = express.Router();

router.post('/', authenticateJWT, async (req, res) => {
    const { title, description, status } = req.body;
    const userId = req.user.id;

    try {
        await db.execute('INSERT INTO tasks (title, description, status, user_id) VALUES (?, ?, ?, ?)', [title, description, status, userId]);
        res.status(201).json({ message: 'Tâche ajoutée avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
});

router.get('/', authenticateJWT, async (req, res) => {
    try {
        const [tasks] = await db.execute('SELECT * FROM tasks WHERE user_id = ?', [req.user.id]);
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
});

router.put('/:id', authenticateJWT, async (req, res) => {
    const { id } = req.params;
    const { title, description, status } = req.body;
    const userId = req.user.id;

    try {
        const [result] = await db.execute('UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ? AND user_id = ?', [title, description, status, id, userId]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Tâche non trouvée' });
        res.status(200).json({ message: 'Tâche mise à jour avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
});

router.delete('/:id', authenticateJWT, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    try {
        const [result] = await db.execute('DELETE FROM tasks WHERE id = ? AND user_id = ?', [id, userId]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Tâche non trouvée' });
        res.status(200).json({ message: 'Tâche supprimée avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
});

export default router;
