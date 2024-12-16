import React, { useState, useEffect, useRef} from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import 'leaflet-routing-machine';
import AppBarComponent from '../components/AppBarComponent.js';
import AppBarComponenttwo from '../components/AppBarComponenttwo.js';
import Footer from '../components/FooterComponent.js';
import { Drawer, Box, Typography, IconButton, Toolbar, AppBar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export const SecondPage = () => {
  const [geojsonData, setGeojsonData] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [selectedId, setSelectedId] = useState(null); // Sync dropdown and map selection
  const [openDrawer, setOpenDrawer] = useState(false);
  const [featureDetails, setFeatureDetails] = useState(null);
  const [univGeoJSONReady, setUnivGeoJSONReady] = useState(false);
  const [areaGeoJSONReady, setAreaGeoJSONReady] = useState(false);
  const [lowUnivJsonReady,setLowUnivJSONReady] = useState(false);
  const [studentWithCertReady,setStudentWithCertReady] = useState(false);
  const [accessibilityReady,setAccessibilityReady] = useState(false);

  const fetchAccessibility = async () => {
    try {
      const response = await fetch('http://localhost:5000/get_ai_program_outreach_accessibility');
      if (!response.ok) {
        throw new Error('Failed to fetch GeoJSON');
      }
      
      const data = await response.json();
      console.log(data);
      setGeojsonData(data);
      setUnivGeoJSONReady(false);
      setAreaGeoJSONReady(false);
      setLowUnivJSONReady(false);
      setStudentWithCertReady(false);
      setAccessibilityReady(true);
    } catch (error) {
      console.error('Error fetching GeoJSON:', error);
    }
  };
    const fetchUnivGeoJSON = async () => {
      try {
        const response = await fetch('http://localhost:5000/universities');
        if (!response.ok) {
          throw new Error('Failed to fetch GeoJSON');
        }
        
        const data = await response.json();
        console.log(data);
        setGeojsonData(data);
        setUnivGeoJSONReady(true);
        setAreaGeoJSONReady(false);
        setLowUnivJSONReady(false);
        setStudentWithCertReady(false);
        setAccessibilityReady(false);
      } catch (error) {
        console.error('Error fetching GeoJSON:', error);
      }
    };

    const fetchAreaStudentGeoJson = async () => {
      try {
        const response = await fetch('http://localhost:5000/count_student');
        if (!response.ok) {
          throw new Error('Failed to fetch GeoJSON');
        }
        const data = await response.json();
        console.log(data);
        setGeojsonData(data);
        setUnivGeoJSONReady(false);
        setAreaGeoJSONReady(true);
        setLowUnivJSONReady(false);
        setStudentWithCertReady(false);
        setAccessibilityReady(false);
      } catch (error) {
        console.error('Error fetching GeoJSON:', error);
      }
    };
    const fetchLowUniv = async () => {
      try {
        const response = await fetch('http://localhost:5000/count_low_student');
        if (!response.ok) {
          throw new Error('Failed to fetch GeoJSON');
        }
        
        const data = await response.json();
        console.log(data);
        setGeojsonData(data);
        setUnivGeoJSONReady(false);
        setAreaGeoJSONReady(false);
        setLowUnivJSONReady(true);
        setStudentWithCertReady(false);
        setAccessibilityReady(false);
      } catch (error) {
        console.error('Error fetching GeoJSON:', error);
      }
    };
    const fetchStudentWithCert = async () => {
      try {
        const response = await fetch('http://localhost:5000/get_student_cert');
        if (!response.ok) {
          throw new Error('Failed to fetch GeoJSON');
        }
        
        const data = await response.json();
        console.log(data);
        setGeojsonData(data);
        setUnivGeoJSONReady(false);
        setAreaGeoJSONReady(false);
        setLowUnivJSONReady(false);
        setStudentWithCertReady(true);
        setAccessibilityReady(false);
      } catch (error) {
        console.error('Error fetching GeoJSON:', error);
      }
    };

  const handleOpenDrawer = (feature) => {
    setFeatureDetails(feature.properties); // Set feature details for the drawer
    setOpenDrawer(true);
  };

  const handleCloseDrawer = () => {
    setOpenDrawer(false);
    setFeatureDetails(null);
  };
  const getClosestFeature = (latlng) => {
    if (!geojsonData || !geojsonData.features) return null;
  
    let closestFeature = null;
    let minDistance = Infinity;
  
    geojsonData.features.forEach((feature) => {
      const geometry = feature.geometry;
      if (!geometry || !geometry.coordinates || geometry.coordinates.length === 0) return;
  
      // Check if the geometry is a MultiPolygon
      if (geometry.type === 'MultiPolygon') {
        geometry.coordinates.forEach((polygonCoordinates) => {
          // For each polygon, iterate through the exterior ring (first element in the array)
          const polygonLatLngs = polygonCoordinates[0].map(coord => L.latLng(coord[1], coord[0])); // [lat, lng]
          
          const polygonBounds = L.latLngBounds(polygonLatLngs);
          const distance = polygonBounds.getCenter().distanceTo(latlng);  // You can adjust this to a better calculation if needed
  
          if (distance < minDistance) {
            minDistance = distance;
            closestFeature = feature;
          }
        });
      } else if (geometry.type === 'Polygon') {
        // Handle simple Polygon geometry as well
        const polygonLatLngs = geometry.coordinates[0].map(coord => L.latLng(coord[1], coord[0])); // [lat, lng]
        const polygonBounds = L.latLngBounds(polygonLatLngs);
        const distance = polygonBounds.getCenter().distanceTo(latlng); // You can adjust this to a better calculation if needed
  
        if (distance < minDistance) {
          minDistance = distance;
          closestFeature = feature;
        }
      }
    });
  
    return closestFeature;
  };
  
  const MapClickHandler = () => {
    const [routeControl, setRouteControl] = useState(null);
    const routeControlRef = useRef(null);  // Use ref to hold the route control
    
    useMapEvents({
      click(e) {
        if (!geojsonData) return;
  
        const clickedLatLng = e.latlng;
        const closestFeature = getClosestFeature(clickedLatLng);
  
        if (closestFeature) {
          const map = e.target;
  
          // Clear previous route if it exists
          if (routeControlRef.current) {
            //map.removeControl(routeControlRef.current);
          }
          L.Icon.Default.mergeOptions({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
          });
          // Determine the coordinates of the closest feature
          const coordinates = closestFeature.geometry.type === 'MultiPolygon'
            ? closestFeature.geometry.coordinates[0][0]  // Use first polygon in the MultiPolygon
            : closestFeature.geometry.coordinates[0];  // For simple Polygon
  
          const closestPoint = L.latLng(coordinates[0][1], coordinates[0][0]); // lat, lng
          const newRouteControl = L.Routing.control({
            
            waypoints: [
              clickedLatLng,  // Start from the clicked point
              closestPoint     // Closest point on the feature
            ],
            routeWhileDragging: true,
            
            lineOptions: {
              styles: [{ color: 'red', weight: 5 }]  // Set route color to blue
            },
          }).addTo(map);

          routeControlRef.current = newRouteControl;  // Save the new route control instance
          setRouteControl(newRouteControl);  // Update state to track the route control
        }
      }
    });
  
    return null;
  };
  const getSelectedIndex = (feature) => {
    if (!geojsonData || !geojsonData.features) return null;
    return geojsonData.features.findIndex((f) => f === feature);
  };

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
      
      {(!areaGeoJSONReady && !lowUnivJsonReady) && geojsonData  && (
        <div style={{ margin: '10px', textAlign: 'center' }}>
          <select
            value={selectedId !== null ? selectedId : ''} // Set dropdown value to selected university index
            onChange={(e) => {
              const featureId = e.target.value;
              const feature = geojsonData.features[parseInt(featureId)];
              setSelectedFeature(feature || null); // Update selected feature
              setSelectedId(parseInt(featureId)); // Update selected index for dropdown
            }}
          >
            <option value="">Select a university</option>
            {geojsonData.features.map((feature, index) => (
              <option key={index} value={index}>
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
          key={JSON.stringify(geojsonData)} // Make sure the key changes when geojsonData changes
          data={geojsonData}
          style={{
            color: 'blue',
            weight: 2,
            fillOpacity: 0.5,
          }}
          onEachFeature={(feature, layer) => {
            if (feature.properties) {
              const { name } = feature.properties;
              let popupContent = null;
              
                popupContent = `
                  <h3>${name || 'N/A'}</h3>
                  <button id="showDetailBtn-${name}" class="leaflet-popup-button">Show Detail</button>
                `;
              
              
              
              layer.bindPopup(popupContent);
              // Add event listener when the popup opens
              layer.on('popupopen', () => {
                const button = document.getElementById(`showDetailBtn-${name}`);
                if (button) {
                  button.addEventListener('click', () => {
                    handleOpenDrawer(feature);
                  });
                }
              });
        
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
        <MapClickHandler />
      </MapContainer>

      {/* AppBarComponenttwo below the map */}
      <Box sx={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
        <AppBarComponenttwo fetchAreaStudentGeoJson = {fetchAreaStudentGeoJson} 
        fetchUnivGeoJSON = {fetchUnivGeoJSON} fetchLowUniv = {fetchLowUniv} 
        fetchStudentWithCert = {fetchStudentWithCert}
        handleCloseDrawer = {handleCloseDrawer}
        fetchAccessibility = {fetchAccessibility}
        />
        
      </Box>

      {/* Non-blocking Drawer for Feature Details */}
      {<Drawer
        anchor="left"
        open={openDrawer}
        onClose={handleCloseDrawer}
        hideBackdrop
        variant="persistent"
        sx={{
          '& .MuiDrawer-paper': {
            width: '20%', // Adjust width as needed
            position: 'fixed',
            zIndex: 1200,
            backgroundColor: '#f5f5f5', // Light background for contrast
            borderRight: '1px solid #ddd', // Subtle border
            boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)', // Add a shadow for depth
            padding: '20px', // Add padding inside the Drawer
          },
        }}
      >
        <Toolbar sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
          {(univGeoJSONReady? <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
            University Details
          </Typography> : <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
            Area Details
          </Typography>)}
          <IconButton onClick={handleCloseDrawer}>
            <CloseIcon />
          </IconButton>
        </Toolbar>

        <Box sx={{ textAlign: 'center' }}>
          {featureDetails ? (
            <div>
              <Typography variant="h5" sx={{ mb: 2, color: '#444' }}>
                {featureDetails.name}
              </Typography>
              <Typography variant="body1" sx={{ color: '#666' }}>
                <strong>Number of Students:</strong> {featureDetails.count || 'N/A'}
              </Typography>
              {/* Add more details or visuals here */}
            </div>
          ) : (
            <Typography variant="body2" sx={{ color: '#888' }}>
              Loading details...
            </Typography>
          )}
        </Box>
      </Drawer>}
      <Footer/>
    </div>
  );
};

export default SecondPage;
