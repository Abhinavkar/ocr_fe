import React, { useState, useEffect, useContext } from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../UserContext';
import './UserRegister.css';

const { Option } = Select;

export const UserRegister = () => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext); // Access user data from context
    const [departments, setDepartments] = useState([]);
    const [sections, setSections] = useState([]);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchDepartments = async () => {
            const response = await fetch(`http://localhost:8000/api/services/classes/${user.organization_id}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setDepartments(data);
        };

        fetchDepartments();
    }, [user.organization_id]);

    const fetchSections = async (departmentId) => {
        if (departmentId) {
            const response = await fetch(`http://localhost:8000/api/services/sections/${departmentId}/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setSections(data);
        }
    };

    const handleDepartmentChange = (value) => {
        form.setFieldsValue({ section_assigned: undefined });
        fetchSections(value);
    };

    const handleRegister = async (values) => {
        const response = await fetch('http://localhost:8000/api/auth/org/register/user/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ...values,
                organization: user.organization_id
            }),
        });

        if (response.ok) {
            message.success('Registration successful');
            navigate('/');
        } else {
            message.error('Registration failed');
        }
    };

    return (
        <div className="user-register">
            <div className="form-container">
                <h2>User Registration</h2>
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={handleRegister}
                >
                    <Form.Item label="Organization">
                        <span>{user.organization}</span>
                    </Form.Item>
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: 'Please input the username!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input the password!' }]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        label="First Name"
                        name="first_name"
                        rules={[{ required: true, message: 'Please input the first name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Last Name"
                        name="last_name"
                        rules={[{ required: true, message: 'Please input the last name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: 'Please input the email!', type: 'email' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Department"
                        name="department"
                        rules={[{ required: true, message: 'Please select a department!' }]}
                    >
                        <Select
                            placeholder="Select Department"
                            onChange={handleDepartmentChange}
                        >
                            {departments.map(dept => (
                                <Option key={dept._id} value={dept._id}>{dept.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Section Assigned"
                        name="section_assigned"
                        rules={[{ required: true, message: 'Please select a section!' }]}
                    >
                        <Select placeholder="Select Section">
                            {sections.map(section => (
                                <Option key={section._id} value={section._id}>{section.name}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Register
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default UserRegister;
