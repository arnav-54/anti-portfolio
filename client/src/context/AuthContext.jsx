import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Configure axios base URL
    axios.defaults.baseURL = import.meta.env.VITE_API_URL || '/api';
    axios.defaults.withCredentials = true;

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        checkUserLoggedIn();
    }, []);

    const checkUserLoggedIn = async () => {
        try {
            const { data } = await axios.get('/auth/me');
            setUser(data);
        } catch (error) {
            setUser(null);
            localStorage.removeItem('auth_token');
            delete axios.defaults.headers.common['Authorization'];
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        const { data } = await axios.post('/auth/login', { username, password });
        setUser(data);
        if (data && data.token) {
            localStorage.setItem('auth_token', data.token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        }
        return data;
    };

    const logout = async () => {
        try {
            await axios.post('/auth/logout');
        } catch (err) {
            // ignore
        }
        setUser(null);
        localStorage.removeItem('auth_token');
        delete axios.defaults.headers.common['Authorization'];
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
