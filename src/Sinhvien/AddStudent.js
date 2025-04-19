import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, FormControl, InputLabel, Select,
  MenuItem, Box, Typography, CircularProgress
} from '@mui/material';
import { API_ENDPOINTS } from '../config/api';

function AddStudent({ open, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    student_id: '',
    first_name: '',
    last_name: '',
    email: '',
    address: '',
    birth_day: '',
    phone: '',
    gender: '0',
    academic_year: '',
    class_id: '',
    department_id: ''
  });
  const [classes, setClasses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDropdownData();
  }, []);

  const fetchDropdownData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [classesRes, departmentsRes] = await Promise.all([
        fetch(API_ENDPOINTS.CLASSES.LIST, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }),
        fetch(API_ENDPOINTS.DEPARTMENTS.LIST, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
      ]);

      if (!classesRes.ok || !departmentsRes.ok) {
        throw new Error('Không thể kết nối đến máy chủ');
      }

      const classesData = await classesRes.json();
      const departmentsData = await departmentsRes.json();

      setClasses(classesData.data || []);
      setDepartments(departmentsData.data || []);
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu:', err);
      setError(err.message || 'Không thể tải dữ liệu');
    } finally {
      setLoading(false);
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
      setLoading(true);
      setError(null);

      const response = await fetch(API_ENDPOINTS.STUDENTS.CREATE, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Không thể thêm sinh viên mới');
      }

      const data = await response.json();
      if (data.status === 'success') {
        onAdd();
        onClose();
      } else {
        throw new Error(data.message || 'Thêm sinh viên thất bại');
      }
    } catch (err) {
      console.error('Lỗi khi thêm sinh viên:', err);
      setError(err.message || 'Không thể thêm sinh viên');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Thêm sinh viên mới</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              name="student_id"
              label="Mã sinh viên"
              value={formData.student_id}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              name="first_name"
              label="Họ"
              value={formData.first_name}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              name="last_name"
              label="Tên"
              value={formData.last_name}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              name="address"
              label="Địa chỉ"
              value={formData.address}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              name="birth_day"
              label="Ngày sinh"
              type="date"
              value={formData.birth_day}
              onChange={handleChange}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              name="phone"
              label="Số điện thoại"
              value={formData.phone}
              onChange={handleChange}
              required
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Giới tính</InputLabel>
              <Select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <MenuItem value="0">Nam</MenuItem>
                <MenuItem value="1">Nữ</MenuItem>
              </Select>
            </FormControl>
            <TextField
              name="academic_year"
              label="Niên khóa"
              value={formData.academic_year}
              onChange={handleChange}
              required
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Lớp</InputLabel>
              <Select
                name="class_id"
                value={formData.class_id}
                onChange={handleChange}
                required
              >
                {classes.map(cls => (
                  <MenuItem key={cls.id} value={cls.id}>{cls.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Khoa</InputLabel>
              <Select
                name="department_id"
                value={formData.department_id}
                onChange={handleChange}
                required
              >
                {departments.map(dept => (
                  <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Hủy</Button>
          <Button type="submit" variant="contained" color="primary">
            Thêm
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default AddStudent;
