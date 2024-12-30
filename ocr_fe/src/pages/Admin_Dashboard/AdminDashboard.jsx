import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import "./style.css";
import "./style.scss";
import { Link } from 'react-router-dom';
import LogoSvg from "../../assets/images/logo.svg";
import DashboardPng from "../../assets/images/dashboard.png";
import DownloadPng from "../../assets/images/download.png";
import CareersPng from "../../assets/images/careers.png";
import LogoutPng from "../../assets/images/logout.png";
import UploadPng from "../../assets/images/upload.png";
import ArrowDownSvg from "../../assets/images/arrow-down.svg";

export const AdminDashboard = () => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext); 
    const [classSelected, setClassSelected] = useState('');
    const [subjectSelected, setSubjectSelected] = useState('');
    const [uploadType, setUploadType] = useState('pdf'); 
    const [coursePdf, setCoursePdf] = useState(null);
    const [questionImage, setQuestionImage] = useState(null);
    const [message, setMessage] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [examid, setExamid] = useState('');
    const [isUploading, setIsUploading] = useState(false); 
    console.log("User:", user);

    useEffect(() => {
        const fetchUploadedFiles = async () => {
            
            const response = await fetch('http://localhost:8000/api/qa/admin/upload/pdf/list/', {
                method: 'GET',
            
            });

            if (response.ok) {
                const data = await response.json();
                setUploadedFiles(data.documents || []);
            }
        };
        const fetchClassApi = async () => {
            const response = await fetch(`http://localhost:8000/api/services/classes/${user.organization_id}`, {
                method: 'GET',
            });

            if (response.ok) {
                const data = await response.json();
                setClasses(data);
            }
        };

        fetchUploadedFiles();
        fetchClassApi();
    }, []);

    const fetchSubjectApi = async (classId) => {
        const response = await fetch(`http://localhost:8000/api/services/subjects/${classId}/`, {
            method: 'GET',
        });

        if (response.ok) {
            const data = await response.json();
            setSubjects(data || []);
        }
    };

    useEffect(() => {
        if (classSelected) {
            fetchSubjectApi(classSelected);
            setSubjectSelected(''); 
        } else {
            setSubjects([]); 
            setSubjectSelected('');
        }
    }, [classSelected]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('is_admin');
        navigate('/');
    };
    const handleNavigateResult=()=>{
        navigate('/result')
    }

    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!classSelected || !subjectSelected) {
            setMessage("Please select both Class and Subject.");
            return;
        }

        setIsUploading(true); 

        const formData = new FormData();
        formData.append('class_selected', classSelected);
        formData.append('subject_selected', subjectSelected);
        formData.append('exam_id', examid);
        formData.append('upload_type', uploadType);
        
        if (uploadType === 'pdf' && coursePdf) {
            formData.append('course_pdf', coursePdf);
        }
        if (uploadType === 'pdf' && questionImage) {
            formData.append('question_image', questionImage);
        }

        try {
            const token = localStorage.getItem('token');
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
                setIsUploading(false); 
                return;
            }
            const responseData = await response.json();
            setMessage(responseData.message);
            fetchUploadedFiles();
        } catch (error) {
            setMessage("Your Document has been uploaded Successfully");
        } finally {
            setIsUploading(false); 
        }
    };

    const handleNavigateAddUser = () => {
        navigate('/user/register');
    };

    const handleNavigateAddSubadmin = () => {
        navigate('/add-subadmin');
    };

    const handleDelete = async (pdfName) => {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8000/api/qa/admin/upload/pdf/delete/${pdfName}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (response.ok) {
            setUploadedFiles(uploadedFiles.filter(file => file.pdf_name !== pdfName));
        } else {
            const errorData = await response.json();
            setMessage(errorData.message || "An error occurred during the deletion.");
        }
    };

    return (
        <>
            <div>
                <header>
                    <div className="d-flex justify-content-between">
                        <h2 className="heading"> {user.organization} Admin Dashboard</h2>
                    </div>
                </header>
                {isUploading && (
                    <div className="upload-popup">
                        <div className="popup-content">
                            <div className="spinner"></div>
                            <p>Processing, please wait...</p>
                        </div>
                    </div>
                )}

                <div className="sidenav">
                    <div className="logo">
                        <img src={LogoSvg} alt="Logo" />
                    </div>
                   
                    <ul>
                        <li ><span>Hi {user.first_name}</span></li>
                        <li className="active"><Link to="/dashboard"><span><img src={DashboardPng} alt="Dashboard" /></span>Dashboard</Link></li>
                        <li><Link to="/result"><span><img src={DownloadPng} alt="Download" /></span>Result Download</Link></li>
                        {user.is_admin && (
                        <>
                            <li><Link to="/user/register/"><span><img src={CareersPng} alt="Add User" /></span>Add User</Link></li>
                            <li><Link to="/sub-user/register"><span><img src={CareersPng} alt="Add Subadmin" /></span>Add Subadmin</Link></li>
                            <li><Link to="/user-management"><span><img src={CareersPng} alt="User Management" /></span>User Management</Link></li>
                        </>
                    )}
                    {user.is_sub_admin && !user.is_admin && (
                        <li><Link to="/user/register/"><span><img src={CareersPng} alt="Add User" /></span>Add User</Link></li>                    )}
                        <li><Link to="/" onClick={handleLogout}><span><img src={LogoutPng} alt="Logout" /></span>Logout</Link></li>
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
                                                <select className="form-control" value={classSelected} onChange={(e) => setClassSelected(e.target.value)}>
                                                    <option value="">Select</option>
                                                    {classes.map((classItem) => (
                                                        <option value={classItem._id} key={classItem._id}>
                                                            {classItem.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group d-flex">
                                            <label className="col-sm-3 col-form-label label">Subject</label>
                                            <div className="col-sm-9">
                                                <select 
                                                    className="form-control" 
                                                    value={subjectSelected} 
                                                    onChange={(e) => setSubjectSelected(e.target.value)} 
                                                    disabled={!classSelected} 
                                                >
                                                    <option value="">Select</option>
                                                    {subjects.map((subjectItem) => (
                                                        <option value={subjectItem._id} key={subjectItem._id}>
                                                            {subjectItem.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group d-flex">
                                            <label className="col-sm-3 col-form-label label">Exam Id </label>
                                            <div className="col-sm-9">
                                                <input type="text" className="form-control" placeholder="Enter Exam Id" onChange={(e) => setExamid(e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row-md-6 d-flex ps-5 align-items-center upfile">
                                        <form className="formUpload" onSubmit={handleFileUpload}>
                                            <div className="form-group d-flex">
                                            <label className="col-sm-7 col-form-label label">Upload</label>
                                                <div className="col-sm-9">
                                                    <select 
                                                        id="uploadType" 
                                                        className="form-control" 
                                                        value={uploadType} 
                                                        onChange={(e) => setUploadType(e.target.value)}
                                                    >
                                                        <option value="pdf">Course PDF</option>
                                                        <option value="image">Question Paper</option>
                                                    </select>
                                                </div>
                                            </div>

                                            {uploadType === 'pdf' && (
                                                <div className="upload-files-container">
                                                    <span className="upload-icon"><img src={UploadPng} alt="Upload" /></span>
                                                    <h3 className="dynamic-message">Upload COURSE PDF</h3>
                                                    <input 
                                                        type="file" 
                                                        onChange={(e) => setCoursePdf(e.target.files[0])} 
                                                        accept=".pdf" 
                                                        className="default-file-input" 
                                                    />
                                                </div>
                                            )}

                                            {uploadType === 'image' && (
                                                <div className="upload-files-container">
                                                    <span className="upload-icon"><img src={UploadPng} alt="Upload" /></span>
                                                    <h3 className="dynamic-message">Upload Question Paper</h3>
                                                    <input 
                                                        type="file" 
                                                        onChange={(e) => setQuestionImage(e.target.files[0])} 
                                                        accept="image/*,.pdf" 
                                                        className="default-file-input" 
                                                    />
                                                </div>
                                            )}

                                            <div className='buttonBox'>
                                                <button type="submit" className="btn-fill">Upload</button>
                                            </div>
                                        </form>
                                        <span>{message}</span>
                                    </div>
                                </div>
                            </div>
                            <h2 className="heading mt20">List of Uploaded Documents</h2>
                            <div className="common-box">
                                <div className="table-responsive">

                                    <table className="table custom-table">
                                        <thead>
                                            <tr>
                                                <th>Class <span><img src={ArrowDownSvg} alt="Arrow" /></span></th>
                                                <th>Subject <span><img src={ArrowDownSvg} alt="Arrow" /></span></th>
                                                <th>PDF Name <span><img src={ArrowDownSvg} alt="Arrow" /></span></th>
                                                <th>Question Name <span><img src={ArrowDownSvg} alt="Arrow" /></span></th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {uploadedFiles.length > 0 ? (
                                                uploadedFiles.map((file, index) => (
                                                    <tr key={index}>
                                                        <td>{file.class}</td>
                                                        <td>{file.subject}</td>
                                                        <td>{file.pdf_name}</td>
                                                        <td>{file.question_name}</td>
                                                        <td>
                                                            <button
                                                            onClick={() => handleDelete(file.pdf_name)}
                                                            className="btn btn-danger"
                                                            >Delete</button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr><td colSpan="5">No documents uploaded yet.</td></tr>
                                            )}
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
};
