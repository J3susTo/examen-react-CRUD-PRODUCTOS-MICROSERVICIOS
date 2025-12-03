import { useState, useEffect } from 'react';

const useAuth = () => {
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
    if (token) localStorage.setItem('token', token);
    }, [token]);

    const login = (newToken) => setToken(newToken);

    const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    };

    return { token, login, logout };
};

export default useAuth;