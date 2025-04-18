import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import EditCourseRegistration from './EditCourseRegistration';

// Constants for API URLs
const API_BASE = 'http://localhost/QLDiem/API';
const REG_URL = `${API_BASE}/student_reg/read.php`;
const DELETE_URL = `${API_BASE}/student_reg/delete.php`;
const STUDENT_URL = `${API_BASE}/students/readStudents.php`;
const SUBJECT_URL = `${API_BASE}/subjects/read.php`;

function CourseRegistrationList() {
  // State hooks
  const [registrations, setRegistrations] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [editData, setEditData] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const navigate = useNavigate();

  // API Calls
  const fetchRegistrations = async () => {
    try {
      const res = await axios.get(REG_URL);
      if (res.data.status === 'success') {
        setRegistrations(res.data.data);
      }
    } catch (err) {
      console.error('Lỗi lấy danh sách đăng ký:', err);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get(STUDENT_URL);
      if (res.data.status === 'success') {
        console.log('Dữ liệu trả về:', res.data.data); //
        setStudents(res.data.data);
      }
    } catch (err) {
      console.error('Lỗi lấy sinh viên:', err);
    }
  };

  const fetchSubjects = async () => {
    try {
      const res = await axios.get(SUBJECT_URL);
      if (res.data.status === 'success') {
        console.log('Dữ liệu trả về:', res.data.data); //
        setSubjects(res.data.data);
      }
    } catch (err) {
      console.error('Lỗi lấy môn học:', err);
    }
  };

  useEffect(() => {
    fetchRegistrations();
    fetchStudents();
    fetchSubjects();
  }, []);

  // Filtered registrations based on selected student and subject
  const filteredRegistrations = registrations.filter((r) => {
    const matchStudent = !selectedStudent || r.student_id === selectedStudent;
    const matchSubject = !selectedSubject || r.subject_id === selectedSubject;
    return matchStudent && matchSubject;
  });

  // Handle actions
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xoá?')) {
      try {
        const res = await axios.delete(DELETE_URL, { data: { id } });
        if (res.data.status === 'success') {
          fetchRegistrations();
        }
        alert('xoá thành công');
      } catch (err) {
        console.error('Lỗi xoá:', err);
      }
    }
  };

  const handleEditClick = (registration) => {
    setEditData(registration);
    setOpenDialog(true);
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(`${API_BASE}/student_reg/update.php`, editData);
      if (res.data.status === 'success') {
        fetchRegistrations();
        setOpenDialog(false);
      }
    } catch (err) {
      console.error('Lỗi cập nhật:', err);
    }
  };

  // Columns for DataGrid
  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'student_id', headerName: 'Mã Sinh viên', flex: 1 },
    { field: 'full_name', headerName: 'Sinh viên', flex: 1 },
    { field: 'subject_id', headerName: 'Mã Môn', flex: 1 },
    { field: 'subject_name', headerName: 'Môn học', flex: 1 },
    { field: 'credits', headerName: 'Số tín chỉ', width: 120 },
    { field: 'semester', headerName: 'Học kỳ', width: 120 },
    { field: 'academic_year', headerName: 'Năm học', width: 120 },
    { field: 'created_at', headerName: 'Ngày tạo', width: 160 },
    { field: 'updated_at', headerName: 'Ngày cập nhật', width: 160 },
    {
      field: 'actions',
      headerName: 'Thao tác',
      width: 160,
      renderCell: (params) => (
        <>{/** */}
          <IconButton color="primary" onClick={() => handleEditClick(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Danh sách đăng ký môn học</Typography>
        
      </Box>

      {/* Filter section */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Sinh viên</InputLabel>
          <Select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            label="Sinh viên"
          >
            <MenuItem value="">Tất cả</MenuItem>
            {students.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.first_name} {s.last_name}
              </MenuItem>
            ))}
          </Select>

        </FormControl>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Môn học</InputLabel>
          <Select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            label="Môn học"
          >
            <MenuItem value="">Tất cả</MenuItem>
            {subjects.map((s) => (
              <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" onClick={() => navigate('/course-registrations/add')}>
          Thêm đăng ký
        </Button>
      </Box>

      {/* DataGrid display */}
      <Box sx={{ height: 500 }}>
        <DataGrid
          rows={filteredRegistrations}
          columns={columns}
          getRowId={(row) => row.id}
          disableRowSelectionOnClick
          pageSize={10}
        />
      </Box>

      {/* Edit Course Registration Dialog */}
      <EditCourseRegistration
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSave={handleUpdate}
        editData={editData}
        setEditData={setEditData}
        students={students}
        subjects={subjects}
      />
    </Box>
  );
}

export default CourseRegistrationList;
