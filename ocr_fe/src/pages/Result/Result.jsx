import React, { useState, useEffect } from 'react';
import './Result.css';
import LogoSvg from "../../assets/images/logo.svg";
import DashboardPng from "../../assets/images/dashboard.png";
import DownloadPng from "../../assets/images/download.png";
import LogoutPng from "../../assets/images/logout.png";
import { useNavigate } from 'react-router-dom';

export const Result = () => {
    const navigate = useNavigate();
    const [results, setResults] = useState([]);

    useEffect(() => {
        const fetchResults = async () => {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8000/api/qa/results/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setResults(data);
            }
            console.log(results);
        };

        fetchResults();
    }, []);

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
                    <li className="active"><a href="javascript:void(0)"><span><img src={DownloadPng} alt="Download" /></span>Results</a></li>
                    <li><a href="javascript:void(0)" onClick={handleLogout}><span><img src={LogoutPng} alt="Logout" /></span>Logout</a></li>
                </ul>
            </div>
            <div className="main-content">
                <div className="result-container">
                    <h2>Results</h2>
                    <table className="result-table">
                        <thead>
                            <tr>
                                <th>Document ID</th>
                                <th>Exam ID</th>
                                <th>Class</th>
                                <th>Subject</th>
                                <th>Roll No</th>
                                <th>Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {results.map((result) => (
                                <tr key={result.document_id}>
                                    <td>{result.document_id}</td>
                                    <td>{result.class_id}</td>
                                    <td>{result.subject}</td>
                                    <td>{result.exam_id}</td>
                                    <td>{result.roll_no}</td>
                                    <td>{result.similarity_score}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

