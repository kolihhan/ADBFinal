import React from 'react';
import AppBarComponent from '../components/AppBarComponent.js'; // Adjust the path as needed
import Footer from '../components/FooterComponent.js'
import { Card, CardContent, CardMedia, Grid, Typography, Box, Link } from '@mui/material';
import { styled } from '@mui/system';

const TeamContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  backgroundColor: theme.palette.background.default,
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const TeamTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 'bold',
  marginBottom: theme.spacing(4),
  color: theme.palette.secondary.main,
}));

const TeamCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  boxShadow: theme.shadows[6],
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
  backgroundColor: theme.palette.background.paper,
}));

const TeamImage = styled(CardMedia)(({ theme }) => ({
  height: 200,
  width: 200,
  borderRadius: '50%',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  objectFit: 'cover',
  boxShadow: theme.shadows[3],
}));

const TeamMember = ({ name, role, image, linkedin }) => (
  <Link href={linkedin} target="_blank" rel="noopener" underline="none">
    <TeamCard>
      <TeamImage component="img" image={image} alt={`${name}'s photo`} />
      <CardContent>
        <Typography variant="h6" component="h2" align="center" color="textPrimary">
          {name}
        </Typography>
        <Typography variant="body2" color="textSecondary" align="center">
          {role}
        </Typography>
      </CardContent>
    </TeamCard>
  </Link>
);

export const FourthPage = () => {
  return (
    <div className="App">
      <AppBarComponent />
      
      <TeamContainer>
        <TeamTitle variant="h3" align="center">
          Meet Our Team
        </TeamTitle>
        
        <Grid container spacing={4} justifyContent="center">
          {/* Example team members with LinkedIn links */}
          <Grid item xs={12} sm={6} md={4}>
            <TeamMember
              name="Lindsey Anne Yu"
              role="112065423"
              image="lindsey.jpeg" // Replace with actual images
              linkedin="https://www.linkedin.com/in/lindseyanne/"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TeamMember
              name="Ko Li Han"
              role="112065710"
              image="ko.jpeg" // Replace with actual images
              linkedin="https://www.linkedin.com/in/ko-lih-han-748993241"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TeamMember
              name="Bill Louis Harchan"
              role="110006213"
              image="bill.png" // Replace with actual images
              linkedin="https://www.linkedin.com/in/billlouis/"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TeamMember
              name="Christian Owen"
              role="110006217"
              image="owen.jpg" // Replace with actual images
              linkedin="https://www.linkedin.com/in/christian-owen27/"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TeamMember
              name="Keith Saudjana"
              role="113062421"
              image="keith.jpg" // Replace with actual images
              linkedin="https://www.linkedin.com/in/keithsaudjana"
            />
          </Grid>
        </Grid>
      </TeamContainer>
      <Footer/>
    </div>
  );
};

export default FourthPage;
