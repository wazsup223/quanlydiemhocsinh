import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, FormControl, InputLabel, Select,
  MenuItem, Box, Typography, CircularProgress
} from '@mui/material';
import { API_ENDPOINTS } from '../config/api';

function AddClass({ open, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    class_id: '',
    name: '',
    department_id: ''
  });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

      const response = await fetch(API_ENDPOINTS.CLASSES.CREATE, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Không thể thêm lớp mới');
      }

      const data = await response.json();
      if (data.status === 'success') {
        onAdd();
        onClose();
      } else {
        throw new Error(data.message || 'Thêm lớp thất bại');
      }
    } catch (err) {
      console.error('Lỗi khi thêm lớp:', err);
      setError(err.message || 'Không thể thêm lớp');
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
      <DialogTitle>Thêm lớp mới</DialogTitle>
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
            Thêm
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default AddClass; 