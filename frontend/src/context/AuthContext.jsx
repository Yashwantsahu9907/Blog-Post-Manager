import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            // Set global axios interceptor
            axios.interceptors.request.use(
                (config) => {
                    if (parsedUser?.token) {
                        config.headers.Authorization = `Bearer ${parsedUser.token}`;
                    }
                    return config;
                },
                (error) => Promise.reject(error)
            );
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        setUser(userData);
        axios.interceptors.request.use(
            (config) => {
                if (userData?.token) {
                    config.headers.Authorization = `Bearer ${userData.token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        // We can't easily remove interceptors like this but resetting headers is fine
        axios.defaults.headers.common['Authorization'] = '';
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
