import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin';

const getAuthHeaders = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        return {
            headers: { Authorization: `Bearer ${user.token}` }
        };
    }
    return {};
};

export const getDashboardMetrics = async () => {
    const response = await axios.get(`${API_URL}/dashboard`, getAuthHeaders());
    return response.data;
};

export const getUsers = async () => {
    const response = await axios.get(`${API_URL}/users`, getAuthHeaders());
    return response.data;
};

export const updateUser = async (id, userData) => {
    const response = await axios.put(`${API_URL}/users/${id}`, userData, getAuthHeaders());
    return response.data;
};

export const deleteUser = async (id) => {
    const response = await axios.delete(`${API_URL}/users/${id}`, getAuthHeaders());
    return response.data;
};

export const getAdminPosts = async (params) => {
    const config = getAuthHeaders();
    config.params = params;
    const response = await axios.get(`${API_URL}/posts`, config);
    return response.data;
};

export const updatePostApproval = async (id, approvalStatus) => {
    const response = await axios.put(`${API_URL}/posts/${id}/approve`, { approvalStatus }, getAuthHeaders());
    return response.data;
};
