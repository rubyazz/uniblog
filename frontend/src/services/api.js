import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getMe: () => api.get('/auth/me'),
};

export const postsAPI = {
  getAll: (page = 0, size = 10, sort = 'createdAt') =>
    api.get(`/posts?page=${page}&size=${size}&sort=${sort}`),
  search: (query, page = 0) =>
    api.get(`/posts/search?query=${query}&page=${page}`),
  getByCategory: (categoryId, page = 0) =>
    api.get(`/posts/category/${categoryId}?page=${page}`),
  getByTag: (tagId, page = 0) =>
    api.get(`/posts/tag/${tagId}?page=${page}`),
  getFeatured: (page = 0) =>
    api.get(`/posts/featured?page=${page}`),
  getBySlug: (slug) => api.get(`/posts/slug/${slug}`),
  getById: (id) => api.get(`/posts/${id}`),
  getByAuthor: (authorId, page = 0) =>
    api.get(`/posts/author/${authorId}?page=${page}`),
  create: (data) => api.post('/posts', data),
  update: (id, data) => api.put(`/posts/${id}`, data),
  delete: (id) => api.delete(`/posts/${id}`),
  like: (id) => api.post(`/posts/${id}/like`),
};

export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

export const tagsAPI = {
  getAll: () => api.get('/tags'),
  create: (data) => api.post('/tags', data),
  delete: (id) => api.delete(`/tags/${id}`),
};

export const commentsAPI = {
  getByPost: (postId, page = 0) =>
    api.get(`/comments/post/${postId}?page=${page}`),
  create: (postId, data) => api.post(`/comments/post/${postId}`, data),
  delete: (id) => api.delete(`/comments/${id}`),
  approve: (id) => api.put(`/comments/${id}/approve`),
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getUsers: () => api.get('/admin/users'),
  toggleUser: (id) => api.put(`/admin/users/${id}/toggle`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getAllPosts: (page = 0) => api.get(`/admin/posts?page=${page}`),
  getPendingComments: (page = 0) =>
    api.get(`/admin/comments/pending?page=${page}`),
};

export default api;
