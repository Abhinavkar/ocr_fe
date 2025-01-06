import React, { useState, useEffect, useContext } from 'react';
import './UserLogin.css';
import AdminLogo from "../../assets/images/blacklogo.png";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from '../../UserContext';
import SideNav from '../../components/SideNav';

export const SubUserRegister = () => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext); // Access user data from context
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [sectionAssigned, setSectionAssigned] = useState('');
    const [department, setDepartment] = useState('');
    const [departments, setDepartments] = useState([]);
    const [sections, setSections] = useState([]);

    useEffect(() => {
        const fetchDepartments = async () => {
            const response = await fetch(`http://localhost:8000/api/services/classes/${user.organization_id}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setDepartments(data);
        };

        fetchDepartments();
    }, [user.organization_id]);

    useEffect(() => {
        const fetchSections = async () => {
            if (department) {
                const response = await fetch(`http://localhost:8000/api/services/sections/${department}/`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                setSections(data);
            }
        };

        fetchSections();
    }, [department]);

    const handleRegister = async (e) => {
        e.preventDefault();

        const response = await fetch('http://localhost:8000/api/auth/org/register/subadmin/', {
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
                organization: user.organization_id
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
        <div className="user-register-page">
            <SideNav />
            <div className="main-content">
                <div className="login-container">
                    <img src={AdminLogo} className="LoginLogoImage" alt="Admin Logo" />
                    <h2>Sub Admin Registration</h2>
                    <form onSubmit={handleRegister}>
                        <div className="form-group">
                            <label htmlFor="organization">Organization : {user.organization}</label>
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
                            <select
                                id="department"
                                name="department"
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                required
                                className="form-control"
                            >
                                <option value="">Select Department</option>
                                {departments.map(dept => (
                                    <option key={dept._id} value={dept._id}>{dept.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="sectionAssigned">Section Assigned</label>
                            <select
                                id="sectionAssigned"
                                name="sectionAssigned"
                                value={sectionAssigned}
                                onChange={(e) => setSectionAssigned(e.target.value)}
                                required
                                className="form-control"
                            >
                                <option value="">Select Section</option>
                                {sections.map(section => (
                                    <option key={section._id} value={section._id}>{section.name}</option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="btn-fill">Register</button>
                    </form>
                    <ToastContainer />
                </div>
            </div>
        </div>
    );
};

export default SubUserRegister;
