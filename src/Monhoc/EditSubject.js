import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Grid,
  TextField, Button, MenuItem, FormControl, InputLabel, Select,
  Snackbar, Alert
} from '@mui/material';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

function EditSubject({ open, onClose, subject, onUpdate }) {
  const [form, setForm] = useState({
    id: '',
    name: '',
    credits: '',
    semester: '',
    process_percentage: '',
    midterm_percentage: '',
    final_percentage: '',
    department_id: ''
  });
  const [departments, setDepartments] = useState([]);
  const [alert, setAlert] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (subject) {
      setForm(subject);
    }
  }, [subject]);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get(API_ENDPOINTS.DEPARTMENTS.READ);
        if (Array.isArray(res.data?.data)) {
          setDepartments(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
        setAlert({
          open: true,
          message: 'Không thể tải danh sách khoa',
          severity: 'error'
        });
      }
    };
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        API_ENDPOINTS.SUBJECTS.UPDATE,
        JSON.stringify(form),
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (res.data?.status === 'success') {
        setAlert({
          open: true,
          message: 'Cập nhật thành công!',
          severity: 'success'
        });
        onUpdate();
        onClose();
      } else {
        setAlert({
          open: true,
          message: `Cập nhật thất bại: ${res.data?.message || 'Lỗi không xác định'}`,
          severity: 'error'
        });
      }
    } catch (err) {
      console.error('Error updating subject:', err);
      setAlert({
        open: true,
        message: 'Lỗi khi cập nhật môn học',
        severity: 'error'
      });
    }
  };

  const handleCloseAlert = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>Chỉnh sửa môn học</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <Grid container spacing={2} sx={{ mt: 1 }}>  
            <Grid item xs={12} sm={6}>
              <TextField label="Mã môn học" name="id" value={form.id} fullWidth disabled />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Tên môn học" name="name" value={form.name} onChange={handleChange} fullWidth />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField 
                label="Số tín chỉ" 
                name="credits" 
                value={form.credits} 
                onChange={handleChange} 
                fullWidth 
                type="number"
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField 
                label="Học Kỳ" 
                name="semester" 
                value={form.semester} 
                onChange={handleChange} 
                fullWidth 
                type="number"
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField 
                label="% Quá trình" 
                name="process_percentage" 
                value={form.process_percentage} 
                onChange={handleChange} 
                fullWidth 
                type="number"
                inputProps={{ min: 0, max: 100 }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField 
                label="% Giữa kỳ" 
                name="midterm_percentage" 
                value={form.midterm_percentage} 
                onChange={handleChange} 
                fullWidth 
                type="number"
                inputProps={{ min: 0, max: 100 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField 
                label="% Cuối kỳ" 
                name="final_percentage" 
                value={form.final_percentage} 
                onChange={handleChange} 
                fullWidth 
                type="number"
                inputProps={{ min: 0, max: 100 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Khoa</InputLabel>
                <Select name="department_id" value={form.department_id} onChange={handleChange} label="Khoa">
                  {departments.map(dept => (
                    <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Hủy</Button>
          <Button variant="contained" onClick={handleSubmit}>Lưu</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleCloseAlert}>
        <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
          {alert.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default EditSubject;
