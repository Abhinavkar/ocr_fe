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
          isActive: exam.is_active ? 'Active' : 'Inactive', // Map is_active to a readable format
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

  // Function to update exam status
  const handleUpdateStatus = async (examId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Active' ? false : true;
      const response = await axios.put('http://localhost:8000/api/services/update/exam-id/', {
        examId: examId,
        is_active: newStatus,
      }, {
        headers: {
          'userId': user.id,
        },
      });

      if (response.status === 200) {
        message.success('Exam status updated successfully.');
        fetchExamData(); // Refresh the data
      } else {
        message.error('Failed to update exam status.');
      }
    } catch (error) {
      console.error('Error updating exam status:', error);
      message.error('Failed to update exam status.');
    }
  };

  // Function to delete exam
  const handleDelete = async (examId) => {
    try {
      const response = await axios.delete('http://localhost:8000/api/services/delete/exam-id/', {
        headers: {
          'userId': user.id,
        },
        data: {
          examId: examId,
        },
      });

      if (response.status === 200) {
        message.success('Exam deleted successfully.');
        fetchExamData(); // Refresh the data
      } else {
        message.error('Failed to delete exam.');
      }
    } catch (error) {
      console.error('Error deleting exam:', error);
      message.error('Failed to delete exam.');
    }
  };

  // Call fetch function when the component is mounted
  useEffect(() => {
    fetchExamData();
  }, []);

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
      title: 'Section',
      dataIndex: 'section',
      key: 'section',
    },
    {
      title: 'Subject',
      dataIndex: 'classSubject',
      key: 'classSubject',
    },
    
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
    },
    {
      title: 'Update Status',
      key: 'updateStatus',
      render: (text, record) => (
        <Button
          type="primary"
          onClick={() => handleUpdateStatus(record.examId, record.isActive)}
        >
          {record.isActive === 'Active' ? 'Deactivate' : 'Activate'}
        </Button>
      ),
    },
    {
      title: 'Delete',
      key: 'delete',
      render: (text, record) => (
        <Popconfirm
          title="Are you sure to delete this record?"
          onConfirm={() => handleDelete(record.examId)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="danger">Delete</Button>
        </Popconfirm>
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
