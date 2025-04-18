import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, CircularProgress
} from '@mui/material';
import axios from 'axios';

function EditDepartment({ open, onClose, departmentData, onUpdate }) {
  const [formData, setFormData] = useState({
    id: '',
    symbol: '',
    department_name: '',
    created_at: '',
    updated_at: ''
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (departmentData && open) {
      setFormData({
        id: departmentData.id,
        symbol: departmentData.symbol,
        department_name: departmentData.name,
        created_at: departmentData.created_at,
        updated_at: departmentData.updated_at
      });
    }
  }, [departmentData, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    const updatedData = {
      ...formData,
      name: formData.department_name,
      updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };

    try {
      const res = await axios.put(
        'http://localhost/QLDiem/API/departments/update_departments.php',
        JSON.stringify(updatedData),
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (res.data.status === 'success') {
        alert('Cập nhật khoa thành công!');
        onUpdate();
        onClose();
      } else {
        alert('Cập nhật thất bại: ' + (res.data.message || 'Lỗi không xác định'));
      }
    } catch (err) {
      console.error('Lỗi khi cập nhật khoa:', err);
      alert('Đã xảy ra lỗi khi cập nhật.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Chỉnh sửa thông tin khoa</DialogTitle>
      <DialogContent dividers>
        <TextField
          label="ID"
          name="id"
          value={formData.id}
          fullWidth
          margin="normal"
          disabled
        />
        <TextField
          label="Ký hiệu"
          name="symbol"
          value={formData.symbol}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Tên khoa"
          name="department_name"
          value={formData.department_name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Hủy</Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          variant="contained"
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Cập nhật'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditDepartment;
