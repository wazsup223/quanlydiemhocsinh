import React, { useEffect, useState } from 'react';
import {
  Box, Button, Typography, FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Info as InfoIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import EditClass from './EditClass'; // Form chỉnh sửa lớp học

function ClassList() {
  // --- 1. State quản lý dữ liệu ---
  const [classes, setClasses] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 2. State lọc và form sửa ---
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [editingClass, setEditingClass] = useState(null);

  // --- 3. Điều hướng ---
  const navigate = useNavigate();

  // --- 4. Lấy danh sách lớp ---
  const fetchClasses = async () => {
    try {
      const res = await axios.get('http://localhost/QLDiem/API/classess/readClasses.php');
      if (Array.isArray(res.data?.data)) {
        setClasses(res.data.data);
      }
    } catch (err) {
      console.error('Lỗi khi tải danh sách lớp:', err);
    }
  };

  // --- 5. Lấy danh sách khoa ---
  const fetchDepartments = async () => {
    try {
      const res = await axios.get('http://localhost/QLDiem/API/departments/readDepartments.php');
      setDepartments(res.data?.data || []);
    } catch (err) {
      console.error('Lỗi khi tải danh sách khoa:', err);
    }
  };

  // --- 6. Gọi dữ liệu ban đầu ---
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      await Promise.all([fetchClasses(), fetchDepartments()]);
      setLoading(false);
    };

    fetchInitialData();
  }, []);

  // --- 7. Lọc theo khoa ---
  const filteredClasses = selectedDepartment
    ? classes.filter(cls => cls.department_id === selectedDepartment)
    : classes;

  // --- 8. Xử lý xóa lớp ---
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa LỚP này không?')) {
      try {
        const res = await axios.post(
          'http://localhost/QLDiem/API/classess/delete_classes.php',
          JSON.stringify({ id }),
          { headers: { 'Content-Type': 'application/json' } }
        );

        if (res.data && res.data.status === 'success') {
          alert(res.data.message || 'Xóa thành công!');
          fetchClasses(); // Tải lại danh sách sau khi xóa
        } else {
          alert('Xóa thất bại: ' + (res.data?.message || 'Lỗi không xác định'));
        }
      } catch (err) {
        console.error('Lỗi khi xóa lớp:', err);
        alert('Lỗi khi xóa lớp. Vui lòng thử lại sau.');
      }
    }
  };

  // --- 9. Sửa lớp ---
  const handleEdit = (rowData) => {
    setEditingClass(rowData);
  };

  // --- 10. Cấu hình DataGrid ---
  const columns = [
    { field: 'id', headerName: 'Mã lớp', width: 100 },
    { field: 'name', headerName: 'Tên lớp', flex: 1 },
    { field: 'max_students', headerName: 'Sỉ số', width: 100},
    {
      field: 'department_name',
      headerName: 'Khoa',
      flex: 1,
      valueGetter: (params) =>
        `${params.row.department_id} - ${params.row.department_name}`,
    },
    {
      field: 'host_instructor_id',
      headerName: 'GV phụ trách',
      flex: 1,
      valueGetter: (params) =>
        `${params.row.host_instructor_id} - ${params.row.instructor_name}`,
    },
    {
      field: 'actions',
      headerName: 'Thao tác',
      flex: 1,
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
            onClick={() => navigate(`/class-detail/${params.row.id}`)}
            startIcon={<InfoIcon />}
          >
            Xem học sinh
          </Button>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ height: 500, width: '100%' }}>
      <Typography variant="h4" gutterBottom>
        Danh sách lớp
      </Typography>

      {/* --- Bộ lọc và nút thêm --- */}
      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Khoa</InputLabel>
          <Select
            value={selectedDepartment}
            label="Khoa"
            onChange={(e) => setSelectedDepartment(e.target.value)}
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
          startIcon={<AddIcon />}
          onClick={() => navigate('/classes/add')}
        >
          Thêm lớp
        </Button>
      </Box>

      {/* --- Bảng danh sách lớp --- */}
      <DataGrid
        rows={filteredClasses}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10]}
        loading={loading}
        getRowId={(row) => row.id}
      />

      {/* --- Form chỉnh sửa lớp --- */}
      {editingClass && (
        <EditClass
          open={!!editingClass}
          classData={editingClass}
          onClose={() => setEditingClass(null)}
          onUpdate={() => {
            fetchClasses();
            setEditingClass(null);
          }}
        />
      )}
    </Box>
  );
}

export default ClassList;
