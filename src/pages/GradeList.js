import React, { useState, useEffect, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function GradeList() {
  const [grades, setGrades] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [instructors, setInstructors] = useState([]);
  const [selectedInstructor, setSelectedInstructor] = useState('');
  const navigate = useNavigate();

  const fetchInstructors = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/instructors/read.php`);
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
  };

  const fetchGrades = useCallback(async () => {
    try {
      let url = `${process.env.REACT_APP_API_URL}/grades/read.php`;
      
      if (selectedInstructor) {
        url = `${process.env.REACT_APP_API_URL}/grades/read_by_instructor_id.php?instructor_id=${selectedInstructor}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.status === 'success') {
        setGrades(data.data);
      } else {
        console.error('API error:', data.message);
      }
    } catch (error) {
      console.error('Error fetching grades:', error);
    }
  }, [selectedInstructor]);

  useEffect(() => {
    fetchGrades();
    fetchInstructors();
  }, [fetchGrades]);

  useEffect(() => {
    fetchGrades();
  }, [selectedInstructor, fetchGrades]);

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa điểm này?')) {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/grades/delete.php?id=${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data.status === 'success') {
          fetchGrades();
        } else {
          console.error('API error:', data.message);
        }
      } catch (error) {
        console.error('Error deleting grade:', error);
      }
    }
  };

  const handleEdit = (id) => {
    navigate(`/edit-grade/${id}`);
  };

  const handleInstructorChange = (event) => {
    setSelectedInstructor(event.target.value);
  };

  const filteredGrades = grades.filter((grade) =>
    Object.values(grade).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Danh sách điểm
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/add-grade')}
        >
          Thêm điểm
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField
          fullWidth
          label="Tìm kiếm"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Giảng viên</InputLabel>
          <Select
            value={selectedInstructor}
            label="Giảng viên"
            onChange={handleInstructorChange}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {instructors.map((instructor) => (
              <MenuItem key={instructor.id} value={instructor.id}>
                {instructor.first_name} {instructor.last_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Sinh viên</TableCell>
              <TableCell>Môn học</TableCell>
              <TableCell>Điểm quá trình</TableCell>
              <TableCell>Điểm giữa kỳ</TableCell>
              <TableCell>Điểm cuối kỳ</TableCell>
              <TableCell>Giảng viên</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredGrades.map((grade) => (
              <TableRow key={grade.id}>
                <TableCell>{grade.id}</TableCell>
                <TableCell>{grade.student_name}</TableCell>
                <TableCell>{grade.subject_name}</TableCell>
                <TableCell>{grade.process_score}</TableCell>
                <TableCell>{grade.midterm_score}</TableCell>
                <TableCell>{grade.final_score}</TableCell>
                <TableCell>{grade.instructor_name}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(grade.id)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(grade.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default GradeList; 