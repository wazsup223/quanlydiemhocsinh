import React, { useState, useEffect } from 'react';
import {
  Box, Button, Typography, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem, CircularProgress
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';

function ClassList() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editClass, setEditClass] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [classesRes, departmentsRes] = await Promise.all([
        fetch(API_ENDPOINTS.CLASSES.LIST, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }),
        fetch(API_ENDPOINTS.DEPARTMENTS.LIST, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
      ]);

      if (!classesRes.ok || !departmentsRes.ok) {
        throw new Error('Không thể kết nối đến máy chủ');
      }

      const classesData = await classesRes.json();
      const departmentsData = await departmentsRes.json();

      setClasses(classesData.data || []);
      setDepartments(departmentsData.data || []);
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu ban đầu:', err);
      setError(err.message || 'Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_ENDPOINTS.CLASSES.READ_BY_DEPARTMENT}?department_id=${selectedDepartment}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Không thể kết nối đến máy chủ');
      }

      const data = await response.json();
      setClasses(data.data || []);
    } catch (err) {
      console.error('Lỗi khi lấy danh sách lớp:', err);
      setError(err.message || 'Không thể tải dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa lớp này?')) {
      try {
        const response = await fetch(API_ENDPOINTS.CLASSES.DELETE, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ id })
        });

        if (!response.ok) {
          throw new Error('Không thể xóa lớp');
        }

        setClasses(classes.filter(cls => cls.id !== id));
      } catch (err) {
        console.error('Lỗi khi xóa lớp:', err);
        setError(err.message || 'Không thể xóa lớp');
      }
    }
  };

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
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Khoa</InputLabel>
          <Select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <MenuItem value="">Tất cả</MenuItem>
            {departments.map(dept => (
              <MenuItem key={dept.id} value={dept.id}>{dept.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button variant="contained" onClick={handleFilter}>
          Lọc
        </Button>
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={() => navigate('/classes/add')}
        sx={{ mb: 2 }}
      >
        Thêm lớp
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mã lớp</TableCell>
              <TableCell>Tên lớp</TableCell>
              <TableCell>Khoa</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {classes.map((cls) => (
              <TableRow key={cls.id}>
                <TableCell>{cls.class_id}</TableCell>
                <TableCell>{cls.name}</TableCell>
                <TableCell>{cls.department_name}</TableCell>
                <TableCell>
                  <IconButton onClick={() => navigate(`/classes/edit/${cls.id}`)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(cls.id)}>
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

export default ClassList; 