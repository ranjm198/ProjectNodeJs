import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import userRoutes from './routes/users.js';
import taskRoutes from './routes/tasks.js';
import http from 'http';
import { Server } from 'socket.io';  

dotenv.config();

const app = express();

const server = http.createServer(app);

const io = new Server(server);  

app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/list', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'profil.html'));
});

app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);

io.on('connection', (socket) => {
    console.log('Utilisateur connecté');

    socket.on('addTask', (task) => {
        console.log('Tâche ajoutée:', task);

        io.emit('taskAdded', task);
    });

    socket.on('disconnect', () => {
        console.log('Utilisateur déconnecté');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`✅ Serveur démarré sur : http://localhost:${PORT}`);
});
