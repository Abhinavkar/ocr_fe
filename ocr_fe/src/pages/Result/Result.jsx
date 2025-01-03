import React, { useState, useEffect, useContext } from 'react';
import React, { useState, useEffect ,useContext} from 'react';
import './Result.css';
import LogoSvg from "../../assets/images/logo.svg";
import DashboardPng from "../../assets/images/dashboard.png";
import DownloadPng from "../../assets/images/download.png";
import LogoutPng from "../../assets/images/logout.png";
import CareersPng from "../../assets/images/careers.png"

import { useNavigate,Link } from 'react-router-dom';
import { UserContext } from '../../UserContext';
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
            console.log(results);
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
                        <li ><span>Hi {user.first_name}</span></li>
                        <li className="active"><Link to="/dashboard"><span><img src={DashboardPng} alt="Dashboard" /></span>Dashboard</Link></li>
                        <li><Link to="/result"><span><img src={DownloadPng} alt="Download" /></span>Result Download</Link></li>
                        {user.is_admin && (
                        <>
                            <li><Link to="/user/register/"><span><img src={CareersPng} alt="Add User" /></span>Add User</Link></li>
                            <li><Link to="/sub-user/register"><span><img src={CareersPng} alt="Add Subadmin" /></span>Add Subadmin</Link></li>
                            <li><Link to="/user-management"><span><img src={CareersPng} alt="User Management" /></span>User Management</Link></li>
                            <li><Link to="/class/management"><span><img src={CareersPng} alt="User Management" /></span>Class Management</Link></li>
                        </>
                    )}
                    {user.is_sub_admin && !user.is_admin && (
                        <li><Link to="/user/register/"><span><img src={CareersPng} alt="Add User" /></span>Add User</Link></li>                    )}
                        <li><Link to="/" onClick={handleLogout}><span><img src={LogoutPng} alt="Logout" /></span>Logout</Link></li>
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
