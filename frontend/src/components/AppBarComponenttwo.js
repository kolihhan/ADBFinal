import * as React from 'react';
import { Button, Box, Typography } from '@mui/material';

function AppBarComponenttwo({ fetchUnivGeoJSON, fetchAreaStudentGeoJson, handleCloseDrawer, fetchLowUniv, fetchStudentWithCert, fetchAccessibility }) {
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
        <Typography variant="button">Taiwan Uni</Typography>
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
        <Typography variant="button">TAICA Uni</Typography>
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
        <Typography variant="button">TAICA Cities</Typography>
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
        <Typography variant="button">Low TAICA Reach</Typography>
      </Button>
      <Button 
        onClick={() => { 
          fetchAccessibility(); 
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
        <Typography variant="button">TAICA Accessibility</Typography>
      </Button>
      
    </Box>
  );
}

export default AppBarComponenttwo;
