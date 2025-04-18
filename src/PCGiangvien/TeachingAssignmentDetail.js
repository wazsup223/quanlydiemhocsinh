import React, { useState, useEffect, useCallback } from 'react';
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

function TeachingAssignmentDetail() {
  const { id } = useParams();
  const [assignment, setAssignment] = useState(null);
  const [instructor, setInstructor] = useState(null);
  const [subject, setSubject] = useState(null);
  const [classItem, setClassItem] = useState(null);
  const navigate = useNavigate();

  // Bọc fetchInstructor trong useCallback
  const fetchInstructor = useCallback(async (instructorId) => {
    try {
      const response = await fetch(`http://localhost/QLDiem/API/instructors/read_one.php?id=${instructorId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.status === 'success') {
        setInstructor(data.data);
      } else {
        console.error('API error:', data.message);
      }
    } catch (error) {
      console.error('Error fetching instructor:', error);
    }
  }, []);

  // Bọc fetchSubject trong useCallback
  const fetchSubject = useCallback(async (subjectId) => {
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
  }, []);

  // Bọc fetchClass trong useCallback
  const fetchClass = useCallback(async (classId) => {
    try {
      const response = await fetch(`http://localhost/QLDiem/API/classes/read_one.php?id=${classId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.status === 'success') {
        setClassItem(data.data);
      } else {
        console.error('API error:', data.message);
      }
    } catch (error) {
      console.error('Error fetching class:', error);
    }
  }, []);

  // Bọc fetchAssignment trong useCallback
  const fetchAssignment = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost/QLDiem/API/teaching_assignments/read_one.php?id=${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.status === 'success') {
        setAssignment(data.data);
        fetchInstructor(data.data.instructor_id);
        fetchSubject(data.data.subject_id);
        fetchClass(data.data.class_id);
      } else {
        console.error('API error:', data.message);
      }
    } catch (error) {
      console.error('Error fetching assignment:', error);
    }
  }, [id, fetchInstructor, fetchSubject, fetchClass]);

  useEffect(() => {
    fetchAssignment();
  }, [fetchAssignment]); // Thêm fetchAssignment vào dependency array

  if (!assignment || !instructor || !subject || !classItem) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Chi tiết phân công giảng dạy
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate(`/teaching-assignments/edit/${id}`)}
        >
          Chỉnh sửa
        </Button>
      </Box>

      <TableContainer component={Paper} sx={{ mb: 3 }}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell component="th" scope="row" sx={{ width: '30%' }}>
                Giảng viên
              </TableCell>
              <TableCell>{instructor.name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Môn học
              </TableCell>
              <TableCell>{subject.subject_name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Lớp
              </TableCell>
              <TableCell>{classItem.class_name}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Học kỳ
              </TableCell>
              <TableCell>{assignment.semester}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell component="th" scope="row">
                Năm học
              </TableCell>
              <TableCell>{assignment.academic_year}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={() => navigate('/teaching-assignments')}
        >
          Quay lại
        </Button>
      </Box>
    </Box>
  );
}

export default TeachingAssignmentDetail;