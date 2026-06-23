import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '';

const api = axios.create({
  baseURL: `${API_BASE}/api/models`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for error logging
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;
    console.error(`[API Error] ${error.config?.method?.toUpperCase()} ${error.config?.url} — ${status}: ${message}`);
    return Promise.reject(error);
  }
);

export const fetchModels = async () => {
  const { data } = await api.get('/');
  return data;
};

export const fetchModelById = async (id) => {
  const { data } = await api.get(`/${id}`);
  return data;
};

export const createModel = async (modelData) => {
  const { data } = await api.post('/', modelData);
  return data;
};

export const updateModel = async (id, modelData) => {
  const { data } = await api.put(`/${id}`, modelData);
  return data;
};

export const deleteModel = async (id) => {
  const { data } = await api.delete(`/${id}`);
  return data;
};

export const searchModelsAPI = async (query) => {
  const { data } = await api.get('/search', { params: { q: query } });
  return data;
};
