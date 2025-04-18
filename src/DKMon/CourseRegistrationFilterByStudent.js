import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';

function CourseRegistrationFilterByStudent() {
  const { studentId } = useParams();
  const [registrations, setRegistrations] = useState([]);
  const [student, setStudent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRegistrations();
    fetchStudent();
  }, [studentId]);

  const fetchRegistrations = async () => {
    try {
      const response = await fetch(`http://localhost/QLDiem/API/course_registrations/read_by_studentid.php?student_id=${studentId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.status === 'success') {
        setRegistrations(data.data);
      } else {
        console.error('API error:', data.message);
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
    }
  };

  const fetchStudent = async () => {
    try {
      const response = await fetch(`http://localhost/QLDiem/API/students/read_one.php?id=${studentId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.status === 'success') {
        setStudent(data.data);
      } else {
        console.error('API error:', data.message);
      }
    } catch (error) {
      console.error('Error fetching student:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đăng ký này?')) {
      try {
        const response = await fetch(`http://localhost/QLDiem/API/course_registrations/delete.php`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.status === 'success') {
          fetchRegistrations();
        } else {
          console.error('API error:', data.message);
        }
      } catch (error) {
        console.error('Error deleting registration:', error);
      }
    }
  };

  if (!student) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Đăng ký môn học của sinh viên: {student.name}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/course-registrations/add')}
        >
          Thêm đăng ký mới
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Môn học</TableCell>
              <TableCell>Học kỳ</TableCell>
              <TableCell>Năm học</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {registrations.map((registration) => (
              <TableRow key={registration.id}>
                <TableCell>{registration.id}</TableCell>
                <TableCell>{registration.subject_name}</TableCell>
                <TableCell>{registration.semester}</TableCell>
                <TableCell>{registration.academic_year}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => navigate(`/course-registrations/detail/${registration.id}`)}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton
                    color="primary"
                    onClick={() => navigate(`/course-registrations/edit/${registration.id}`)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(registration.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/course-registrations')}
        >
          Quay lại
        </Button>
      </Box>
    </Box>
  );
}

export default CourseRegistrationFilterByStudent; 