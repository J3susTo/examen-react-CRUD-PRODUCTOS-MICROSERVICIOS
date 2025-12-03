import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL_AUTH}/login`, { email, password });
        login(response.data);  // Guarda el token en localStorage
        navigate('/productos');
        } catch (err) {
            console.log("ERROR COMPLETO:", err);
            console.log("Response del backend:", err.response?.data);
            console.log("Status:", err.response?.status);
            setError("Error de login: " + (err.response?.data?.message || err.message));
        }
    };

    return (
    <div class="container mt-5">
        <div class="row justify-content-center">
        <div class="col-md-6">
            <div class="card shadow">
            <div class="card-body">
                <h2 class="card-title text-center mb-4">Login</h2>
                <form onSubmit={handleLogin}>
                <div class="mb-3">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div class="mb-3">
                    <label class="form-label">Password</label>
                    <input type="password" class="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                {error && <div class="alert alert-danger">{error}</div>}
                <button type="submit" class="btn btn-primary w-100">Iniciar Sesión</button>
                </form>
            </div>
            </div>
        </div>
        </div>
    </div>
    );
};

export default Login;