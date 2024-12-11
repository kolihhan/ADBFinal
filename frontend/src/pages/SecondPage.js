import React, { useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import L from 'leaflet'; // Import the Leaflet namespace
import AppBarComponent from '../components/AppBarComponent.js'; // Adjust the path as needed

export const SecondPage = () => {
  const [geojsonData, setGeojsonData] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          setGeojsonData(data); // Set the GeoJSON data to state
        } catch (error) {
          alert('Invalid GeoJSON file');
        }
      };
      reader.readAsText(file);
    }
  };

  // Component to zoom the map to GeoJSON bounds
  const ZoomToBounds = ({ geojson }) => {
    const map = useMap();
    if (geojson) {
      const bounds = L.geoJSON(geojson).getBounds();
      map.fitBounds(bounds);
    }
    return null;
  };

  return (
    <div className="App">
      {/* Include the AppBar component */}
      <AppBarComponent />

      {/* File input for uploading GeoJSON */}
      <input
        type="file"
        accept=".geojson"
        onChange={handleFileUpload}
        style={{ margin: '20px' }}
      />

      {/* MapContainer to render the Leaflet map */}
      <MapContainer
        style={{ height: '600px', width: '100%' }}
        center={[23.6978, 120.9605]} // Default center set to Taiwan
        zoom={7} // Default zoom level
      >
        {/* Add OpenStreetMap tiles */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* Render GeoJSON layer if data is loaded */}
        {geojsonData && (
          <GeoJSON
            data={geojsonData}
            style={{
              color: 'blue',
              weight: 2,
              fillOpacity: 0.5,
            }}
            onEachFeature={(feature, layer) => {
              // Add popup for each feature
              if (feature.properties) {
                const { name, name:en, addr:full, address } = feature.properties;
                const popupContent = `
                  <div style="font-family: Arial, sans-serif; line-height: 1.5;">
                    <h3 style="margin: 0; color: #007bff;">${name || 'N/A'}</h3>
                    <p style="margin: 5px 0;"><strong>English Name:</strong> ${feature.properties['name:en'] || 'N/A'}</p>
                    <p style="margin: 5px 0;"><strong>Address:</strong> ${feature.properties['addr:full'] || 'N/A'}</p>
                  </div>
                `;
                layer.bindPopup(popupContent);
              }
            }}            
          />
        )}

        {/* Automatically zoom to bounds when GeoJSON is loaded */}
        {geojsonData && <ZoomToBounds geojson={geojsonData} />}
      </MapContainer>
    </div>
  );
};

export default SecondPage;
