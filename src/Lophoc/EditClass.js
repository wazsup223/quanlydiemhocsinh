import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, FormControl, InputLabel, Select, MenuItem, CircularProgress
} from '@mui/material';
import axios from 'axios';

function EditClass({ open, onClose, classData, onUpdate }) {
  // ==============================
  // I. State
  // ==============================
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    max_students: '',
    department_id: '',
    host_instructor_id: '',
    created_at: '',
    updated_at: ''
  });

  const [departments, setDepartments] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(false);

  // ==============================
  // II. Effect: Lấy dữ liệu ban đầu và cập nhật formData từ props
  // ==============================
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [deptRes, instructorRes] = await Promise.all([
          axios.get('http://localhost/QLDiem/API/departments/readDepartments.php'),
          axios.get('http://localhost/QLDiem/API/instructors/read.php')
        ]);

        setDepartments(deptRes.data?.data || []);
        setInstructors(instructorRes.data?.data || []);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
      }
    };

    if (classData) {
      setFormData({
        id: classData.id,
        name: classData.name,
        max_students: classData.max_students,
        department_id: classData.department_id,
        host_instructor_id: classData.host_instructor_id,
        created_at: classData.created_at,
        updated_at: classData.updated_at,
      });
    }

    fetchInitialData();
  }, [classData]);

  // ==============================
  // III. Xử lý thay đổi input form
  // ==============================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==============================
  // IV. Gửi dữ liệu cập nhật lớp
  // ==============================
  const handleSubmit = async () => {
    setLoading(true);

    const updatedData = {
      ...formData,
      updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
    };

    try {
      const res = await axios.put(
        'http://localhost/QLDiem/API/classess/update_classes.php',
        JSON.stringify(updatedData),
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (res.data.status === 'success') {
        alert('Cập nhật lớp học thành công!');
        onUpdate();
        onClose();
      } else {
        alert('Cập nhật thất bại: ' + (res.data.message || 'Lỗi không xác định'));
      }
    } catch (err) {
      console.error('Lỗi khi cập nhật lớp:', err);
      alert('Lỗi khi cập nhật lớp. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // V. Giao diện Dialog chỉnh sửa
  // ==============================
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Chỉnh sửa lớp học</DialogTitle>
      <DialogContent dividers>
        {/* Mã lớp - không cho chỉnh sửa */}
        <TextField
          label="Mã lớp"
          name="id"
          value={formData.id}
          onChange={handleChange}
          fullWidth
          margin="normal"
          disabled
        />

        {/* Tên lớp */}
        <TextField
          label="Tên lớp"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        {/* Sỉ số */}
        <TextField
          label="Sỉ số"
          name="max_students"
          value={formData.max_students}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />

        {/* Khoa */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Khoa</InputLabel>
          <Select
            label="Khoa"
            name="department_id"
            value={formData.department_id}
            onChange={handleChange}
          >
            {departments.map((dept) => (
              <MenuItem key={dept.id} value={dept.id}>
                {dept.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Giảng viên phụ trách */}
        <FormControl fullWidth margin="normal">
          <InputLabel>Giảng viên phụ trách</InputLabel>
          <Select
            label="Giảng viên phụ trách"
            name="host_instructor_id"
            value={formData.host_instructor_id}
            onChange={handleChange}
          >
            {instructors.map((ins) => (
              <MenuItem key={ins.id} value={ins.id}>
                {ins.id} - {ins.instructor_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* created_at có thể bật lại nếu cần debug */}
        {/*
        <TextField
          label="Ngày tạo"
          name="created_at"
          value={formData.created_at}
          onChange={handleChange}
          fullWidth
          margin="normal"
          disabled
        />
        */}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Hủy
        </Button>
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

export default EditClass;
