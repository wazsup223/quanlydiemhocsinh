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

function CourseRegistrationFilterBySubject() {
  const { subjectId } = useParams();
  const [registrations, setRegistrations] = useState([]);
  const [subject, setSubject] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRegistrations();
    fetchSubject();
  }, [subjectId]);

  const fetchRegistrations = async () => {
    try {
      const response = await fetch(`http://localhost/QLDiem/API/course_registrations/read_by_subject.php?subject_id=${subjectId}`);
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

  const fetchSubject = async () => {
    try {
      const response = await fetch(`http://localhost/QLDiem/API/subjects/read_one.php?id=${subjectId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.status === 'success') {
        setSubject(data.data);
      } else {
        console.error('API error:', data.message);
      }
    } catch (error) {
      console.error('Error fetching subject:', error);
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

  if (!subject) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Đăng ký môn học: {subject.subject_name}
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
              <TableCell>Sinh viên</TableCell>
              <TableCell>Học kỳ</TableCell>
              <TableCell>Năm học</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {registrations.map((registration) => (
              <TableRow key={registration.id}>
                <TableCell>{registration.id}</TableCell>
                <TableCell>{registration.student_name}</TableCell>
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

export default CourseRegistrationFilterBySubject; 