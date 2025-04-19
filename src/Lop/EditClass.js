import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, FormControl, InputLabel, Select,
  MenuItem, Box, Typography, CircularProgress
} from '@mui/material';
import { API_ENDPOINTS } from '../config/api';

function EditClass({ open, onClose, classData, onUpdate }) {
  const [formData, setFormData] = useState({
    class_id: '',
    name: '',
    department_id: ''
  });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (classData) {
      setFormData({
        class_id: classData.class_id || '',
        name: classData.name || '',
        department_id: classData.department_id || ''
      });
    }
  }, [classData]);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(API_ENDPOINTS.DEPARTMENTS.LIST, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Không thể kết nối đến máy chủ');
      }

      const data = await response.json();
      setDepartments(data.data || []);
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

      const response = await fetch(API_ENDPOINTS.CLASSES.UPDATE, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: classData.id,
          ...formData
        })
      });

      if (!response.ok) {
        throw new Error('Không thể cập nhật thông tin lớp');
      }

      const data = await response.json();
      if (data.status === 'success') {
        onUpdate();
        onClose();
      } else {
        throw new Error(data.message || 'Cập nhật thất bại');
      }
    } catch (err) {
      console.error('Lỗi khi cập nhật lớp:', err);
      setError(err.message || 'Không thể cập nhật thông tin');
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
      <DialogTitle>Cập nhật thông tin lớp</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              name="class_id"
              label="Mã lớp"
              value={formData.class_id}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              name="name"
              label="Tên lớp"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
            />
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
            Cập nhật
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default EditClass; 