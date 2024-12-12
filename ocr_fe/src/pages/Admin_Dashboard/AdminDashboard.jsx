import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./style.css" 
import "./style.scss"

import SearchSvg from "../../assets/images/search.svg"
import NotificationsSvg from "../../assets/images/notifications.svg"
import MoonSolidSvg from "../../assets/images/moon-solid.svg"
import InfoOutlineSvg from "../../assets/images/info_outline.svg"
import AvatarPng from "../../assets/images/avatar.png"
import LogoSvg from "../../assets/images/logo.svg"
import DashboardPng from "../../assets/images/dashboard.png"
import DownloadPng from "../../assets/images/download.png"
import NewsFeedPng from "../../assets/images/news-feed.png"
import UpcomingEventsPng from "../../assets/images/upcoming-events.png"
import CareersPng from "../../assets/images/careers.png"
import LogoutPng from "../../assets/images/logout.png"
import UploadPng from "../../assets/images/upload.png"
import ArrowDownSvg from "../../assets/images/arrow-down.svg"

export const AdminDashboard = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('is_admin');
        navigate('/');
    };

    return (
        <>
        <div>
            <header>
                <div className="d-flex justify-content-between">
                    <h2 className="heading">Question & Answer Admin Dashboard</h2>
                    <div className="search-profile-blk">
                        <div className="position-relative search-blk">
                            <input type="text" className="form-control" placeholder="Search..." autoComplete="off"
                                id="search-options" value=""/>
                        </div>
                        <ul className="nav">
                            <li className="nav-item">
                                <a className="nav-link" href="#"><img src={NotificationsSvg} /></a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#"><img src={MoonSolidSvg} /></a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="#"><img src={InfoOutlineSvg} /></a>
                            </li>
                            <li className="nav-item">
                                <div className="dropdown">
                                    <div className="dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                        <img src={AvatarPng} />
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </header>
            <div className="sidenav">
                <div className="logo">
                    <img src={LogoSvg} alt="Logo" />
                </div>
                <ul>
                    <li className="active"><a href="javascript:void(0)"><span><img src={DashboardPng} alt="Dashboard" /></span>Dashboard</a></li>
                    <li><a href="javascript:void(0)"><span><img src={DownloadPng} alt="Download" /></span> Result Download</a></li>
                    <li><a href="javascript:void(0)" onClick={handleLogout}><span><img src={LogoutPng} alt="Logout" /></span>Logout</a></li>
                </ul>
            </div>
            <div className="main-content">
                <div className="page-content">
                    <div className="container-fluid">
                        <div className="common-box">
                            <div className="row align-items-start">
                                <div className="col-md-6 pe-5">
                                    <div className="form-group d-flex mb-3">
                                        <label className="col-sm-3 col-form-label label">Class</label>
                                        <div className="col-sm-9">
                                            <div className="downcaret-icon">
                                            <select className="form-control">
                                                <option>Class 1</option>
                                                <option>Class 2</option>
                                                <option>Class 3</option>
                                                <option>Class 4</option>
                                                <option>Class 5</option>
                                                <option>Class 6</option>
                                                <option>Class 7</option>
                                                <option>Class 8</option>
                                                <option>Class 9</option>
                                                <option>Class 10</option>
                                            </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-group d-flex">
                                        <label for="title" className="col-sm-3 col-form-label label">Subject</label>
                                        <div className="col-sm-9">
                                            <div className="downcaret-icon">
                                                <select className="form-control">
                                                    <option>History</option>
                                                    <option>Geography</option>
                                                    <option>Science</option>
                                                    <option>English</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6 d-flex ps-5 align-items-center upfile">
    
                                    <form className="" enctype='multipart/form-data'>
                                        <div className="upload-files-container">
                                            <div className="">
                                                <span className="upload-icon"> <img src={UploadPng} /> </span>
                                                <h3 className="dynamic-message"> Upload COURSE PDF </h3>
                                                <div className="">
                                                    <span className="browse-files">
                                                        <input type="file" className="default-file-input" />
                                                        <span className="browse-files-text">PDF ONLY</span>
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="cannot-upload-message"> Please select a file first </span>
    
                                        </div>
                                        <div className="upload-files-container">
                                            <div className="">
                                                <span className="upload-icon"> <img src={UploadPng} /> </span>
                                                <h3 className="dynamic-message"> Upload Question Paper Image</h3>
                                                <div className="">
                                                    <span className="browse-files">
                                                        <input type="file" className="default-file-input" />
                                                        <span className="browse-files-text">PNG, JPG  files
                                                            areallowed</span>
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="cannot-upload-message"> Please select a file first </span>
    
                                        </div>
                                    </form>
                                    <div className="content-blk">
                                        <h3 className="subheading">Upload Document</h3>
                                        <p className="content">Upload all your required Documents here</p>
                                        <button className="btn-fill">Upload </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <h2 className="heading mt20">Document Requests</h2>
                        <div className="common-box">
                            <div className="table-responsive">
                                <table className="table custom-table">
                                    <thead>
                                        <tr>
                                            <th scope="col">User <span><img src={ArrowDownSvg} /></span></th>
                                            <th scope="col">Class <span><img src={ArrowDownSvg} /></span></th>
                                            <th scope="col">Subject <span><img src={ArrowDownSvg} /></span></th>
                                            <th scope="col">Uploaded Date <span><img src={ArrowDownSvg} /></span></th>
                                            <th scope="col">Status <span><img src={ArrowDownSvg} /></span></th> 
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Abhinav Kar </td>
                                            <td>Class 2</td>
                                            <td>Science</td>
                                            <td>Aug. 12. 2024, 11:16 a.m.</td>
                                            <td>
                                                <div className="downcaret-icon">
                                                    <select className="form-control">
                                                        <option>Open</option>
                                                        <option>Close</option>
                                                    </select>
                                                </div>
                                            </td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    
        <div className="modal fade custom-modal" id="sendSurveyModal" tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                    <div className="modal-body">
                        <h2 className="heading text-center">Do you want to send survey to the alumni?</h2>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-fill" data-bs-dismiss="modal">Yes</button>
                        <button type="button" className="btn btn-outline" data-bs-dismiss="modal">No</button>
                    </div>
                </div>
            </div>
        </div>
        </>
    
  )
}
