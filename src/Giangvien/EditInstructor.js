import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, FormControl, InputLabel, Select, MenuItem,
  CircularProgress
} from '@mui/material';
import axios from 'axios';

function EditInstructor({ open, onClose, instructorData, onUpdate }) {
  const [formData, setFormData] = useState({
    id: '',
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
  const [loading, setLoading] = useState(false);

  // Gán dữ liệu khi mở dialog
  useEffect(() => {
    if (instructorData && open) {
      setFormData({
        id: instructorData.id,
        first_name: instructorData.first_name,
        last_name: instructorData.last_name,
        email: instructorData.email,
        address: instructorData.address,
        birth_day: instructorData.birth_day,
        phone: instructorData.phone,
        gender: instructorData.gender,
        degree: instructorData.degree,
        department_id: instructorData.department_id
      });
    }
  }, [instructorData, open]);

  // Lấy danh sách khoa
  useEffect(() => {
    if (open) {
      fetchDepartments();
    }
  }, [open]);

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

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Gửi cập nhật
  const handleSubmit = async () => {
    // Kiểm tra dữ liệu trước khi gửi
    if (!formData.first_name || !formData.last_name || !formData.email) {
      alert('Vui lòng nhập đầy đủ họ, tên và email.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.put(
        'http://localhost/QLDiem/API/instructors/update.php',
        
        JSON.stringify({ ...formData }),
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (res.data.status === 'success') {
        alert('Cập nhật giảng viên thành công!');
        onUpdate();  // callback reload danh sách
        onClose();   // đóng dialog
      } else {
        alert('Cập nhật thất bại: ' + (res.data.message || 'Lỗi không xác định'));
      }
    } catch (err) {
      console.error('Lỗi khi cập nhật giảng viên:', err);
      alert('Đã xảy ra lỗi khi cập nhật.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Chỉnh sửa thông tin giảng viên</DialogTitle>
      <DialogContent dividers>
        <TextField label="Họ" name="first_name" value={formData.first_name} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Tên" name="last_name" value={formData.last_name} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Email" name="email" value={formData.email} onChange={handleChange} fullWidth margin="normal" />
        <TextField label="Địa chỉ" name="address" value={formData.address} onChange={handleChange} fullWidth margin="normal" />
        <TextField
          label="Ngày sinh"
          name="birth_day"
          type="date"
          value={formData.birth_day}
          onChange={handleChange}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
        <TextField label="Số điện thoại" name="phone" value={formData.phone} onChange={handleChange} fullWidth margin="normal" />

        <FormControl fullWidth margin="normal">
          <InputLabel>Giới tính</InputLabel>
          <Select name="gender" value={formData.gender} onChange={handleChange} label="Giới tính">
            <MenuItem value="0">Nam</MenuItem>
            <MenuItem value="1">Nữ</MenuItem>
           
          </Select>
        </FormControl>

        <TextField label="Học vị" name="degree" value={formData.degree} onChange={handleChange} fullWidth margin="normal" />

        <FormControl fullWidth margin="normal">
          <InputLabel>Khoa</InputLabel>
          <Select name="department_id" value={formData.department_id} onChange={handleChange} label="Khoa">
            {departments.map((dep) => (
              <MenuItem key={dep.id} value={dep.id}>
                {dep.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary">Hủy</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Cập nhật'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditInstructor;
