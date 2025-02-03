import React,{useState,useEffect,useContext} from 'react';
import 'chart.js/auto';
import "./Dashboard.css";
import SideNav from '../../components/SideNav';
import { FileOutlined,SignatureFilled,DatabaseOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { Table, Button } from 'antd';
import { UserContext } from '../../UserContext';
const DashBoard = () => {
  const {user} = useContext(UserContext);
  const [data, setData] = useState([]);
  console.log(user.organization_id)
  useEffect(() => {
    fetch('http://localhost:8000/api/services/details-all/',{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'organizationId':user.organization_id
      }
    })
      .then(response => response.json())
      .then(data => setData(data));
  }, []);
  
 
  return (
    <div className='dashboard'>
      OVERVIEW
      <div className='dashboard-sidebar'>
      <SideNav />
      </div>
      <div className='dashboard-content'>
        <main>
          <div className='dashboard-body'>
            <div className="dashboard-layout">
              <div className="dashboard-grid-layout">
                <div className='layout-grid-row1'>
                  <div className="layout-grid-col1">
                  <div className="dashboard-card">
                      <div className="card-title">
                        <h3 className='card-title-content'>{data?.organization_name} User Details </h3>
                      
                    
                      </div>
                      <div className="card-body">
                        <div className='body-topic-row'>
                          <div className='body-topic-row-content'>
                            <h6 className="topic-name">Total No of Users</h6>
                            <span className="topic-number">{data?.total_user_count}</span>
                          </div>
                          <div className='body-topic-row-content'>
                            <h6 className="topic-name">Admin</h6>
                            <span className="topic-number">{data?.admin_count}</span>
                          </div>
                          <div className='body-topic-row-content'>
                            <h6 className="topic-name">Subadmin</h6>
                            <span className="topic-number">{data?.sub_admin_count}</span>
                          </div>
                          <div className='body-topic-row-content'>
                            <h6 className="topic-name">User</h6>
                            <span className="topic-number">{data?.user_count}</span>
                          </div>
                        </div>
                      
                      </div>
                      <div className="card-footer">

                      <Link to='/organization' className='card-footer-link'>View Details  <FileOutlined /></Link>
                      </div>
                    </div>
                    <div className="dashboard-card">
                      <div className="card-title">
                        <h3 className='card-title-content'> Department Details </h3>
                      
                    
                      </div>
                      <div className="card-body">
                        <div className='body-topic-row'>
                          <div className='body-topic-row-content'>
                            <h6 className="topic-name">Total No of Department</h6>
                            <span className="topic-number">3</span>
                          </div>
                          <div className='body-topic-row-content'>
                            <h6 className="topic-name">No of Classes </h6>
                            <span className="topic-number">{data?.class_count}</span>
                          </div>
                          <div className='body-topic-row-content'>
                            <h6 className="topic-name">No of Section </h6>
                            <span className="topic-number">{data?.section_count}</span>
                          </div>
                          <div className='body-topic-row-content'>
                            <h6 className="topic-name">No of Subject </h6>
                            <span className="topic-number">{data?.subject_count}</span>
                          </div>
                          

                        </div>
                      
                      </div>
                      <div className="card-footer">
                        <Link to='/department'  className='card-footer-link'>More Details  <DatabaseOutlined /></Link>
                      </div>
                    </div>
                    <div className="dashboard-card">
                      <div className="card-title">
                        <h3 className='card-title-content'> Exam Details </h3>
                       
                      </div>
                      <div className="card-body">
                        <div className='body-topic-row'>
                          <div className='body-topic-row-content'>
                            <h6 className="topic-name">Total Exam Conduted</h6>
                            <span className="topic-number">{data?.exam_count}</span>
                          </div>
                          <div className='body-topic-row-content'>
                            <h6 className="topic-name">Active Exam</h6>
                            <span className="topic-number">{data?.active_exam_count}</span>
                          </div>
                          <div className='body-topic-row-content'>
                            <h6 className="topic-name">Inactive Exam</h6>
                            <span className="topic-number">{data?.inactive_exam_count}</span>
                          </div>
                          

                        </div>
                      
                      </div>
                      <div className="card-footer">
                        <Link to='/exam'  className='card-footer-link'>Conduct Exam  <SignatureFilled /></Link>
                      </div>
                    </div>
                  </div>
                  <div className="layout-grid-col2">
                  <div className="dashboard-card">
                      <div className="card-title">
                        <h3 className='card-title-content'> Results Published  </h3>
                       
                      </div>
                      <div className="card-body">
                      <div className='body-topic-row'>
                          <div className='body-topic-row-content'>
                            <h6 className="topic-name">Total Results Published</h6>
                            <span className="topic-number">1340</span>
                          </div>
                          <div className='body-topic-row-content'>
                            <h6 className="topic-name">Pending Result</h6>
                            <span className="topic-number">21</span>
                          </div>
                          <div className='body-topic-row-content'>
                            <h6 className="topic-name">Evaluation Pending </h6>
                            <span className="topic-number">24</span>
                          </div>
                          <div className='body-topic-row-content'>
                            <h6 className="topic-name">Evaluation Failed </h6>
                            <span className="topic-number">24</span>
                          </div>
                          <div className='body-topic-row-content'>
                            <h6 className="topic-name">Re-Evaluation Request </h6>
                            <span className="topic-number">24</span>
                          </div>
                          <div className='body-topic-row-content'>
                            <h6 className="topic-name">Re-Evaluation Success </h6>
                            <span className="topic-number">24</span>
                          </div>

                          <div className='body-topic-row-content'>
                            <h6 className="topic-name">Dummy Data </h6>
                            <span className="topic-number">24</span>
                          </div>

                          

                        </div>
                      
                      </div>
                      <div className="card-footer">
                        <Link to='/result'  className='card-footer-link'>See Results  <FileOutlined /></Link>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='layout-grid-row2'>
                <div className="layout-grid-col3">
                  <div className="dashboard-card">
                      <div className="card-title">
                        <h3 className='card-title-content'> Organization Details   </h3>
                        
                      </div>
                      <div className="card-body">
                      <div className='body-topic-row'>
                          <div className='body-topic-row-content'>
                            <h6 className="topic-name">Total No. of Principal</h6>
                            <span className="topic-number">40</span>
                          </div>
                          <div className='body-topic-row-content'>
                            <h6 className="topic-name">Total No of. HOD  </h6>
                            <span className="topic-number">21</span>
                          </div>
                          <div className='body-topic-row-content'>
                            <h6 className="topic-name">Total No of Teacher's </h6>
                            <span className="topic-number">24</span>
                          </div>
                          <div className='body-topic-row-content'>
                            <h6 className="topic-name">Total No of Students </h6>
                            <span className="topic-number">24</span>
                          </div>
                          <div className='body-topic-row-content'>
                            <h6 className="topic-name">Organization </h6>
                            <span className="topic-number">24</span>
                          </div>
                          <div className='body-topic-row-content'>
                            <h6 className="topic-name">Dummy Data </h6>
                            <span className="topic-number">24</span>
                          </div>

                          <div className='body-topic-row-content'>
                            <h6 className="topic-name">Dummy Data </h6>
                            <span className="topic-number">24</span>
                          </div>

                          

                        </div>
                      
                      </div>
                      <div className="card-footer">
                        <Link to='/department'  className='card-footer-link'> Go to Managment Services  <FileOutlined /></Link>
                      </div>
                    </div>
                    <div className="dashboard-card">
                      <div className="card-title">
                        <h3 className='card-title-content'> Organization Details   </h3>
                        
                      </div>
                      <div className="card-body">
                      <div className='body-topic-row'>
                          <div className='body-topic-row-content'>
                            <h6 className="topic-name">Total No. of Principal</h6>
                            <span className="topic-number">40</span>
                          </div>
                          <div className='body-topic-row-content'>
                            <h6 className="topic-name">Total No of. HOD  </h6>
                            <span className="topic-number">21</span>
                          </div>
                          <div className='body-topic-row-content'>
                            <h6 className="topic-name">Total No of Teacher's </h6>
                            <span className="topic-number">24</span>
                          </div>
                          <div className='body-topic-row-content'>
                            <h6 className="topic-name">Total No of Students </h6>
                            <span className="topic-number">24</span>
                          </div>
                          <div className='body-topic-row-content'>
                            <h6 className="topic-name">Organization </h6>
                            <span className="topic-number">24</span>
                          </div>
                          <div className='body-topic-row-content'>
                            <h6 className="topic-name">Dummy Data </h6>
                            <span className="topic-number">24</span>
                          </div>

                          <div className='body-topic-row-content'>
                            <h6 className="topic-name">Dummy Data </h6>
                            <span className="topic-number">24</span>
                          </div>

                          

                        </div>
                      
                      </div>
                      <div className="card-footer">
                        <Link to='/olddashboard'  className='card-footer-link'> Go to Managment Services  <FileOutlined /></Link>
                      </div>
                    </div>
                </div>
              </div>
              </div>
              

            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashBoard;