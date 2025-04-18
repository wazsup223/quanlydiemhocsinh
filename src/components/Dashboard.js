import React, { useState, useEffect } from 'react';
import {
  Grid, Paper, Typography, CircularProgress
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
        fetch('http://localhost/QLDiem/API/students/readStudents.php'),
        fetch('http://localhost/QLDiem/API/classess/readClasses.php'),
        fetch('http://localhost/QLDiem/API/departments/readDepartments.php'),
        fetch('http://localhost/QLDiem/API/instructors/read.php'),
        fetch('http://localhost/QLDiem/API/subjects/read.php'),
        fetch('http://localhost/QLDiem/API/grades/read.php'),
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

      if (gradesData.status === 'success' && gradesData.data.length > 0) {
        gradesData.data.forEach(grade => {
          if (grade.process_score && grade.midterm_score && grade.final_score) {
            const avg = (
              parseFloat(grade.process_score) +
              parseFloat(grade.midterm_score) +
              parseFloat(grade.final_score)
            ) / 3;
            totalGrade += avg;
            gradeCount++;
          }
        });
      }

      const averageGrade = gradeCount > 0
        ? (totalGrade / gradeCount).toFixed(1)
        : 0;

      setStats({
        totalStudents: studentsData.status === 'success' ? studentsData.data.length : 0,
        totalClasses: classesData.status === 'success' ? classesData.data.length : 0,
        totalDepartments: departmentsData.status === 'success' ? departmentsData.data.length : 0,
        totalInstructors: instructorsData.status === 'success' ? instructorsData.data.length : 0,
        totalSubjects: subjectsData.status === 'success' ? subjectsData.data.length : 0,
        averageGrade
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Không thể tải dữ liệu thống kê. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon, title, value, color }) => (
    <Grid item xs={12} sm={6} md={4}>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 140 }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          {icon}
          <Typography variant="h6">{title}</Typography>
        </div>
        {loading ? (
          <CircularProgress size={24} />
        ) : (
          <Typography variant="h4">{value}</Typography>
        )}
      </Paper>
    </Grid>
  );

  // Dữ liệu cho biểu đồ
  const chartData = [
    { name: 'Học sinh', value: stats.totalStudents },
    { name: 'Lớp', value: stats.totalClasses },
    { name: 'Khoa', value: stats.totalDepartments },
    { name: 'Giảng viên', value: stats.totalInstructors },
    { name: 'Môn học', value: stats.totalSubjects },
    { name: 'Điểm TB', value: parseFloat(stats.averageGrade) },
  ];

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Tổng quan
      </Typography>
      <Grid container spacing={3}>
        <StatCard
          icon={<PeopleIcon sx={{ fontSize: 40, color: '#1976d2', mr: 1 }} />}
          title="Tổng số học sinh"
          value={stats.totalStudents}
        />
        <StatCard
          icon={<SchoolIcon sx={{ fontSize: 40, color: '#2e7d32', mr: 1 }} />}
          title="Tổng số lớp"
          value={stats.totalClasses}
        />
        <StatCard
          icon={<AssessmentIcon sx={{ fontSize: 40, color: '#ed6c02', mr: 1 }} />}
          title="Điểm trung bình"
          value={stats.averageGrade}
        />
        <StatCard
          icon={<BusinessIcon sx={{ fontSize: 40, color: '#6a1b9a', mr: 1 }} />}
          title="Tổng số khoa"
          value={stats.totalDepartments}
        />
        <StatCard
          icon={<PersonIcon sx={{ fontSize: 40, color: '#1565c0', mr: 1 }} />}
          title="Tổng số giảng viên"
          value={stats.totalInstructors}
        />
        <StatCard
          icon={<SchoolIcon sx={{ fontSize: 40, color: '#00897b', mr: 1 }} />}
          title="Tổng số môn học"
          value={stats.totalSubjects}
        />
      </Grid>

      {/* Biểu đồ nhỏ */}
      <Typography variant="h6" sx={{ mt: 5, mb: 2 }}>
        Biểu đồ thống kê
      </Typography>
      <Paper sx={{ p: 2 }}>
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <Tooltip />
            <Bar dataKey="value" fill="#1976d2" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      {error && (
        <Typography color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </div>
  );
}

export default Dashboard;
