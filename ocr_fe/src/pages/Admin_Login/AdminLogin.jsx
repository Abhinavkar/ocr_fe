import React, { useState, useContext } from 'react';
import './AdminLogin.css';
import AdminLogo from "../../assets/images/blacklogo.png";
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from '../../UserContext';

export const AdminLogin = () => {
    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        if (username && password) {
            const login = async () => {
                try {
                    const response = await fetch('http://localhost:8000/api/auth/login/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ username, password }),
                    });
                    if (!response.ok) {
                        throw new Error('Invalid email or password');
                    }
                    const data = await response.json();
                    localStorage.setItem('token', data.access);
                    localStorage.setItem('is_admin', data.is_admin);
                    setUser(data); // Set user details in context
                
                    navigate('/dashboard');
                } catch (error) {
                    toast.error(error.message);
                }
            };
            login();
        }
    };

    return (
        <div className="login-container">
            <img src={AdminLogo} className="LoginLogoImage" alt="" />
            <h2>Admin Login</h2>
            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button className='bbutton' type="submit">Login</button>
            </form>
            <ToastContainer />
            <div className='notyet'>  <Link to="/admin/register">Don't have a ID Yet? Click to Register</Link></div>
        </div>
    );
};