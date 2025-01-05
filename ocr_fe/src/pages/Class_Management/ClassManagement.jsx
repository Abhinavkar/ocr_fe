
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
const ClassManagement = () => {
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]);
    const [newClassName, setNewClassName] = useState('');
    const [newClassSection, setNewClassSection] = useState('');
    const [updateClassId, setUpdateClassId] = useState(null);
    const [updateClassName, setUpdateClassName] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const {user} = useContext(UserContext)

    useEffect(() => {
        const fetchClasses = async () => {
            const response = await fetch('http://localhost:8000/api/services/classes/676d5062b1f7e1e5c223eace/', {
                method: 'GET',
            });

            if (response.ok) {
                const data = await response.json();
                setClasses(data);
            }
        };

        fetchClasses();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('is_admin');
        navigate('/');
    };

    const handleCreateClass = async () => {
        console.log("CLikced")
        const response = await fetch('http://localhost:8000/api/services/classes/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'userId':user.id,
            },
            body: JSON.stringify({
                name: newClassName,
                organization_id: user.organization_id,  
               
            }),
        });

        if (response.ok) {
            const newClass = await response.json();
            setClasses([...classes, newClass]);
            setNewClassName('');
            setNewClassSection('');
            
        }
    };

    const handleDeleteClass = async (classId) => {
        const response = await fetch(`http://localhost:8000/api/services/classes/delete/${classId}/`, {
            method: 'DELETE',
        });

        if (response.ok) {
            setClasses(classes.filter((classItem) => classItem._id !== classId));
        }
    };

    const handleUpdateClass = (classId) => {
        setUpdateClassId(classId);
        const classToUpdate = classes.find((classItem) => classItem._id === classId);
        setUpdateClassName(classToUpdate.name);
        setIsModalOpen(true);
    };

    const handleSaveUpdateClass = async () => {
        const response = await fetch(`http://localhost:8000/api/services/classes/update/${updateClassId}/`, {
            method: 'PUT',
            headers: {
                'userId': user.id, 
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: updateClassName,
            }),
        });

        if ( response.ok) {
            const updatedClass = await response.json();
            setClasses(classes.map((classItem) => (classItem._id === updateClassId ? updatedClass : classItem)));
            setUpdateClassId(null);
            setUpdateClassName('');
            try {
                navigate('/dashboard');
                        }
            catch{
                console.error("error");
                
            }
            finally{
                setIsModalOpen(false);


            }
          
            
        }
    };

    const handleCancelUpdate = () => {
        setUpdateClassId(null);
        setUpdateClassName('');
        setIsModalOpen(false);
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
                        <button onClick={handleCreateClass}>Create Class</button>
                    </div>
                    <table className="class-table">
                        <thead>
                            <tr>
                                <th>Class ID</th>
                                <th>Class Name</th>
                                <th>Section</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {classes.map((classItem) => (
                                <tr key={classItem._id}>
                                    <td>{classItem._id}</td>
                                    <td>{classItem.name}</td>
                                    <td>
                                        {classItem.sections && classItem.sections.length > 0
                                            ? classItem.sections.map((section) => section.name).join(', ')
                                            : 'No Section'}
                                    </td>
                                    <td>
                                        <button onClick={() => handleDeleteClass(classItem._id)}>Delete</button>
                                        <button onClick={() => handleUpdateClass(classItem._id)}>Update</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
                        <button onClick={handleSaveUpdateClass}>Save</button>
                        <button onClick={handleCancelUpdate}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClassManagement;