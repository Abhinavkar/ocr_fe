import React, { useState, useEffect, useContext } from 'react';
import './Result.css';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import { Table, Button } from 'antd';
import jsPDF from 'jspdf';
import SideNav from '../../components/SideNav';

export const Result = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [results, setResults] = useState([]);
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);

    useEffect(() => {
        const fetchResults = async () => {
            const response = await fetch('http://localhost:8000/api/qa/results/', {
                method: 'GET',
                headers: {
                    'userId': user.id,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setResults(data);
            }
        };

        const fetchClasses = async () => {
            const response = await fetch(`http://localhost:8000/api/services/classes/${user.organization_id}`, {
                method: 'GET',
                headers: {
                    'userId': user.id,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setClasses(data);
            }
        };

        const fetchSection = async () => {
            const response = await fetch(`http://localhost:8000/api/services/sections/`, {
                method: 'GET',
                headers: {
                    'userId': user.id,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setSections(data);
            }
        };

        fetchSection();
        fetchResults();
        fetchClasses();
    }, [user.organization_id, user.id]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('is_admin');
        navigate('/');
    };

    const getClassById = (id) => {
        const classItem = classes.find((classItem) => classItem._id === id);
        return classItem ? classItem.name : 'Unknown Class';
    };

    const getSectionById = (id) => {
        const secItem = sections.find((secItem) => secItem._id === id);
        return secItem ? secItem.name : 'Unknown Section';
    };

    const handleDownload = async (result) => {
        const doc = new jsPDF();

        // Add title
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 128); // Dark blue color
        doc.text('Student Result Card', 105, 20, { align: 'center' });

        // Add organization name
        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0); // Black color
        doc.text(`${user.organization}`, 105, 30, { align: 'center' });

        // Add a line separator
        doc.setLineWidth(0.5);
        doc.setDrawColor(0, 0, 0); // Black color
        doc.line(10, 35, 200, 35);

        // Add student details with labels and values in different colors
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0); // Black color
        doc.text('Document ID:', 10, 45);
        doc.text('Exam ID:', 10, 55);
        doc.text('Class:', 10, 65);
        doc.text('Section:', 10, 75);
        doc.text('Subject:', 10, 85);
        doc.text('Roll No:', 10, 95);
        doc.text('Score:', 10, 105);
        doc.text('Document Uploaded By:', 10, 115);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 128); // Dark blue color
        doc.text(`${result.document_id}`, 60, 45);
        doc.text(`${result.exam_id}`, 60, 55);
        doc.text(getClassById(result.class_id), 60, 65);
        doc.text(getSectionById(result.section_id), 60, 75);
        doc.text(`${result.subject}`, 60, 85);
        doc.text(`${result.roll_no}`, 60, 95);
        doc.text(`${result.similarity_score}`, 60, 105);
        doc.text('Abhinav Kar', 60, 115); // Replace with actual uploader if available

        // Add a footer
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(128, 128, 128); // Gray color
        doc.text('Generated by OCR System', 105, 285, { align: 'center' });

        doc.save(`result_${result._id}.pdf`);
    };

    const columns = [
        {
            title: 'S No',
            dataIndex: 'sno',
            key: 'sno',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Exam ID',
            dataIndex: 'exam_id',
            key: 'exam_id',
        },
        {
            title: 'Class',
            dataIndex: 'class_id',
            key: 'class_id',
            render: (text) => getClassById(text),
        },
        {
            title: 'Section',
            dataIndex: 'section_id',
            key: 'section_id',
            render: (text) => getSectionById(text),
        },
        {
            title: 'Subject',
            dataIndex: 'subject',
            key: 'subject',
        },
        {
            title: 'Roll No',
            dataIndex: 'roll_no',
            key: 'roll_no',
        },
        {
            title: 'Score',
            dataIndex: 'similarity_score',
            key: 'similarity_score',
        },
        {
            title: 'Document Uploaded By',
            dataIndex: 'uploaded_by',
            key: 'uploaded_by',
            render: () => 'Abhinav Kar', // Replace with actual uploader if available
        },
        {
            title: 'Get Report',
            key: 'action',
            render: (text, record) => (
                <Button onClick={() => handleDownload(record)}>Download</Button>
            ),
        },
        {
            title: 'Reevaluate',
            key: 'action',
            render: (text, record) => (
                <Button>Reevaluate</Button>
            ),
        },
        {
            title: 'Delete',
            key: 'action',
            render: (text, record) => (
                <Button>Delete</Button>
            ),

        }
    ];

    return (
        <div className="result-page">
            <SideNav />
            <div className="result-content">
                <div className="result-container">
                    <h2>{user.organization} Results</h2>
                    <Table columns={columns} dataSource={results} rowKey="document_id" />
                </div>
                <div>
                    Result Reevaluation Section
                </div>
            </div>
        </div>
    );
};

export default Result;
