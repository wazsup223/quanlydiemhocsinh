import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,Grid,
  TextField, Button, MenuItem, FormControl, InputLabel, Select
} from '@mui/material';
import axios from 'axios';

function EditSubject({ open, onClose, subject, onUpdate }) {
  const [form, setForm] = useState({
    id: '',
    name: '',
    credits: '',
    semester:'',
    process_percentage: '',
    midterm_percentage: '',
    final_percentage: '',
    department_id: ''
  });
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    if (subject) {
      setForm(subject);
    }
  }, [subject]);

  useEffect(() => {
    axios.get('http://localhost/QLDiem/API/departments/readDepartments.php')
      .then(res => {
        if (Array.isArray(res.data?.data)) {
          setDepartments(res.data.data);
        }
      });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        'http://localhost/QLDiem/API/subjects/update.php',
        JSON.stringify(form),
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (res.data?.status === 'success') {
        alert('Cập nhật thành công!');
        onUpdate();
        onClose();
      } else {
        alert('Cập nhật thất bại: ' + res.data?.message);
      }
    } catch (err) {
      console.error(err);
      alert('Lỗi khi cập nhật.');
    }
  };

  return (
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
            <TextField label="Số tín chỉ" name="credits" value={form.credits} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="Học Kỳ" name="semester" value={form.semester} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="% Quá trình" name="process_percentage" value={form.process_percentage} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField label="% Giữa kỳ" name="midterm_percentage" value={form.midterm_percentage} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="% Cuối kỳ" name="final_percentage" value={form.final_percentage} onChange={handleChange} fullWidth />
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
  );
  
}

export default EditSubject;
