import React from 'react';
import { Box, Typography, Grid, Link } from '@mui/material';
import { styled } from '@mui/system';

const AppContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh', // Ensure the footer is pushed to the bottom of the page
}));

const MainContent = styled(Box)(({ theme }) => ({
  flexGrow: 1, // This ensures the main content takes up available space
}));

const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: 'white',
  color: theme.palette.common.white,
  padding: theme.spacing(4, 0),
  textAlign: 'center',
  marginTop: 'auto', // Ensures the footer sticks to the bottom of the page
}));

const FooterContent = styled(Grid)(({ theme }) => ({
  justifyContent: 'center',
  textAlign: 'center',
  '& .footer-text': {
    marginBottom: theme.spacing(1),
  },
}));

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent container spacing={2}>
        <Grid item xs={12} sm={4}>
          <Typography variant="h6" className="footer-text" sx={{ color: 'secondary.main' }}>
            Contact Us
          </Typography>
          <Typography variant="body2" sx={{ color: 'secondary.main' }}>
            Email: <Link href="mailto:TAICAMS@nthu.edu.tw" color="inherit">TAICAMS@nthu.edu.tw</Link>
          </Typography>
          <Typography variant="body2" sx={{ color: 'secondary.main' }}>
            Phone: (123) 456-7890
          </Typography>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Typography variant="h6" className="footer-text" sx={{ color: 'secondary.main' }}>
            Address
          </Typography>
          <Typography variant="body2" sx={{ color: 'secondary.main' }}>
            No. 101號, Section 2, Guangfu Rd, East District, Hsinchu City, 300
          </Typography>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Typography variant="h6" className="footer-text" sx={{ color: 'secondary.main' }}>
            Follow Us
          </Typography>
          <Typography variant="body2" sx={{ color: 'secondary.main' }}>
            <Link href="https://www.facebook.com" color="inherit" target="_blank" rel="noopener">
              Facebook
            </Link>
            {' | '}
            <Link href="https://www.twitter.com" color="inherit" target="_blank" rel="noopener">
              Twitter
            </Link>
            {' | '}
            <Link href="https://www.instagram.com" color="inherit" target="_blank" rel="noopener">
              Instagram
            </Link>
          </Typography>
        </Grid>
      </FooterContent>

      <Typography variant="body2" color="inherit" sx={{ marginTop: 2, color: 'secondary.main' }}>
        &copy; {new Date().getFullYear()} Lindsey and the Boys. All wrongs reserved.
      </Typography>
    </FooterContainer>
  );
};

export default Footer;
