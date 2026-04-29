import axios from 'axios';

const API_URL = 'http://localhost:5000/api/users';

export const registerUser = async (userData) => {
    const response = await axios.post(API_URL, userData);
    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

export const loginUser = async (userData) => {
    const response = await axios.post(`${API_URL}/login`, userData);
    if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

export const logoutUser = () => {
    localStorage.removeItem('user');
};

const getAuthHeaders = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        return {
            headers: { Authorization: `Bearer ${user.token}` }
        };
    }
    return {};
};

export const getUserProfile = async () => {
    const response = await axios.get(`${API_URL}/profile`, getAuthHeaders());
    return response.data;
};

export const updateUserProfile = async (userData) => {
    const response = await axios.put(`${API_URL}/profile`, userData, getAuthHeaders());
    if (response.data) {
        // Update local storage user data
        const currentUser = JSON.parse(localStorage.getItem('user'));
        const updatedUser = { ...currentUser, ...response.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    return response.data;
};

export const uploadProfileImage = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const config = getAuthHeaders();
    config.headers['Content-Type'] = 'multipart/form-data';
    
    const response = await axios.post(`${API_URL}/profile/image`, formData, config);
    return response.data.imageUrl;
};
