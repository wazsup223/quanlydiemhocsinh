import React, { useState, useEffect } from 'react';
import {
  Grid, Paper, Typography, CircularProgress, Box
} from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  Assessment as AssessmentIcon,
  Business as BusinessIcon,
  Person as PersonIcon
} from '@mui/icons-material';
import {
  BarChart, Bar, XAxis, Tooltip, ResponsiveContainer
} from 'recharts';
import { API_ENDPOINTS } from '../config/api';

function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    totalDepartments: 0,
    totalInstructors: 0,
    totalSubjects: 0,
    averageGrade: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const [
        studentsRes,
        classesRes,
        departmentsRes,
        instructorsRes,
        subjectsRes,
        gradesRes
      ] = await Promise.all([
        fetch(API_ENDPOINTS.STUDENTS.LIST),
        fetch(API_ENDPOINTS.CLASSES.LIST),
        fetch(API_ENDPOINTS.DEPARTMENTS.LIST),
        fetch(API_ENDPOINTS.INSTRUCTORS.LIST),
        fetch(API_ENDPOINTS.SUBJECTS.LIST),
        fetch(API_ENDPOINTS.GRADES.LIST),
      ]);

      const studentsData = await studentsRes.json();
      const classesData = await classesRes.json();
      const departmentsData = await departmentsRes.json();
      const instructorsData = await instructorsRes.json();
      const subjectsData = await subjectsRes.json();
      const gradesData = await gradesRes.json();

      // Tính điểm trung bình
      let totalGrade = 0;
      let gradeCount = 0;
      if (gradesData.data && Array.isArray(gradesData.data)) {
        gradesData.data.forEach(grade => {
          if (grade.final_score) {
            totalGrade += parseFloat(grade.final_score);
            gradeCount++;
          }
        });
      }

      setStats({
        totalStudents: studentsData.data?.length || 0,
        totalClasses: classesData.data?.length || 0,
        totalDepartments: departmentsData.data?.length || 0,
        totalInstructors: instructorsData.data?.length || 0,
        totalSubjects: subjectsData.data?.length || 0,
        averageGrade: gradeCount > 0 ? (totalGrade / gradeCount).toFixed(2) : 0
      });
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Không thể tải dữ liệu thống kê');
    } finally {
      setLoading(false);
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

  const statCards = [
    { title: 'Tổng số sinh viên', value: stats.totalStudents, icon: <PeopleIcon /> },
    { title: 'Tổng số lớp học', value: stats.totalClasses, icon: <SchoolIcon /> },
    { title: 'Tổng số khoa', value: stats.totalDepartments, icon: <BusinessIcon /> },
    { title: 'Tổng số giảng viên', value: stats.totalInstructors, icon: <PersonIcon /> },
    { title: 'Tổng số môn học', value: stats.totalSubjects, icon: <AssessmentIcon /> },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box sx={{ mb: 1 }}>{card.icon}</Box>
              <Typography variant="h6">{card.title}</Typography>
              <Typography variant="h4">{card.value}</Typography>
            </Paper>
          </Grid>
        ))}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Điểm trung bình: {stats.averageGrade}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
