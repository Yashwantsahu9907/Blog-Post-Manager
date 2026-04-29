import api from './api';

const API_URL = '/admin';

export const getDashboardMetrics = async () => {
    const response = await api.get(`${API_URL}/dashboard`);
    return response.data;
};

export const getUsers = async () => {
    const response = await api.get(`${API_URL}/users`);
    return response.data;
};

export const updateUser = async (id, userData) => {
    const response = await api.put(`${API_URL}/users/${id}`, userData);
    return response.data;
};

export const deleteUser = async (id) => {
    const response = await api.delete(`${API_URL}/users/${id}`);
    return response.data;
};

export const getAdminPosts = async (params) => {
    const response = await api.get(`${API_URL}/posts`, { params });
    return response.data;
};

export const updatePostApproval = async (id, approvalStatus) => {
    const response = await api.put(`${API_URL}/posts/${id}/approve`, { approvalStatus });
    return response.data;
};

