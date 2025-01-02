import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoSvg from "../../assets/images/logo.svg";
import DashboardPng from "../../assets/images/dashboard.png";
import DownloadPng from "../../assets/images/download.png";
import LogoutPng from "../../assets/images/logout.png";
import CareersPng from "../../assets/images/careers.png";
import './ClassManagement.css';

const ClassManagement = () => {
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]);

    useEffect(() => {
        const fetchClasses = async () => {
            const response = await fetch('http://localhost:8000/api/services/classes/676d5062b1f7e1e5c223eace/', {
                method: 'GET',
               
            });

            if (response.ok) {
                const data = await response.json();
                 setClasses(data);
            }
            console.log(classes)
        };
        console.log(classes)

        fetchClasses();
    }, []);

    const handleLogout = () => {
        // localStorage.removeItem('token');
        localStorage.removeItem('is_admin');
        navigate('/');
    };

    const SideNav = () => (
        <div className="sidenav">
            <div className="logo">
                <img src={LogoSvg} alt="Logo" />
            </div>
            <ul>
                <li><a href="/dashboard"><span><img src={DashboardPng} alt="Dashboard" /></span>Dashboard</a></li>
                <li><a href="/results"><span><img src={DownloadPng} alt="Download" /></span>Results</a></li>
                <li><a href="/user/register"><span><img src={CareersPng} alt="Add User" /></span>Add User</a></li>
                <li><a href="/sub-user/register"><span><img src={CareersPng} alt="Add Subadmin" /></span>Add Subadmin</a></li>
                <li className="active"><a href="/class-management"><span><img src={CareersPng} alt="Class Management" /></span>Class Management</a></li>
                <li><a href="/" onClick={handleLogout}><span><img src={LogoutPng} alt="Logout" /></span>Logout</a></li>
            </ul>
        </div>
    );

    return (
        <div className="class-management-page">
            <SideNav />
            <div className="main-content">
                <div className="class-management-container">
                    <h2>Class Management</h2>
                    <table className="class-table">
                        <thead>
                            <tr>
                                <th>Class ID</th>
                                <th>Class Name</th>
                                <th>Section</th>
                            </tr>
                        </thead>
                        <tbody>
                            {classes.map((classItem) => (
                                <tr key={classItem._id}>
                                    <td>{classItem._id}</td>
                                    <td>{classItem.name}</td>
                                    <td>{classItem.section}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ClassManagement;