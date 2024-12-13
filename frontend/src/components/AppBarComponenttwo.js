import * as React from 'react';
import { Button, Box, Typography } from '@mui/material';

function AppBarComponenttwo({ fetchUnivGeoJSON, fetchAreaStudentGeoJson, handleCloseDrawer, fetchLowUniv, fetchStudentWithCert }) {
  return (
    <Box sx={{
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center',
      padding: '20px',
      width: '80%',
      maxWidth: '1200px',
      margin: 'auto',
    }}>
      <Button 
        onClick={() => { 
          fetchUnivGeoJSON(); 
          handleCloseDrawer(); 
        }} 
        sx={{
          '&:hover': { backgroundColor: '#5d1c90' }, 
          margin: '0 15px',
          backgroundColor: '#5d1c60',
          color: 'white',
          borderRadius: '5px',
          padding: '10px 20px',
        }}
      >
        <Typography variant="button">Query 1</Typography>
      </Button>
      <Button 
        onClick={() => { 
          fetchAreaStudentGeoJson(); 
          handleCloseDrawer(); 
        }} 
        sx={{
          '&:hover': { backgroundColor: '#5d1c90' }, 
          margin: '0 15px',
          backgroundColor: '#5d1c60',
          color: 'white',
          borderRadius: '5px',
          padding: '10px 20px',
        }}
      >
        <Typography variant="button">Query 2</Typography>
      </Button>
      <Button 
        onClick={() => { 
          fetchLowUniv(); 
          handleCloseDrawer(); 
        }} 
        sx={{
          '&:hover': { backgroundColor: '#5d1c90' }, 
          margin: '0 15px',
          backgroundColor: '#5d1c60',
          color: 'white',
          borderRadius: '5px',
          padding: '10px 20px',
        }}
      >
        <Typography variant="button">Query 3</Typography>
      </Button>
      <Button 
        onClick={() => { 
          fetchStudentWithCert(); 
          handleCloseDrawer(); 
        }} 
        sx={{
          '&:hover': { backgroundColor: '#5d1c90' }, 
          margin: '0 15px',
          backgroundColor: '#5d1c60',
          color: 'white',
          borderRadius: '5px',
          padding: '10px 20px',
        }}
      >
        <Typography variant="button">Query 4</Typography>
      </Button>
    </Box>
  );
}

export default AppBarComponenttwo;
