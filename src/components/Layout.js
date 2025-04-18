import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  Avatar,
} from '@mui/material';
import {
  Menu as MenuIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Class as ClassIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon,
  Grade as GradeIcon,
 
} from '@mui/icons-material';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';

const drawerWidth = 240;

function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Thống Kê', icon: <PeopleIcon />, path: '/dashboard' },
    { text: 'Quản lý sinh viên', icon: <PeopleIcon />, path: '/students' },
    { text: 'Quản lý môn học', icon: <SchoolIcon />, path: '/subjects' },
    { text: 'Quản lý lớp học', icon: <ClassIcon />, path: '/classes' },
    { text: 'Quản lý khoa', icon: <BusinessIcon />, path: '/departments' },
    { text: 'Quản lý giảng viên', icon: <PersonIcon />, path: '/instructors' },
    { text: 'Quản lý phân công', icon: <AssignmentIcon />, path: '/teaching-assignments' },
    { text: 'Quản lý điểm', icon: <GradeIcon />, path: '/grades' },
    { text: 'Quản lý Đăng Ký Môn', icon: <AppRegistrationIcon />, path: '/course-registrations' },
    //{ text: 'Quản lý Người Dùng', icon: <PeopleIcon />, path: '/users' },
  ];

  const drawer = (
    <div>
      <Toolbar>
      
        <Typography variant="h6" noWrap component="div">
          Quản Lý Điểm
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              navigate(item.path);
              setMobileOpen(false);
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            PHẦN MỀM QUẢN LÝ ĐIỂM
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

export default Layout; 