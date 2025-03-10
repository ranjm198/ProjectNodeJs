import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../models/db.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const [result] = await db.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
        res.status(201).json({ message: 'Utilisateur créé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de l\'inscription', error });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const [users] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        if (users.length === 0) return res.status(401).json({ message: 'Identifiants incorrects' });

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Identifiants incorrects' });

        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
});
router.get('/list', async (req, res) => {
    try {
        const [users] = await db.execute('SELECT id, username, password FROM users');
        res.json(users);  
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
});
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params; // On récupère l'ID de l'utilisateur à supprimer

    try {
        const [result] = await db.execute('DELETE FROM users WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        res.json({ message: 'Utilisateur supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur', error });
    }
});
export default router;
