import React, { useState, useEffect } from 'react';
import AppBarComponent from '../components/AppBarComponent.js';
import Footer from '../components/FooterComponent.js';
import {
  LinearProgress,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Select,
  MenuItem,
  Button,
  Grid,
  Divider,
} from '@mui/material';

export const ThirdPage = () => {
  const [studentId, setStudentId] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [universities, setUniversities] = useState([]);
  const [studentInfo, setStudentInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/get_university_ids_and_names')
      .then((response) => response.json())
      .then((data) => setUniversities(data))
      .catch((error) => {
        console.error('Error fetching universities:', error);
        setError('Failed to load universities.');
      });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('student-id', studentId);
    formData.append('university-id', selectedUniversity);

    fetch('http://localhost:5000/post_query_student', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          setStudentInfo(null);
        } else {
          setStudentInfo(data.info[0]);
          setError(null);
        }
      })
      .catch((error) => {
        setError('An error occurred while fetching data.');
        console.error('Error:', error);
      });
  };

  return (
    <Box>
      <AppBarComponent />
      <Box sx={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
        {/* Form Section */}
        <Box
          component="form"
          onSubmit={handleSubmit}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={2}
          border={1}
          borderRadius={2}
          borderColor="#ccc"
          mb={4}
        >
          <TextField
            label="Student ID"
            color="secondary"
            variant="outlined"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="e.g. 110006217"
            sx={{ width: '45%' }}
            required
          />
          <Select
            value={selectedUniversity}
            color="secondary"
            onChange={(e) => setSelectedUniversity(e.target.value)}
            displayEmpty
            variant="outlined"
            sx={{ width: '45%' }}
            required
          >
            <MenuItem value="" disabled>
              Select from the list...
            </MenuItem>
            {universities.map((uni) => (
              <MenuItem key={uni.university_id} value={uni.university_id}>
                {uni.university_name}
              </MenuItem>
            ))}
          </Select>
          <Button
            type="submit"
            variant="contained"
            sx={{ backgroundColor: '#A164D9', color: 'white' }}
          >
            Search
          </Button>
        </Box>

        {/* Student Information */}
        {error && <Typography color="error">{error}</Typography>}
        {!studentInfo &&<Typography color="error" sx={{ minHeight: '500px' }}>Data Not Found</Typography> }
        {studentInfo && (
          <Box border={1} borderColor="#ccc" borderRadius={2} p={3} component={Paper} sx={{ minHeight: '500px' }}>
            <Grid container spacing={3}>
              {/* Left Column - Student Info */}
              <Grid item xs={12} md={6}>
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Name: <span style={{ fontWeight: 'normal' }}>{studentInfo.name}</span>
                  </Typography>
                  <Typography>
                    <strong>Student ID:</strong> {studentInfo.student_id}
                  </Typography>
                  <Typography>
                    <strong>University:</strong> {studentInfo.university_name}
                  </Typography>
                  <Typography>
                    <strong>Year Level:</strong> {studentInfo.year_level}
                  </Typography>
                  <Typography>
                    <strong>Degree Level:</strong> {studentInfo.degree_level}
                  </Typography>
                  <Typography>
                    <strong>Degree Program:</strong> {studentInfo.degree_program}
                  </Typography>

                  {/* Progress Bar */}
                  <Box mt={2} textAlign="left">
                    <Typography>
                      <strong>TAICA Credits:</strong> {studentInfo.taica_credits} / 15
                    </Typography>
                    <Box display="flex" alignItems="center">
                      <LinearProgress
                        variant="determinate"
                        value={(studentInfo.taica_credits / 15) * 100}
                        sx={{
                          width: '80%',
                          height: '10px',
                          borderRadius: '5px',
                          marginRight: '10px',
                          backgroundColor: '#f0f0f0',
                        }}
                      />
                      <Typography variant="body2" color="textSecondary">
                        {((studentInfo.taica_credits / 15) * 100).toFixed(0)}%
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>

              {/* Right Column - Course Tables */}
              <Grid item xs={12} md={6}>
                {/* TAICA Completed Courses */}
                <Typography variant="h6" fontWeight="bold" mb={1}>
                  TAICA Completed Courses
                </Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Course ID</TableCell>
                        <TableCell>Course Name</TableCell>
                        <TableCell>Program</TableCell>
                        <TableCell>Credits</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {studentInfo.completed_courses.map((course) => (
                        <TableRow key={course.course_id}>
                          <TableCell>{course.course_id}</TableCell>
                          <TableCell>{course.course_name}</TableCell>
                          <TableCell>{course.program}</TableCell>
                          <TableCell>{course.credits}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Other TAICA Courses */}
                <Typography variant="h6" fontWeight="bold" mb={1}>
                  Other TAICA Courses
                </Typography>
                <TableContainer component={Paper} variant="outlined">
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Course ID</TableCell>
                        <TableCell>Course Name</TableCell>
                        <TableCell>Program</TableCell>
                        <TableCell>Credits</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {studentInfo.undone_courses.map((course) => (
                        <TableRow key={course.course_id}>
                          <TableCell>{course.course_id}</TableCell>
                          <TableCell>{course.course_name}</TableCell>
                          <TableCell>{course.program}</TableCell>
                          <TableCell>{course.credits}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>
      <Footer/>
    </Box>
  );
};

export default ThirdPage;
