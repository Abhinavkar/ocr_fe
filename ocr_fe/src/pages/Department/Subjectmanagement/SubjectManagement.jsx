import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Table, Modal, message, Select } from 'antd';
import './SubjectManagement.css';
import { UserContext } from '../../../UserContext';
import SideNav from '../../../components/SideNav';

const { Option } = Select;
const API_BASE_URL = 'http://localhost:8000/api/services/org/subjects';
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
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
    const [selectedSubjectId, setSelectedSubjectId] = useState(null);
    const [updateSubjectName, setUpdateSubjectName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${API_BASE_URL}/${user.organization_id}/`, {
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
                const response = await fetch(`${CLASS_API_BASE_URL}/${user.organization_id}/`, {
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
                const response = await fetch(`http://localhost:8000/api/services/org/sections/${user.organization_id}/`, {
                    method: 'GET',
                });

                if (!response.ok) throw new Error('Failed to fetch sections.');

                const data = await response.json();
                console.log('Sections:', data); 
                setSections(data);
            } catch (error) {
                console.error(error.message);
            }
        };

        fetchSubjects();
        fetchClasses();
        fetchSections();
    }, [user.organization_id]);
    const fetchSections = async (id) => {
        try {
            const response = await fetch(`${SECTION_API_BASE_URL}/${id}/`, {
                method: 'GET',
            });

            if (!response.ok) throw new Error('Failed to fetch sections.');

            const data = await response.json();
            console.log('Sections:', data); 
            setSections(data);
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleAddSubject = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/services/subjects/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    userId: user.id,
                },
                body: JSON.stringify({
                    name: newSubjectName,
                    class_id: selectedClassId,
                    associated_section_id: selectedSectionId,
                    organization_id: user.organization_id,
                }),
            });

            if (!response.ok) throw new Error('Failed to create subject.');

            const newSubject = await response.json();
            setSubjects((prevSubjects) => [...prevSubjects, newSubject]);
            setNewSubjectName('');
            setSelectedClassId('');
            setSelectedSectionId('');
            message.success('Subject added successfully');
            navigate('/department')
        } catch (error) {
            console.error(error.message);
            message.error('Failed to add subject');
        }
    };

    const handleDeleteSubject = async (subjectId) => {
        try {
            const response = await fetch(`http://localhost:8000/api/services/delete/subjects/${subjectId}/`, {
                method: 'DELETE',
                headers: {
                    userId: user.id,
                },
            });

            if (!response.ok) throw new Error('Failed to delete subject.');

            setSubjects((prevSubjects) => prevSubjects.filter((subjectItem) => subjectItem._id !== subjectId));
            message.success('Subject deleted successfully');
            navigate("/department")

        } catch (error) {
            console.error(error.message);
            message.error('Failed to delete subject');
        }
    };

    const showDeleteModal = (subjectId) => {
        setSelectedSubjectId(subjectId);
        setIsDeleteModalVisible(true);
    };

    const handleDeleteOk = () => {
        handleDeleteSubject(selectedSubjectId);
        setIsDeleteModalVisible(false);
    };

    const handleDeleteCancel = () => {
        setIsDeleteModalVisible(false);
    };

    const showUpdateModal = (subjectId, subjectName) => {
        setSelectedSubjectId(subjectId);
        setUpdateSubjectName(subjectName);
        setIsUpdateModalVisible(true);
    };

    const handleUpdateOk = async () => {
        console.log(selectedSubjectId, updateSubjectName);
        try {
            const response = await fetch(`http://localhost:8000/api/services/update/subjects/${selectedSubjectId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    userId: user.id,
                },
                body: JSON.stringify({ name: updateSubjectName }),
            });

            if (!response.ok) throw new Error('Failed to update subject.');

            const updatedSubject = await response.json();
            setSubjects((prevSubjects) =>
                prevSubjects.map((subjectItem) =>
                    subjectItem._id === selectedSubjectId ? updatedSubject : subjectItem
                )
            );
            setIsUpdateModalVisible(false);
            message.success('Subject updated successfully');
            navigate("/dashboard")

        } catch (error) {
            console.error(error.message);
            message.error('Failed to update subject');
        }
    };

    const handleUpdateCancel = () => {
        setIsUpdateModalVisible(false);
    };

    const columns = [
        {
            title: 'S No',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Class Name',
            dataIndex: 'class_id',
            key: 'class_id',
            render: (class_id) => getClassNameById(class_id),
        },
        {
            title: 'Section Name',
            dataIndex: 'associated_section_id',
            key: 'associated_section_id',
            render:(associated_section_id) => getSectionNameById(associated_section_id)
        },
        {
            title: 'Subject Name',
            dataIndex: 'subject_name',
            key: 'subject_name',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <>
                    <Button type="primary" onClick={() => showUpdateModal(record._id, record.name)}>
                        Edit
                    </Button>
                    <Button type="danger" onClick={() => showDeleteModal(record._id)} style={{ marginLeft: 8 }}>
                        Delete
                    </Button>
                </>
            ),
        },
    ];

    const getClassNameById = (classId) => {
        const classItem = classes.find((classItem) => classItem._id === classId);
        return classItem ? classItem.name : 'Unknown';
    };

    const getSectionNameById = (sectionId) => {
       
        const sectionItem = sections.find((sectionItem) => sectionItem._id === sectionId);
        
        return sectionItem ? sectionItem.section_name : 'Unknown';
    };

    return (
        <div className="subject-management-page">
            <SideNav />
            <div className="subject-management-content">
                <h2>Subject Management</h2>
                <Form layout="inline" onFinish={handleAddSubject}>
                    <Form.Item>
                        <Select
                            placeholder="Select Class"
                            value={selectedClassId}
                            onChange={(value) => {
                                setSelectedClassId(value)
                                fetchSections(value)
                            }}
                            style={{ width: 200 }}
                        >
                            {classes.map((classItem) => (
                                <Option key={classItem._id} value={classItem._id}>
                                    {classItem.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Select
                            placeholder="Select Section"
                            value={selectedSectionId}
                            onChange={(value) => setSelectedSectionId(value)}
                            style={{ width: 200 }}
                        >
                            {sections.map((sectionItem) => (
                                <Option key={sectionItem._id} value={sectionItem._id}>
                                    {sectionItem.name}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Input
                            placeholder="New Subject Name"
                            value={newSubjectName}
                            onChange={(e) => setNewSubjectName(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Add Subject
                        </Button>
                    </Form.Item>
                </Form>
                <div className="table-container">
                    <Table columns={columns} dataSource={subjects} rowKey="_id" loading={isLoading} />
                </div>
                <Modal
                    title="Delete Subject"
                    visible={isDeleteModalVisible}
                    onOk={handleDeleteOk}
                    onCancel={handleDeleteCancel}
                    okText="Delete"
                    okButtonProps={{ type: 'danger' }}
                >
                    <p>Are you sure you want to delete this subject?</p>
                </Modal>
                <Modal
                    title="Update Subject Name"
                    visible={isUpdateModalVisible}
                    onOk={handleUpdateOk}
                    onCancel={handleUpdateCancel}
                    okText="Save"
                >
                    <Input
                        placeholder="New Subject Name"
                        value={updateSubjectName}
                        onChange={(e) => {
                            setUpdateSubjectName(e.target.value)
                            console.log(e.target.value)
                        }}
                    />
                </Modal>
            </div>
        </div>
    );
};

export default SubjectManagement;