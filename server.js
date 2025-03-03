import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import userRoutes from './routes/users.js';
import taskRoutes from './routes/tasks.js';

// Configuration des variables d'environnement
dotenv.config();

// Initialisation de l'application Express
const app = express();

// Middleware pour gérer CORS et JSON
app.use(cors());
app.use(express.json());

// Gestion des fichiers statiques (Accès aux pages HTML)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

// Définition des routes API
app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);

// Port d'écoute du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur : http://localhost:${PORT}`);
});
