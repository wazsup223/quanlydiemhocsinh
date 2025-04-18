import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Button,
  Divider
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

function ClassDetail() {
  const { id } = useParams(); // Lấy id lớp học từ URL
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Lấy danh sách sinh viên
        const studentsRes = await axios.get(`http://localhost/QLDiem/API/classess/read_studentClasses.php?id=${id}`);
        if (Array.isArray(studentsRes.data?.data)) {
          setStudents(studentsRes.data.data);
        } else {
          setStudents([]);
        }
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu:', err);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const columns = [
    { field: 'id', headerName: 'ID', width: 250 },
    { field: 'last_name', headerName: 'Họ', width: 150 },
    { field: 'first_name', headerName: 'Tên', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone', headerName: 'SĐT', width: 130 },
    { field: 'birth_day', headerName: 'Ngày sinh', width: 130 },
    {
      field: 'gender',
      headerName: 'Giới tính',
      width: 100,
      valueGetter: (params) => params.row.gender === '1' ? 'Nam' : 'Nữ'
    },
    { field: 'academic_year', headerName: 'Niên khóa', width: 130 },
    { field: 'address', headerName: 'Địa chỉ', width: 200 },
  ];

  return (
    <Box sx={{ padding: 2 }}>
      <Button variant="contained" color="primary" onClick={() => navigate(-1)} sx={{ marginBottom: 2 }}>
        Quay lại
      </Button>

      <Divider sx={{ marginBottom: 2 }} />

      {loading ? (
        <CircularProgress />
      ) : (
        <Paper elevation={3} sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Tổng số sinh viên: {students.length}
          </Typography>

          <DataGrid
            rows={students}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5, 10]}
            getRowId={(row) => row.id}
            autoHeight
          />
        </Paper>
      )}
    </Box>
  );
}

export default ClassDetail;