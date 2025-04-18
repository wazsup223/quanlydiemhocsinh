import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function AddTeachingAssignment() {
  const [assignmentData, setAssignmentData] = useState({
    instructor_id: '',
    subject_id: '',
    class_id: '',
    semester: '',
    academic_year: '',
  });

  const [instructors, setInstructors] = useState([]);
  const [allSubjects, setAllSubjects] = useState([]); // tất cả môn học từ subjects API
  const [registeredSubjects, setRegisteredSubjects] = useState([]); // lọc ra những môn có sinh viên đăng ký
  const [filteredSubjects, setFilteredSubjects] = useState([]); // danh sách môn học được lọc theo khoa
  const navigate = useNavigate();

  useEffect(() => {
    fetchInstructors();
    fetchSubjects();
    fetchRegisteredSubjects();
  }, []);

  // Fetch APIs
  const fetchInstructors = async () => {
    try {
      const res = await fetch('http://localhost/QLDiem/API/instructors/read.php');
      const data = await res.json();
      if (data.status === 'success') setInstructors(data.data);
    } catch (err) {
      console.error('Error fetching instructors:', err);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await fetch('http://localhost/QLDiem/API/subjects/read.php');
      const data = await res.json();
      if (data.status === 'success') setAllSubjects(data.data);
    } catch (err) {
      console.error('Error fetching subjects:', err);
    }
  };

  const fetchRegisteredSubjects = async () => {
    try {
      const res = await fetch('http://localhost/QLDiem/API/student_reg/read.php');
      const data = await res.json();
      if (data.status === 'success') {
        const subjectIds = Array.from(new Set(data.data.map((reg) => reg.subject_id)));
        setRegisteredSubjects(subjectIds);
      }
    } catch (err) {
      console.error('Error fetching registered subjects:', err);
    }
  };

  // Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Nếu chọn giảng viên thì lọc lại danh sách môn học
    if (name === 'instructor_id') {
      const selectedInstructor = instructors.find(inst => inst.id === value);
      const deptId = selectedInstructor?.department_id;

      const filtered = allSubjects.filter(
        subject =>
          registeredSubjects.includes(subject.id) &&
          subject.department_id === deptId
      );
      setFilteredSubjects(filtered);
    }

    setAssignmentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost/QLDiem/API/instructor_assignments/create.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(assignmentData),
      });
      const data = await res.json();
      if (data.status === 'success') {
        navigate('/teaching-assignments');
      } else {
        console.error('API error:', data.message);
        alert(data.message); // hiển thị lỗi cho người dùng
      }
    } catch (err) {
      console.error('Error creating assignment:', err);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Thêm phân công giảng dạy mới
      </Typography>
      <form onSubmit={handleSubmit}>
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Giảng viên</InputLabel>
          <Select
            name="instructor_id"
            value={assignmentData.instructor_id}
            onChange={handleChange}
            label="Giảng viên"
          >
            {instructors.map((instructor) => (
              <MenuItem key={instructor.id} value={instructor.id}>
                {instructor.first_name} {instructor.last_name}-({instructor.department_name})
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal" required>
          <InputLabel>Môn học</InputLabel>
          <Select
            name="subject_id"
            value={assignmentData.subject_id}
            onChange={handleChange}
            label="Môn học"
            disabled={!assignmentData.instructor_id}
          >
            {filteredSubjects.map((subject) => (
              <MenuItem key={subject.id} value={subject.id}>
                {subject.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button variant="contained" color="primary" type="submit">
            Thêm
          </Button>
          <Button variant="outlined" onClick={() => navigate('/teaching-assignments')}>
            Hủy
          </Button>
        </Box>
      </form>
    </Box>
  );
}

export default AddTeachingAssignment;