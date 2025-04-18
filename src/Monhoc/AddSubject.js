import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function AddSubject() {
  const [subjectData, setSubjectData] = useState({
    name: '',
    id: '',
    credits: '',
    semester:'',

    process_percentage: '',
    midterm_percentage: '',
    final_percentage: '',
    department_id: '',
  });

  const [departments, setDepartments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost/QLDiem/API/departments/readDepartments.php')
      .then(res => res.json())
      .then(data => {
        if (data && data.data) setDepartments(data.data);
      })
      .catch(err => console.error('Lỗi khi tải danh sách khoa:', err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSubjectData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Tạo timestamp định dạng chuẩn SQL
    const now = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const fullData = {
      ...subjectData,
      created_at: now,
      updated_at: now,
    };

    try {
      const response = await fetch('http://localhost/QLDiem/API/subjects/create.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fullData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.status === 'success') {
        navigate('/subjects');
        alert('Thêm Môn học thành công!');
      } else {
        console.error('API error:', data.message);
      }
    } catch (error) {
      console.error('Lỗi tạo môn học:', error);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Thêm môn học mới
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Tên môn học"
          name="name"
          value={subjectData.name}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Mã môn học"
          name="id"
          value={subjectData.id}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Số tín chỉ"
          name="credits"
          type="number"
          value={subjectData.credits}
          onChange={handleChange}
          margin="normal"
          required
        />
         <TextField
          fullWidth
          label="Học Kỳ"
          name="semester"
          type="number"
          value={subjectData.semester}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="% Quá trình"
          name="process_percentage"
          type="number"
          value={subjectData.process_percentage}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="% Giữa kỳ"
          name="midterm_percentage"
          type="number"
          value={subjectData.midterm_percentage}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="% Cuối kỳ"
          name="final_percentage"
          type="number"
          value={subjectData.final_percentage}
          onChange={handleChange}
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Khoa</InputLabel>
          <Select
            name="department_id"
            value={subjectData.department_id}
            onChange={handleChange}
            label="Khoa"
            required
          >
            {departments.map((dept) => (
              <MenuItem key={dept.id} value={dept.id}>
                {dept.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button variant="contained" color="primary" type="submit">
            Thêm
          </Button>
          <Button variant="outlined" onClick={() => navigate('/subjects')}>
            Hủy
          </Button>
        </Box>
      </form>
    </Box>
  );
}

export default AddSubject;
