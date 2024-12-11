import React from 'react'
import './AdminLogin.css'
import AdminLogo from "../../assets/images/blacklogo.png"
import { useNavigate } from 'react-router-dom'

export const AdminLogin = () => {
    const navigate = useNavigate();
    // const { setUser } = useContext(UserContext);
  
    const handleLogin = (e) => {
      e.preventDefault();
      if (username && password) {
        const login = async () => {
          const response = await fetch('http://localhost:8000/api/auth/admin/login/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
          }).then((response) => {
            if (!response.ok) {
              throw new Error('Invalid email or password');
            }
            return response;
          });
          const data = await response.json();
        //   localStorage.setItem('token', data.access);
        //   setUser(data); // Set user details in context
          navigate('/');
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
          <input type="text" id="username" name="username" required />
        </div>
        <div className="form-group" >
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit" >Login</button>
      </form>
    </div>
  )
}