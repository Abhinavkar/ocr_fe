import React from 'react';
import { Table, Button } from 'antd';

const ExamUploadAnswer = () => {
  const dataSource = [
    {
      key: '1',
      sno: '1',
      rollNo: '12345',
      examId: 'EX001',
      classSubject: 'Math',
      section: 'A',
      uploadedBy:"ABHinav",
      evaluationStatus: 'Pending',
    },
    {
      key: '2',
      sno: '2',
      rollNo: '12346',
      examId: 'EX002',
      classSubject: 'Science',
      section: 'B',
      evaluationStatus: 'Completed',
    },
    // Add more data as needed
  ];

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
      dataIndex: 'Subject',
      key: 'Subject',
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
        title:'Uploaded By',
        dataIndex:"uploadedBy",
        key:'uploadedBy',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Button type="primary">Evaluate</Button>
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