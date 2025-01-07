import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Table, Modal, message, Select } from 'antd';
import './SectionManagement.css';
import { UserContext } from '../../UserContext';
import SideNav from '../../components/SideNav';

const { Option } = Select;
const API_BASE_URL = 'http://localhost:8000/api/services/org/sections';
const API_BASE_URL_SEC= 'http://localhost:8000/api/services/sections'
const CLASS_API_BASE_URL = 'http://localhost:8000/api/services/classes';

const SectionManagement = () => {
    const navigate = useNavigate();
    const [sections, setSections] = useState([]);
    const [classes, setClasses] = useState([]);
    const [newSectionName, setNewSectionName] = useState('');
    const [selectedClassId, setSelectedClassId] = useState('');
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
    const [selectedSectionId, setSelectedSectionId] = useState(null);
    const [updateSectionName, setUpdateSectionName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useContext(UserContext);

    useEffect(() => {
        const fetchSections = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${API_BASE_URL}/${user.organization_id}/`, {
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

        fetchSections();
        fetchClasses();
    }, [user.organization_id]);

    const handleAddSection = async () => {
        try {
            const response = await fetch(`${API_BASE_URL_SEC}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    userId: user.id,
                },
                body: JSON.stringify({
                    name: newSectionName,
                    class_id: selectedClassId,
                    organization_id: user.organization_id,
                }),
            });

            if (!response.ok) throw new Error('Failed to create section.');

            const newSection = await response.json();
            setSections((prevSections) => [...prevSections, newSection]);
            setNewSectionName('');
            setSelectedClassId('');
            message.success('Section added successfully');
            navigate("/dashboard")

        } catch (error) {
            console.error(error.message);
            message.error('Failed to add section');
        }
    };

    const handleDeleteSection = async (sectionId) => {
        try {
            const response = await fetch(`${API_BASE_URL_SEC}/delete/${sectionId}/`, {
                method: 'DELETE',
                headers: {
                    userId: user.id,
                },
            });

            if (!response.ok) throw new Error('Failed to delete section.');

            setSections((prevSections) => prevSections.filter((sectionItem) => sectionItem._id !== sectionId));
            message.success('Section deleted successfully');
            navigate("/dashboard")

        } catch (error) {
            console.error(error.message);
            message.error('Failed to delete section');
        }
    };

    const showDeleteModal = (sectionId) => {
        setSelectedSectionId(sectionId);
        setIsDeleteModalVisible(true);
    };

    const handleDeleteOk = () => {
        handleDeleteSection(selectedSectionId);
        setIsDeleteModalVisible(false);
    };

    const handleDeleteCancel = () => {
        setIsDeleteModalVisible(false);
    };

    const showUpdateModal = (sectionId, sectionName) => {
        setSelectedSectionId(sectionId);
        setUpdateSectionName(sectionName);
        setIsUpdateModalVisible(true);
    };

    const handleUpdateOk = async () => {
        try {
            const response = await fetch(`${API_BASE_URL_SEC}/update/${selectedSectionId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    userId: user.id,
                },
                body: JSON.stringify({ name: updateSectionName }),
            });

            if (!response.ok) throw new Error('Failed to update section.');

            const updatedSection = await response.json();
            setSections((prevSections) =>
                prevSections.map((sectionItem) =>
                    sectionItem._id === selectedSectionId ? updatedSection : sectionItem
                )
            );
            setIsUpdateModalVisible(false);
            message.success('Section updated successfully');
            navigate("/dashboard")

        } catch (error) {
            console.error(error.message);
            message.error('Failed to update section');
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
            dataIndex: 'section_name',
            key: 'section_name',
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

    return (
        <div className="section-management-page">
            <SideNav />
            <div className="section-management-content">
                <h2>Section Management</h2>
                <Form layout="inline" onFinish={handleAddSection}>
                    <Form.Item>
                        <Select
                            placeholder="Select Class"
                            value={selectedClassId}
                            onChange={(value) => setSelectedClassId(value)}
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
                        <Input
                            placeholder="New Section Name"
                            value={newSectionName}
                            onChange={(e) => setNewSectionName(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Add Section
                        </Button>
                    </Form.Item>
                </Form>
                <div className="table-container">
                    <Table columns={columns} dataSource={sections} rowKey="_id" loading={isLoading} />
                </div>
                <Modal
                    title="Delete Section"
                    visible={isDeleteModalVisible}
                    onOk={handleDeleteOk}
                    onCancel={handleDeleteCancel}
                    okText="Delete"
                    okButtonProps={{ type: 'danger' }}
                >
                    <p>Are you sure you want to delete this section?</p>
                </Modal>
                <Modal
                    title="Update Section Name"
                    visible={isUpdateModalVisible}
                    onOk={handleUpdateOk}
                    onCancel={handleUpdateCancel}
                    okText="Save"
                >
                    <Input
                        placeholder="New Section Name"
                        value={updateSectionName}
                        onChange={(e) => setUpdateSectionName(e.target.value)}
                    />
                </Modal>
            </div>
        </div>
    );
};

export default SectionManagement;