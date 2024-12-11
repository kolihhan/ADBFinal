import React from 'react';
import { FirstPage } from './pages/FirstPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import SecondPage from './pages/SecondPage';
import ThirdPage from './pages/ThirdPage';
import FourthPage from './pages/FourthPage';

// Define your custom theme
let theme = createTheme({
  palette: {
    primary: {
      main: '#f4f4f4', // Replace with your desired primary color
    },
    secondary: {
      main: '#5d1c60', // Replace with your desired secondary color
    },
    background: {
      default: '#f4f4f4', // Sets the background color for the entire app
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}> {/* Apply theme to the whole app */}
      <CssBaseline /> {/* Normalize CSS and apply the theme's background color */}
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<FirstPage/>}/>
            <Route path="/second" element={<SecondPage/>}/>
            <Route path="/third" element={<ThirdPage/>}/>
            <Route path="/fourth" element={<FourthPage/>}/>
          </Routes>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
