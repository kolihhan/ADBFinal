import React from 'react';
import AppBarComponent from '../components/AppBarComponent.js'; // Adjust the path as needed
import { Typography, Box } from '@mui/material';
import { styled } from '@mui/system';
import Footer from '../components/FooterComponent.js'; // Import the Footer component

const LandingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: 'calc(100vh - 64px)', // Adjust based on your AppBar height
  padding: theme.spacing(25), // Adjust padding here if needed
  background: 'linear-gradient(to bottom right, #f0f4f8, #d9e4ea)',
  margin: 0, // Ensure no margin here
  borderRadius: theme.shape.borderRadius, // Rounded corners for a softer look
}));

const TextContent = styled(Box)(({ theme }) => ({
  maxWidth: '50%', // Adjusted for better spacing
}));

const ImageContent = styled(Box)(({ theme }) => ({
  maxWidth: '50%', // Adjusted for better spacing
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const LandingImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: 'auto',
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[4],
}));

export const FirstPage = () => {
  return (
    <Box className="App" sx={{ margin: 0 }}> {/* Ensure there's no margin here */}
      {/* Include the AppBar component */}
      <AppBarComponent />

      <LandingContainer>
        {/* Left Section: Text Content */}
        <TextContent>
          <Typography variant="h2" component="h1" gutterBottom color="secondary">
            Welcome to Our Platform
          </Typography>
          <Typography variant="body1" paragraph>
            Discover a world of possibilities with our cutting-edge technology. Join us in shaping the future.
          </Typography>
        </TextContent>

        {/* Right Section: Image Content */}
        <ImageContent>
          <LandingImage
            src="Framework.png" // Replace with an actual image URL
            alt="Rep Image"
          />
        </ImageContent>
      </LandingContainer>

      {/* Add the Footer here */}
      <Footer />
    </Box>
  );
};

export default FirstPage;
