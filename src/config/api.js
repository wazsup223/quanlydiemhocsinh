const API_BASE_URL = 'https://ql-diem-backend.onrender.com/API';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: `${API_BASE_URL}/auth/login.php`,
  
  // Students
  STUDENTS: {
    LIST: `${API_BASE_URL}/students/readStudents.php`,
    CREATE: `${API_BASE_URL}/students/createStudent.php`,
    UPDATE: `${API_BASE_URL}/students/updateStudent.php`,
    DELETE: `${API_BASE_URL}/students/deleteStudent.php`,
    BY_ACADEMIC_YEAR: `${API_BASE_URL}/students/readByAcademicYear.php`,
    BY_CLASS: `${API_BASE_URL}/students/readByClass.php`,
    BY_DEPARTMENT: `${API_BASE_URL}/students/readByDepartment.php`,
  },

  // Subjects
  SUBJECTS: {
    LIST: `${API_BASE_URL}/subjects/read.php`,
    CREATE: `${API_BASE_URL}/subjects/create.php`,
    UPDATE: `${API_BASE_URL}/subjects/update.php`,
    DELETE: `${API_BASE_URL}/subjects/delete.php`,
    BY_DEPARTMENT: `${API_BASE_URL}/subjects/readByDepartment.php`,
  },

  // Classes
  CLASSES: {
    LIST: `${API_BASE_URL}/classess/readClasses.php`,
    CREATE: `${API_BASE_URL}/classess/create_classes.php`,
    UPDATE: `${API_BASE_URL}/classess/update_classes.php`,
    DELETE: `${API_BASE_URL}/classess/delete_classes.php`,
    STUDENTS: `${API_BASE_URL}/classess/read_studentClasses.php`,
  },

  // Departments
  DEPARTMENTS: {
    LIST: `${API_BASE_URL}/departments/readDepartments.php`,
    CREATE: `${API_BASE_URL}/departments/createDepartment.php`,
    UPDATE: `${API_BASE_URL}/departments/updateDepartment.php`,
    DELETE: `${API_BASE_URL}/departments/deleteDepartment.php`,
  },

  // Course Registrations
  REGISTRATIONS: {
    LIST: `${API_BASE_URL}/student_reg/read.php`,
    CREATE: `${API_BASE_URL}/student_reg/create.php`,
    UPDATE: `${API_BASE_URL}/student_reg/update.php`,
    DELETE: `${API_BASE_URL}/student_reg/delete.php`,
  },

  // Grades
  GRADES: {
    LIST: `${API_BASE_URL}/grades/read.php`,
    CREATE: `${API_BASE_URL}/grades/create.php`,
    UPDATE: `${API_BASE_URL}/grades/update.php`,
    DELETE: `${API_BASE_URL}/grades/delete.php`,
    BY_INSTRUCTOR: `${API_BASE_URL}/grades/read_by_instructor_id.php`,
    REGISTRATIONS: `${API_BASE_URL}/grades/addgrades_reg.php`,
  },

  // Users
  USERS: {
    LIST: `${API_BASE_URL}/users/read.php`,
    CREATE: `${API_BASE_URL}/users/create.php`,
    UPDATE: `${API_BASE_URL}/users/update.php`,
    DELETE: `${API_BASE_URL}/users/delete.php`,
  },

  // Instructors
  INSTRUCTORS: {
    LIST: `${API_BASE_URL}/instructors/read.php`,
    CREATE: `${API_BASE_URL}/instructors/create.php`,
    UPDATE: `${API_BASE_URL}/instructors/update.php`,
    DELETE: `${API_BASE_URL}/instructors/delete.php`,
  },

  // Teaching Assignments
  TEACHING_ASSIGNMENTS: {
    BY_INSTRUCTOR: `${API_BASE_URL}/teaching_assignments/read_by_instructor.php`,
    BY_SUBJECT: `${API_BASE_URL}/teaching_assignments/read_by_subject.php`,
    BY_CLASS: `${API_BASE_URL}/teaching_assignments/read_by_class.php`,
  },
}; 