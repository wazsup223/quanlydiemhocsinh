import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddCourseRegistration() {
  // ==== State quản lý dữ liệu ====
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState({
    student_id: '',
    subject_id: '',
  });

  const navigate = useNavigate();

  // ==== Gọi API lấy dữ liệu ====
  useEffect(() => {
    fetchStudents();
    fetchSubjects();
  }, []);

  const fetchStudents = async () => {
    try {
      const res = await axios.get('http://localhost/QLDiem/API/students/readStudents.php');
      if (res.data.status === 'success') {
        setStudents(res.data.data);
      } else {
        console.error('Lỗi API sinh viên:', res.data.message);
      }
    } catch (error) {
      console.error('Lỗi kết nối sinh viên:', error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await axios.get('http://localhost/QLDiem/API/subjects/read.php');
      if (res.data.status === 'success') {
        setSubjects(res.data.data);
      } else {
        console.error('Lỗi API môn học:', res.data.message);
      }
    } catch (error) {
      console.error('Lỗi kết nối môn học:', error);
    }
  };

  // ==== Xử lý thay đổi input form ====
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==== Xử lý submit form ====
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Dữ liệu gửi đi:", formData);  // Log dữ liệu form trước khi gửi
    try {
      const res = await axios.post(
        'http://localhost/QLDiem/API/student_reg/create.php',
        formData
      );
  
      if (res.data.status === 'success') {
        navigate('/course-registrations');
      } else {
        console.error('Lỗi API khi thêm đăng ký:', res.data.message);
        alert('trùng môn');
      }
    } catch (error) {
      console.error('Lỗi kết nối khi thêm đăng ký:', error.response || error.message || error);
    }
  };

  // ==== Giao diện form ====
  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Thêm đăng ký môn học mới
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          {/* Chọn sinh viên */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Sinh viên</InputLabel>
            <Select
              name="student_id"
              value={formData.student_id}
              onChange={handleChange}
              label="Sinh viên"
              required
            >
              {students.map((student) => (
                <MenuItem key={student.id} value={student.id}>
                  {student.first_name} {student.last_name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Chọn môn học */}
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Môn học</InputLabel>
            <Select
              name="subject_id"
              value={formData.subject_id}
              onChange={handleChange}
              label="Môn học"
              required
            >
              {subjects.map((subject) => (
                <MenuItem key={subject.id} value={subject.id}>
                  {subject.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Nút hành động */}
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button type="submit" variant="contained" color="primary">
              Thêm
            </Button>
            <Button variant="outlined" onClick={() => navigate('/course-registrations')}>
              Hủy
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default AddCourseRegistration;
