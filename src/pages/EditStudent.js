import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
} from '@mui/material';
import axios from 'axios';

function EditStudent({ open, onClose, student, onUpdate }) {
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
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    if (student) {
      setFormData(student);
    }
    fetchClasses();
  }, [student]);

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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost/QLDiem/API/update_student.php',
        formData
      );
      if (response.data.message) {
        alert('Cập nhật học sinh thành công!');
        onUpdate();
        onClose();
      }
    } catch (error) {
      console.error('Error updating student:', error);
      alert('Có lỗi xảy ra khi cập nhật học sinh!');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Sửa thông tin học sinh</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mã học sinh"
                name="MaHocSinh"
                value={formData.MaHocSinh}
                disabled
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
                InputLabelProps={{ shrink: true }}
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
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Lưu thay đổi
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditStudent;
