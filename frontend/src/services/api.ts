const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export const api = {
    getToken: () => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('token');
        }
        return null;
    },

    setToken: (token: string) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('token', token);
        }
    },

    removeToken: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }
    },

    getHeaders: () => {
        const token = api.getToken();
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        return headers;
    },

    get: async (url: string) => {
        const res = await fetch(`${API_URL}${url}`, {
            method: 'GET',
            headers: api.getHeaders(),
        });
        return res.json();
    },

    post: async (url: string, body: any) => {
        const res = await fetch(`${API_URL}${url}`, {
            method: 'POST',
            headers: api.getHeaders(),
            body: JSON.stringify(body),
        });
        return res.json();
    },

    put: async (url: string, body: any) => {
        const res = await fetch(`${API_URL}${url}`, {
            method: 'PUT',
            headers: api.getHeaders(),
            body: JSON.stringify(body),
        });
        return res.json();
    },

    patch: async (url: string, body: any) => {
        const res = await fetch(`${API_URL}${url}`, {
            method: 'PATCH',
            headers: api.getHeaders(),
            body: JSON.stringify(body),
        });
        return res.json();
    },

    delete: async (url: string) => {
        const res = await fetch(`${API_URL}${url}`, {
            method: 'DELETE',
            headers: api.getHeaders(),
        });
        return res.json();
    },
};
