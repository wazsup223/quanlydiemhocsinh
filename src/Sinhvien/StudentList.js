import React, { useState, useEffect, useCallback } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  Button, Typography, FormControl, InputLabel, Select, MenuItem, Box, 
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon, Clear as ClearIcon } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import EditStudent from './EditStudent';

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
 

  const navigate = useNavigate();

  // Fetch dropdown data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [studentRes, classRes, deptRes] = await Promise.all([
          axios.get('http://localhost/QLDiem/API/students/readStudents.php'),
          axios.get('http://localhost/QLDiem/API/classess/readClasses.php'),
          axios.get('http://localhost/QLDiem/API/departments/readDepartments.php'),
        ]);

        if (Array.isArray(studentRes.data?.data)) {
          const years = [...new Set(studentRes.data.data.map(s => s.academic_year))];
          setAcademicYears(years);
        }

        if (Array.isArray(classRes.data?.data)) setClasses(classRes.data.data);
        if (Array.isArray(deptRes.data?.data)) setDepartments(deptRes.data.data);

      } catch (err) {
        console.error('Lỗi khi tải dữ liệu ban đầu:', err);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch students list
  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);

    

      let url = 'http://localhost/QLDiem/API/students/readStudents.php';
      let config = {};

      if (selectedAcademicYear) {
        url = `http://localhost/QLDiem/API/students/readByAcademicYear.php?academic_year=${selectedAcademicYear}`;
      } else if (selectedClass) {
        url = `http://localhost/QLDiem/API/students/readByClass.php?class_id=${selectedClass}`;
      } else if (selectedDepartment) {
        url = `http://localhost/QLDiem/API/students/readByDepartment.php`;
        config = {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          data: JSON.stringify({ department_id: selectedDepartment }),
        };
        const response = await axios(url, config);
        setStudents(Array.isArray(response.data.data) ? response.data.data : []);
        return;
      }

      const response = await axios.get(url);
      setStudents(Array.isArray(response.data.data) ? response.data.data : []);
    } catch (err) {
      console.error('Lỗi khi lấy danh sách sinh viên:', err);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, [selectedAcademicYear, selectedClass, selectedDepartment]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleEdit = (student) => {
    setEditStudent(student);
    setOpenEdit(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sinh viên này không?')) {
      try {
        const response = await axios.post(
          'http://localhost/QLDiem/API/students/deleteStudent.php',
          JSON.stringify({ id }),
          { headers: { 'Content-Type': 'application/json' } }
        );
  
        // Kiểm tra theo chuẩn response mà bạn gửi từ PHP
        if (response.data?.status === 'success') {
          alert(' Xóa sinh viên thành công!');
          fetchStudents(); // Cập nhật lại danh sách
        } else {
          alert(' Xóa thất bại: ' + (response.data?.message || 'Không rõ nguyên nhân'));
        }
      } catch (error) {
        console.error('Lỗi khi xóa sinh viên:', error);
        alert(' Đã xảy ra lỗi khi gửi yêu cầu xóa.');
      }
    }
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setEditStudent(null);
  };

  const handleClearFilters = () => {
    setSelectedAcademicYear('');
    setSelectedClass('');
    setSelectedDepartment('');
   
  };

  const columns = [
    { field: 'id', headerName: 'Mã SV', width: 120 },
    { field: 'first_name', headerName: 'Họ', width: 150 },
    { field: 'last_name', headerName: 'Tên', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'address', headerName: 'Địa chỉ', width: 200 },
    { field: 'birth_day', headerName: 'Ngày sinh', width: 130 },
    { field: 'phone', headerName: 'SĐT', width: 130 },
    {
      field: 'gender', headerName: 'Giới tính', width: 100,
      valueGetter: (params) => (params.row.gender === '0' ? 'Nam' : 'Nữ')
    },
    { field: 'academic_year', headerName: 'Khóa', width: 100 },
    { field: 'class_name', headerName: 'Lớp', width: 100 },
    { field: 'department_name', headerName: 'Khoa', width: 150 },
    {
      field: 'actions',
      headerName: 'Thao tác',
      width: 200,
      renderCell: (params) => (
        <>
          <Button size="small" startIcon={<EditIcon />} onClick={() => handleEdit(params.row)}>Sửa</Button>
          <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(params.row.id)}>Xóa</Button>
        </>
      )
    },
  ];

  return (
    <div style={{ height: 500, width: '100%' }}>
      <Typography variant="h4" gutterBottom>Danh sách sinh viên</Typography>

      <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Năm học</InputLabel>
          <Select value={selectedAcademicYear} label="Năm học" onChange={(e) => setSelectedAcademicYear(e.target.value)}>
            <MenuItem value="">Tất cả</MenuItem>
            {academicYears.map((year) => (
              <MenuItem key={year} value={year}>{year}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Lớp</InputLabel>
          <Select value={selectedClass} label="Lớp" onChange={(e) => setSelectedClass(e.target.value)}>
            <MenuItem value="">Tất cả</MenuItem>
            {classes.map((cls) => (
              <MenuItem key={cls.id} value={cls.id}>{cls.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Khoa</InputLabel>
          <Select value={selectedDepartment} label="Khoa" onChange={(e) => setSelectedDepartment(e.target.value)}>
            <MenuItem value="">Tất cả</MenuItem>
            {departments.map((dept) => (
              <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="outlined"
          startIcon={<ClearIcon />}
          onClick={handleClearFilters}
        >
          Xóa bộ lọc
        </Button>
      </Box>

      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/students/add')}
        >
          Thêm sinh viên
        </Button>
      </Box>

      <DataGrid
        rows={students}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10]}
        loading={loading}
        getRowId={(row) => row.id}
        disableSelectionOnClick
      />

      <EditStudent
        open={openEdit}
        onClose={handleCloseEdit}
        student={editStudent}
        onUpdate={fetchStudents}
      />
    </div>
  );
}

export default StudentList;
