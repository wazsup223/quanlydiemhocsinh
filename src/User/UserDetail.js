import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUser();
  }, [id]);

  const fetchUser = async () => {
    try {
      const response = await fetch(`http://localhost/QLDiem/API/users/read_one.php?id=${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.status === 'success') {
        setUser(data.data);
      } else {
        console.error('API error:', data.message);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h2">
            Chi tiết người dùng
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(`/users/edit/${id}`)}
            >
              Chỉnh sửa
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/users')}
            >
              Quay lại
            </Button>
          </Box>
        </Box>

        <List>
          <ListItem>
            <ListItemText
              primary="Tên đăng nhập"
              secondary={user.username}
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Họ tên"
              secondary={user.full_name}
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Email"
              secondary={user.email}
            />
          </ListItem>
          <Divider />
          <ListItem>
            <ListItemText
              primary="Vai trò"
              secondary={user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
            />
          </ListItem>
        </List>
      </Paper>
    </Box>
  );
}

export default UserDetail; 