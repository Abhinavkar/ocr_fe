import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./style.css";
import "./style.scss";

import SearchSvg from "../../assets/images/search.svg";
import NotificationsSvg from "../../assets/images/notifications.svg";
import MoonSolidSvg from "../../assets/images/moon-solid.svg";
import InfoOutlineSvg from "../../assets/images/info_outline.svg";
import AvatarPng from "../../assets/images/avatar.png";
import LogoSvg from "../../assets/images/logo.svg";
import DashboardPng from "../../assets/images/dashboard.png";
import DownloadPng from "../../assets/images/download.png";
import NewsFeedPng from "../../assets/images/news-feed.png";
import UpcomingEventsPng from "../../assets/images/upcoming-events.png";
import CareersPng from "../../assets/images/careers.png";
import LogoutPng from "../../assets/images/logout.png";
import UploadPng from "../../assets/images/upload.png";
import ArrowDownSvg from "../../assets/images/arrow-down.svg";

export const AdminDashboard = () => {
    const navigate = useNavigate();
    const [classSelected, setClassSelected] = useState('');
    const [subjectSelected, setSubjectSelected] = useState('');
    const [coursePdf, setCoursePdf] = useState(null);
    const [questionImage, setQuestionImage] = useState(null);
    const [message, setMessage] = useState('');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('is_admin');
        navigate('/');
    };

    const handleFileUpload = async (e) => {
        console.log("Triggere")
        console.log(classSelected)
        e.preventDefault();
        if (!classSelected || !subjectSelected) {
            setMessage("Please select both Class and Subject.");
            console.log(message);
            
            return;
        }

        console.log("Trigger2")
        const formData = new FormData();
       
        formData.append('class_selected', classSelected);
        formData.append('subject_selected', subjectSelected);
        if (coursePdf) formData.append('course_pdf', coursePdf);
        if (questionImage) formData.append('question_image', questionImage);

        try {
            const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
            const response = await fetch('http://localhost:8000/api/qa/admin/upload/pdf/', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                setMessage(errorData.message || "An error occurred during the upload.");
                return;
            }

            const responseData = await response.json();
            setMessage(responseData.message);
        } catch (error) {
            setMessage("An error occurred during the upload.");
        }
    };

    return (
        <>
            <div>
                <header>
                    <div className="d-flex justify-content-between">
                        <h2 className="heading">Question & Answer Admin Dashboard</h2>
                    </div>
                </header>

                <div className="sidenav">
                    <div className="logo">
                        <img src={LogoSvg} alt="Logo" />
                    </div>
                    <ul>
                        <li className="active"><a href="javascript:void(0)"><span><img src={DashboardPng} alt="Dashboard" /></span>Dashboard</a></li>
                        <li><a href="javascript:void(0)"><span><img src={DownloadPng} alt="Download" /></span>Result Download</a></li>
                        <li><a href="javascript:void(0)" onClick={handleLogout}><span><img src={LogoutPng} alt="Logout" /></span>Logout</a></li>
                    </ul>
                </div>

                <div className="main-content">
                    <div className="page-content">
                        <div className="container-fluid">
                            <div className="common-box">
                                <div className="row align-items-start">
                                    <div className="">
                                        <div className="form-group d-flex mb-3">
                                            <label className="col-sm-3 col-form-label label">Class</label>
                                            <div className="col-sm-9">
                                                        <select className="form-control" defaultValue="Class 1" value={classSelected} onChange={(e) => {setClassSelected(e.target.value);console.log("hi",e.target.value);}}>
                                                            <option value="Select">Select</option>
                                                            <option value="Class 1">Class 1</option>
                                                            <option value="Class 2">Class 2</option>
                                                            <option value="Class 3">Class 3</option>
                                                            <option value="Class 4">Class 4</option>
                                                            <option value="Class 5">Class 5</option>
                                                            <option value="Class 6">Class 6</option>
                                                            <option value="Class 7">Class 7</option>
                                                            <option value="Class 8">Class 8</option>
                                                            <option value="Class 9">Class 9</option>
                                                            <option value="Class 10">Class 10</option>
                                                        </select>
                                            </div>
                                        </div>
                                        <div className="form-group d-flex">
                                            <label className="col-sm-3 col-form-label label">Subject</label>
                                            <div className="col-sm-9">
                                                <select className="form-control" value={subjectSelected} onChange={(e) => setSubjectSelected(e.target.value)}>
                                                    <option value="Select">Select</option>
                                                    <option value="History">History</option>
                                                    <option  value="Geography">Geography</option>
                                                    <option  value="Science">Science</option>
                                                    <option  value="English">English</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="row-md-6 d-flex ps-5 align-items-center upfile">
                                        <form className="formUpload"onSubmit={handleFileUpload}>
                                            <div className='boxes'>
                                            <div className="upload-files-container">
                                                <span className="upload-icon"><img src={UploadPng} alt="Upload" /></span>
                                                <h3 className="dynamic-message">Upload COURSE PDF</h3>
                                                <input type="file" onChange={(e) =>{
                                                    setCoursePdf(e.target.files[0])
                                                    console.log("FileUploaded",coursePdf)
                                                }
                                            } accept=".pdf" className="default-file-input" />
                                            </div>
                                            <div className="upload-files-container">
                                                <span className="upload-icon"><img src={UploadPng} alt="Upload" /></span>
                                                <h3 className="dynamic-message">Upload Question Paper Image</h3>
                                                <input type="file" onChange={(e) => setQuestionImage(e.target.files[0])} accept="image/*" className="default-file-input" />
                                            </div>
                                            </div>
                                            <div className='buttonBox'>
                                                 <button type="submit" className="btn-fill">Upload</button>
                                             </div>
                                          
                                        </form>
                                        <span>{message}</span>

                                    </div>
                                    
                                </div>
                            </div>

                            <h2 className="heading mt20">Document Requests</h2>
                            <div className="common-box">
                                <div className="table-responsive">
                                    <table className="table custom-table">
                                        <thead>
                                            <tr>
                                                <th>User <span><img src={ArrowDownSvg} alt="Arrow" /></span></th>
                                                <th>Class <span><img src={ArrowDownSvg} alt="Arrow" /></span></th>
                                                <th>Subject <span><img src={ArrowDownSvg} alt="Arrow" /></span></th>
                                                <th>Uploaded Date <span><img src={ArrowDownSvg} alt="Arrow" /></span></th>
                                                <th>Status <span><img src={ArrowDownSvg} alt="Arrow" /></span></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>Abhinav Kar</td>
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
        </>
    );
}
