import api from './api';

const API_URL = '/users';

export const registerUser = async (userData) => {
    const response = await api.post(API_URL, userData);
    return response.data;
};

export const loginUser = async (userData) => {
    const response = await api.post(`${API_URL}/login`, userData);
    return response.data;
};

export const getUserProfile = async () => {
    const response = await api.get(`${API_URL}/profile`);
    return response.data;
};

export const updateUserProfile = async (userData) => {
    const response = await api.put(`${API_URL}/profile`, userData);
    return response.data;
};

export const uploadProfileImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post(`${API_URL}/profile/image`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data.imageUrl;
};

