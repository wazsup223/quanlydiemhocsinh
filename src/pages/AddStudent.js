import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  MenuItem,
  Paper,
} from '@mui/material';
import axios from 'axios';

function AddStudent() {
  const [classes, setClasses] = useState([]);
  const [formData, setFormData] = useState({
    MaHocSinh: '',
    HoTen: '',
    NgaySinh: '',
    GioiTinh: '',
    DiaChi: '',
    Email: '',
    SoDienThoai: '',
    MaLop: '',
  });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('http://localhost/QLDiem/API/get_classes.php');
      setClasses(response.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost/QLDiem/API/post_student.php', formData);
      alert('Thêm học sinh thành công!');
      setFormData({
        MaHocSinh: '',
        HoTen: '',
        NgaySinh: '',
        GioiTinh: '',
        DiaChi: '',
        Email: '',
        SoDienThoai: '',
        MaLop: '',
      });
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Có lỗi xảy ra khi thêm học sinh!');
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Thêm học sinh mới
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Mã học sinh"
              name="MaHocSinh"
              value={formData.MaHocSinh}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Họ tên"
              name="HoTen"
              value={formData.HoTen}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Ngày sinh"
              name="NgaySinh"
              type="date"
              value={formData.NgaySinh}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              select
              label="Giới tính"
              name="GioiTinh"
              value={formData.GioiTinh}
              onChange={handleChange}
            >
              <MenuItem value="Nam">Nam</MenuItem>
              <MenuItem value="Nữ">Nữ</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Địa chỉ"
              name="DiaChi"
              value={formData.DiaChi}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Email"
              name="Email"
              type="email"
              value={formData.Email}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              label="Số điện thoại"
              name="SoDienThoai"
              value={formData.SoDienThoai}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              select
              label="Lớp"
              name="MaLop"
              value={formData.MaLop}
              onChange={handleChange}
            >
              {classes.map((cls) => (
                <MenuItem key={cls.MaLop} value={cls.MaLop}>
                  {cls.TenLop}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
            >
              Thêm học sinh
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}

export default AddStudent; 