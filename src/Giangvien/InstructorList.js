import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import EditInstructor from './EditInstructor';

function InstructorList() {
  // --- 1. State quản lý dữ liệu ---
  const [instructors, setInstructors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [editInstructor, setEditInstructor] = useState(null);  // Quản lý giảng viên cần sửa
  const [loading, setLoading] = useState(true);

  // --- 2. Điều hướng ---
  const navigate = useNavigate();

  // --- 3. Lấy danh sách giảng viên và khoa ---
  const fetchInstructors = async () => {
    try {
      const res = await axios.get('http://localhost/QLDiem/API/instructors/read.php');
      setInstructors(res.data?.data || []);
    } catch (error) {
      console.error('Lỗi khi tải giảng viên:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await axios.get('http://localhost/QLDiem/API/departments/readDepartments.php');
      if (res.data.status === 'success') {
        setDepartments(res.data.data);
      }
    } catch (error) {
      console.error('Lỗi khi tải khoa:', error);
    }
  };

  // Gọi cả 2 khi vừa load
  useEffect(() => {
    fetchDepartments();
    fetchInstructors();
  }, []);

  // Gọi chọn khoa
  const filteredInstructors = selectedDepartment
  ? instructors.filter((instructor) => instructor.department_id === selectedDepartment)
  : instructors;


  // --- 4. Xử lý xóa giảng viên ---
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa giảng viên này?')) {
      try {
        const response = await axios.delete('http://localhost/QLDiem/API/instructors/delete.php', {
          headers: { 'Content-Type': 'application/json' },
          data: JSON.stringify({ id }),
        });
        if (response.data.status === 'success') {
          alert(response.data.message || 'Xóa thành công!');
          fetchInstructors();
        } else {
          alert('Xóa thất bại: ' + (response.data.message || 'ràng buộc '));
        }
      } catch (error) {
        console.error('Lỗi khi xóa:', error);
      }
    }
  };

  // Sửa giảng viên
  const handleEdit = (rowData) => {
    setEditInstructor(rowData);  // Cập nhật giảng viên cần sửa
  };
  const handleUpdate = () => {
    fetchInstructors(); // Lấy lại danh sách giảng viên
    setEditInstructor(null); // Đóng form sửa
  };

  // --- 5. Cấu hình cột cho DataGrid ---
  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'first_name', headerName: 'Họ', width: 100 },
    { field: 'last_name', headerName: 'Tên', width: 130 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone', headerName: 'Số điện thoại', width: 150 },
    { field: 'address', headerName: 'Địa chỉ', width: 200 },
    { field: 'birth_day', headerName: 'Ngày sinh', width: 120 },
    {
      field: 'gender', headerName: 'Giới tính', width: 100,
      valueGetter: (params) => (params.row.gender === '0' ? 'Nam' : 'Nữ')
    },
    { field: 'degree', headerName: 'Học vị', width: 120 },
    { field: 'department_name', headerName: 'Khoa', width: 160 },  // Backend trả thêm trường này
    { field: 'created_at', headerName: 'Tạo lúc', width: 150 },
    { field: 'updated_at', headerName: 'Cập nhật', width: 150 },
    {
      field: 'actions',
      headerName: 'Thao tác',
      width: 180,
      renderCell: (params) => (
        <>
          <Button
            size="small"
            startIcon={<EditIcon />}
            onClick={() => handleEdit(params.row)}  // Hiển thị form sửa
          >
            Sửa
          </Button>
          <Button
            size="small"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => handleDelete(params.row.id)}
          >
            Xóa
          </Button>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        Danh sách giảng viên
      </Typography>

      {/* Bộ lọc khoa và nút thêm */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Khoa</InputLabel>
          <Select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            label="Khoa"
          >
            <MenuItem value="">Tất cả</MenuItem>
            {departments.map((dept) => (
              <MenuItem key={dept.id} value={dept.id}>
                {dept.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={() => navigate('/instructors/add')}  // Điều hướng tới trang thêm giảng viên
        >
          Thêm giảng viên
        </Button>
      </Box>

      {/* Bảng DataGrid */}
      <DataGrid
        rows={filteredInstructors}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10]}
        loading={loading}
        getRowId={(row) => row.id}
      />

      {/* Form chỉnh sửa giảng viên */}
      {editInstructor && (
      <EditInstructor
        open={!!editInstructor}
        instructorData={editInstructor}
        onClose={() => setEditInstructor(null)}
        onUpdate={handleUpdate} // Truyền hàm vào
      />
    )}
    </Box>
  );
}

export default InstructorList;
