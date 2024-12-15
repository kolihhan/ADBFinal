import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box'; 
import { NavLink } from 'react-router-dom'; // Import NavLink instead of Link
import { useTheme } from '@mui/material/styles'; 
import '../css/AppBarComponent.css'; 

function AppBarComponent() {
  const theme = useTheme(); 

  return (
    <AppBar position="static" sx={{ backgroundColor: theme.palette.background.default }}>
      <Container>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <img
              src="taica_logo.png" 
              alt="Custom Logo"
              className="appbar-logo"
            />
            <Typography
              variant="h5"
              noWrap
              component="a"
              color={theme.palette.secondary.main}
            >
              TaicaMS
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-evenly', flexGrow: 1 }}>
            {/* Use NavLink for active link highlighting */}
            <Button sx={{ '&:hover': { backgroundColor: 'transparent' } }}>
              <NavLink 
                to="/" 
                style={({ isActive }) => ({ 
                  color: isActive ? theme.palette.secondary.dark : theme.palette.secondary.main,
                  textDecoration: isActive ? 'underline' : 'none' // Underline when active
                })}
              >
                About Us
              </NavLink>
            </Button>
            <Button sx={{ '&:hover': { backgroundColor: 'transparent' } }}>
              <NavLink 
                to="/second" 
                style={({ isActive }) => ({
                  color: isActive ? theme.palette.secondary.dark : theme.palette.secondary.main,
                  textDecoration: isActive ? 'underline' : 'none' // Underline when active
                })}
              >
                Spatial
              </NavLink>
            </Button>
            <Button sx={{ '&:hover': { backgroundColor: 'transparent' } }}>
              <NavLink 
                to="/third" 
                style={({ isActive }) => ({
                  color: isActive ? theme.palette.secondary.dark : theme.palette.secondary.main,
                  textDecoration: isActive ? 'underline' : 'none' // Underline when active
                })}
              >
                Graph
              </NavLink>
            </Button>
            <Button sx={{ '&:hover': { backgroundColor: 'transparent' } }}>
              <NavLink 
                to="/fourth" 
                style={({ isActive }) => ({ 
                  color: isActive ? theme.palette.secondary.dark : theme.palette.secondary.main,
                  textDecoration: isActive ? 'underline' : 'none' // Underline when active
                })}
              >
                Our Team
              </NavLink>
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default AppBarComponent;
