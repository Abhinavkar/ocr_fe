import React, { useState, useEffect, useContext } from 'react';
import './Result.css';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../UserContext';
import { Table, Button, message } from 'antd';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import SideNav from '../../components/SideNav';

export const Result = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const [results, setResults] = useState([]);
    const [classes, setClasses] = useState([]);
    const [sections, setSections] = useState([]);

    useEffect(() => {
        if (!user || !user.organization_id || !user.id) return;

        const fetchResults = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/qa/results/', {
                    method: 'GET',
                    headers: {
                        'organizationId': user.organization_id,
                    },
                });
        
                if (!response.ok) throw new Error('Failed to fetch results');
        
                const data = await response.json();
                console.log('Results:', data);
                setResults(data?.results);  // Ensure data is an array
            } catch (error) {
                console.error('Error fetching results:', error);
                setResults([]);  // Prevent undefined state
            }
        };
        

        const fetchClasses = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/services/classes/${user.organization_id}`, {
                    method: 'GET',
                    headers: { 'userId': user.id },
                });
                if (!response.ok) throw new Error('Failed to fetch classes');
                const data = await response.json();
                setClasses(data);
            } catch (error) {
                console.error('Error fetching classes:', error);
            }
        };

        const fetchSections = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/services/sections/`, {
                    method: 'GET',
                    headers: { 'userId': user.id },
                });
                if (!response.ok) throw new Error('Failed to fetch sections');
                const data = await response.json();
                setSections(data);
            } catch (error) {
                console.error('Error fetching sections:', error);
            }
        };

        fetchResults();
        fetchClasses();
        fetchSections();
    }, [user]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('is_admin');
        navigate('/');
    };

    const handleDownload = (result) => {
        const doc = new jsPDF();
        const pageHeight = doc.internal.pageSize.height;
        const margin = 20;
        let startY = margin;
    
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 128);
        doc.text('Student Result Card', 105, startY, { align: 'center' , });
        startY += 10;
        
        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        doc.text(result.organization || 'Unknown Organization', 105, startY, { align: 'center' });
        startY += 10;
    
        doc.setLineWidth(0.5);
        doc.line(10, startY, 200, startY);
        startY += 10;
    
        // General Info
        const generalInfo = [
            ['Document ID:', result?._id],
            ['Exam ID:', result?.exam_id],
            ['Class:', result?.class_name],
            ['Section:', result?.section_name],
            ['Subject:', result?.subject_name],
            ['Roll No:', result?.roll_no],
            ['Score:', result?.scores],
            ['Document Uploaded By:', 'Abhinav Kar']
        ];
    
        doc.setFontSize(12);
        generalInfo.forEach(([label, value]) => {
            if (startY > pageHeight - margin) {
                doc.addPage();
                startY = margin;
            }
            doc.setFont('helvetica', 'bold');
            doc.text(label, 10, startY);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 128);
            doc.text(String(value), 60, startY);
            startY += 8;
        });
    
        // Question Results
        if (startY > pageHeight - margin) {
            doc.addPage();
            startY = margin;
        }
        
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Question Results:', 10, startY);
        startY += 10;
    
        // Process each result
        result.results.forEach((item, index) => {
            const addText = (label, text) => {
                if (startY > pageHeight - margin) {
                    doc.addPage();
                    startY = margin;
                }
                doc.setFont('helvetica', 'bold');
                doc.text(label, 10, startY);
                doc.setFont('helvetica', 'normal');
                const wrappedText = doc.splitTextToSize(text, 140);
                doc.text(wrappedText, 60, startY);
                startY += wrappedText.length * 6;
            };
    
            addText('Question:', item.question);
            addText('User Answer:', Object.values(item.user_answer).join("\n"));
            addText('Model Answer:', item.model_generated_answer);
            addText('Score:', Object.values(item.scores).join("\n"));
    
            if (index < result.results.length - 1) {
                doc.setLineWidth(0.5);
                doc.line(10, startY, 200, startY);
                startY += 5;
            }
        });
    
        // Save the PDF
        doc.save(`result_${result._id}.pdf`);
    };
    
    
    
    
    const handleDelete = (record) => {
        message.warning(`Delete functionality for result ID ${record._id} not implemented yet.`);
    };

    const handleReevaluate = (record) => {
        message.info(`Reevaluation for result ID ${record._id} initiated.`);
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
            sorter: (a, b) => a.exam_id.localeCompare(b.exam_id),
        },
        {
            title: 'Class',
            dataIndex: 'class_name',
            key: 'class_name',
            filters: classes.map(cls => ({ text: cls.name, value: cls.name })),
            onFilter: (value, record) => record.class_name.includes(value),
            sorter: (a, b) => a.class_name.localeCompare(b.class_name),
        },
        {
            title: 'Section',
            dataIndex: 'section_name',
            key: 'section_name',
            filters: sections.map(section => ({ text: section.name, value: section.name })),
            onFilter: (value, record) => record.section_name.includes(value),
            sorter: (a, b) => a.section_name.localeCompare(b.section_name),
        },
        {
            title: 'Subject',
            dataIndex: 'subject_name',
            key: 'subject_name',
            sorter: (a, b) => a.subject_name.localeCompare(b.subject_name),
        },
        {
            title: 'Roll No',
            dataIndex: 'roll_no',
            key: 'roll_no',
            sorter: (a, b) => a.roll_no - b.roll_no,
        },
        {
            title: 'Score',
            dataIndex: 'similarity_score',
            key: 'similarity_score',
            sorter: (a, b) => a.similarity_score - b.similarity_score,
        },
        {
            title: 'Uploaded By',
            key: 'uploaded_by',
            render: () => 'Digant Mohanty',
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (text, record) => (
                <>
                    <Button onClick={() => handleDownload(record)}>Download</Button>
                    <Button onClick={() => handleReevaluate(record)}>Reevaluate</Button>
                    <Button onClick={() => handleDelete(record)}>Delete</Button>
                </>
            ),
        },
    ];

    return (
        <div className="result-page">
            <SideNav />
            <div className="result-content">
                <h2>{user.organization} Results</h2>
                <Table columns={columns} dataSource={results} rowKey="_id" />
            </div>
        </div>
    );
};

export default Result;
