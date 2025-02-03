import React, { useState } from 'react';
import { Table, Button, Popconfirm } from 'antd';

const ExamUploadAnswer = () => {
  const [dataSource, setDataSource] = useState([
    {
      key: '1',
      sno: '1',
      rollNo: '12345',
      examId: 'EX001',
      classSubject: 'Math',
      section: 'A',
      uploadedBy: "Digant",
      evaluationStatus: 'Pending',
    },
    {
      key: '2',
      sno: '2',
      rollNo: '12346',
      examId: 'EX002',
      classSubject: 'Science',
      section: 'B',
      uploadedBy: "Abhinav",
      evaluationStatus: 'Completed',
    },
    // Add more data as needed
  ]);

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
      title: 'Roll No',
      dataIndex: 'rollNo',
      key: 'rollNo',
    },
    {
      title: 'Exam ID',
      dataIndex: 'examId',
      key: 'examId',
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
      title: 'Evaluation Status',
      dataIndex: 'evaluationStatus',
      key: 'evaluationStatus',
    },
    {
      title: 'Uploaded By',
      dataIndex: 'uploadedBy',
      key: 'uploadedBy',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <>
          <Button type="primary" style={{ marginRight: 8 }}>Evaluate</Button>
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
      <h2>Exam Upload Answer</h2>
      <Table dataSource={dataSource} columns={columns} />
    </div>
  );
};

export default ExamUploadAnswer;