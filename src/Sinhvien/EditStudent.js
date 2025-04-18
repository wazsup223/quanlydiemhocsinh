import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
} from '@mui/material';
import axios from 'axios';

function EditStudent({ open, onClose, student, onUpdate }) {
  const [formData, setFormData] = useState({
    id: '',
    first_name: '',
    last_name: '',
    birth_day: '',
    gender: '',
    address: '',
    email: '',
    phone: '',
    class_id: '',
    department_id: '',
    academic_year: '',
  });

  const [classes, setClasses] = useState([]);
  const [departments, setDepartments] = useState([]);

  // Hàm lấy thời gian hiện tại theo định dạng MySQL
  const getCurrentDateTime = () => {
    const now = new Date();
    const pad = (n) => (n < 10 ? '0' + n : n);
    return (
      now.getFullYear() +
      '-' +
      pad(now.getMonth() + 1) +
      '-' +
      pad(now.getDate()) +
      ' ' +
      pad(now.getHours()) +
      ':' +
      pad(now.getMinutes()) +
      ':' +
      pad(now.getSeconds())
    );
  };

  // Cập nhật form khi student thay đổi
  useEffect(() => {
    if (student) {
      setFormData({
        ...student,
        gender: String(student.gender),
      });
    }
    fetchClasses();
    fetchDepartments();
  }, [student]);

  const fetchClasses = async () => {
    try {
      const response = await axios.get('http://localhost/QLDiem/API/classess/readClasses.php');
      setClasses(response.data.data);
    } catch (error) {
      console.error('Error fetching classes:', error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://localhost/QLDiem/API/departments/readDepartments.php');
      setDepartments(response.data.data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Gửi dữ liệu cập nhật, có tùy chọn giữ form mở hoặc đóng lại
  const handleSubmit = async (keepOpen = false) => {
    const updatedData = {
      ...formData,
      gender: parseInt(formData.gender),
      updated_at: getCurrentDateTime(),
      created_at: student.created_at,
    };

    try {
      const response = await axios.post(
        'http://localhost/QLDiem/API/students/updateStudent.php',
        JSON.stringify(updatedData),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.message) {
        alert('Cập nhật sinh viên thành công!');

        // Cập nhật lại form để phản ánh dữ liệu mới (nhất là gender)
        setFormData({
          ...updatedData,
          gender: String(updatedData.gender),
        });

        onUpdate(); // Gọi callback để reload danh sách nếu có

        if (!keepOpen) {
          onClose(); // Đóng dialog nếu không giữ lại
        }
      }
    } catch (error) {
      console.error('Error updating student:', error);
      alert('Có lỗi xảy ra khi cập nhật sinh viên!');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Sửa thông tin sinh viên</DialogTitle>
      <DialogContent>
        <form>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="ID" name="id" value={formData.id} disabled />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Họ"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Tên"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Ngày sinh"
                name="birth_day"
                type="date"
                value={formData.birth_day}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                select
                label="Giới tính"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <MenuItem value="1">Nam</MenuItem>
                <MenuItem value="0">Nữ</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Số điện thoại"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Địa chỉ"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Năm học"
                name="academic_year"
                value={formData.academic_year}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                select
                label="Lớp"
                name="class_id"
                value={formData.class_id}
                onChange={handleChange}
              >
                {classes.map((cls) => (
                  <MenuItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                select
                label="Khoa"
                name="department_id"
                value={formData.department_id}
                onChange={handleChange}
              >
                {departments.map((dept) => (
                  <MenuItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={() => handleSubmit(true)} variant="contained" color="success">
          Lưu và tiếp tục
        </Button>
        <Button onClick={() => handleSubmit(false)} variant="contained" color="primary">
          Lưu và đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditStudent;
