import React from 'react';
import { Tabs } from 'antd';
import SideNav from '../../components/SideNav';
import './Department.css';
import ClassManagement from './Class_Management/ClassManagement';
import SectionManagement from './Section_Management/SectionManagement';
import SubjectManagement from './Subjectmanagement/SubjectManagement';

const { TabPane } = Tabs;

const Department = () => {
  return (
    <div className='department'>
      <div className='department-sidebar'>
        <SideNav />
      </div>
      <div className='department-content'>
        <div className="department-page-header">
          <h1>Department</h1>
        </div>
        <main>
          <Tabs defaultActiveKey="1">
            <TabPane tab="Class Management" key="1">
              <div className='tab-content'>
                <ClassManagement />
              </div>
            </TabPane>
            <TabPane tab="Section Management" key="2">
              <div className='tab-content'>
                <SectionManagement />
              </div>
            </TabPane>
            <TabPane tab="Subject Management" key="3">
              <div className='tab-content'>
                <SubjectManagement />
              </div>
            </TabPane>
            <TabPane tab="Overview" key="4">
              <div className='tab-content'>
                <h4>Overview Content</h4>
                <p>Details about the department...</p>
              </div>
            </TabPane>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Department;