import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import "./style.css";
import "./style.scss";
import UploadPng from "../../assets/images/upload.png";
import CareersPng from "../../assets/images/careers.png"
import ArrowDownSvg from "../../assets/images/arrow-down.svg";
import SideNav from '../../components/SideNav';

export const AdminDashboard = () => {
    const navigate = useNavigate();
    const { user } = useContext(UserContext); 
    const [classSelected, setClassSelected] = useState('');
    const [sectionSelected, setSectionSelected] = useState('');
    const [subjectSelected, setSubjectSelected] = useState('');
    const [uploadType, setUploadType] = useState('pdf'); 
    const [coursePdf, setCoursePdf] = useState(null);
    const [questionImage, setQuestionImage] = useState(null);
    const [message, setMessage] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [examIds, setExamIds] = useState([]);
    const [isUploading, setIsUploading] = useState(false); 
    const [examData , SetExamData] = useState([])
    
    useEffect(() => {
        const fetchUploadedFiles = async () => {
         
            const response = await fetch('http://localhost:8000/api/qa/documents/', {
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
    }, [user.organization_id]);

    const fetchSectionApi = async (classId) => {
        const response = await fetch(`http://localhost:8000/api/services/sections/${classId}/`, {
        method: 'GET',
        });

        if (response.ok) {
        const data = await response.json();
        console.log(data)
        setSections(data || []);
        if (data.length > 0) {
            fetchSubjectApi(data[0].id); 
        }
        }
    };
    const fetchSubjectApi = async (sectionId) => {
        console.log(sectionId)
        const response = await fetch(`http://localhost:8000/api/services/subjects/${sectionId}/`, {
            method: 'GET',
        });

        if (response.ok) {
            const data = await response.json();
            setSubjects(data || []);
        }
    };

    const fetchExamId = async (classId, sectionId, subjectId) => {
        try {
            const response = await fetch('http://localhost:8000/api/services/get/exam-id/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'classId': classId,
                    'sectionId': sectionId, 
                    'subjectId': subjectId,
                    'organizationId': user.organization_id,
                },
            });

            if (response.ok) {
                const data = await response.json();
                SetExamData(data.exam_ids)
            } else {
                console.error('Failed to fetch exam ID');
            }
        } catch (error) {
            console.error('Error fetching exam ID:', error);
        }
    };

    const handleClassChange = (e) => {
        const classId = e.target.value;
        setClassSelected(classId);
        fetchSectionApi(classId);
    };

    const handleSectionChange = (e) => {
        const sectionId = e.target.value;
        setSectionSelected(sectionId);
        fetchSubjectApi(sectionId);
    };

    const handleSubjectChange = (e) => {
        const subjectId = e.target.value;
        setSubjectSelected(subjectId);
        if (classSelected && sectionSelected && subjectId) {
            fetchExamId(classSelected, sectionSelected, subjectId);
        }
    };

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
        formData.append("section_selected",sectionSelected)
        formData.append('exam_id', examIds); 
        formData.append('upload_type', uploadType);
        formData.append('organization',user.organization_id);
        
        if (uploadType === 'pdf' && coursePdf) {
            formData.append('course_pdf', coursePdf);
            try {

                const response = await fetch('http://localhost:8000/api/qa/upload/course/pdf/', {
                    method: 'POST',
                    headers: {
                        userId: user.id,
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
        }
        if (uploadType === 'image' && questionImage) {
            formData.append('question_paper_pdf', questionImage);
            try {

                const response = await fetch('http://localhost:8000/api/qa/upload/question/pdf/', {
                    method: 'POST',
                    headers: {
                        userId: user.id,
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
                <SideNav/>
              
                <div className="main-content">
                    <div className="page-content">
                        <div className="container-fluid">
                            <div className="common-box">
                                <div className="row align-items-start">
                                    <div className="">
                                        <div className="form-group d-flex mb-3">
                                            <label className="col-sm-3 col-form-label label">Class</label>
                                            <div className="col-sm-9">
                                                <select className="form-control" value={classSelected} onChange={handleClassChange}>
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
                                        <label className="col-sm-3 col-form-label label">Sections</label>
                                            <div className="col-sm-9">
                                                <select className="form-control" value={sectionSelected} onChange={handleSectionChange}>
                                                    <option value="">Select Section</option>
                                                    {sections.map((section) => (
                                                        <option key={section._id} value={section._id}>{section.name}</option>
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
                                                    onChange={handleSubjectChange} 
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
                                        {uploadType === 'image' && (
                                            <div className="form-group d-flex mb-3">
                                                <label className="col-sm-3 col-form-label label">Exam Id</label>
                                                <div className="col-sm-9">
                                                    <select className="form-control" value={examIds} onChange={(e) => setExamIds(e.target.value)}>
                                                        <option value="">select</option>
                                                        {console.log(examData)}
                                                        {examData.map((exam_id,id)=>{
                                                            return(
                                                                <option value={exam_id} key={id}>
                                                                {exam_id}
                                                            </option> 
                                                            )
                                                        })}
                                                        
                                                    </select>
                                                </div>
                                            </div>
                                        )}
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
 
export default AdminDashboard;