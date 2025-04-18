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
  TableRow,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

function CourseRegistrationDetail() {
  const { id } = useParams();
  const [registration, setRegistration] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRegistration();
  }, [id]);
  useEffect(() => {
    fetchRegistration();
  }, [fetchRegistration]);
  async function fetchRegistration() {
    try {
      const response = await fetch(`http://localhost/QLDiem/API/course_registrations/read_one.php?id=${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.status === 'success') {
        setRegistration(data.data);
      } else {
        console.error('API error:', data.message);
      }
    } catch (error) {
      console.error('Error fetching registration:', error);
    }
  }

  if (!registration) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Chi tiết đăng ký môn học
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(`/course-registrations/edit/${id}`)}
        >
          Chỉnh sửa
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row" sx={{ width: '30%' }}>
                Sinh viên
              </TableCell>
              <TableCell>{registration.student_name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Môn học
              </TableCell>
              <TableCell>{registration.subject_name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Học kỳ
              </TableCell>
              <TableCell>{registration.semester}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Năm học
              </TableCell>
              <TableCell>{registration.academic_year}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', gap: 2 }}>
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

export default CourseRegistrationDetail; 