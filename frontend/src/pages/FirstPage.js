import React from 'react';
import AppBarComponent from '../components/AppBarComponent.js'; // Adjust the path as needed
import { Typography, Box } from '@mui/material';
import { styled } from '@mui/system';
import Footer from '../components/FooterComponent.js'; // Import the Footer component
import { motion } from 'framer-motion'; // Import Framer Motion

const LandingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  height: 'calc(100vh - 64px)', // Adjust based on your AppBar height
  padding: theme.spacing(15), // Adjust padding here if needed
  background: 'linear-gradient(to bottom right, #f0f4f8, #d9e4ea)',
  margin: 0, // Ensure no margin here
  borderRadius: theme.shape.borderRadius, // Rounded corners for a softer look
}));

const TextContent = styled(Box)(({ theme }) => ({
  maxWidth: '45%', // Adjusted for better spacing
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

// Animation variants for Framer Motion
const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

const textVariants = {
  hidden: { opacity: 0, x: -100 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7 } },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.7, delay: 0.3 } },
};

export const FirstPage = () => {
  return (
    <Box className="App"> {/* Ensure there's no margin here */}
      {/* Include the AppBar component */}
      <AppBarComponent />

      <LandingContainer
        component={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left Section: Text Content */}
        <TextContent component={motion.div} variants={textVariants}>
          <Typography variant="h2" component="h1" gutterBottom color="secondary">
            Welcome to TaicaMS!
          </Typography>
          <Typography variant="body1" paragraph>
            Where knowledge and creativity abound! Explore, engage, and interact with our system to discover the culmination of six passionate individuals.
            Here, we've created efficient solutions to match TAICA's unique needs and characteristics, ensuring powerful querying options to all necessary stakeholders.
          </Typography>
        </TextContent>

        {/* Right Section: Image Content */}
        <ImageContent component={motion.div} variants={imageVariants}>
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
