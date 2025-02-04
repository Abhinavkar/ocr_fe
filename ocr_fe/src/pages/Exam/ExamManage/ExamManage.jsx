import React, { useState, useEffect, useContext } from 'react';
import { Table, Button, Popconfirm, message } from 'antd';
import axios from 'axios';
import { UserContext } from '../../../UserContext';

const ExamManage = () => {
  const [dataSource, setDataSource] = useState([]);
  const { user } = useContext(UserContext);

  // Function to fetch exam data
  const fetchExamData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/services/generated/exam-id/', {
        headers: {
          'userId': user.id,
        },
      });

      if (response.data.exam_ids && response.data.exam_ids.length > 0) {
        const examData = response.data.exam_ids.map((exam, index) => ({
          key: exam._id,
          sno: index + 1,
          examId: exam._id,
          class: exam.class_name,
          classSubject: exam.subject_name,
          section: exam.section_name,
        }));

        setDataSource(examData);  // Set the fetched data in the table
      } else {
        message.error('No exam data found.');
      }
    } catch (error) {
      console.error('Error fetching exam data:', error);
      message.error('Failed to fetch exam data.');
    }
  };

  // Call fetch function when the component is mounted
  useEffect(() => {
    fetchExamData();
  }, []);

  const handleDelete = (key) => {
    const newDataSource = dataSource.filter((item) => item.key !== key);
    setDataSource(newDataSource);
  };

  const columns = [
    {
      title: 'S.No',
      dataIndex: 'sno',
      key: 'sno',
    },
    {
      title: 'Exam ID',
      dataIndex: 'examId',
      key: 'examId',
    },
    {
      title: 'Class',
      dataIndex: 'class',
      key: 'class',
    },
    {
      title: 'Subject',
      dataIndex: 'classSubject',
      key: 'classSubject',
    },
    {
      title: 'Section',
      dataIndex: 'section',
      key: 'section',
    },
    {
        title:"Status",
        dataIndex:"is_active",
        key:"is_active"
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <>
          <Popconfirm
            title="Are you sure to delete this record?"
            onConfirm={() => handleDelete(record.key)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="danger">Delete</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div>
      <h2>Exam Manage</h2>
      <Table dataSource={dataSource} columns={columns} />
    </div>
  );
};

export default ExamManage;
