import React, { useEffect, useState } from 'react';
import {Box,Button,Typography,FormControl,InputLabel,Select,MenuItem, CircularProgress, Alert} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import EditDepartment from './EditDepartment'; // Form chỉnh sửa khoa
import { API_ENDPOINTS } from '../config/api';

function DepartmentList() {
  // --- 1. State quản lý dữ liệu ---
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- 2. State lọc và form sửa ---
  const [selectedSymbol, setSelectedSymbol] = useState('');
  const [editingDepartment, setEditingDepartment] = useState(null);

  // --- 3. Điều hướng ---
  const navigate = useNavigate();

  // --- 4. Lấy danh sách khoa ---
  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(API_ENDPOINTS.DEPARTMENTS.LIST, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Không thể kết nối đến máy chủ');
      }

      const data = await response.json();
      setDepartments(data.data || []);
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu:', err);
      setError(err.message || 'Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  // --- 5. Lọc theo symbol ---
  const filteredDepartments = selectedSymbol
    ? departments.filter((dept) => dept.symbol === selectedSymbol)
    : departments;

  // --- 6. Xử lý xóa khoa ---
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa khoa này?')) {
      try {
        const response = await fetch(API_ENDPOINTS.DEPARTMENTS.DELETE, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id })
        });

        if (!response.ok) {
          throw new Error('Không thể xóa khoa');
        }

        setDepartments(departments.filter(dept => dept.id !== id));
      } catch (err) {
        console.error('Lỗi khi xóa khoa:', err);
        setError(err.message || 'Không thể xóa khoa');
      }
    }
  };

  // --- 7. Sửa khoa ---
  const handleEdit = (rowData) => {
    setEditingDepartment(rowData);
  };

  // --- 8. Cấu hình DataGrid ---
  const columns = [
    { field: 'id', headerName: 'Mã khoa', flex: 1 },
    { field: 'symbol', headerName: 'Ký hiệu', flex: 1},
    { field: 'name', headerName: 'Tên khoa', flex: 1 },
    { field: 'created_at', headerName: 'Ngày tạo', flex: 1 },
    { field: 'updated_at', headerName: 'Cập nhật', flex: 1 },
    {
      field: 'actions',
      headerName: 'Thao tác',
      width: 300,
      renderCell: (params) => (
        <>
          <Button
            size="small"
            onClick={() => handleEdit(params.row)}
            startIcon={<EditIcon />}
          >
            Sửa
          </Button>
          <Button
            size="small"
            color="error"
            onClick={() => handleDelete(params.row.id)}
            startIcon={<DeleteIcon />}
          >
            Xóa
          </Button>
          <Button
            size="small"
            onClick={() => navigate(`/department-detail/${params.row.id}`)}
            startIcon={<InfoIcon />}
          >
            Chi tiết
          </Button>
        </>
      ),
    },
  ];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ height: 500, width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        Danh sách khoa
      </Typography>

      {/* Bộ lọc và nút thêm */}
      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Ký hiệu</InputLabel>
          <Select
            value={selectedSymbol}
            label="Ký hiệu"
            onChange={(e) => setSelectedSymbol(e.target.value)}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {[...new Set(departments.map((dept) => dept.symbol))].map((symbol) => (
              <MenuItem key={symbol} value={symbol}>
                {symbol}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={() => navigate('/departments/add')}
        >
          Thêm khoa mới
        </Button>
      </Box>

      {/* Bảng dữ liệu */}
      <DataGrid
        rows={filteredDepartments}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10]}
        loading={loading}
        getRowId={(row) => row.id}
      />

      {/* Form chỉnh sửa */}
      {editingDepartment && (
        <EditDepartment
          open={!!editingDepartment}
          departmentData={editingDepartment}
          onClose={() => setEditingDepartment(null)}
          onUpdate={() => {
            fetchDepartments();
            setEditingDepartment(null);
          }}
        />
      )}
    </Box>
  );
}

export default DepartmentList;
