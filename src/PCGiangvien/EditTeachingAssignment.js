import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import axios from 'axios';

function EditTeachingAssignment({ open, onClose, editingData, onSaveSuccess }) {
  const [subjects, setSubjects] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [formData, setFormData] = useState({
    subject_id: '',
    instructor_id: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  // --- Lấy dữ liệu môn học & giảng viên ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const [subjectRes, instructorRes] = await Promise.all([
        axios.get('http://localhost/QLDiem/API/subjects/read.php'),
        axios.get('http://localhost/QLDiem/API/instructors/read.php'),
      ]);
      setSubjects(subjectRes.data?.data || []);
      setInstructors(instructorRes.data?.data || []);
    } catch (error) {
      setErrorMessage('Lỗi khi tải dữ liệu.');
      setOpenSnackbar(true);
      console.error('Lỗi khi tải dữ liệu:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (editingData) {
      setFormData({
        subject_id: editingData.subject_id,
        instructor_id: editingData.instructor_id,
      });
    } else {
      setFormData({
        subject_id: '',
        instructor_id: '',
      });
    }
  }, [editingData]);

  // --- Xử lý lưu ---
  const handleSave = async () => {
    // Kiểm tra formData trước khi gửi
   // console.log(formData);
  
    if (editingData) {
      try {
        const response = await axios.post(
          'http://localhost/QLDiem/API/instructor_assignments/update.php',
          {
            old_subject_id: editingData.subject_id,
            old_instructor_id: editingData.instructor_id,
            new_subject_id: formData.subject_id,
            new_instructor_id: formData.instructor_id
          }
        );
        alert('Cập nhật thành công');
        console.log(response.data); // In ra phản hồi từ server
        onClose(); // Đóng dialog & reload data
      } catch (error) {
        console.error('Lỗi khi lưu:', error.response ? error.response.data : error.message);
      }
    }
  };
  

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth>
        <DialogTitle>{editingData ? 'Chỉnh sửa phân công' : 'Thêm phân công'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          {loading ? (
            <CircularProgress />
          ) : (
            <>
              <FormControl fullWidth sx={{ mt: 2 }}>
                <InputLabel>Môn học</InputLabel>
                <Select
                  value={formData.subject_id}
                  label="Môn học"
                  onChange={(e) => setFormData({ ...formData, subject_id: e.target.value })}
                >
                  {subjects.map((s) => (
                    <MenuItem key={s.id} value={s.id}>
                      {s.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Giảng viên</InputLabel>
                <Select
                  value={formData.instructor_id}
                  label="Giảng viên"
                  onChange={(e) => setFormData({ ...formData, instructor_id: e.target.value })}
                >
                  {instructors.map((i) => (
                    <MenuItem key={i.id} value={i.id}>
                      {i.first_name} {i.last_name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Hủy</Button>
          <Button variant="contained" onClick={handleSave} disabled={loading}>
            {editingData ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert severity="error" onClose={() => setOpenSnackbar(false)}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
}

export default EditTeachingAssignment;
