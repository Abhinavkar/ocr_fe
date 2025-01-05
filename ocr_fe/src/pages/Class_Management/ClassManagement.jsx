import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoSvg from "../../assets/images/logo.svg";
import DashboardPng from "../../assets/images/dashboard.png";
import DownloadPng from "../../assets/images/download.png";
import LogoutPng from "../../assets/images/logout.png";
import CareersPng from "../../assets/images/careers.png";
import './ClassManagement.css';
import { UserContext } from '../../UserContext';
import SideNav from '../../components/SideNav';

const API_BASE_URL = 'http://localhost:8000/api/services/classes';

const ClassManagement = () => {
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]);
    const [newClassName, setNewClassName] = useState('');
    const [updateClassId, setUpdateClassId] = useState(null);
    const [updateClassName, setUpdateClassName] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${API_BASE_URL}/676d5062b1f7e1e5c223eace/`, {
                    method: 'GET',
                });

                if (!response.ok) throw new Error('Failed to fetch classes.');

                const data = await response.json();
                setClasses(data);
            } catch (error) {
                console.error(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchClasses();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('is_admin');
        navigate('/');
    };

    const handleCreateClass = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    userId: user.id,
                },
                body: JSON.stringify({
                    name: newClassName,
                    organization_id: user.organization_id,
                }),
            });

            if (!response.ok) throw new Error('Failed to create class.');

            const newClass = await response.json();
            setClasses((prevClasses) => [...prevClasses, newClass]);
            setNewClassName('');
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleDeleteClass = async (classId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/delete/${classId}/`, {
                method: 'DELETE',
                headers: {
                    userId: user.id,
                },
            });

            if (!response.ok) throw new Error('Failed to delete class.');

            setClasses((prevClasses) => prevClasses.filter((classItem) => classItem.id !== classId));
            setTimeout
            navigate('/class/management');
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleUpdateClass = (classId) => {
        const classToUpdate = classes.find((classItem) => classItem.id === classId);
        setUpdateClassId(classId);
        setUpdateClassName(classToUpdate?.name || '');
        setIsModalOpen(true);
    };

    const handleSaveUpdateClass = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/update/${updateClassId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    userId: user.id,
                },
                body: JSON.stringify({
                    name: updateClassName,
                }),
            });

            if (!response.ok) throw new Error('Failed to update class.');

            const updatedClass = await response.json();
            setClasses((prevClasses) =>
                prevClasses.map((classItem) => (classItem.id === updateClassId ? updatedClass : classItem))
            );
            setIsModalOpen(false);
            setUpdateClassId(null);
            setUpdateClassName('');
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleCancelUpdate = () => {
        setIsModalOpen(false);
        setUpdateClassId(null);
        setUpdateClassName('');
    };

    return (
        <div className="class-management-page">
            <SideNav />
            <div className="main-content">
                <div className="class-management-container">
                    <h2>Class Management</h2>

                    <div className="create-class-form">
                        <input
                            type="text"
                            placeholder="Class Name"
                            value={newClassName}
                            onChange={(e) => setNewClassName(e.target.value)}
                        />
                        <button onClick={handleCreateClass} disabled={!newClassName.trim()}>
                            Create Class
                        </button>
                    </div>

                    {isLoading ? (
                        <p>Loading classes...</p>
                    ) : (
                        <table className="class-table">
                            <thead>
                                <tr>
                                    <th>S No</th>
                                    <th>Class Name</th>
                                    
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {classes.length > 0 ? (
                                    classes.map((classItem,i) => (
                                        <tr key={classItem._id}>
                                            <td>{i+1}</td>
                                            <td>{classItem.name}</td>
                                           
                                            <td>
                                                <button onClick={() => handleDeleteClass(classItem._id)}>Delete</button>
                                                <button onClick={() => handleUpdateClass(classItem._id)}>Update</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4">No classes available</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h3>Update Class Name</h3>
                        <input
                            type="text"
                            placeholder="New Class Name"
                            value={updateClassName}
                            onChange={(e) => setUpdateClassName(e.target.value)}
                        />
                        <button onClick={handleSaveUpdateClass} disabled={!updateClassName.trim()}>
                            Save
                        </button>
                        <button onClick={handleCancelUpdate}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClassManagement;
