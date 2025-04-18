import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as VisibilityIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';

function TeachingAssignmentFilter() {
  const { type, id } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [filterName, setFilterName] = useState('');
  const navigate = useNavigate();

  // Bọc fetchInstructors trong useCallback
  const fetchInstructors = useCallback(async () => {
    try {
      const response = await fetch('http://localhost/QLDiem/API/instructors/read.php');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.status === 'success') {
        setInstructors(data.data);
      } else {
        console.error('API error:', data.message);
      }
    } catch (error) {
      console.error('Error fetching instructors:', error);
    }
  }, []);

  // Bọc fetchSubjects trong useCallback
  const fetchSubjects = useCallback(async () => {
    try {
      const response = await fetch('http://localhost/QLDiem/API/subjects/read.php');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.status === 'success') {
        setSubjects(data.data);
      } else {
        console.error('API error:', data.message);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  }, []);

  // Bọc fetchClasses trong useCallback
  const fetchClasses = useCallback(async () => {
    try {
      const response = await fetch('http://localhost/QLDiem/API/classes/read.php');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.status === 'success') {
        setClasses(data.data);
      } else {
        console.error('API error:', data.message);
      }
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  }, []);

  // Bọc fetchData trong useCallback
  const fetchData = useCallback(async () => {
    try {
      let url = '';
      switch (type) {
        case 'instructor':
          url = `http://localhost/QLDiem/API/teaching_assignments/read_by_instructor.php?id=${id}`;
          break;
        case 'subject':
          url = `http://localhost/QLDiem/API/teaching_assignments/read_by_subject.php?id=${id}`;
          break;
        case 'class':
          url = `http://localhost/QLDiem/API/teaching_assignments/read_by_class.php?id=${id}`;
          break;
        default:
          return;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.status === 'success') {
        setAssignments(data.data);
        fetchInstructors();
        fetchSubjects();
        fetchClasses();
        setFilterName(data.filter_name);
      } else {
        console.error('API error:', data.message);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, [type, id, fetchInstructors, fetchSubjects, fetchClasses]);

  useEffect(() => {
    fetchData();
  }, [fetchData]); // Thêm fetchData vào dependency array

  const handleDelete = async (assignmentId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa phân công giảng dạy này?')) {
      try {
        const response = await fetch(`http://localhost/QLDiem/API/teaching_assignments/delete.php`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: assignmentId }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.status === 'success') {
          fetchData();
        } else {
          console.error('API error:', data.message);
        }
      } catch (error) {
        console.error('Error deleting assignment:', error);
      }
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'instructor':
        return `Phân công giảng dạy của giảng viên: ${filterName}`;
      case 'subject':
        return `Phân công giảng dạy môn học: ${filterName}`;
      case 'class':
        return `Phân công giảng dạy lớp: ${filterName}`;
      default:
        return 'Phân công giảng dạy';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" component="h2">
          {getTitle()}
        </Typography>
        <Button
          variant="outlined"
          onClick={() => navigate('/teaching-assignments')}
        >
          Quay lại
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Giảng viên</TableCell>
              <TableCell>Môn học</TableCell>
              <TableCell>Lớp</TableCell>
              <TableCell>Học kỳ</TableCell>
              <TableCell>Năm học</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assignments.map((assignment) => {
              const instructor = instructors.find((i) => i.id === assignment.instructor_id);
              const subject = subjects.find((s) => s.id === assignment.subject_id);
              const classItem = classes.find((c) => c.id === assignment.class_id);

              return (
                <TableRow key={assignment.id}>
                  <TableCell>{instructor ? instructor.name : 'N/A'}</TableCell>
                  <TableCell>{subject ? subject.subject_name : 'N/A'}</TableCell>
                  <TableCell>{classItem ? classItem.class_name : 'N/A'}</TableCell>
                  <TableCell>{assignment.semester}</TableCell>
                  <TableCell>{assignment.academic_year}</TableCell>
                  <TableCell>
                    <IconButton
                      color="info"
                      onClick={() => navigate(`/teaching-assignments/detail/${assignment.id}`)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      color="primary"
                      onClick={() => navigate(`/teaching-assignments/edit/${assignment.id}`)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(assignment.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default TeachingAssignmentFilter;