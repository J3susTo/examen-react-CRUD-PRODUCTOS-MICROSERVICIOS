import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import fondo from '../assets/fondo-login.png';
import  '../App.css';



const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
        const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL_AUTH}/login`,
        { email, password }
        );

        login(response.data);  
        navigate('/productos');
    } catch (err) {
        console.log("ERROR COMPLETO:", err);
        setError(err.response?.data?.message || 'Credenciales incorrectas');
    } finally {
        setLoading(false);
    }
    };

    return (
    <div className="login-bg d-flex align-items-center justify-content-center" style={{ backgroundImage: `url(${fondo})` }}>
        <div className="card login-card shadow-lg mt-5">
        <div className="card-body p-4">
            <h3 className="text-center mb-4 fw-bold">🔐 Iniciar Sesión</h3>

            <form onSubmit={handleLogin}>
            <div className="mb-3">
                <label className="form-label">Correo electrónico</label>
                <input
                type="email"
                className="form-control form-control-lg"
                placeholder="usuario@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                />
            </div>

            <div className="mb-3">
                <label className="form-label">Contraseña</label>
                <input
                type="password"
                className="form-control form-control-lg"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                />
            </div>

            {error && (
                <div className="alert alert-danger py-2 text-center">
                {error}
                </div>
            )}

            <button
                type="submit"
                className="btn btn-primary btn-lg w-100"
                disabled={loading}
            >
                {loading ? 'Validando...' : 'Ingresar'}
            </button>
            </form>

        </div>
        </div>
    </div>
    );
};

export default Login;
