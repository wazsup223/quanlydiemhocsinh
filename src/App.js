import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './components/Dashboard';
//student
import StudentList from './Sinhvien/StudentList';
import AddStudent from './Sinhvien/AddStudent';
import EditStudent from './Sinhvien/EditStudent';
//subject
import SubjectList from './Monhoc/SubjectList';
import AddSubject from './Monhoc/AddSubject';
import EditSubject from './Monhoc/EditSubject';
//class
import ClassList from './Lophoc/ClassList';
import AddClass from './Lophoc/AddClass';
import EditClass from './Lophoc/EditClass';
import ClassDetail from './Lophoc/ClassDetail';
//grades
import GradeList from './Diem/GradeList';
import AddGrade from './Diem/AddGrade';
import EditGrade from './Diem/EditGrade';
//Department
import DepartmentList from './Khoa/DepartmentList';
import AddDepartment from './Khoa/AddDepartment';
import EditDepartment from './Khoa/EditDepartment';
import DepartmentDetail from './Khoa/DepartmentDetail';
//Instructor
import InstructorList from './Giangvien/InstructorList';
import AddInstructor from './Giangvien/AddInstructor';
import EditInstructor from './Giangvien/EditInstructor';
import InstructorDetail from './Giangvien/InstructorDetail';

import TeachingAssignmentList from './PCGiangvien/TeachingAssignmentList';
import AddTeachingAssignment from './PCGiangvien/AddTeachingAssignment';
import EditTeachingAssignment from './PCGiangvien/EditTeachingAssignment';
import TeachingAssignmentDetail from './PCGiangvien/TeachingAssignmentDetail';
import TeachingAssignmentFilter from './PCGiangvien/TeachingAssignmentFilter';
import TeachingAssignmentFilterBySemester from './PCGiangvien/TeachingAssignmentFilterBySemester';

import CourseRegistrationList from './DKMon/CourseRegistrationList';
import AddCourseRegistration from './DKMon/AddCourseRegistration';
import EditCourseRegistration from './DKMon/EditCourseRegistration';
import CourseRegistrationDetail from './DKMon/CourseRegistrationDetail';
import CourseRegistrationFilterByStudent from './DKMon/CourseRegistrationFilterByStudent';
import CourseRegistrationFilterBySubject from './DKMon/CourseRegistrationFilterBySubject';

import UserList from './User/UserList';
import AddUser from './User/AddUser';
import EditUser from './User/EditUser';
import UserDetail from './User/UserDetail';
import theme from './theme';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<Dashboard />} />
            <Route index element={<Dashboard />} />
            <Route path="students" element={<StudentList />} />
            <Route path="students/add" element={<AddStudent />} />
            <Route path="students/edit/:id" element={<EditStudent />} />

            <Route path="grades" element={<GradeList />} />
            <Route path="grades/add" element={<AddGrade />} />
            <Route path="grades/edit/:id" element={<EditGrade />} />

            <Route path="subjects" element={<SubjectList />} />
            <Route path="subjects/add" element={<AddSubject />} />
            <Route path="subjects/edit/:id" element={<EditSubject />} />

            <Route path="classes" element={<ClassList />} />
            <Route path="classes/add" element={<AddClass />} />
            <Route path="classes/edit/:id" element={<EditClass />} />
            <Route path="class-detail/:id" element={<ClassDetail />} />
            
            <Route path="departments" element={<DepartmentList />} />
            <Route path="departments/add" element={<AddDepartment />} />
            <Route path="departments/edit/:id" element={<EditDepartment />} />
            <Route path="department-detail/:id" element={<DepartmentDetail />} />

            
            <Route path="instructors" element={<InstructorList />} />
            <Route path="instructors/add" element={<AddInstructor />} />
            <Route path="instructors/edit/:id" element={<EditInstructor />} />
            <Route path="instructors/detail/:id" element={<InstructorDetail />} />


            <Route path="teaching-assignments" element={<TeachingAssignmentList />} />
            <Route path="teaching-assignments/add" element={<AddTeachingAssignment />} />
            <Route path="teaching-assignments/edit/:id" element={<EditTeachingAssignment />} />
            <Route path="teaching-assignments/detail/:id" element={<TeachingAssignmentDetail />} />
            <Route path="teaching-assignments/filter/:type/:id" element={<TeachingAssignmentFilter />} />
            <Route path="teaching-assignments/filter/semester/:semester/:academicYear" element={<TeachingAssignmentFilterBySemester />} />

            <Route path="course-registrations" element={<CourseRegistrationList />} />
            <Route path="course-registrations/add" element={<AddCourseRegistration />} />
            <Route path="course-registrations/edit/:id" element={<EditCourseRegistration />} />
            <Route path="course-registrations/detail/:id" element={<CourseRegistrationDetail />} />
            <Route path="course-registrations/student/:studentId" element={<CourseRegistrationFilterByStudent />} />
            <Route path="course-registrations/subject/:subjectId" element={<CourseRegistrationFilterBySubject />} />

            <Route path="users" element={<UserList />} />
            <Route path="users/add" element={<AddUser />} />
            <Route path="users/edit/:id" element={<EditUser />} />
            <Route path="users/detail/:id" element={<UserDetail />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App; 