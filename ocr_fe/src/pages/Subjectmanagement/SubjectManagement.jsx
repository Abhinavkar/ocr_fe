import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './SubjectManagement.css';
import { UserContext } from '../../UserContext';
import SideNav from '../../components/SideNav';

const API_BASE_URL = 'http://localhost:8000/api/services/subjects';
const CLASS_API_BASE_URL = 'http://localhost:8000/api/services/classes';
const SECTION_API_BASE_URL = 'http://localhost:8000/api/services/sections';

const SubjectManagement = () => {
    const navigate = useNavigate();
    const [subjects, setSubjects] = useState([]);
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [newSubjectName, setNewSubjectName] = useState('');
    const [selectedClassId, setSelectedClassId] = useState('');
    const [selectedSectionId, setSelectedSectionId] = useState('');
    const [updateSubjectId, setUpdateSubjectId] = useState(null);
    const [updateSubjectName, setUpdateSubjectName] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${API_BASE_URL}//`, {
                    method: 'GET',
                });

                if (!response.ok) throw new Error('Failed to fetch subjects.');

                const data = await response.json();
                console.log('Subjects:', data); // Debugging log
                setSubjects(data);
            } catch (error) {
                console.error(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchClasses = async () => {
            try {
                const response = await fetch(`${CLASS_API_BASE_URL}//`, {
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

        const fetchSections = async () => {
            try {
                const response = await fetch(`${SECTION_API_BASE_URL}//`, {
                    method: 'GET',
                });

                if (!response.ok) throw new Error('Failed to fetch sections.');

                const data = await response.json();
                console.log('Sections:', data); // Debugging log
                setSections(data);
            } catch (error) {
                console.error(error.message);
            }
        };

        fetchSubjects();
        fetchClasses();
        fetchSections();
    }, []);

    const handleCreateSubject = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    userId: user.id,
                },
                body: JSON.stringify({
                    name: newSubjectName,
                    class_id: selectedClassId,
                    section_id: selectedSectionId,
                    organization_id: user.organization_id,
                }),
            });

            if (!response.ok) throw new Error('Failed to create subject.');

            const newSubject = await response.json();
            setSubjects((prevSubjects) => [...prevSubjects, newSubject]);
            setNewSubjectName('');
            setSelectedClassId('');
            setSelectedSectionId('');
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleDeleteSubject = async (subjectId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/delete/${subjectId}/`, {
                method: 'DELETE',
                headers: {
                    userId: user.id,
                },
            });

            if (!response.ok) throw new Error('Failed to delete subject.');

            setSubjects((prevSubjects) => prevSubjects.filter((subjectItem) => subjectItem._id !== subjectId));
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleUpdateSubject = (subjectId) => {
        const subjectToUpdate = subjects.find((subjectItem) => subjectItem._id === subjectId);
        setUpdateSubjectId(subjectId);
        setUpdateSubjectName(subjectToUpdate?.name || '');
        setIsModalOpen(true);
    };

    const handleSaveUpdateSubject = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/update/${updateSubjectId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    userId: user.id,
                },
                body: JSON.stringify({
                    name: updateSubjectName,
                }),
            });

            if (!response.ok) throw new Error('Failed to update subject.');

            const updatedSubject = await response.json();
            setSubjects((prevSubjects) =>
                prevSubjects.map((subjectItem) => (subjectItem._id === updateSubjectId ? updatedSubject : subjectItem))
            );
            setIsModalOpen(false);
            setUpdateSubjectId(null);
            setUpdateSubjectName('');
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleCancelUpdate = () => {
        setIsModalOpen(false);
        setUpdateSubjectId(null);
        setUpdateSubjectName('');
    };

    const getClassNameById = (classId) => {
        const classItem = classes.find((classItem) => classItem._id === classId);
        return classItem ? classItem.name : 'Unknown';
    };

    const getSectionNameById = (sectionId) => {
        const sectionItem = sections.find((sectionItem) => sectionItem._id === sectionId);
        return sectionItem ? sectionItem.name : 'Unknown';
    };

    return (
        <div className="subject-management-page">
            <SideNav />
            <div className="main-content">
                <div className="subject-management-container">
                    <h2>Subject Management</h2>

                    <div className="create-subject-form">
                        <select
                            value={selectedClassId}
                            onChange={(e) => setSelectedClassId(e.target.value)}
                        >
                            <option value="">Select Class</option>
                            {classes.map((classItem) => (
                                <option key={classItem._id} value={classItem._id}>
                                    {classItem.name}
                                </option>
                            ))}
                        </select>
                        <select
                            value={selectedSectionId}
                            onChange={(e) => setSelectedSectionId(e.target.value)}
                        >
                            <option value="">Select Section</option>
                            {sections.map((sectionItem) => (
                                <option key={sectionItem._id} value={sectionItem._id}>
                                    {sectionItem.name}
                                </option>
                            ))}
                        </select>
                        <input
                            type="text"
                            placeholder="Subject Name"
                            value={newSubjectName}
                            onChange={(e) => setNewSubjectName(e.target.value)}
                        />
                        <button onClick={handleCreateSubject} disabled={!newSubjectName.trim() || !selectedClassId || !selectedSectionId}>
                            Create Subject
                        </button>
                    </div>

                    {isLoading ? (
                        <p>Loading subjects...</p>
                    ) : (
                        <table className="subject-table">
                            <thead>
                                <tr>
                                    <th>S No</th>
                                    <th>Class Name</th>
                                    <th>Section Name</th>
                                    <th>Subject Name</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subjects.length > 0 ? (
                                    subjects.map((subjectItem, i) => (
                                        <tr key={subjectItem._id}>
                                            <td>{i + 1}</td>
                                            <td>{getClassNameById(subjectItem.class_id)}</td>
                                            <td>{getSectionNameById(subjectItem.section_id)}</td>
                                            <td>{subjectItem.name}</td>
                                            <td>
                                                <button onClick={() => handleDeleteSubject(subjectItem._id)}>Delete</button>
                                                <button onClick={() => handleUpdateSubject(subjectItem._id)}>Update</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5">No subjects available</td>
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
                        <h3>Update Subject Name</h3>
                        <input
                            type="text"
                            placeholder="New Subject Name"
                            value={updateSubjectName}
                            onChange={(e) => setUpdateSubjectName(e.target.value)}
                        />
                        <button onClick={handleSaveUpdateSubject} disabled={!updateSubjectName.trim()}>
                            Save
                        </button>
                        <button onClick={handleCancelUpdate}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubjectManagement;
