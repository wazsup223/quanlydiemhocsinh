import React, { useState } from 'react';
import {
  Container, TextField, Button, Typography, Box, Alert
} from '@mui/material';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(API_ENDPOINTS.LOGIN, formData);
      if (res.data.status === 'success') {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        localStorage.setItem('token', res.data.token);
        // 👉 Bạn có thể điều hướng sang Dashboard tại đây
        window.location.href = '/dashboard'; 
      } else {
        setError('Email hoặc mật khẩu không đúng.');
      }
    } catch (err) {
      console.error(err);
      setError('Lỗi kết nối đến máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Đăng nhập
        </Typography>
        <Box component="form" sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Mật khẩu"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
          />
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;
