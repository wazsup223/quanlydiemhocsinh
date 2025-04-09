import React, { useState, useEffect, useCallback } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Typography, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import axios from 'axios';
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

  const fetchAcademicYears = async () => {
    try {
      const response = await axios.get('http://localhost/QLDiem/API/students/readStudents.php');
      if (response.data && Array.isArray(response.data.data)) {
        const years = [...new Set(response.data.data.map(student => student.academic_year))];
        setAcademicYears(years);
      }
    } catch (error) {
      console.error('Error fetching academic years:', error);
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await axios.get('http://localhost/QLDiem/API/classess/readClasses.php');
      if (response.data && Array.isArray(response.data.data)) {
        setClasses(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://localhost/QLDiem/API/departments/readDepartments.php');
      if (response.data && Array.isArray(response.data.data)) {
        setDepartments(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchStudents = useCallback(async () => {
    try {
      let url = 'http://localhost/QLDiem/API/students/readStudents.php';
      
      if (selectedAcademicYear) {
        url = `http://localhost/QLDiem/API/students/readByAcademicYear.php?academic_year=${selectedAcademicYear}`;
      } else if (selectedClass) {
        url = `http://localhost/QLDiem/API/students/readByClass.php?class_id=${selectedClass}`;
      } else if (selectedDepartment) {
        url = 'http://localhost/QLDiem/API/students/readByDepartment.php';
      }

      const response = await axios.get(url);
      
      if (response.data && Array.isArray(response.data.data)) {
        setStudents(response.data.data);
      } else {
        console.error('Unexpected API response format:', response.data);
        setStudents([]);
      }
    } catch (error) {
      console.error('Error fetching students:', error.response || error);
    } finally {
      setLoading(false);
    }
  }, [selectedAcademicYear, selectedClass, selectedDepartment]);

  useEffect(() => {
    fetchStudents();
    fetchAcademicYears();
    fetchClasses();
    fetchDepartments();
  }, [fetchStudents]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleEdit = (student) => {
    setEditStudent(student);
    setOpenEdit(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa học sinh này?")) {
      try {
        const response = await axios.post(
          "http://localhost/QLDiem/API/delete_student.php",
          { id },
          { headers: { "Content-Type": "application/json" } }
        );
  
        if (response.data.success) {
          alert("Xóa học sinh thành công!");
          fetchStudents();
        } else {
          alert("Xóa thất bại: " + response.data.error);
        }
      } catch (error) {
        console.error("Delete error:", error);
        alert("Lỗi khi xóa học sinh: " + (error.response?.data?.error || "Lỗi kết nối"));
      }
    }
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setEditStudent(null);
  };

  const handleFilterChange = (event, setter) => {
    setter(event.target.value);
  };

  const columns = [
    { field: 'id', headerName: 'Mã SV', width: 100 },
    { field: 'first_name', headerName: 'Họ', width: 150 },
    { field: 'last_name', headerName: 'Tên', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'address', headerName: 'Địa chỉ', width: 200 },
    { field: 'birth_day', headerName: 'Ngày sinh', width: 130 },
    { field: 'phone', headerName: 'SĐT', width: 130 },
    { field: 'gender', headerName: 'Giới tính', width: 100,
      valueGetter: (params) => (params.row.gender === 0 ? 'Nam' : 'Nữ')
    },
    { field: 'academic_year', headerName: 'Khoá', width: 100 },
    { field: 'class_id', headerName: 'Lớp', width: 100 },
    { field: 'department_id', headerName: 'Khoa', width: 100 },
    {
      field: 'actions',
      headerName: 'Thao tác',
      width: 200,
      renderCell: (params) => (
        <>
          <Button
            size="small"
            startIcon={<EditIcon />}
            onClick={() => handleEdit(params.row)}
          >
            Sửa
          </Button>
          <Button
            size="small"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => handleDelete(params.row.id)}
          >
            Xóa
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ height: 500, width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        Danh sách sinh viên
      </Typography>
      
      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Năm học</InputLabel>
          <Select
            value={selectedAcademicYear}
            label="Năm học"
            onChange={(e) => handleFilterChange(e, setSelectedAcademicYear)}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {academicYears.map((year) => (
              <MenuItem key={year} value={year}>{year}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Lớp</InputLabel>
          <Select
            value={selectedClass}
            label="Lớp"
            onChange={(e) => handleFilterChange(e, setSelectedClass)}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {classes.map((classItem) => (
              <MenuItem key={classItem.id} value={classItem.id}>{classItem.class_name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Khoa</InputLabel>
          <Select
            value={selectedDepartment}
            label="Khoa"
            onChange={(e) => handleFilterChange(e, setSelectedDepartment)}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {departments.map((dept) => (
              <MenuItem key={dept.id} value={dept.id}>{dept.department_name}</MenuItem>
            ))}
          </Select>
        </FormControl>
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
