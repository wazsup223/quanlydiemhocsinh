import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, CircularProgress,
  MenuItem
} from '@mui/material';
import axios from 'axios';

function EditGradeDialog({ open, onClose, gradeData, onUpdate }) {
  const [formData, setFormData] = useState({
    id: '',
    student_id: '',
    subject_id: '',
    process_score: '',
    midterm_score: '',
    final_score: '',
    by_instructor_id: '',
  });

  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(false);

  // Gán dữ liệu khi mở dialog
  useEffect(() => {
    if (gradeData && open) {
      setFormData({
        id: gradeData.id,
        student_id: gradeData.student_id,
        subject_id: gradeData.subject_id,
        process_score: gradeData.process_score,
        midterm_score: gradeData.midterm_score,
        final_score: gradeData.final_score,
        by_instructor_id: gradeData.by_instructor_id,
      });
    }
  }, [gradeData, open]);

  // Lấy danh sách sinh viên, môn học, và giảng viên
  useEffect(() => {
    if (open) {
      fetchStudents();
      fetchSubjects();
      fetchInstructors();
    }
  }, [open]);

  const fetchStudents = async () => {
    try {
      const res = await axios.get('http://localhost/QLDiem/API/students/readStudents.php');
      if (res.data.status === 'success') {
        setStudents(res.data.data);
      }
    } catch (err) {
      console.error('Lỗi khi lấy danh sách sinh viên:', err);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await axios.get('http://localhost/QLDiem/API/subjects/read.php');
      if (res.data.status === 'success') {
        setSubjects(res.data.data);
      }
    } catch (err) {
      console.error('Lỗi khi lấy danh sách môn học:', err);
    }
  };

  const fetchInstructors = async () => {
    try {
      const res = await axios.get('http://localhost/QLDiem/API/instructors/read.php');
      if (res.data.status === 'success') {
        setInstructors(res.data.data);
      }
    } catch (err) {
      console.error('Lỗi khi lấy danh sách giảng viên:', err);
    }
  };

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Gửi cập nhật
  const handleSubmit = async () => {
    // Kiểm tra dữ liệu trước khi gửi
    if (!formData.student_id || !formData.subject_id) {
      alert('Vui lòng chọn sinh viên và môn học.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.put(
        `http://localhost/QLDiem/API/grades/update.php?id=${formData.id}`,
        JSON.stringify(formData),
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (res.data.status === 'success') {
        alert('Cập nhật điểm thành công!');
        onUpdate();  // callback reload danh sách
        onClose();   // đóng dialog
      } else {
        alert('Cập nhật thất bại: ' + (res.data.message || 'Lỗi không xác định'));
      }
    } catch (err) {
      console.error('Lỗi khi cập nhật điểm:', err);
      alert('Đã xảy ra lỗi khi cập nhật.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Chỉnh sửa điểm</DialogTitle>
      <DialogContent dividers>
        <TextField
          select
          label="Sinh viên"
          name="student_id"
          value={formData.student_id}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          {students.map((student) => (
            <MenuItem key={student.id} value={student.id}>
              {student.first_name} {student.last_name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Môn học"
          name="subject_id"
          value={formData.subject_id}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          {subjects.map((subject) => (
            <MenuItem key={subject.id} value={subject.id}>
              {subject.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Điểm quá trình"
          name="process_score"
          type="number"
          value={formData.process_score}
          onChange={handleChange}
          fullWidth
          margin="normal"
          inputProps={{ min: 0, max: 10, step: 0.1 }}
        />

        <TextField
          label="Điểm giữa kỳ"
          name="midterm_score"
          type="number"
          value={formData.midterm_score}
          onChange={handleChange}
          fullWidth
          margin="normal"
          inputProps={{ min: 0, max: 10, step: 0.1 }}
        />

        <TextField
          label="Điểm cuối kỳ"
          name="final_score"
          type="number"
          value={formData.final_score}
          onChange={handleChange}
          fullWidth
          margin="normal"
          inputProps={{ min: 0, max: 10, step: 0.1 }}
        />

        <TextField
          select
          label="Giảng viên"
          name="by_instructor_id"
          value={formData.by_instructor_id}
          onChange={handleChange}
          fullWidth
          margin="normal"
        >
          {instructors.map((instructor) => (
            <MenuItem key={instructor.id} value={instructor.id}>
              {instructor.first_name} {instructor.last_name}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="secondary">Hủy</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Cập nhật'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditGradeDialog;
