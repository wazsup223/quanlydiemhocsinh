import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, CircularProgress } from '@mui/material';
import { People as PeopleIcon, School as SchoolIcon, Assessment as AssessmentIcon } from '@mui/icons-material';

function Dashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
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
      
      // Fetch students count
      const studentsResponse = await fetch('http://localhost/QLDiem/API/students/readStudents.php');
      if (!studentsResponse.ok) {
        throw new Error(`HTTP error! status: ${studentsResponse.status}`);
      }
      const studentsData = await studentsResponse.json();
      
      // Fetch classes count
      const classesResponse = await fetch('http://localhost/QLDiem/API/classess/readClasses.php');
      if (!classesResponse.ok) {
        throw new Error(`HTTP error! status: ${classesResponse.status}`);
      }
      const classesData = await classesResponse.json();
      
      // Fetch grades for average calculation
      const gradesResponse = await fetch('http://localhost/QLDiem/API/grades/read.php');
      if (!gradesResponse.ok) {
        throw new Error(`HTTP error! status: ${gradesResponse.status}`);
      }
      const gradesData = await gradesResponse.json();
      
      // Calculate average grade
      let totalGrade = 0;
      let gradeCount = 0;
      
      if (gradesData.status === 'success' && gradesData.data.length > 0) {
        gradesData.data.forEach(grade => {
          if (grade.process_score && grade.midterm_score && grade.final_score) {
            const avg = (parseFloat(grade.process_score) + parseFloat(grade.midterm_score) + parseFloat(grade.final_score)) / 3;
            totalGrade += avg;
            gradeCount++;
          }
        });
      }
      
      const averageGrade = gradeCount > 0 ? (totalGrade / gradeCount).toFixed(1) : 0;
      
      setStats({
        totalStudents: studentsData.status === 'success' ? studentsData.data.length : 0,
        totalClasses: classesData.status === 'success' ? classesData.data.length : 0,
        averageGrade: averageGrade
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Tổng quan
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <PeopleIcon sx={{ fontSize: 40, color: '#1976d2', mr: 1 }} />
              <Typography variant="h6">Tổng số học sinh</Typography>
            </div>
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              <Typography variant="h4">{stats.totalStudents}</Typography>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <SchoolIcon sx={{ fontSize: 40, color: '#2e7d32', mr: 1 }} />
              <Typography variant="h6">Tổng số lớp</Typography>
            </div>
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              <Typography variant="h4">{stats.totalClasses}</Typography>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <AssessmentIcon sx={{ fontSize: 40, color: '#ed6c02', mr: 1 }} />
              <Typography variant="h6">Điểm trung bình</Typography>
            </div>
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              <Typography variant="h4">{stats.averageGrade}</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </div>
  );
}

export default Dashboard; 