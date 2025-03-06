import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminLogin from './pages/Admin_Login/AdminLogin';
import AdminRegister from './pages/Admin_Login/AdminRegister';
import AdminDashboard from './pages/Admin_Dashboard/AdminDashboard';
import Result from './pages/Result/Result';
import ClassManagement from './pages/Department/Class_Management/ClassManagement';
import SectionManagement from './pages/Department/Section_Management/SectionManagement';
import SubjectManagement from './pages/Department/Subjectmanagement/SubjectManagement';
import DashBoard from './pages/Dashboard/DashBoard';
import Organization from './pages/Organization/Organization';
import PrivateRoute from './components/PrivateRoute';
import Department from './pages/Department/Department';
import Exam from './pages/Exam/Exam';
import AnswerUpload from './pages/AnswerUpload/AnswerUpload';

function App() {
  return (
    <div className="App" style={{height:"100vh"}}>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/admin/register" element={<AdminRegister />} />
      
        <Route
          path="/olddashboard"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/result"
          element={
            <PrivateRoute>
              <Result />
            </PrivateRoute>
          }
        />
        <Route
          path="/exam"
          element={
            <PrivateRoute>
              <Exam />
            </PrivateRoute>
          }
        />
        <Route
          path="/section/management"
          element={
            <PrivateRoute>
              <SectionManagement />
            </PrivateRoute>
          }
        />

        <Route
          path="/subject"
          element={
            <PrivateRoute>
              <SubjectManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashBoard />
            </PrivateRoute>
          }
        />
        <Route
          path="/organization"
          element={
            <PrivateRoute>
              <Organization />
            </PrivateRoute>
          }
        />
        <Route
          path="/department"
          element={
            <PrivateRoute>
              <Department />
            </PrivateRoute>
          }
        />
        <Route
          path='/answerupload'
          element={
            <PrivateRoute>
              <AnswerUpload/>
            </PrivateRoute>

          }/>
      </Routes>
    </div>
  );
}

export default App;