import React from 'react';
import './Result.css';
import LogoSvg from "../../assets/images/logo.svg";
import DashboardPng from "../../assets/images/dashboard.png";
import DownloadPng from "../../assets/images/download.png";
import LogoutPng from "../../assets/images/logout.png";
import { useNavigate } from 'react-router-dom';

export const Result = () => {
    const navigate = useNavigate();
    const results = [
        { id: 1, name: 'John Doe', score: 95 },
        { id: 2, name: 'Jane Smith', score: 88 },
        { id: 3, name: 'Sam Johnson', score: 92 },
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('is_admin');
        navigate('/');
    };

    return (
        <div className="result-page">
            <div className="sidenav">
                <div className="logo">
                    <img src={LogoSvg} alt="Logo" />
                </div>
                <ul>
                    <li><a href="javascript:void(0)"><span><img src={DashboardPng} alt="Dashboard" /></span>Dashboard</a></li>
                    <li className="active"><a href="javascript:void(0)"><span><img src={DownloadPng} alt="Download" /></span>Result Download</a></li>
                    <li><a href="javascript:void(0)" onClick={handleLogout}><span><img src={LogoutPng} alt="Logout" /></span>Logout</a></li>
                </ul>
            </div>
            <div className="main-content">
                <div className="result-container">
                    <h2>Results</h2>
                    <table className="result-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map(result => (
                                <tr key={result.id}>
                                    <td>{result.id}</td>
                                    <td>{result.name}</td>
                                    <td>{result.score}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};