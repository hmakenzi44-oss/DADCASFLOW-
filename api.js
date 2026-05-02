const API_URL = 'http://localhost:3000/api';

const api = {
    async get(endpoint) {
        const response = await fetch(`${API_URL}${endpoint}`);
        return await response.json();
    },
    async post(endpoint, data) {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await response.json();
    }
};
