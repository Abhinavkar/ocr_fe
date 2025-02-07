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
        
        // Title
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 128);
        doc.text('Student Result Card', 105, 20, { align: 'center' });
    
        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        doc.text(user.organization || 'Unknown Organization', 105, 30, { align: 'center' });
    
        doc.setLineWidth(0.5);
        doc.line(10, 35, 200, 35);
    
        // General Information
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        const info = [
            ['Document ID:', result?._id],
            ['Exam ID:', result?.exam_id],
            ['Class:', result?.class_name],
            ['Section:', result?.section_name],
            ['Subject:', result?.subject_name],
            ['Roll No:', result?.roll_no],
            ['Score:', result?.scores],
            ['Document Uploaded By:', 'Abhinav Kar']
        ];
        
        let y = 45;
        info.forEach(([label, value]) => {
            doc.text(label, 10, y);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(0, 0, 128);
            doc.text(String(value || 'N/A'), 60, y);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(0, 0, 0);
            y += 10;
        });
    
        doc.line(10, y, 200, y);
        y += 10;
    
        // Table Header
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setFillColor(200, 200, 200); // Light Gray Background
        doc.rect(10, y, 190, 10, 'F'); // Background Box
        doc.setTextColor(0, 0, 0);
        doc.text('Question-wise Details', 105, y + 7, { align: 'center' });
        y += 15;
    
        const pageHeight = doc.internal.pageSize.height;
        
        result.results.forEach((item, index) => {
            if (y > pageHeight - 40) {
                doc.addPage();
                y = 20;
            }
    
            doc.setFont('helvetica', 'bold');
            doc.text(`Q${index + 1}:`, 10, y);
            y += 6;
    
            doc.setFont('helvetica', 'normal');
            // question=item.question.strip('\n')
            let questionLines = doc.splitTextToSize(item.question, 180);
            doc.text(questionLines, 15, y);
            y += questionLines.length * 6;
    
            const fields = [
                ['User Answer:', Object.values(item.user_answer).join("\n")],
                ['Model Answer:', item.model_generated_answer],
                ['Score:', Object.values(item.scores).join("\n")]
            ];
    
            fields.forEach(([label, text]) => {
                if (y > pageHeight - 40) {
                    doc.addPage();
                    y = 20;
                }
    
                doc.setFont('helvetica', 'bold');
                doc.text(label, 10, y);
                y += 6;
                doc.setFont('helvetica', 'normal');
                let lines = doc.splitTextToSize(text, 180);
                doc.text(lines, 15, y);
                y += lines.length * 6 + 4;
            });
    
            if (y > pageHeight - 30) {
                doc.addPage();
                y = 20;
            }
            doc.setLineWidth(0.5);
            doc.line(10, y, 200, y);
            y += 10;
        });
    
        // Footer with Date & Page Number
        let pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(10);
            doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 10, pageHeight - 10);
            doc.text(`Page ${i} of ${pageCount}`, 180, pageHeight - 10);
        }
    
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
            title: 'Total Score',
            dataIndex: 'total_score',
            key: 'total_score',
            sorter: (a, b) => a.total_score - b.total_score,
        },
        {
            title: 'Avg Score',
            dataIndex: 'average_score',
            key: 'average_score',
            sorter: (a, b) => a.average_score - b.average_score,
        },
        {
            title: 'Uploaded By',
            key: 'uploaded_by',
            render: () => 'Ritu Choudhary',
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
