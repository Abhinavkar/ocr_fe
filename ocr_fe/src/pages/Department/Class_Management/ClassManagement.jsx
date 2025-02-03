import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../../UserContext';
import { Form, Input, Button, Table, Modal, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import SideNav from '../../../components/SideNav';
import './ClassManagement.css';

const API_BASE_URL = 'http://localhost:8000/api/services/classes';

const ClassManagement = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]);
    const [newClassName, setNewClassName] = useState('');
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
    const [selectedClassId, setSelectedClassId] = useState(null);
    const [updateClassName, setUpdateClassName] = useState('');

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/${user.organization_id}`, {
                    method: 'GET',
                    headers: {
                        userId: user.id,
                    },
                });

                if (!response.ok) throw new Error('Failed to fetch classes.');

                const data = await response.json();
                setClasses(data);
            } catch (error) {
                console.error(error.message);
            }
        };

        fetchClasses();
    }, [user.organization_id, user.id]);

    const handleAddClass = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    userId: user.id,
                },
                body: JSON.stringify({ name: newClassName, organization_id: user.organization_id }),
            });

            if (!response.ok) throw new Error('Failed to create class.');

            const newClass = await response.json();
            setClasses((prevClasses) => [...prevClasses, newClass]);
            setNewClassName('');
            message.success('Class added successfully');
            navigate("/department")
        } catch (error) {
            console.error(error.message);
            message.error('Failed to add class');
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
            message.success('Class deleted successfully');
            navigate("/dashboard")
        } catch (error) {
            console.error(error.message);
            message.error('Failed to delete class');
        }
    };

    const showDeleteModal = (classId) => {
        setSelectedClassId(classId);
        setIsDeleteModalVisible(true);
    };

    const handleDeleteOk = () => {
        handleDeleteClass(selectedClassId);
        setIsDeleteModalVisible(false);
    };

    const handleDeleteCancel = () => {
        setIsDeleteModalVisible(false);
    };

    const showUpdateModal = (classId, className) => {
        setSelectedClassId(classId);
        setUpdateClassName(className);
        setIsUpdateModalVisible(true);
    };

    const handleUpdateOk = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/update/${selectedClassId}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    userId: user.id,
                },
                body: JSON.stringify({ name: updateClassName }),
            });

            if (!response.ok) throw new Error('Failed to update class.');

            const updatedClass = await response.json();
            setClasses((prevClasses) =>
                prevClasses.map((classItem) =>
                    classItem.id === selectedClassId ? updatedClass : classItem
                )
            );
            setIsUpdateModalVisible(false);
            message.success('Class updated successfully');
            navigate("/dashboard")
        } catch (error) {
            console.error(error.message);
            message.error('Failed to update class');
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
            dataIndex: 'name',
            key: 'name',
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

    return (
        <div className="class-management-page">
            <SideNav />
            <div className="class-management-content">
                <h2>Class Management</h2>
                <Form layout="inline" onFinish={handleAddClass}>
                    <Form.Item>
                        <Input
                            placeholder="New Class Name"
                            value={newClassName}
                            onChange={(e) => setNewClassName(e.target.value)}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Add Class
                        </Button>
                    </Form.Item>
                </Form>
                <div className="table-container">
                    <Table columns={columns} dataSource={classes} rowKey="id" />
                </div>
                <Modal
                    title="Delete Class"
                    visible={isDeleteModalVisible}
                    onOk={handleDeleteOk}
                    onCancel={handleDeleteCancel}
                    okText="Delete"
                    okButtonProps={{ type: 'danger' }}
                >
                    <p>Are you sure you want to delete this class?</p>
                </Modal>
                <Modal
                    title="Update Class Name"
                    visible={isUpdateModalVisible}
                    onOk={handleUpdateOk}
                    onCancel={handleUpdateCancel}
                    okText="Save"
                >
                    <Input
                        placeholder="New Class Name"
                        value={updateClassName}
                        onChange={(e) => setUpdateClassName(e.target.value)}
                    />
                </Modal>
            </div>
        </div>
    );
};

export default ClassManagement;