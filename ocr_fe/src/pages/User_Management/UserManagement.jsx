import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../UserContext';
import { Table, Button, Modal, Form, Input, message } from 'antd';
import SideNav from '../../components/SideNav';
import './UserManagement.css';

const API_BASE_URL = 'http://localhost:8000/api/operation';

const UserManagement = () => {
    const { user } = useContext(UserContext);
    const [users, setUsers] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/users/`, {
                    method: 'GET',
                    headers: {
                        userId: user.id,
                    },
                });

                if (!response.ok) throw new Error('Failed to fetch users.');

                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error(error.message);
            }
        };

        fetchUsers();
    }, [user.id]);

    const showEditModal = (user) => {
        setSelectedUser(user);
        form.setFieldsValue(user);
        setIsModalVisible(true);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        form.resetFields();
    };

    const handleSaveUser = async () => {
        try {
            const values = form.getFieldsValue();
            const response = await fetch(`${API_BASE_URL}/update/${selectedUser.id}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    userId: user.id,
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) throw new Error('Failed to update user.');

            const updatedUser = await response.json();
            setUsers((prevUsers) =>
                prevUsers.map((user) => (user.id === selectedUser.id ? updatedUser : user))
            );
            setIsModalVisible(false);
            message.success('User updated successfully');
        } catch (error) {
            console.error(error.message);
            message.error('Failed to update user');
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/delete/${userId}/`, {
                method: 'DELETE',
                headers: {
                    userId: user.id,
                },
            });

            if (!response.ok) throw new Error('Failed to delete user.');

            setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
            message.success('User deleted successfully');
        } catch (error) {
            console.error(error.message);
            message.error('Failed to delete user');
        }
    };

    const columns = [
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'First Name',
            dataIndex: 'first_name',
            key: 'first_name',
        },
        {
            title: 'Last Name',
            dataIndex: 'last_name',
            key: 'last_name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <>
                    <Button type="primary" onClick={() => showEditModal(record)}>
                        Edit
                    </Button>
                    <Button type="danger" onClick={() => handleDeleteUser(record.id)} style={{ marginLeft: 8 }}>
                        Delete
                    </Button>
                </>
            ),
        },
    ];

    return (
        <div className="user-management-page">
            <SideNav />
            <div className="user-management-content">
                <h2>User Management</h2>
                <Table columns={columns} dataSource={users} rowKey="id" style={{ marginTop: 20 }} />
                <Modal
                    title="Edit User"
                    visible={isModalVisible}
                    onOk={handleSaveUser}
                    onCancel={handleCancel}
                    okText="Save"
                >
                    <Form form={form} layout="vertical">
                        <Form.Item name="username" label="Username">
                            <Input />
                        </Form.Item>
                        <Form.Item name="first_name" label="First Name">
                            <Input />
                        </Form.Item>
                        <Form.Item name="last_name" label="Last Name">
                            <Input />
                        </Form.Item>
                        <Form.Item name="email" label="Email">
                            <Input />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </div>
    );
};

export default UserManagement;