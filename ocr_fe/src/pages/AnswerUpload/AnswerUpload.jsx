import React, { useState, useEffect, useContext } from 'react';
import { Table, Button, Popconfirm, message, Select, Input, Upload } from 'antd';
import { UserContext } from '../../UserContext';
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const AnswerUpload = () => {
  const { user } = useContext(UserContext);
  const [rollNo, setRollNo] = useState('');
  const [examId, setExamId] = useState('');
  const [className, setClassName] = useState('');
  const [subject, setSubject] = useState('');
  const [pdf, setPdf] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [examIds, setExamIds] = useState([]);
  const [classSelected, setClassSelected] = useState('');
  const [sectionSelected, setSectionSelected] = useState('');
  const [subjectSelected, setSubjectSelected] = useState('');
  const [organizations, setOrganizations] = useState([]);
  const [organizationSelected, setOrganizationSelected] = useState('');
  const [userOrgId, setUserOrgId] = useState('');

  useEffect(() => {
    const fetchUserOrgId = async () => {
      const orgId = await localStorage.getItem('org_id');
      setUserOrgId(orgId);
      console.log("UserOrgId", orgId);
    };
    fetchUserOrgId();
  }, []);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        console.log("hii")
        const response = await fetch(`http://localhost:8000/api/services/classes/${user?.organization_id}`, {
          method: 'GET',
        });

        if (response.ok) {
          const data = await response.json();
          setClasses(data || []);
        } else {
          message.error('Failed to fetch classes.');
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
        message.error('An error occurred while fetching classes.');
      }
    };

    fetchClasses(organizationSelected);
    
    setClasses([]);
    setClassSelected('');
    setSections([]);
    setSectionSelected('');
    setSubjects([]);
    setSubjectSelected('');
    
  },[]);
  
  useEffect(() => {
    if (classSelected) {
      fetchSections(classSelected);
      setSectionSelected(''); // Reset section selection when class changes
    } else {
      setSections([]); // Clear sections when no class is selected
      setSectionSelected('');
      setSubjects([]);
      setSubjectSelected('');
    }
  }, [classSelected]);

  useEffect(() => {
    if (sectionSelected) {
      fetchSubjects(sectionSelected);
      setSubjectSelected(''); // Reset subject selection when section changes
    } else {
      setSubjects([]); // Clear subjects when no section is selected
      setSubjectSelected('');
    }
  }, [sectionSelected]);

  useEffect(() => {
    if (classSelected && sectionSelected && subjectSelected) {
      fetchExamId(classSelected, sectionSelected, subjectSelected);
    } else {
      setExamIds([]);
      setExamId('');
    }
  }, [classSelected, sectionSelected, subjectSelected]);

  const fetchSections = async (classId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/services/sections/${classId}/`, {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        setSections(data || []);
      } else {
        message.error('Failed to fetch sections.');
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
      message.error('An error occurred while fetching sections.');
    }
  };

  const fetchSubjects = async (sectionId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/services/subjects/${sectionId}/`, {
        method: 'GET',
      });

      if (response.ok) {
        const data = await response.json();
        setSubjects(data || []);
      } else {
        message.error('Failed to fetch subjects.');
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
      message.error('An error occurred while fetching subjects.');
    }
  };

  const fetchExamId = async (classId, sectionId, subjectId) => {
    try {
      const response = await fetch(`http://localhost:8000/api/services/get/exam-id/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'classId': classId,
          'sectionId': sectionId,
          'subjectId': subjectId,
          'organizationId': user?.organization_id,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setExamIds(data.exam_ids);
        console.log(data.exam_ids);
      } else {
        console.error('Failed to fetch exam ID');
      }
    } catch (error) {
      console.error('Error fetching exam ID:', error);
    }
  };

  const uploadAnswer = async () => {
    if (!pdf) {
      message.error('Please select a PDF to upload.');
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append('rollNo', rollNo);
    formData.append('examId', examId);
    formData.append('classId', classSelected); // Include classId in the form data
    formData.append('sectionId', sectionSelected); // Include sectionId in the form data
    formData.append('subjectId', subjectSelected);
    formData.append('organizationId', user?.organization_id);
    formData.append('answer_pdf', pdf);

    try {
      const response = await fetch(`http://localhost:8000/api/qa/upload/answers/`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        message.success('Answer uploaded successfully.');
        // Reset form data
        setRollNo('');
        setExamId('');
        setClassSelected('');
        setSectionSelected('');
        setSubjectSelected('');
        setPdf(null);
      } else {
        message.error('Failed to upload answer.');
      }
    } catch (error) {
      message.error('An error occurred while uploading the answer.');
    } finally {
      setIsUploading(false);
    }
  };

  const handlePickPdf = (info) => {
    if (info.file.status === 'done') {
      setPdf(info.file.originFileObj);
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  return (
    <div>
      <h2>Exam Answer Upload</h2>
      <div>
        <label>Organization</label>
        <Select
          value={user.organization}
          style={{ width: '100%' }}
        >
          <Option value={user.organization}>{user.organization}</Option>
        </Select>
      </div>
      <div>
        <label>Class</label>
        <Select
          value={classSelected}
          onChange={setClassSelected}
          style={{ width: '100%' }}
        >
          <Option value="">Select Class</Option>
          {classes.map((classItem) => (
            <Option key={classItem._id} value={classItem._id}>
              {classItem.name}
            </Option>
          ))}
        </Select>
      </div>
      <div>
        <label>Section</label>
        <Select
          value={sectionSelected}
          onChange={setSectionSelected}
          style={{ width: '100%' }}
        >
          <Option value="">Select Section</Option>
          {sections.map((sectionItem) => (
            <Option key={sectionItem._id} value={sectionItem._id}>
              {sectionItem.name}
            </Option>
          ))}
        </Select>
      </div>
      <div>
        <label>Subject</label>
        <Select
          value={subjectSelected}
          onChange={setSubjectSelected}
          style={{ width: '100%' }}
        >
          <Option value="">Select Subject</Option>
          {subjects.map((subjectItem) => (
            <Option key={subjectItem._id} value={subjectItem._id}>
              {subjectItem.name}
            </Option>
          ))}
        </Select>
      </div>
      <div>
        <label>Exam ID</label>
        <Select
          value={examId}
          onChange={setExamId}
          style={{ width: '100%' }}
        >
          <Option value="">Select Exam ID</Option>
          {examIds.map((examItem, index) => (
            <Option key={index} value={examItem}>
              {examItem}
            </Option>
          ))}
        </Select>
      </div>
      <div>
        <label>Roll No</label>
        <Input
          value={rollNo}
          onChange={(e) => setRollNo(e.target.value)}
          placeholder="Enter Roll No"
        />
      </div>
      <div>
        <label></label>
        <Upload
          name="pdf"
          accept=".pdf"
          beforeUpload={(file) => {
            setPdf(file);
            return false; // Prevent automatic upload
          }}
          onChange={handlePickPdf}
        > 
          <Button icon={<UploadOutlined />} style={{ border: 0 }}>Select PDF</Button>
        </Upload>
        {pdf && <span>{pdf.name}</span>}
      </div>
      <Button type="primary" onClick={uploadAnswer} loading={isUploading}>
        Submit Answer
      </Button>
    </div>
  );
};

export default AnswerUpload;