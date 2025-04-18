import React, { useEffect, useState, useCallback } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import {
  Button, Typography, Box, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EditSubject from './EditSubject';

function SubjectList() {
  const [subjects, setSubjects] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const [editSubject, setEditSubject] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);

  const handleEdit = (subject) => {
    setEditSubject(subject);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setEditSubject(null);
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const deptRes = await axios.get('http://localhost/QLDiem/API/departments/readDepartments.php');
        if (Array.isArray(deptRes.data?.data)) setDepartments(deptRes.data.data);
      } catch (err) {
        console.error('Lỗi khi tải danh sách khoa:', err);
      }
    };
    fetchInitialData();
  }, []);

  const fetchSubjects = useCallback(async () => {
    try {
      setLoading(true);
      let url = 'http://localhost/QLDiem/API/subjects/read.php';

      if (selectedDepartment) {
        url = 'http://localhost/QLDiem/API/subjects/readByDepartment.php';
        const res = await axios.post(url, JSON.stringify({ department_id: selectedDepartment }), {
          headers: { 'Content-Type': 'application/json' }
        });
        setSubjects(Array.isArray(res.data.data) ? res.data.data : []);
      } else {
        const res = await axios.get(url);
        setSubjects(Array.isArray(res.data.data) ? res.data.data : []);
      }
    } catch (err) {
      console.error('Lỗi khi tải môn học:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedDepartment]);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa môn học này không?')) {
      try {
        const res = await axios.post('http://localhost/QLDiem/API/subjects/delete.php',
          JSON.stringify({ id }),
          { headers: { 'Content-Type': 'application/json' } }
        );
        if (res.data?.status === 'success') {
          alert('Xóa thành công!');
          fetchSubjects();
        } else {
          alert('Xóa thất bại: ' + res.data?.message);
        }
      } catch (err) {
        alert('Lỗi khi xóa môn học.');
      }
    }
  };

  const columns = [
    { field: 'id', headerName: 'Mã MH', width: 100 },
    { field: 'name', headerName: 'Tên môn', width: 200 },
    { field: 'semester', headerName: 'Học Kỳ', width: 100 },
    { field: 'credits', headerName: 'Số TC', width: 100 },
    { field: 'process_percentage', headerName: '% QT', width: 100 },
    { field: 'midterm_percentage', headerName: '% GK', width: 100 },
    { field: 'final_percentage', headerName: '% CK', width: 100 },
    { field: 'department_name', headerName: 'Khoa', flex :1 },
    { field: 'created_at', headerName: 'Tạo lúc', width: 160 },
    { field: 'updated_at', headerName: 'Cập nhật', width: 160 },
    {
      field: 'actions',
      headerName: 'Thao tác',
      flex :1,
      renderCell: (params) => (
        <>
           <Button size="small" startIcon={<EditIcon />} onClick={() => handleEdit(params.row)}>Sửa</Button>
          <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(params.row.id)}>Xóa</Button>
        </>
      )
    }
  ];

  return (
    <div style={{ height: 500, width: '100%' }}>
      <Typography variant="h4" gutterBottom>Danh sách môn học</Typography>

      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Khoa</InputLabel>
          <Select value={selectedDepartment} label="Khoa" onChange={(e) => setSelectedDepartment(e.target.value)}>
            <MenuItem value="">Tất cả</MenuItem>
            {departments.map((dept) => (
              <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/subjects/add')}>
          Thêm môn học
        </Button>
      </Box>

      <DataGrid
        rows={subjects}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10]}
        getRowId={(row) => row.id}
        loading={loading}
      />
      
      <EditSubject
        open={openEdit}
        onClose={handleCloseEdit}
        subject={editSubject}
        onUpdate={fetchSubjects}
      />
    </div>
  );
}

export default SubjectList;
