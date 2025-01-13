import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../../../UserContext';
import { Table, Button, Modal, Form, Input, message } from 'antd';

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
            const response = await fetch(`${API_BASE_URL}/update/${selectedUser._id}/`, {
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
                prevUsers.map((user) => (user._id === selectedUser._id ? updatedUser : user))
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
            const response = await fetch(`${API_BASE_URL}/users/${userId}/`, {
                method: 'DELETE',
                headers: {
                    userId: user.id,
                },
            });

            if (!response.ok) throw new Error('Failed to delete user.');

            setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
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
            title: 'Is Admin',
            dataIndex: 'is_admin',
            key: 'is_admin',
            render: (text) => (text ? 'Yes' : 'No'),
        },
        // {
        //     title: 'Is Super Staff',
        //     dataIndex: 'is_super_staff',
        //     key: 'is_super_staff',
        //     render: (text) => (text ? 'Yes' : 'No'),
        // },
        {
            title: 'Is Sub Admin',
            dataIndex: 'is_sub_admin',
            key: 'is_sub_admin',
            render: (text) => (text ? 'Yes' : 'No'),
        },
        {
            title: 'Is User',
            dataIndex: 'is_user',
            key: 'is_user',
            render: (text) => (text ? 'Yes' : 'No'),
        },
        {
            title: 'Department',
            dataIndex: 'department',
            key: 'department',
        },
        {
            title: 'Class Assigned',
            dataIndex: 'department_name',
            key: 'department_name',
        },
        {
            title: 'Section Assigned',
            dataIndex: 'section_name',
            key: 'section_name',
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <>
                    <Button type="primary" onClick={() => showEditModal(record)}>
                        Edit
                    </Button>
                    <Button type="danger" onClick={() => handleDeleteUser(record._id)} style={{ marginLeft: 8 }}>
                        Delete
                    </Button>
                </>
            ),
        },
    ];

    return (
        <div className="user-management-page">
            <div className="user-management-content">
               <div className='UserManagementHeader'>
               <h2>{user.organization } User DataBase</h2>
               </div>
                <Table columns={columns} dataSource={users} rowKey="_id" style={{ marginTop: 20 }} />
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
                        <Form.Item name="is_admin" label="Is Admin">
                            <Input type="checkbox" />
                        </Form.Item>
                        <Form.Item name="is_super_staff"  label="Is Super Staff">
                            <Input type="checkbox" disabled/>
                        </Form.Item>
                        <Form.Item name="is_sub_admin" label="Is Sub Admin">
                            <Input type="checkbox" />
                        </Form.Item>
                        <Form.Item name="is_user" label="Is User">
                            <Input type="checkbox" />
                        </Form.Item>
                        <Form.Item name="department" label="Department">
                            <Input />
                        </Form.Item>
                        <Form.Item name="section_assigned" label="Section Assigned">
                            <Input />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </div>
    );
};

export default UserManagement;