import * as React from 'react';
import { Button, Box, Typography } from '@mui/material';

function AppBarComponentThree({setAppBarChoice, handleChangeAppBarChoice }) {
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
          setAppBarChoice(0); 
          handleChangeAppBarChoice(); 
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
        <Typography variant="button">Student Query</Typography>
      </Button>
      <Button 
        onClick={() => { 
          setAppBarChoice(1);  
          handleChangeAppBarChoice(); 
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
        <Typography variant="button">Program Query</Typography>
      </Button>
     
    </Box>
  );
}

export default AppBarComponentThree;
