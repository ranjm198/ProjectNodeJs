import express from 'express';
import mysql from 'mysql2';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Connexion à la base de données MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // votre nom d'utilisateur MySQL
  password: '', // votre mot de passe MySQL
  database: 'task_manager' // nom de votre base de données
});

db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à la base de données:', err);
  } else {
    console.log('Connexion à la base de données réussie');
  }
});

// Exporter la connexion à la base de données pour l'utiliser dans d'autres fichiers
export { db };

// Routes pour les pages HTML
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

app.get('/tasks', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'tasks.html'));
});

// Routes API
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Démarrer le serveur
const port = 5000;
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
