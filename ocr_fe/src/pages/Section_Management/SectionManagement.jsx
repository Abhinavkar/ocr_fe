import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './SectionManagement.css';
import { UserContext } from '../../UserContext';
import SideNav from '../../components/SideNav';

const API_BASE_URL = 'http://localhost:8000/api/services/sections';
const CLASS_API_BASE_URL = 'http://localhost:8000/api/services/classes';

const SectionManagement = () => {
    const navigate = useNavigate();
    const [sections, setSections] = useState([]);
    const [classes, setClasses] = useState([]);
    const [newSectionName, setNewSectionName] = useState('');
    const [updateSectionId, setUpdateSectionId] = useState(null);
    const [updateSectionName, setUpdateSectionName] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchSections = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${API_BASE_URL}/677b55352848b6ceab2cf5af/`, {
                    method: 'GET',
                });

                if (!response.ok) throw new Error('Failed to fetch sections.');

                const data = await response.json();
                console.log('Sections:', data); // Debugging log
                setSections(data);
            } catch (error) {
                console.error(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchClasses = async () => {
            try {
                const response = await fetch(`${CLASS_API_BASE_URL}/676d5062b1f7e1e5c223eace/`, {
                    method: 'GET',
                });

                if (!response.ok) throw new Error('Failed to fetch classes.');

                const data = await response.json();
                console.log('Classes:', data); // Debugging log
                setClasses(data);
            } catch (error) {
                console.error(error.message);
            }
        };

        fetchSections();
        fetchClasses();
    }, []);

    const handleCreateSection = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    userId: user.id,
                },
                body: JSON.stringify({
                    name: newSectionName,
                    organization_id: user.organization_id,
                }),
            });

            if (!response.ok) throw new Error('Failed to create section.');

            const newSection = await response.json();
            setSections((prevSections) => [...prevSections, newSection]);
            setNewSectionName('');
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleDeleteSection = async (sectionId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/delete/${sectionId}/`, {
                method: 'DELETE',
                headers: {
                    userId: user.id,
                },
            });

            if (!response.ok) throw new Error('Failed to delete section.');

            setSections((prevSections) => prevSections.filter((sectionItem) => sectionItem._id !== sectionId));
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleUpdateSection = (sectionId) => {
        const sectionToUpdate = sections.find((sectionItem) => sectionItem._id === sectionId);
        setUpdateSectionId(sectionId);
        setUpdateSectionName(sectionToUpdate?.name || '');
        setIsModalOpen(true);
    };

    const handleSaveUpdateSection = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/update/${updateSectionId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    userId: user.id,
                },
                body: JSON.stringify({
                    name: updateSectionName,
                }),
            });

            if (!response.ok) throw new Error('Failed to update section.');

            const updatedSection = await response.json();
            setSections((prevSections) =>
                prevSections.map((sectionItem) => (sectionItem._id === updateSectionId ? updatedSection : sectionItem))
            );
            setIsModalOpen(false);
            setUpdateSectionId(null);
            setUpdateSectionName('');
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleCancelUpdate = () => {
        setIsModalOpen(false);
        setUpdateSectionId(null);
        setUpdateSectionName('');
    };

    const getClassNameById = (classId) => {
        const classItem = classes.find((classItem) => classItem._id === classId);
        return classItem ? classItem.name : 'Unknown';
    };

    return (
        <div className="section-management-page">
            <SideNav />
            <div className="main-content">
                <div className="section-management-container">
                    <h2>Section Management</h2>

                    <div className="create-section-form">
                        <input
                            type="text"
                            placeholder="Section Name"
                            value={newSectionName}
                            onChange={(e) => setNewSectionName(e.target.value)}
                        />
                        <button onClick={handleCreateSection} disabled={!newSectionName.trim()}>
                            Create Section
                        </button>
                    </div>

                    {isLoading ? (
                        <p>Loading sections...</p>
                    ) : (
                        <table className="section-table">
                            <thead>
                                <tr>
                                    <th>S No</th>
                                    <th>Class Name</th>
                                    <th>Section Name</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sections.length > 0 ? (
                                    sections.map((sectionItem, i) => (
                                        <tr key={sectionItem._id}>
                                            <td>{i + 1}</td>
                                            <td>{getClassNameById(sectionItem.class_id)}</td>
                                            <td>{sectionItem.name}</td>
                                            <td>
                                                <button onClick={() => handleDeleteSection(sectionItem._id)}>Delete</button>
                                                <button onClick={() => handleUpdateSection(sectionItem._id)}>Update</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4">No sections available</td>
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
                        <h3>Update Section Name</h3>
                        <input
                            type="text"
                            placeholder="New Section Name"
                            value={updateSectionName}
                            onChange={(e) => setUpdateSectionName(e.target.value)}
                        />
                        <button onClick={handleSaveUpdateSection} disabled={!updateSectionName.trim()}>
                            Save
                        </button>
                        <button onClick={handleCancelUpdate}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SectionManagement;