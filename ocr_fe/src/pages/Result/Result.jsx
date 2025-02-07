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

        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text('Document ID:', 10, 45);
        doc.text('Exam ID:', 10, 55);
        doc.text('Class:', 10, 65);
        doc.text('Section:', 10, 75);
        doc.text('Subject:', 10, 85);
        doc.text('Roll No:', 10, 95);
        doc.text('Total Score:', 10, 105);
        doc.text('Average Score:', 10, 115);
        doc.text('Document Uploaded By:', 10, 115);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 128);
        doc.text(`${result?._id}`, 60, 45);
        doc.text(`${result?.exam_id}`, 60, 55);
        doc.text(`${result?.class_name}`, 60, 65);
        doc.text(`${result?.section_name}`, 60, 75);
        doc.text(`${result?.subject_name}`, 60, 85);
        doc.text(`${result?.roll_no}`, 60, 95);
        doc.text(`${result?.total_score}`, 60, 105); 
        doc.text(`${result?.average_score}`, 60, 105);
        doc.text('Abhinav Kar', 60, 115);

        const tableColumn = ["Question", "User Answer", "Model Answer", "Score"];
        const tableRows = [];

        result.results.forEach(item => {
            tableRows.push([
                item.question,
                Object.values(item.user_answer).join("\n"),
                item.model_generated_answer,
                Object.values(item.scores).join("\n")
            ]);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 130,
            theme: 'grid',
            headStyles: { fillColor: [0, 0, 128] },
            styles: { fontSize: 10, cellPadding: 3 },
        });

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
