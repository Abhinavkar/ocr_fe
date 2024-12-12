import React , {useState} from 'react'
import './UserLogin.css'
import AdminLogo from "../../assets/images/blacklogo.png"
import { useNavigate } from 'react-router-dom'

export const UserLogin = () => {
    const navigate = useNavigate();    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    // const { setUser } = useContext(UserContext);
  
    const handleLogin = (e) => {
      e.preventDefault();
      if (username && password) {
        const login = async () => {
          const response = await fetch('http://localhost:8000/api/auth/login/', {
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
          navigate('/user/dashboard');
        };
        login();
      }
    };
  return (
    <div className="login-container">
        <img src={AdminLogo} className="LoginLogoImage" alt="" />

      <h2>User Login</h2>
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
        <button type="submit" >Login</button>
      </form>
    </div>
  )
}