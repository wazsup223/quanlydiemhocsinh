// AddClass.js
import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, Typography, Grid, MenuItem, Paper
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddClass() {
  // ====================== State khởi tạo ======================
  const [departments, setDepartments] = useState([]);     // Danh sách khoa
  const [instructors, setInstructors] = useState([]);     // Danh sách giảng viên
  const [classess,setClassess]=useState([]);//danh sách lớp
  const [formData, setFormData] = useState({
    
    name: '',
    max_students: '',
    department_id: '',
    host_instructor_id: ''
  });

  const navigate = useNavigate();

  // ====================== Lấy dữ liệu từ API ======================
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptRes, instRes,clsRes] = await Promise.all([
          axios.get('http://localhost/QLDiem/API/departments/readDepartments.php'),
          axios.get('http://localhost/QLDiem/API/instructors/read.php'),
          axios.get('http://localhost/QLDiem/API/classess/readClasses.php')
        ]);
        setDepartments(deptRes.data.data || []);
        setInstructors(instRes.data.data || []);
        setClassess(clsRes.data.data|| []);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
      }
    };

    fetchData();
  }, []);

  // ====================== Xử lý thay đổi input ======================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // ====================== Xử lý submit ======================
  const handleSubmit = async (e) => {
    e.preventDefault();

    const now = new Date().toISOString();

    const fullData = {
      ...formData,
      created_at: now,
      updated_at: now
    };

    try {
      await axios.post(
        'http://localhost/QLDiem/API/classess/create_classes.php',
        JSON.stringify(fullData),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      alert('Thêm lớp học thành công!');
      navigate('/classes'); // Chuyển hướng về danh sách lớp
    } catch (error) {
      console.error('Lỗi khi thêm lớp học:', error);
      alert('Đã xảy ra lỗi khi thêm lớp học!');
    }
  };

  // ====================== Giao diện form ======================
  return (
    <Paper sx={{ p: 4, maxWidth: 700, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>Thêm lớp học mới</Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          
          <Grid item xs={12}>
            <TextField label="Tên lớp" name="name" fullWidth required value={formData.name} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField label="Sỉ số tối đa" name="max_students" fullWidth required value={formData.max_students} onChange={handleChange} />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Khoa"
              name="department_id"
              select
              fullWidth
              required
              value={formData.department_id}
              onChange={handleChange}
            >
              {departments.map((dept) => (
                <MenuItem key={dept.id} value={dept.id}>
                  {dept.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Giảng viên phụ trách"
              name="host_instructor_id"
              select
              fullWidth
              required
              value={formData.host_instructor_id}
              onChange={handleChange}
            >
              {/*classess.map((cls) => (
                <MenuItem key={cls.id} value={cls.id}>
                  {cls.host_instructor_id} - {cls.instructor_name}
                </MenuItem>
              ))*/}
              {instructors.map((ins) => (
                <MenuItem key={ins.id} value={ins.id}>
                  {ins.id} - {ins.instructor_name}
                </MenuItem>
                
              ))}
              
            </TextField>
          </Grid>
        </Grid>

        <Box mt={3}>
          <Button type="submit" variant="contained" color="primary">
            Thêm lớp học
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}

export default AddClass;
