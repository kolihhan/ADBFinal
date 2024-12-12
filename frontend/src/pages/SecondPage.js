import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import AppBarComponent from '../components/AppBarComponent.js';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, IconButton, Toolbar, Box, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export const SecondPage = () => {
  const [geojsonData, setGeojsonData] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [selectedId, setSelectedId] = useState(null); // This is just to sync the dropdown and the map selection
  const [openDialog, setOpenDialog] = useState(false); 
  const [featureDetails, setFeatureDetails] = useState(null);

  // Fetch GeoJSON from the Flask API
  useEffect(() => {
    const fetchGeoJSON = async () => {
      try {
        const response = await fetch('http://localhost:5000/universities');
        if (!response.ok) {
          throw new Error('Failed to fetch GeoJSON');
        }
        const data = await response.json();
        setGeojsonData(data);
      } catch (error) {
        console.error('Error fetching GeoJSON:', error);
      }
    };

    fetchGeoJSON();
  }, []);

  const handleOpenDialog = (feature) => {
    setFeatureDetails(feature.properties); // Set feature details for the dialog
    setOpenDialog(true);
  };

  // Handle closing the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFeatureDetails(null);
  };

  // Additional function just to find index
  const getSelectedIndex = (feature) => {
    if (!geojsonData || !geojsonData.features) return null;
    return geojsonData.features.findIndex(f => f === feature);
  };

  // Zoom to the map
  const ZoomToBounds = ({ feature }) => {
    const map = useMap();

    useEffect(() => {
      if (feature && feature.geometry) {
        const bounds = L.geoJSON(feature).getBounds();
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }, [feature, map]);

    return null;
  };

  return (
    <div className="App">
      {/* Include the AppBar component */}
      <AppBarComponent />

      {/* University Selector */}
      {geojsonData && (
        <div style={{ margin: '10px', textAlign: 'center' }}>
          <select
            value={selectedId !== null ? selectedId : ""} // Set dropdown value to selected university index
            onChange={(e) => {
              const featureId = e.target.value;
              const feature = geojsonData.features[parseInt(featureId)];
              setSelectedFeature(feature || null); // Update selected feature
              setSelectedId(parseInt(featureId)); // Update selected index for dropdown
            }}
          >
            <option value="">Select a university</option>
            {geojsonData.features.map((feature, index) => (
              <option
                key={index} 
                value={index} 
              >
                {feature.properties.name || `Error`}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* MapContainer to render the Leaflet map */}
      <MapContainer
        style={{ height: '600px', width: '100%' }}
        center={[23.6978, 120.9605]} // Default center, Taiwan
        zoom={7} // Default zoom level
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* Render GeoJSON layer */}
        {geojsonData && (
        <GeoJSON
          data={geojsonData}
          style={{
            color: 'blue',
            weight: 2,
            fillOpacity: 0.5,
          }}
          onEachFeature={(feature, layer) => {
            if (feature.properties) {
              const { name } = feature.properties;  // Assuming each feature has a unique 'id'
              const popupContent = `
                <h3>${name || 'N/A'}</h3>
                <button id="showDetailBtn-${name}" class="leaflet-popup-button">Show Detail</button>
              `;
              layer.bindPopup(popupContent);

              // Handle adding the event listener once the popup is open
              layer.on('popupopen', () => {
                const button = document.getElementById(`showDetailBtn-${name}`);  // Unique ID for each button

                if (button) {
                  console.log(button);
                  button.addEventListener('click', () => {
                    handleOpenDialog(feature);
                  });
                }
              });

              // Handle the feature click and set the selected feature and ID
              layer.on('click', () => {
                const index = getSelectedIndex(feature);
                setSelectedFeature(feature);
                setSelectedId(index); // Set the index of the clicked feature
              });
            }
          }}
        />
      )}


        {/* Automatically zoom to selected feature */}
        <ZoomToBounds feature={selectedFeature} />
      </MapContainer>

      {/* Fullscreen Dialog for Feature Details */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullScreen
        TransitionComponent={Transition}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">{featureDetails?.name || 'University Details'}</Typography>
          <IconButton edge="start" color="inherit" onClick={handleCloseDialog} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Toolbar>

        <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <Box sx={{ textAlign: 'center' }}>
            {/* Render the details of the selected feature here */}
            {featureDetails ? (
              <div>
                <Typography variant="h6"><strong>Name:</strong> {featureDetails.name}</Typography>
                <Typography variant="body1"><strong>Location:</strong> {featureDetails.location || 'N/A'}</Typography>
                {/* Add more details as needed */}
              </div>
            ) : (
              <Typography variant="body2">Loading...</Typography>
            )}
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ justifyContent: 'center' }}>
          <Button onClick={handleCloseDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SecondPage;
