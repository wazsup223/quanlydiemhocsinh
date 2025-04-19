import { config } from './env';

const API_BASE_URL = config.API_BASE_URL;

export const API_ENDPOINTS = {
  // User endpoints
  USERS: {
    LIST: `${API_BASE_URL}/users/read.php`,
    CREATE: `${API_BASE_URL}/users/create.php`,
    READ_ONE: `${API_BASE_URL}/users/read_one.php`,
    UPDATE: `${API_BASE_URL}/users/update.php`,
    DELETE: `${API_BASE_URL}/users/delete.php`,
  },

  // Student endpoints
  STUDENTS: {
    LIST: `${API_BASE_URL}/students/readStudents.php`,
    CREATE: `${API_BASE_URL}/students/createStudent.php`,
    UPDATE: `${API_BASE_URL}/students/updateStudent.php`,
    DELETE: `${API_BASE_URL}/students/deleteStudent.php`,
    READ_BY_CLASS: `${API_BASE_URL}/students/readByClass.php`,
    READ_BY_DEPARTMENT: `${API_BASE_URL}/students/readByDepartment.php`,
    READ_BY_ACADEMIC_YEAR: `${API_BASE_URL}/students/readByAcademicYear.php`,
  },

  // Class endpoints
  CLASSES: {
    LIST: `${API_BASE_URL}/classess/readClasses.php`,
    CREATE: `${API_BASE_URL}/classess/create_classes.php`,
    UPDATE: `${API_BASE_URL}/classess/update_classes.php`,
    DELETE: `${API_BASE_URL}/classess/delete_classes.php`,
    READ_STUDENTS: `${API_BASE_URL}/classess/read_studentClasses.php`,
  },

  // Department endpoints
  DEPARTMENTS: {
    LIST: `${API_BASE_URL}/departments/readDepartments.php`,
    CREATE: `${API_BASE_URL}/departments/create_departments.php`,
    UPDATE: `${API_BASE_URL}/departments/update_departments.php`,
    DELETE: `${API_BASE_URL}/departments/delete_departments.php`,
    READ_ONE: `${API_BASE_URL}/departments/read_oneDepartments.php`,
    READ_DETAIL: `${API_BASE_URL}/departments/read_detail_departments.php`,
  },

  // Instructor endpoints
  INSTRUCTORS: {
    LIST: `${API_BASE_URL}/instructors/read.php`,
    CREATE: `${API_BASE_URL}/instructors/create.php`,
    UPDATE: `${API_BASE_URL}/instructors/update.php`,
    DELETE: `${API_BASE_URL}/instructors/delete.php`,
    READ_ONE: `${API_BASE_URL}/instructors/read_one.php`,
  },

  // Subject endpoints
  SUBJECTS: {
    LIST: `${API_BASE_URL}/subjects/read.php`,
    CREATE: `${API_BASE_URL}/subjects/create.php`,
    UPDATE: `${API_BASE_URL}/subjects/update.php`,
    DELETE: `${API_BASE_URL}/subjects/delete.php`,
    READ_ONE: `${API_BASE_URL}/subjects/read_one.php`,
    READ_BY_DEPARTMENT: `${API_BASE_URL}/subjects/readByDepartment.php`,
  },

  // Grade endpoints
  GRADES: {
    LIST: `${API_BASE_URL}/grades/read.php`,
    CREATE: `${API_BASE_URL}/grades/create.php`,
    UPDATE: `${API_BASE_URL}/grades/update.php`,
    DELETE: `${API_BASE_URL}/grades/delete.php`,
    READ_BY_INSTRUCTOR: `${API_BASE_URL}/grades/read_by_instructor_id.php`,
    ADD_GRADES_REG: `${API_BASE_URL}/grades/addgrades_reg.php`,
  },

  // Teaching Assignment endpoints
  TEACHING_ASSIGNMENTS: {
    LIST: `${API_BASE_URL}/instructor_assignments/read.php`,
    CREATE: `${API_BASE_URL}/instructor_assignments/create.php`,
    UPDATE: `${API_BASE_URL}/instructor_assignments/update.php`,
    DELETE: `${API_BASE_URL}/instructor_assignments/delete.php`,
    READ_ONE: `${API_BASE_URL}/teaching_assignments/read_one.php`,
    READ_BY_SEMESTER: `${API_BASE_URL}/teaching_assignments/read_by_semester.php`,
    READ_BY_INSTRUCTOR: `${API_BASE_URL}/teaching_assignments/read_by_instructor.php`,
    READ_BY_SUBJECT: `${API_BASE_URL}/teaching_assignments/read_by_subject.php`,
    READ_BY_CLASS: `${API_BASE_URL}/teaching_assignments/read_by_class.php`,
  },

  // Course Registration endpoints
  COURSE_REGISTRATIONS: {
    LIST: `${API_BASE_URL}/student_reg/read.php`,
    CREATE: `${API_BASE_URL}/student_reg/create.php`,
    DELETE: `${API_BASE_URL}/course_registrations/delete.php`,
    READ_ONE: `${API_BASE_URL}/course_registrations/read_one.php`,
    READ_BY_STUDENT: `${API_BASE_URL}/course_registrations/read_by_studentid.php`,
    READ_BY_SUBJECT: `${API_BASE_URL}/course_registrations/read_by_subject.php`,
  },
}; 