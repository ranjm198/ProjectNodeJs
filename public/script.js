const API_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('loginForm')) {
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const res = await fetch(`${API_URL}/users/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                });

                const data = await res.json();
                if (res.ok) {
                    localStorage.setItem('token', data.token);
                    window.location.href = 'tasks.html';
                } else {
                    alert(data.message);
                }
            } catch (error) {
                alert('Erreur lors de la connexion. Veuillez réessayer.');
            }
        });
    }

    if (document.getElementById('registerForm')) {
        document.getElementById('registerForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const res = await fetch(`${API_URL}/users/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password }),
                });

                if (res.ok) {
                    alert('Inscription réussie');
                    window.location.href = 'index.html';
                } else {
                    alert('Erreur lors de l\'inscription');
                }
            } catch (error) {
                alert('Erreur lors de l\'inscription. Veuillez réessayer.');
            }
        });
    }

    if (document.getElementById('taskForm')) {
        fetchTasks();
        document.getElementById('taskForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const token = localStorage.getItem('token');
            const title = document.getElementById('taskTitle').value;
            const description = document.getElementById('taskDescription').value;
            const status = document.getElementById('taskStatus').value;

            try {
                await fetch(`${API_URL}/tasks`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ title, description, status }),
                });

                fetchTasks();
            } catch (error) {
                alert('Erreur lors de l\'ajout de la tâche');
            }
        });
    }
});

async function fetchTasks() {
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`${API_URL}/tasks`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });
        const tasks = await res.json();

        const taskList = document.getElementById('taskList');
        taskList.innerHTML = tasks.map(t => `
            <tr>
                <td>${t.title}</td>
                <td>${t.description}</td>
                <td>${t.status === "pending" ? "En attente" : "Terminée"}</td>
                <td>
                    <button class="edit-btn" onclick="updateTask(${t.id})">Modifier</button>
                    <button class="delete-btn" onclick="deleteTask(${t.id})">Supprimer</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        alert('Erreur lors de la récupération des tâches');
    }
}

async function updateTask(taskId) {
    const newTitle = prompt('Entrez le nouveau titre');
    const newDescription = prompt('Entrez la nouvelle description');
    const newStatus = prompt('Entrez le nouveau statut (pending/completed)');

    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_URL}/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ title: newTitle, description: newDescription, status: newStatus }),
        });

        if (response.ok) {
            fetchTasks(); 
            alert('Tâche mise à jour');
        } else {
            alert('Erreur lors de la mise à jour de la tâche');
        }
    } catch (error) {
        alert('Erreur lors de la mise à jour');
    }
}

async function deleteTask(taskId) {
    const confirmation = confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?');
    
    if (confirmation) {
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_URL}/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                fetchTasks(); 
                alert('Tâche supprimée');
            } else {
                alert('Erreur lors de la suppression de la tâche');
            }
        } catch (error) {
            alert('Erreur lors de la suppression de la tâche');
        }
    }
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}
