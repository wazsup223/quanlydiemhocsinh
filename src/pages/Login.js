import React, { useState } from 'react';
import {
  Container, TextField, Button, Typography, Box, Alert
} from '@mui/material';
import axios from 'axios';

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
      const res = await axios.post('http://localhost/QLDiem/API/auth/login.php', formData);
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
    <Container maxWidth="xs">
      <Box sx={{ mt: 10, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h5" align="center">Đăng nhập</Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <TextField
          label="Email"
          name="email"
          fullWidth
          value={formData.email}
          onChange={handleChange}
        />
        <TextField
          label="Mật khẩu"
          name="password"
          type="password"
          fullWidth
          value={formData.password}
          onChange={handleChange}
        />
        <Button
          variant="contained"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </Button>
      </Box>
    </Container>
  );
};

export default LoginPage;
