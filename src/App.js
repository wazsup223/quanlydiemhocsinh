import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
//student
import StudentList from './Sinhvien/StudentList';
import AddStudent from './Sinhvien/AddStudent';
import EditStudent from './Sinhvien/EditStudent';
//khoa
import DepartmentList from './Khoa/DepartmentList';
import AddDepartment from './Khoa/AddDepartment';
import EditDepartment from './Khoa/EditDepartment';
import DepartmentDetail from './Khoa/DepartmentDetail';
//lophoc
import ClassList from './Lophoc/ClassList';
import AddClass from './Lophoc/AddClass';
import EditClass from './Lophoc/EditClass';
import ClassDetail from './Lophoc/ClassDetail';
//monhoc
import SubjectList from './Monhoc/SubjectList';
import AddSubject from './Monhoc/AddSubject';
import EditSubject from './Monhoc/EditSubject';
//giangvien
import InstructorList from './Giangvien/InstructorList';
import AddInstructor from './Giangvien/AddInstructor';
import EditInstructor from './Giangvien/EditInstructor';
import InstructorDetail from './Giangvien/InstructorDetail';
//diem
import GradeList from './Diem/GradeList';
import AddGrade from './Diem/AddGrade';
import EditGrade from './Diem/EditGrade';
//dkmon
import CourseRegistrationList from './DKMon/CourseRegistrationList';
import AddCourseRegistration from './DKMon/AddCourseRegistration';
//pcgiangvien
import TeachingAssignmentList from './PCGiangvien/TeachingAssignmentList';
import AddTeachingAssignment from './PCGiangvien/AddTeachingAssignment';
import EditTeachingAssignment from './PCGiangvien/EditTeachingAssignment';
import TeachingAssignmentDetail from './PCGiangvien/TeachingAssignmentDetail';
import TeachingAssignmentFilter from './PCGiangvien/TeachingAssignmentFilter';
import TeachingAssignmentFilterBySemester from './PCGiangvien/TeachingAssignmentFilterBySemester';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/" element={<Layout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="students" element={<StudentList />} />
            <Route path="students/add" element={<AddStudent />} />
            <Route path="students/edit/:id" element={<EditStudent />} />
            <Route path="departments" element={<DepartmentList />} />
            <Route path="departments/add" element={<AddDepartment />} />
            <Route path="departments/edit/:id" element={<EditDepartment />} />
            <Route path="departments/detail/:id" element={<DepartmentDetail />} />
            <Route path="classes" element={<ClassList />} />
            <Route path="classes/add" element={<AddClass />} />
            <Route path="classes/edit/:id" element={<EditClass />} />
            <Route path="classes/detail/:id" element={<ClassDetail />} />
            <Route path="subjects" element={<SubjectList />} />
            <Route path="subjects/add" element={<AddSubject />} />
            <Route path="subjects/edit/:id" element={<EditSubject />} />
            <Route path="instructors" element={<InstructorList />} />
            <Route path="instructors/add" element={<AddInstructor />} />
            <Route path="instructors/edit/:id" element={<EditInstructor />} />
            <Route path="instructors/detail/:id" element={<InstructorDetail />} />
            <Route path="grades" element={<GradeList />} />
            <Route path="grades/add" element={<AddGrade />} />
            <Route path="grades/edit/:id" element={<EditGrade />} />
            <Route path="course-registrations" element={<CourseRegistrationList />} />
            <Route path="course-registrations/add" element={<AddCourseRegistration />} />
            <Route path="teaching-assignments" element={<TeachingAssignmentList />} />
            <Route path="teaching-assignments/add" element={<AddTeachingAssignment />} />
            <Route path="teaching-assignments/edit/:id" element={<EditTeachingAssignment />} />
            <Route path="teaching-assignments/detail/:id" element={<TeachingAssignmentDetail />} />
            <Route path="teaching-assignments/filter" element={<TeachingAssignmentFilter />} />
            <Route path="teaching-assignments/filter-by-semester" element={<TeachingAssignmentFilterBySemester />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 