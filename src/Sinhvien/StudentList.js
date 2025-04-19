import React, { useState, useEffect } from 'react';
import {
  Box, Button, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem, CircularProgress
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';

function StudentList() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editStudent, setEditStudent] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [academicYears, setAcademicYears] = useState([]);
  const [classes, setClasses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [studentsRes, classesRes, departmentsRes] = await Promise.all([
        fetch(API_ENDPOINTS.STUDENTS.LIST, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }),
        fetch(API_ENDPOINTS.CLASSES.LIST, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }),
        fetch(API_ENDPOINTS.DEPARTMENTS.LIST, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
      ]);

      if (!studentsRes.ok || !classesRes.ok || !departmentsRes.ok) {
        throw new Error('Không thể kết nối đến máy chủ');
      }

      const studentsData = await studentsRes.json();
      const classesData = await classesRes.json();
      const departmentsData = await departmentsRes.json();

      setStudents(studentsData.data || []);
      setClasses(classesData.data || []);
      setDepartments(departmentsData.data || []);

      // Extract unique academic years
      const years = [...new Set(studentsData.data?.map(student => student.academic_year) || [])];
      setAcademicYears(years);
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu ban đầu:', err);
      setError(err.message || 'Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    try {
      setLoading(true);
      setError(null);

      let url = API_ENDPOINTS.STUDENTS.LIST;
      if (selectedAcademicYear) {
        url = `${API_ENDPOINTS.STUDENTS.READ_BY_ACADEMIC_YEAR}?academic_year=${selectedAcademicYear}`;
      } else if (selectedClass) {
        url = `${API_ENDPOINTS.STUDENTS.READ_BY_CLASS}?class_id=${selectedClass}`;
      } else if (selectedDepartment) {
        url = `${API_ENDPOINTS.STUDENTS.READ_BY_DEPARTMENT}?department_id=${selectedDepartment}`;
      }

      const response = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Không thể kết nối đến máy chủ');
      }

      const data = await response.json();
      setStudents(data.data || []);
    } catch (err) {
      console.error('Lỗi khi lấy danh sách sinh viên:', err);
      setError(err.message || 'Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sinh viên này?')) {
      try {
        const response = await fetch(API_ENDPOINTS.STUDENTS.DELETE, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id })
        });

        if (!response.ok) {
          throw new Error('Không thể xóa sinh viên');
        }

        setStudents(students.filter(student => student.id !== id));
      } catch (err) {
        console.error('Lỗi khi xóa sinh viên:', err);
        setError(err.message || 'Không thể xóa sinh viên');
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Niên khóa</InputLabel>
          <Select
            value={selectedAcademicYear}
            onChange={(e) => setSelectedAcademicYear(e.target.value)}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {academicYears.map(year => (
              <MenuItem key={year} value={year}>{year}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Lớp</InputLabel>
          <Select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {classes.map(cls => (
              <MenuItem key={cls.id} value={cls.id}>{cls.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Khoa</InputLabel>
          <Select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {departments.map(dept => (
              <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant="contained" onClick={handleFilter}>
          Lọc
        </Button>
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/students/add')}
        sx={{ mb: 2 }}
      >
        Thêm sinh viên
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã sinh viên</TableCell>
              <TableCell>Họ tên</TableCell>
              <TableCell>Lớp</TableCell>
              <TableCell>Khoa</TableCell>
              <TableCell>Niên khóa</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.student_id}</TableCell>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.class_name}</TableCell>
                <TableCell>{student.department_name}</TableCell>
                <TableCell>{student.academic_year}</TableCell>
                <TableCell>
                  <IconButton onClick={() => navigate(`/students/edit/${student.id}`)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(student.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default StudentList;
