import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import LogoSvg from "../assets/images/logo.svg";
import DashboardPng from "../assets/images/dashboard.png";
import DownloadPng from "../assets/images/download.png";
import LogoutPng from "../assets/images/logout.png";
import CareersPng from "../assets/images/careers.png";
import './SideNav.css';

const SideNav = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('is_admin');
        navigate('/');
    };

    {/*const userManagementMenu = (
        <Menu>
            <Menu.Item key="1">
                <Link to="/user/register/">Add User</Link>
            </Menu.Item>
            <Menu.Item key="2">
                <Link to="/sub-user/register">Add Subadmin</Link>
            </Menu.Item>
            <Menu.Item key="3">
                <Link to="/user/management">User Database</Link>
            </Menu.Item>
        </Menu>
    );

    const departmentManagementMenu = (
        <Menu>
            <Menu.Item key="4">
                <Link to="/class/management">Class Management</Link>
            </Menu.Item>
            <Menu.Item key="5">
                <Link to="/section/management">Section Management</Link>
            </Menu.Item>
            <Menu.Item key="6">
                <Link to="/subject">Subject Management</Link>
            </Menu.Item>
        </Menu>
    ); */}

    return (
        <div className="sidenav">
            <div className="logo">
                <img src={LogoSvg} alt="Logo" />
            </div>
            <ul>
                <li><span style={{color:"white",fontSize:"20px"}}>Hi {user.first_name}</span></li>
                <li className="active">
                    <Link to="/dashboard">
                        <span><img src={DashboardPng} alt="Dashboard" /></span>Dashboard
                    </Link>
                </li>
                <li>
                    <Link to="/answerupload">
                        <span><img src={DownloadPng} alt="Download" /></span>Answer Upload 
                    </Link>
                </li>
                {/* {(user.is_admin || user.is_sub_admin) && (
                    <>
                        <li>
                            <Dropdown overlay={userManagementMenu} trigger={['click']}>
                                <span className="dropdown-toggle"style={{color:"white"}}>
                                    <img src={CareersPng} alt="User Management" /> User Management  <DownOutlined />
                                </span>
                            </Dropdown>
                        </li>
                        <li>
                            <Dropdown overlay={departmentManagementMenu} trigger={['click']}>
                                <span className="dropdown-toggle" style={{color:"white"}}>
                                    <img src={CareersPng}  alt="Department Management" /> Department Management  <DownOutlined />
                                </span>
                            </Dropdown>
                        </li>
                    </>
                )}*/}
                <li>
                    <Link to="/" onClick={handleLogout}>
                        <span><img src={LogoutPng} alt="Logout" /></span>Logout
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default SideNav;