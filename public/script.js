const API_URL = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('loginForm')) {
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

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
        });
    }

    if (document.getElementById('registerForm')) {
        document.getElementById('registerForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

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

            await fetch(`${API_URL}/tasks`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify({ title, description, status }),
            });

            fetchTasks();
        });
    }
});

async function fetchTasks() {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/tasks`, {
        headers: { 'Authorization': `Bearer ${token}` },
    });
    const tasks = await res.json();

    const taskList = document.getElementById('taskList');
    taskList.innerHTML = tasks.map(t => `<li>${t.title} - ${t.status}</li>`).join('');
}

function logout() {
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}
