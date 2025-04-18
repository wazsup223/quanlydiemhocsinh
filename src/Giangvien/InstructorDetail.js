import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

function InstructorDetail() {
  const [instructor, setInstructor] = useState(null);
  const [teachingAssignments, setTeachingAssignments] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchInstructor();
    fetchTeachingAssignments();
  }, [id]);

  const fetchInstructor = async () => {
    try {
      const response = await fetch(`http://localhost/QLDiem/API/instructors/read_one.php?id=${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setInstructor(data);
    } catch (error) {
      console.error('Error fetching instructor:', error);
    }
  };

  const fetchTeachingAssignments = async () => {
    try {
      const response = await fetch(`http://localhost/QLDiem/API/teaching_assignments/read_by_instructor.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ instructor_id: id }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.status === 'success') {
        setTeachingAssignments(data.data);
      } else {
        console.error('API error:', data.message);
      }
    } catch (error) {
      console.error('Error fetching teaching assignments:', error);
    }
  };

  if (!instructor) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Chi tiết giảng viên
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(`/instructors/edit/${id}`)}
        >
          Chỉnh sửa
        </Button>
      </Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Thông tin cá nhân
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Họ tên
            </Typography>
            <Typography>{instructor.name}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Email
            </Typography>
            <Typography>{instructor.email}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Số điện thoại
            </Typography>
            <Typography>{instructor.phone}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Khoa
            </Typography>
            <Typography>{instructor.department_name}</Typography>
          </Box>
        </Box>
      </Paper>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Danh sách phân công giảng dạy
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Môn học</TableCell>
                <TableCell>Lớp</TableCell>
                <TableCell>Học kỳ</TableCell>
                <TableCell>Năm học</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {teachingAssignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell>{assignment.subject_name}</TableCell>
                  <TableCell>{assignment.class_name}</TableCell>
                  <TableCell>{assignment.semester}</TableCell>
                  <TableCell>{assignment.academic_year}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

export default InstructorDetail; 