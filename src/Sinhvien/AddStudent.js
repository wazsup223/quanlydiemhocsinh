import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, Typography, Grid, MenuItem, Paper
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';



function AddStudent() {
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    first_name: '',
    last_name: '',
    birth_day: '',
    gender: '',
    address: '',
    email: '',
    phone: '',
    class_id: '',
    academic_year:''
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  const navigate = useNavigate();

  const fetchClasses = async () => {
    try {
      const response = await axios.get('http://localhost/QLDiem/API/classess/readClasses.php');
      setClasses(response.data.data || []);
    } catch (error) {
      console.error('Lỗi lấy danh sách lớp:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const now = new Date().toISOString();

    const fullData = {
      ...formData,
            // Bạn có thể lấy từ input nếu cần
      department_id: '1',              // Tạm để cố định, có thể fetch từ API khác nếu cần
      created_at: now,
      updated_at: now
    };

    try {
      await axios.post(
        'http://localhost/QLDiem/API/students/createStudent.php',
        JSON.stringify(fullData),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      alert('Thêm sinh viên thành công!');
      navigate('/students'); //chuyển trang sau khi thêm thành công
      setFormData({
        id: '',
        first_name: '',
        last_name: '',
        birth_day: '',
        gender: '',
        address: '',
        email: '',
        phone: '',
        class_id: '',
        academic_year:''
      });
    } catch (error) {
      console.error('Lỗi thêm sinh viên:', error);
      alert('Có lỗi xảy ra khi thêm sinh viên!');
    }
  };

  return (
    <Paper sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>Thêm sinh viên mới</Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField label="Mã sinh viên" name="id" fullWidth required value={formData.id} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Họ" name="first_name" fullWidth required value={formData.first_name} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Tên" name="last_name" fullWidth required value={formData.last_name} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Ngày sinh"
              type="date"
              name="birth_day"
              fullWidth
              required
              value={formData.birth_day}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Giới tính"
              name="gender"
              select
              fullWidth
              required
              value={formData.gender}
              onChange={handleChange}
            >
              <MenuItem value="0">Nam</MenuItem>
              <MenuItem value="1">Nữ</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Địa chỉ" name="address" fullWidth required value={formData.address} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Email" name="email" fullWidth required value={formData.email} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Số điện thoại" name="phone" fullWidth required value={formData.phone} onChange={handleChange} />
          </Grid>
          <Grid item xs={12} sm={6}>
          <TextField label="Khoá" name="academic_year" fullWidth required value={formData.academic_year} onChange={handleChange} > </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Lớp"
              name="class_id"
              select
              fullWidth
              required
              value={formData.class_id}
              onChange={handleChange}
            >
              {classes.map((cls) => (
                <MenuItem key={cls.id} value={cls.id}>{cls.name}</MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>

        <Box mt={3}>
          <Button type="submit" variant="contained" color="primary"  >
            Thêm sinh viên
           
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}

export default AddStudent;
