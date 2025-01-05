import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
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

    return (
        <div className="sidenav">
            <div className="logo">
                <img src={LogoSvg} alt="Logo" />
            </div>
            <ul>
                <li><span>Hi {user.first_name}</span></li>
                <li className="active"><Link to="/dashboard"><span><img src={DashboardPng} alt="Dashboard" /></span>Dashboard</Link></li>
                <li><Link to="/result"><span><img src={DownloadPng} alt="Download" /></span>Result Download</Link></li>
                {user.is_admin && (
                    <>
                        <li><Link to="/user/register/"><span><img src={CareersPng} alt="Add User" /></span>Add User</Link></li>
                        <li><Link to="/sub-user/register"><span><img src={CareersPng} alt="Add Subadmin" /></span>Add Subadmin</Link></li>
                        <li><Link to="/user-management"><span><img src={CareersPng} alt="User Management" /></span>User Management</Link></li>
                        <li><Link to="/class/management"><span><img src={CareersPng} alt="User Management" /></span>Class Management</Link></li>
                    </>
                )}
                {user.is_sub_admin && !user.is_admin && (
                    <li><Link to="/user/register/"><span><img src={CareersPng} alt="Add User" /></span>Add User</Link></li>
                )}
                <li><Link to="/" onClick={handleLogout}><span><img src={LogoutPng} alt="Logout" /></span>Logout</Link></li>
            </ul>
        </div>
    );
};

export default SideNav;