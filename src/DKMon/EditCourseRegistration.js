import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button
} from '@mui/material';

function EditCourseRegistration({
  open,
  onClose,
  onSave,
  editData,
  setEditData,
  students,
  subjects
}) {
  if (!editData) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Chỉnh sửa đăng ký</DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4 }}>
        <FormControl fullWidth sx={{ mt: 1 }}>
          <InputLabel>Sinh viên</InputLabel>
          <Select
            value={editData.student_id || ''}
            onChange={(e) => setEditData({ ...editData, student_id: e.target.value })}
            label="Sinh viên"
          >
            {students.map((s) => (
              <MenuItem key={s.id} value={s.id}>
                {s.first_name} {s.last_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Môn học</InputLabel>
          <Select
            value={editData.subject_id || ''}
            onChange={(e) => setEditData({ ...editData, subject_id: e.target.value })}
            label="Môn học"
          >
            {subjects.map((s) => (
              <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Số tín chỉ"
          value={editData.credits || ''}
          disabled
        />
        <TextField
          label="Học kỳ"
          value={editData.semester || ''}
        
          disabled
        />
        <TextField
          label="Năm học"
          value={editData.academic_year || ''}
       
          disabled
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={onSave}>Lưu</Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditCourseRegistration;
