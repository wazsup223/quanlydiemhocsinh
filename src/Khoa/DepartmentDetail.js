import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  CircularProgress,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';  // Thêm import DataGrid

function DepartmentDetail() {
  const { id } = useParams();  // Lấy ID khoa từ URL
  const navigate = useNavigate();  // Sử dụng hook navigate để điều hướng

  // Khai báo state để lưu trữ thông tin khoa và danh sách giảng viên
  const [departmentInfo, setDepartmentInfo] = useState(null);  // Thông tin khoa
  const [instructors, setInstructors] = useState([]);  // Danh sách giảng viên
  const [loading, setLoading] = useState(true);  // Trạng thái tải dữ liệu

  // Hàm gọi API lấy thông tin khoa
  const fetchDepartmentInfo = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost/QLDiem/API/departments/read_oneDepartments.php?id=${id}`);
      const data = await response.json();
      if (data.status === 'success') {
        setDepartmentInfo(data.data);  // Lưu thông tin khoa vào state
      } else {
        console.error('Lỗi API khi lấy thông tin khoa:', data.message);
      }
    } catch (error) {
      console.error('Lỗi khi gọi API lấy thông tin khoa:', error);
    }
  }, [id]);

  // Hàm gọi API lấy danh sách giảng viên
  const fetchInstructors = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost/QLDiem/API/departments/read_detail_departments.php?department_id=${id}`);
      const data = await response.json();
      if (data.status === 'success') {
        setInstructors(data.data);  // Lưu danh sách giảng viên vào state
      } else {
        console.error('Lỗi API khi lấy danh sách giảng viên:', data.message);
      }
    } catch (error) {
      console.error('Lỗi khi gọi API giảng viên:', error);
    }
  }, [id]);

  // Gọi dữ liệu khi component được render
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchDepartmentInfo(), fetchInstructors()]);
      setLoading(false);
    };
    loadData();
  }, [fetchDepartmentInfo, fetchInstructors]);

  // Hiển thị vòng quay khi đang tải
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Thông báo nếu không tìm thấy thông tin khoa
  if (!departmentInfo) {
    return (
      <Typography sx={{ mt: 3 }}>
        Không tìm thấy thông tin khoa.
      </Typography>
    );
  }

  // Cấu hình các cột cho DataGrid
  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    {
      field: 'full_name',
      headerName: 'Họ và tên',
      width: 200,
      valueGetter: (params) => `${params.row.first_name} ${params.row.last_name}`,  // Gộp tên và họ
    },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone', headerName: 'Số điện thoại', width: 150 },
    { field: 'address', headerName: 'Địa chỉ', width: 200 },
    { field: 'birth_day', headerName: 'Ngày sinh', width: 150 },
    {
      field: 'gender',
      headerName: 'Giới tính',
      width: 100,
      valueGetter: (params) => (params.row.gender === '0' ? 'Nam' : 'Nữ'),  // Chuyển giới tính từ số thành chữ
    },
    { field: 'degree', headerName: 'Học vị', width: 150 },
  ];

  // Biến rows chứa danh sách giảng viên sau khi đã chuyển đổi thành dữ liệu cho DataGrid
  const rows = instructors.map((instructor) => ({
    id: instructor.id,
    first_name: instructor.first_name,
    last_name: instructor.last_name,
    email: instructor.email,
    phone: instructor.phone,
    address: instructor.address,
    birth_day: instructor.birth_day,
    gender: instructor.gender,
    degree: instructor.degree,
  }));

  // Giao diện chính
  return (
    <Box sx={{ p: 3 }}>
      {/* Tiêu đề và nút quay lại */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Chi tiết khoa</Typography>
          <Button variant="contained" color="primary" onClick={() => navigate(-1)} sx={{ marginBottom: 2 }}>
                Quay lại
              </Button>
      </Box>

      {/* Thông tin khoa */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Thông tin khoa</Typography>
        <Typography><strong>Mã khoa:</strong> {departmentInfo.symbol}</Typography>
        <Typography><strong>Tên khoa:</strong> {departmentInfo.name}</Typography>
        {departmentInfo.description && (
          <Typography><strong>Mô tả:</strong> {departmentInfo.description}</Typography>
        )}
        {departmentInfo.created_at && (
          <Typography><strong>Ngày tạo:</strong> {departmentInfo.created_at}</Typography>
        )}
        {departmentInfo.updated_at && (
          <Typography><strong>Ngày cập nhật:</strong> {departmentInfo.updated_at}</Typography>
        )}
      </Paper>

      {/* Danh sách giảng viên */}
      <Typography variant="h6" gutterBottom>
        Danh sách giảng viên ({instructors.length})
      </Typography>

      <Paper sx={{ p: 3 }}>
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={rows}  // Dữ liệu giảng viên
            columns={columns}  // Cấu hình các cột
            pageSize={5}  // Số dòng hiển thị trên một trang
            rowsPerPageOptions={[5]}  // Chọn số dòng trên mỗi trang
            disableSelectionOnClick  // Tắt lựa chọn khi click vào dòng
            getRowId={(row) => row.id}  // Cung cấp khóa duy nhất cho mỗi dòng
          />
        </div>
      </Paper>
    </Box>
  );
}

export default DepartmentDetail;
