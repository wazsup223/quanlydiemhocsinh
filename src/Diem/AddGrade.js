import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddGrade() {
  const navigate = useNavigate();

  // ========================== CONST ==========================
  const [registrations, setRegistrations] = useState([]);
  const [allInstructors, setAllInstructors] = useState([]);
  const [filteredInstructors, setFilteredInstructors] = useState([]);

  const [formData, setFormData] = useState({
    student_id: '',
    subject_id: '',
    process_score: '',
    midterm_score: '',
    final_score: '',
    by_instructor_id: '',
  });

  // ========================== FETCH ==========================
  useEffect(() => {
    fetchRegistrations();
    fetchInstructors();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const response = await axios.get('http://localhost/QLDiem/API/grades/addgrades_reg.php');
      if (response.data.status === 'success') {
        setRegistrations(response.data.data);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách đăng ký:', error);
    }
  };

  const fetchInstructors = async () => {
    try {
      const response = await axios.get('http://localhost/QLDiem/API/instructors/read.php');
      if (response.data.status === 'success') {
        setAllInstructors(response.data.data);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh sách giảng viên:', error);
    }
  };

  // ========================== HANDLE ==========================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegistrationChange = (e) => {
    const selectedValue = e.target.value;
    const [student_id, subject_id] = selectedValue.split('-');

    const filtered = allInstructors.filter((instructor) =>
      instructor.subjects?.includes(subject_id)
    );

    setFormData((prev) => ({
      ...prev,
      student_id,
      subject_id,
      by_instructor_id: '', // reset giảng viên khi chọn lại môn học
    }));
    setFilteredInstructors(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost/QLDiem/API/grades/create.php',
        formData,
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (response.data.status === 'success') {
        navigate('/grades');
      }
    } catch (error) {
      console.error('Lỗi khi tạo điểm:', error);
    }
  };

  // ========================== RENDER ==========================
  return (
    <Box>
      <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
        Thêm điểm mới
      </Typography>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            select
            fullWidth
            label="Sinh viên - Môn học"
            value={`${formData.student_id}-${formData.subject_id}`}
            onChange={handleRegistrationChange}
            sx={{ mb: 2 }}
            required
          >
            {registrations.map((item, index) => (
              <MenuItem key={index} value={`${item.student_id}-${item.subject_id}`}>
                {item.first_name} {item.last_name} - {item.subject_name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Điểm quá trình"
            name="process_score"
            type="number"
            value={formData.process_score}
            onChange={handleChange}
            sx={{ mb: 2 }}
            required
            inputProps={{ min: 0, max: 10, step: 0.1 }}
          />

          <TextField
            fullWidth
            label="Điểm giữa kỳ"
            name="midterm_score"
            type="number"
            value={formData.midterm_score}
            onChange={handleChange}
            sx={{ mb: 2 }}
            required
            inputProps={{ min: 0, max: 10, step: 0.1 }}
          />

          <TextField
            fullWidth
            label="Điểm cuối kỳ"
            name="final_score"
            type="number"
            value={formData.final_score}
            onChange={handleChange}
            sx={{ mb: 2 }}
            required
            inputProps={{ min: 0, max: 10, step: 0.1 }}
          />

          <TextField
            select
            fullWidth
            label="Giảng viên"
            name="by_instructor_id"
            value={formData.by_instructor_id}
            onChange={handleChange}
            sx={{ mb: 3 }}
            required
            disabled={!formData.subject_id} // Chỉ cho chọn nếu đã có môn học
          >
            {filteredInstructors.length > 0 ? (
              filteredInstructors.map((instructor) => (
                <MenuItem key={instructor.id} value={instructor.id}>
                  {instructor.first_name} {instructor.last_name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>Không có giảng viên cho môn này</MenuItem>
            )}
          </TextField>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" color="primary" type="submit">
              Thêm điểm
            </Button>
            <Button variant="outlined" onClick={() => navigate('/grades')}>
              Hủy
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}

export default AddGrade;
