import axios from 'axios';

const API_URL = 'http://localhost:5000/api/posts';

export const getPosts = async (params) => {
    const response = await axios.get(API_URL, { params });
    return response.data;
};

export const getPost = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

export const getUserPosts = async () => {
    // We assume getAuthHeaders from authService or AuthContext applies interceptor, 
    // actually interceptor in AuthContext handles headers.
    const response = await axios.get(`${API_URL}/my-posts`);
    return response.data;
};

export const createPost = async (postData) => {
    const response = await axios.post(API_URL, postData);
    return response.data;
};

export const updatePost = async (id, postData) => {
    const response = await axios.put(`${API_URL}/${id}`, postData);
    return response.data;
};

export const deletePost = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};

export const exportPosts = async (params) => {
    const response = await axios.get(`${API_URL}/export/csv`, {
        params,
        responseType: 'blob',
    });
    return response.data;
};

export const uploadPostImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data.imageUrl;
};
