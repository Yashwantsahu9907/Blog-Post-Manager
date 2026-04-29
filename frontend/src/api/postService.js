import api from './api';

const API_URL = '/posts';

export const getPosts = async (params) => {
    const response = await api.get(API_URL, { params });
    return response.data;
};

export const getPost = async (id) => {
    const response = await api.get(`${API_URL}/${id}`);
    return response.data;
};

export const getUserPosts = async () => {
    const response = await api.get(`${API_URL}/my-posts`);
    return response.data;
};

export const createPost = async (postData) => {
    const response = await api.post(API_URL, postData);
    return response.data;
};

export const updatePost = async (id, postData) => {
    const response = await api.put(`${API_URL}/${id}`, postData);
    return response.data;
};

export const deletePost = async (id) => {
    const response = await api.delete(`${API_URL}/${id}`);
    return response.data;
};

export const exportPosts = async (params) => {
    const response = await api.get(`${API_URL}/export/csv`, {
        params,
        responseType: 'blob',
    });
    return response.data;
};

export const uploadPostImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post(`${API_URL}/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data.imageUrl;
};

