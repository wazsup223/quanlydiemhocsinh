import React, { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, Button, TextField, FormControl,
  InputLabel, Select, MenuItem
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import EditGrade from './EditGrade'; // Dialog chỉnh sửa điểm

function GradeList() {
  // ============================
  // Khai báo state
  // ============================
  const [grades, setGrades] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [instructors, setInstructors] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState('');
  const [loading, setLoading] = useState(false);
  const [editGrade, setEditGrade] = useState(null);

  const navigate = useNavigate();

  // ============================
  // API Calls (Lấy dữ liệu)
  // ============================
  
  // Lấy danh sách giảng viên
  const fetchInstructors = async () => {
    try {
      const res = await axios.get('http://localhost/QLDiem/API/instructors/read.php');
      if (res.data.status === 'success') {
        setInstructors(res.data.data);
      }
    } catch (err) {
      console.error('Lỗi tải giảng viên:', err);
    }
  };

  // Lấy danh sách điểm của sinh viên, có thể lọc theo giảng viên
  const fetchGrades = useCallback(async () => {
    setLoading(true);
    try {
      const url = selectedInstructor
        ? `http://localhost/QLDiem/API/grades/read_by_instructor_id.php?instructor_id=${selectedInstructor}`
        : 'http://localhost/QLDiem/API/grades/read.php';

      const res = await axios.get(url);
      if (res.data.status === 'success') {
        const dataWithAverage = res.data.data.map((grade) => ({
          ...grade,
          avage_score: (
            (parseFloat(grade.process_score || 0) +
             parseFloat(grade.midterm_score || 0) +
             parseFloat(grade.final_score || 0)) / 3
          ).toFixed(2), // Làm tròn đến 2 chữ số
        }));
        setGrades(dataWithAverage);
      }
    } catch (err) {
      console.error('Lỗi tải điểm:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedInstructor]);

  // ============================
  // Hooks: Lấy dữ liệu khi component được render lần đầu
  // ============================
  useEffect(() => {
    fetchInstructors();  // Lấy danh sách giảng viên
    fetchGrades();       // Lấy danh sách điểm
  }, [fetchGrades]);

  // ============================
  // Các hàm xử lý CRUD
  // ============================
  
  // Xóa điểm
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa ĐIỂMM này?')) {
      try {
        const response = await axios.delete('http://localhost/QLDiem/API/grades/delete.php', {
          headers: { 'Content-Type': 'application/json' },
          data: JSON.stringify({ id }),
        });
        if (response.data.status === 'success') {
          alert(response.data.message || 'Xóa thành công!');
          fetchGrades(); // Cập nhật lại danh sách điểm sau khi xóa
        } else {
          alert('Xóa thất bại: ' + (response.data.message || 'ràng buộc '));
        }
      } catch (error) {
        console.error('Lỗi khi xóa:', error);
      }
    }
  };

  // Chỉnh sửa điểm (mở dialog)
  const handleEdit = (rowData) => {
    setEditGrade(rowData);
  };

  // Cập nhật lại danh sách điểm sau khi chỉnh sửa
  const handleUpdate = () => {
    fetchGrades();  // Lấy lại danh sách điểm mới
    setEditGrade(null);  // Đóng dialog
  };

  // ============================
  // Lọc danh sách điểm theo từ khóa tìm kiếm
  // ============================
  const filteredGrades = grades.filter((grade) =>
    Object.values(grade).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // ============================
  // Cấu hình các cột trong DataGrid
  // ============================
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'student_id', headerName: 'MSSV', width: 180 },
    { field: 'full_name', headerName: 'Sinh viên', width: 180 },
    { field: 'subject_name', headerName: 'Môn học', width: 180 },
    { field: 'process_score', headerName: 'Điểm QT', width: 100 },
    { field: 'midterm_score', headerName: 'Giữa kỳ', width: 100 },
    { field: 'final_score', headerName: 'Cuối kỳ', width: 100 },
    { field: 'avage_score', headerName: 'Điểm Trung bình', width: 150},
    { field: 'instructor_name', headerName: 'Giảng viên', width: 180 },
    {
      field: 'actions',
      headerName: 'Thao tác',
      width: 150,
      renderCell: (params) => (
        <>
          <Button
            size="small"
            onClick={() => handleEdit(params.row)}  // Xử lý chỉnh sửa
            startIcon={<EditIcon />}
          >
            Sửa
          </Button>
          <Button
            size="small"
            color="error"
            onClick={() => handleDelete(params.row.id)}  // Xử lý xóa
            startIcon={<DeleteIcon />}
          >
            Xóa
          </Button>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        Danh sách điểm
      </Typography>

      {/* Các điều khiển tìm kiếm và lọc */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Tìm kiếm"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flex: 1 }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Giảng viên</InputLabel>
          <Select
            value={selectedInstructor}
            onChange={(e) => setSelectedInstructor(e.target.value)}  // Lọc theo giảng viên
            label="Giảng viên"
          >
            <MenuItem value="">Tất cả</MenuItem>
            {instructors.map((instructor) => (
              <MenuItem key={instructor.id} value={instructor.id}>
                {instructor.first_name} {instructor.last_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" onClick={() => navigate('/grades/add')}>Thêm điểm</Button>
      </Box>

      {/* DataGrid hiển thị danh sách điểm đã lọc */}
      <DataGrid
        rows={filteredGrades}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10]}
        loading={loading}
        getRowId={(row) => row.id}
      />

      {/* Dialog chỉnh sửa điểm */}
      {editGrade && (
        <EditGrade
          open={!!editGrade}
          gradeData={editGrade}
          onClose={() => setEditGrade(null)}
          onUpdate={handleUpdate}
        />
      )}
    </Box>
  );
}

export default GradeList;
