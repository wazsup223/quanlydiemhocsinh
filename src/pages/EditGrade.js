import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Paper,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

function EditGrade() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [formData, setFormData] = useState({
    student_id: '',
    subject_id: '',
    process_score: '',
    midterm_score: '',
    final_score: '',
    by_instructor_id: '',
  });

  const fetchGrade = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost/QLDiem/API/grades/read.php?id=${id}`);
      const data = await response.json();
      if (data.status === 'success') {
        setFormData(data.data);
      }
    } catch (error) {
      console.error('Error fetching grade:', error);
    }
  }, [id]);

  useEffect(() => {
    fetchGrade();
    fetchStudents();
    fetchSubjects();
    fetchInstructors();
  }, [fetchGrade]);

  const fetchStudents = async () => {
    try {
      const response = await fetch('http://localhost/QLDiem/API/students/readStudents.php');
      const data = await response.json();
      if (data.status === 'success') {
        setStudents(data.data);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await fetch('http://localhost/QLDiem/API/subjects/read.php');
      const data = await response.json();
      if (data.status === 'success') {
        setSubjects(data.data);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  };

  const fetchInstructors = async () => {
    try {
      const response = await fetch('http://localhost/QLDiem/API/instructors/read.php');
      const data = await response.json();
      if (data.status === 'success') {
        setInstructors(data.data);
      }
    } catch (error) {
      console.error('Error fetching instructors:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost/QLDiem/API/grades/update.php?id=${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.status === 'success') {
        navigate('/grades');
      }
    } catch (error) {
      console.error('Error updating grade:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h5" component="h2" sx={{ mb: 3 }}>
        Sửa điểm
      </Typography>

      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <TextField
            select
            fullWidth
            label="Sinh viên"
            name="student_id"
            value={formData.student_id}
            onChange={handleChange}
            sx={{ mb: 2 }}
            required
          >
            {students.map((student) => (
              <MenuItem key={student.id} value={student.id}>
                {student.first_name} {student.last_name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            label="Môn học"
            name="subject_id"
            value={formData.subject_id}
            onChange={handleChange}
            sx={{ mb: 2 }}
            required
          >
            {subjects.map((subject) => (
              <MenuItem key={subject.id} value={subject.id}>
                {subject.name}
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
          >
            {instructors.map((instructor) => (
              <MenuItem key={instructor.id} value={instructor.id}>
                {instructor.first_name} {instructor.last_name}
              </MenuItem>
            ))}
          </TextField>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              type="submit"
            >
              Cập nhật
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/grades')}
            >
              Hủy
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
}

export default EditGrade; 