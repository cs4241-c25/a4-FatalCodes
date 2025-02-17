import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production' 
  ? '' 
  : (import.meta.env.VITE_API_URL || 'http://localhost:3000');

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});

export const todoService = {
  fetchTodos: () => api.get('/api/todos'),
  createTodo: (todo) => api.post('/api/todos', todo),
  updateTodo: (id, updates) => api.patch(`/api/todos/${id}`, updates),
  deleteTodo: (id) => api.delete(`/api/todos/${id}`),
};

export const authService = {
  checkAuth: () => api.get('/api/auth/user'),
  logout: () => api.get('/api/auth/logout'),
}; 