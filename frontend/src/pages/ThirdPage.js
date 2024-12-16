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
  Fab, 
  Divider,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'; 
import AppBarComponentThree from '../components/AppBarComponentThree.js';


export const ThirdPage = () => {
  const [studentId, setStudentId] = useState('');
  const [selectedUniversity, setSelectedUniversity] = useState('');
  const [universities, setUniversities] = useState([]);
  const [studentInfo, setStudentInfo] = useState(null);
  const [programId, setProgramId] = useState('');
  const [programInfo, setProgramInfo] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [error, setError] = useState(null);
  const [appbarChoice, setAppBarChoice] = useState(0);
  
  useEffect(() => {
    fetch('http://localhost:5000/get_university_ids_and_names')
      .then((response) => response.json())
      .then((data) => setUniversities(data))
      .catch((error) => {
        console.error('Error fetching universities:', error);
        setError('Failed to load universities.');
      });
      fetch('http://localhost:5000/get_program_ids_and_names')
      .then((response) => response.json())
      .then((data) => setPrograms(data))
      .catch((error) => {
        console.error('Error fetching programs:', error);
        setError('Failed to load programs.');
      });
  }, []);
  const handleChangeAppBarChoice = () => {
    scrollToTop();
  };
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
  const handleSubmit2 = (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('program-id', programId);

    fetch('http://localhost:5000/post_query_determing_cert_pathway', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          setProgramInfo(null);
        } else {
          console.log(data);
          setProgramInfo(data.info);
          setError(null);
        }
      })
      .catch((error) => {
        setError('An error occurred while fetching data.');
        console.error('Error:', error);
      });
  };
  const scrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight-500,
      behavior: 'smooth',
    });
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  return (
    <Box>
      <AppBarComponent />
      <Box sx={{ padding: '20px', maxWidth: '1200px', margin: 'auto', minHeight: 700}}>
        {/* Form Section */}
        {!appbarChoice? <Box
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
        </Box> : <Box
          component="form"
          onSubmit={handleSubmit2}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          p={2}
          border={1}
          borderRadius={2}
          borderColor="#ccc"
          mb={4}
        >
          <Select
            value={programId}
            color="secondary"
            onChange={(e) => setProgramId(e.target.value)}
            displayEmpty
            variant="outlined"
            sx={{ width: '100%' }}
            required
          >
            <MenuItem value="" disabled>
              Select from the list...
            </MenuItem>
            {programs.map((prog) => (
              <MenuItem key={prog.program_id} value={prog.program_id}>
                {prog.program_name}
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
        </Box>}
        

        {/* Student Information */}
        {error && <Typography color="error">{error}</Typography>}
        {((!studentInfo && appbarChoice===0) || (!programInfo && (appbarChoice===1)))&&<Typography color="error">Data Not Found</Typography>}
        
        {!(appbarChoice) && studentInfo && (
          <Box border={1} borderColor="#ccc" borderRadius={2} p={3} component={Paper}>
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
        {(appbarChoice === 1) && (
          <Box border={1} borderColor="#ccc" borderRadius={2} p={3} component={Paper} sx={{ minHeight: '500px' }}>
            {programInfo && programInfo.length > 0 ? (
              <Box>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Program Certification Details
                </Typography>

                {programInfo.map((student, index) => (
                  <Box
                    key={index}
                    mb={4}
                    p={2}
                    border={1}
                    borderColor="#e0e0e0"
                    borderRadius={2}
                    boxShadow={1}
                  >
                    {/* Certification Status */}
                    {student.courses_remaining === 0 ? (
                      <Typography color="success.main" variant="h6" fontWeight="bold" textAlign="center" mb={2}>
                        🎉 {student.student_name} is Certified in "{student.program_name}" 🎓
                      </Typography>
                    ) : (
                      <Typography color="error" variant="h6" fontWeight="bold" textAlign="center" mb={2}>
                        {student.student_name} has {student.courses_remaining} Course(s) Remaining for "{student.program_name}"
                      </Typography>
                    )}

                    {/* Table for Needed Courses */}
                    {student.courses_remaining > 0 && (
                      <Box>
                        <Typography variant="body1" fontWeight="bold" mb={1}>
                          Needed Courses:
                        </Typography>
                        <TableContainer component={Paper} variant="outlined">
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Course ID</TableCell>
                                <TableCell>Course Name</TableCell>
                                <TableCell>Credits</TableCell>
                                <TableCell>Master Satellite</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {student.needed_courses.map((course) => (
                                <TableRow key={course.id}>
                                  <TableCell>{course.id}</TableCell>
                                  <TableCell>{course.name}</TableCell>
                                  <TableCell>{course.credits}</TableCell>
                                  <TableCell>{course.master_satellite}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body1" textAlign="center" sx={{ minHeight: '500px' }}>
                No program information available. Please search for a program.
              </Typography>
            )}
          </Box>
        )}
      </Box>
      <Fab
          color="primary"
          aria-label="scroll-to-bottom"
          onClick={scrollToBottom}
          sx={{
            position: 'fixed',
            bottom: '70px',
            right: '100px',
            backgroundColor: '#A164D9',
            '&:hover': {
              backgroundColor: '#7C3FA5',
            },
          }}
        >
          <KeyboardArrowDownIcon />
        </Fab>
      <AppBarComponentThree setAppBarChoice={setAppBarChoice} handleChangeAppBarChoice={handleChangeAppBarChoice}/>
      <Footer/>
    </Box>
  );
};

export default ThirdPage;
