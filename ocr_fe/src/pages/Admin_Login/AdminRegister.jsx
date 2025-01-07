import React, { useState, useEffect } from 'react';
import './AdminLogin.css';
import AdminLogo from "../../assets/images/blacklogo.png";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const AdminRegister = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [sectionAssigned, setSectionAssigned] = useState('');
    const [department, setDepartment] = useState('');
    const [organization, setOrganization] = useState('');
    const [organizations, setOrganizations] = useState([]);

    useEffect(() => {
        const fetchOrganizations = async () => {
            const response = await fetch('http://localhost:8000/api/services/get/organization/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setOrganizations(data);
        };
        fetchOrganizations();
    }, []);

    const handleRegister = async (e) => {
        e.preventDefault();

        const response = await fetch('http://localhost:8000/api/auth/org/register/admin/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password,
                first_name: firstName,
                last_name: lastName,
                email,
                section_assigned: sectionAssigned,
                department,
                organization
            }),
        });

        if (response.ok) {
            toast.success('Registration successful');
            navigate('/');
        } else {
            toast.error('Registration failed');
        }
    };

    return (
        <div className="login-container">
            <img src={AdminLogo} className="LoginLogoImage" alt="Admin Logo" />
            <h2>Organization Admin Registration</h2>
            <form onSubmit={handleRegister}>
                <div class name="form-group-box" >
                    <div className="form-group-box-col">
                        <div className="form-group">
                            <label htmlFor="organization">Organization</label>
                            <select
                                id="organization"
                                name="organization"
                                value={organization}
                                onChange={(e) => setOrganization(e.target.value)}
                                required
                                className="form-control"
                            >
                                <option value="">Select Organization</option>
                                {organizations.map(org => (
                                    <option key={org._id} value={org._id}>{org.organization_name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="form-control"
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
                                className="form-control"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="firstName">First Name</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                className="form-control"
                            />
                        </div>
                    </div>
                    <div className="form-group-box-col">
                        <div className="form-group">
                            <label htmlFor="lastName">Last Name</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                                className="form-control"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="form-control"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="department">Department</label>
                            <input
                                type="text"
                                id="department"
                                name="department"
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                required
                                className="form-control"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="sectionAssigned">Sub Department</label>
                            <input
                                type="text"
                                id="sectionAssigned"
                                name="sectionAssigned"
                                value={sectionAssigned}
                                onChange={(e) => setSectionAssigned(e.target.value)}
                                required
                                className="form-control"
                            />
                        </div>
                      
                    </div>
                </div>
                <button type="submit" className="btn-fill">Register</button>
            </form>
            <ToastContainer />
        </div>
    );
};
