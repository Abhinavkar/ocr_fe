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
import MenuItem from 'antd/es/menu/MenuItem';

const SideNav = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('is_admin');
        navigate('/');
    };

    const managementMenu = (
        <Menu>
            {user.is_admin && (
                <>
                    <Menu.Item key="1">
                        <Link to="/user/register/">Add User</Link>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <Link to="/sub-user/register">Add Subadmin</Link>
                    </Menu.Item>
                    <Menu.Item key="3">
                        <Link to="/user-management">User Management</Link>
                    </Menu.Item>
                    <Menu.Item key="4">
                        <Link to="/class/management">Class Management</Link>
                    </Menu.Item>
                    <Menu.Item key="4">
                        <Link to="/section/management">Section Management</Link>
                    </Menu.Item>
                </>
            )}
            {!user.is_admin && user.is_sub_admin && (
                <Menu.Item key="5">
                    <Link to="/user/register/">Add User</Link>
                </Menu.Item>
            )}
        </Menu>
    );

    return (
        <div className="sidenav">
            <div className="logo">
                <img src={LogoSvg} alt="Logo" />
            </div>
            <ul>
                <li><span>Hi {user.first_name}</span></li>
                <li className="active">
                    <Link to="/dashboard">
                        <span><img src={DashboardPng} alt="Dashboard" /></span>Dashboard
                    </Link>
                </li>
          
                {(user.is_admin || user.is_sub_admin) && (
                    <li>
                        <Dropdown overlay={managementMenu} trigger={['click']}>
                            <span className="dropdown-toggle">
                            <p className='dropdown_text'>  <img src={CareersPng} alt="Management" />Management Services <DownOutlined /></p> 
                            </span>
                        </Dropdown>
                    </li>
                )}
                <li>
                
                </li>
                      <li>
                    <Link to="/result">
                        <span><img src={DownloadPng} alt="Download" /></span>Result Download
                    </Link>
                </li>
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