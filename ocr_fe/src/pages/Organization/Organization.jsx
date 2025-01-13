import React from 'react';
import { Tabs } from 'antd';
import SideNav from '../../components/SideNav';
import './Organization.css';
import SubUserRegister from './OrganizationManagement/SubUserRegister';
import UserRegister from './OrganizationManagement/UserRegister';
import UserManagement from './OrganizationManagement/User_Management/UserManagement';
const { TabPane } = Tabs;

const Organization = () => {
  return (
    <div className='organization'>
      <div className='organization-sidebar'>
        <SideNav />
      </div>
      <div className='organization-content'>
        <div className="organization-page-header">
            <h1>Organization</h1>
        </div>

        <main>

                        <Tabs defaultActiveKey="1">
                          <TabPane tab="Overview" key="1">
                            <div className='tab-content'>
                              <h4>Overview Content</h4>
                              <p>Details about the organization...</p>
                            </div>
                          </TabPane>
                          <TabPane tab="Departments" key="2">
                            <div className='tab-content'>
                              <h4>Departments Content</h4>
                              <p>Details about the departments...</p>
                            </div>
                          </TabPane>
                          <TabPane tab="Users" key="3">
                            <div className='tab-content'>
                              <UserManagement/>
                            </div>
                          </TabPane>
                            <TabPane tab="Add Sub Admin" key="4">
                                <div className='tab-content'>
                                <SubUserRegister />
                                </div>
                            </TabPane>
                            <TabPane tab="Add user" key="5">
                                <div className='tab-content'>
                                    <UserRegister />
                                </div>
                            </TabPane>
                            <TabPane tab="Manage User" key="6">
                                <div className='tab-content'>
                                <h4>Management </h4>
                                <p>Details about the page</p>
                                </div>
                            </TabPane>

                        </Tabs>
                      
                    
        </main>
      </div>
    </div>
  );
};

export default Organization;