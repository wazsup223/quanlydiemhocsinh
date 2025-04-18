import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  IconButton,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

function TeachingAssignmentList() {
  // --- 1. State ---
  const [assignments, setAssignments] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [subject, setSubject] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // --- 2. Fetch dữ liệu ---
  const fetchAssignments = async () => {
    try {
      const res = await axios.get('http://localhost/QLDiem/API/instructor_assignments/read.php');
      const records = res.data?.data?.records || [];
      setAssignments(records);
    } catch (error) {
      console.error('Lỗi khi tải danh sách phân công:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInstructors = async () => {
    try {
      const res = await axios.get('http://localhost/QLDiem/API/instructors/read.php');
      setInstructors(res.data?.data || []);
    } catch (error) {
      console.error('Lỗi khi tải danh sách giảng viên:', error);
    }
  };

  const fetchSubject = async () => {
    try {
      const res = await axios.get('http://localhost/QLDiem/API/subjects/read.php');
      setSubject(res.data?.data || []);
    } catch (error) {
      console.error('Lỗi khi tải danh sách môn học:', error);
    }
  };

  useEffect(() => {
    fetchAssignments();
    fetchInstructors();
    fetchSubject();
  }, []);

  // --- 3. Lọc ---
  const filteredAssignments = assignments.filter((a) => {
    const matchInstructor = selectedInstructor ? a.instructor_id === selectedInstructor : true;
    const matchSubject = selectedSubject ? a.subject_id === selectedSubject : true;
    return matchInstructor && matchSubject;
  });

  // --- 4. Hành động ---
  const handleDelete = async (row) => {
    if (window.confirm(`Xoá phân công ${row.subject_name} - ${row.instructor_name}?`)) {
      try {
        await axios.post('http://localhost/QLDiem/API/instructor_assignments/delete.php', {
          subject_id: row.subject_id,
          instructor_id: row.instructor_id,
        });
        fetchAssignments();
        alert('Xoá phân công thành công.');
      } catch (err) {
        console.error('Lỗi khi xoá:', err);
      }
    }
  };

  const handleAdd = () => {
    navigate('/teaching-assignments/add');
  };

  // --- 5. Cột của DataGrid ---
  const columns = [
    { field: 'subject_id', headerName: 'Mã môn học', width: 130 },
    { field: 'subject_name', headerName: 'Tên môn học', width: 200 },
    { field: 'inroses', headerName: 'Mã giảng viên', width: 130 },
    { field: 'instructor_name', headerName: 'Tên giảng viên', width: 200 },
    { field: 'created_at', headerName: 'Ngày tạo', width: 160 },
    { field: 'updated_at', headerName: 'Ngày cập nhật', width: 160 },
    {
      field: 'actions',
      headerName: 'Hành động',
      width: 130,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleDelete(params.row)} color="error">
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  // --- 6. Giao diện ---
  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        Danh sách phân công giảng dạy
      </Typography>

      {/* Bộ lọc */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <FormControl sx={{ minWidth: 240 }}>
          <InputLabel>Giảng viên</InputLabel>
          <Select
            value={selectedInstructor}
            onChange={(e) => setSelectedInstructor(e.target.value)}
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

        <FormControl sx={{ minWidth: 240 }}>
          <InputLabel>Môn học</InputLabel>
          <Select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            label="Môn học"
          >
            <MenuItem value="">Tất cả</MenuItem>
            {subject.map((subj) => (
              <MenuItem key={subj.id} value={subj.id}>
                {subj.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{ height: 56 }}
        >
          Thêm phân công
        </Button>
      </Box>

      {/* Bảng */}
      <DataGrid
        rows={filteredAssignments}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10]}
        loading={loading}
        getRowId={(row) => `${row.subject_id}_${row.instructor_id}`}
      />
    </Box>
  );
}

export default TeachingAssignmentList;