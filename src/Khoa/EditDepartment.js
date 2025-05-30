import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Box, Typography, CircularProgress
} from '@mui/material';
import { API_ENDPOINTS } from '../config/api';

function EditDepartment({ open, onClose, department, onUpdate }) {
  const [formData, setFormData] = useState({
    department_id: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (department) {
      setFormData({
        department_id: department.department_id || '',
        name: department.name || ''
      });
    }
  }, [department]);

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

      const response = await fetch(API_ENDPOINTS.DEPARTMENTS.UPDATE, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: department.id,
          ...formData
        })
      });

      if (!response.ok) {
        throw new Error('Không thể cập nhật thông tin khoa');
      }

      const data = await response.json();
      if (data.status === 'success') {
        onUpdate();
        onClose();
      } else {
        throw new Error(data.message || 'Cập nhật thất bại');
      }
    } catch (err) {
      console.error('Lỗi khi cập nhật khoa:', err);
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
      <DialogTitle>Cập nhật thông tin khoa</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              name="department_id"
              label="Mã khoa"
              value={formData.department_id}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              name="name"
              label="Tên khoa"
              value={formData.name}
              onChange={handleChange}
              required
              fullWidth
            />
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

export default EditDepartment;
