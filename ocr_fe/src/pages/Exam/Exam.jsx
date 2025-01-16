import React from 'react';
import { Tabs } from 'antd';
import SideNav from '../../components/SideNav';
import './Exam.css';
import ExamUploadAnswer from './ExamUploadAnswer/ExamUploadAnswer';
// import ExamDetails from './ExamManagement/ExamDetails';
// import ManageExam from './ExamManagement/ManageExam';
// import AddExam from './ExamManagement/AddExam';

const { TabPane } = Tabs;

const Exam = () => {
  return (
    <div className='exam'>
      <div className='exam-sidebar'>
        <SideNav />
      </div>
      <div className='exam-content'>
        <div className="exam-page-header">
          <h1>Exam</h1>
        </div>
        <main>
          <Tabs defaultActiveKey="1">
            <TabPane tab="Exam Details" key="1">
              <div className='tab-content'>
                <ExamUploadAnswer/>
              </div>
            </TabPane>
            <TabPane tab="Manage Exam" key="2">
              <div className='tab-content'>
                {/* <ManageExam /> */}
              </div>
            </TabPane>
            <TabPane tab="Add Exam" key="3">
              <div className='tab-content'>
                {/* <AddExam /> */}
              </div>
            </TabPane>
            <TabPane tab="Exam Overview" key="4">
              <div className='tab-content'>
                <h4>Exam Overview Content</h4>
                <p>Details about the exam...</p>
              </div>
            </TabPane>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Exam;