import React, { useState, useEffect } from 'react';
import {
  Box, TextField, Button, Typography, Grid, Paper,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddInstructor() {
  const [instructorData, setInstructorData] = useState({
    id:'',
    first_name: '',
    last_name: '',
    email: '',
    address: '',
    birth_day: '',
    phone: '',
    gender: '',
    degree: '',
    department_id: ''
  });

  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get('http://localhost/QLDiem/API/departments/readDepartments.php');
      if (res.data.status === 'success') {
        setDepartments(res.data.data);
      }
    } catch (err) {
      console.error('Lỗi khi lấy danh sách khoa:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInstructorData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        'http://localhost/QLDiem/API/instructors/create.php',
        JSON.stringify(instructorData),
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (res.data.status === 'success') {
        alert('Thêm giảng viên thành công!');
        navigate('/instructors');
      } else {
        alert('Thêm thất bại: ' + (res.data.message || 'Lỗi không xác định'));
      }
    } catch (err) {
      console.error('Lỗi khi tạo giảng viên:', err);
      alert('Đã xảy ra lỗi khi tạo giảng viên.');
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Thêm giảng viên mới
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
          
            {/* id */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth label="ID" name="id"
                value={instructorData.id}
                onChange={handleChange} required
              />
            </Grid>
            {/* Họ */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth label="Họ" name="first_name"
                value={instructorData.first_name}
                onChange={handleChange} required
              />
            </Grid>

            {/* Tên */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth label="Tên" name="last_name"
                value={instructorData.last_name}
                onChange={handleChange} required
              />
            </Grid>

            {/* Email */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth label="Email" name="email" type="email"
                value={instructorData.email}
                onChange={handleChange} required
              />
            </Grid>

            {/* Số điện thoại */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth label="Số điện thoại" name="phone"
                value={instructorData.phone}
                onChange={handleChange}
              />
            </Grid>

            {/* Ngày sinh */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth label="Ngày sinh" name="birth_day" type="date"
                value={instructorData.birth_day}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            {/* Giới tính */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Giới tính</InputLabel>
                <Select
                  name="gender"
                  value={instructorData.gender}
                  onChange={handleChange}
                  label="Giới tính"
                >
                  <MenuItem value="0">Nam</MenuItem>
                  <MenuItem value="1">Nữ</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Địa chỉ */}
            <Grid item xs={12}>
              <TextField
                fullWidth label="Địa chỉ" name="address"
                value={instructorData.address}
                onChange={handleChange}
              />
            </Grid>

            {/* Học vị */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth label="Học vị" name="degree"
                value={instructorData.degree}
                onChange={handleChange}
              />
            </Grid>

            {/* Khoa */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Khoa</InputLabel>
                <Select
                  name="department_id"
                  value={instructorData.department_id}
                  onChange={handleChange}
                  label="Khoa"
                >
                  {departments.map((dep) => (
                    <MenuItem key={dep.id} value={dep.id}>
                      {dep.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Buttons */}
            <Grid item xs={12} sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button variant="outlined" onClick={() => navigate('/instructors')}>
                Hủy
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Thêm
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}

export default AddInstructor;
