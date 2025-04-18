import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function AddDepartment() {
  const [departmentData, setDepartmentData] = useState({
    symbol: '',
    name: '',
    created_at:''
  });

  const navigate = useNavigate();

  // Hàm xử lý thay đổi dữ liệu khi nhập
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDepartmentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Hàm xử lý khi gửi form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra nếu các trường dữ liệu cần thiết đã có giá trị
    if (!departmentData.symbol || !departmentData.name) {
      alert('Vui lòng nhập đầy đủ thông tin ký hiệu và tên khoa.');
      return;
    }

    // Lấy thời gian hiện tại cho created_at và updated_at
    const currentDate = new Date().toISOString();

    // Dữ liệu gửi lên server
    const newDepartmentData = {
      ...departmentData,
      created_at: currentDate,  // Gán thời gian tạo mới
      updated_at: currentDate,  // Gán thời gian cập nhật mới
    };

    try {
      const response = await fetch('http://localhost/QLDiem/API/departments/create_departments.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newDepartmentData),  // Gửi dữ liệu bao gồm thời gian
      });

      const data = await response.json();

      if (data.status === 'success') {
        alert('Thêm khoa thành công!');
        navigate('/departments');
      } else {
        console.error('API error:', data.message);
        alert('Thêm khoa thất bại: ' + (data.message || 'Lỗi không xác định'));
      }
    } catch (error) {
      console.error('Error creating department:', error);
      alert('Lỗi khi thêm khoa. Vui lòng thử lại.');
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" component="h2" gutterBottom>
        Thêm khoa mới
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Ký hiệu"
          name="symbol"
          value={departmentData.symbol}
          onChange={handleChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Tên khoa"
          name="name"
          value={departmentData.name}
          onChange={handleChange}
          margin="normal"
          required
        />
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            type="submit"
          >
            Thêm
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/departments')}
          >
            Hủy
          </Button>
        </Box>
      </form>
    </Box>
  );
}

export default AddDepartment;
