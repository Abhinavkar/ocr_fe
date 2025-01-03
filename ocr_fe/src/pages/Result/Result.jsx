import React, { useState, useEffect, useContext } from 'react';
import './Result.css';
import LogoSvg from "../../assets/images/logo.svg";
import DashboardPng from "../../assets/images/dashboard.png";
import DownloadPng from "../../assets/images/download.png";
import LogoutPng from "../../assets/images/logout.png";
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../UserContext';

export const Result = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [results, setResults] = useState([]);
    const [classes, setClasses] = useState([]);

    useEffect(() => {
        const fetchResults = async () => {
            const response = await fetch('http://localhost:8000/api/qa/results/', {
                method: 'GET',
            });

            if (response.ok) {
                const data = await response.json();
                setResults(data);
            }
        };

        const fetchClasses = async () => {
            const response = await fetch(`http://localhost:8000/api/services/classes/${user.organization_id}`, {
                method: 'GET',
            });

            if (response.ok) {
                const data = await response.json();
                setClasses(data);
            }
        };

        fetchResults();
        fetchClasses();
    }, [user.organization_id]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('is_admin');
        navigate('/');
    };

    const getClassById = (id) => {
        const classItem = classes.find((classItem) => {
            console.log(classItem._id, id);
            return classItem._id === id; // Return the comparison result
        });
        console.log(classItem);
        return classItem ? classItem.name : 'Unknown Class'; // Fallback if class ID not found
    };
    

    return (
        <div className="result-page">
            <div className="sidenav">
                <div className="logo">
                    <img src={LogoSvg} alt="Logo" />
                </div>
                <ul>
                    <li><a href="#"><span><img src={DashboardPng} alt="Dashboard" /></span>Dashboard</a></li>
                    <li className="active"><a href="#"><span><img src={DownloadPng} alt="Download" /></span>Results</a></li>
                    <li><a href="#" onClick={handleLogout}><span><img src={LogoutPng} alt="Logout" /></span>Logout</a></li>
                </ul>
            </div>
            <div className="main-content">
                <div className="result-container">
                    <h2>Results</h2>
                    <table className="result-table">
                        <thead>
                            <tr>
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
                                    <td>{result.exam_id}</td>
                                    <td>{getClassById(result.class_id)}</td>
                                    <td>{result.subject}</td>
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

export default Result;
