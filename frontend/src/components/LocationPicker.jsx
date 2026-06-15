import React, { useState, useCallback } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const containerStyle = {
  width: "400px",
  height: "400px",
};

const initialCenter = {
  lat: 6.9271, // Colombo
  lng: 79.8612,
};

export default function LocationPicker() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, 
  });

  const [markerPosition, setMarkerPosition] = useState(null);

  // When user clicks on map, place marker there
  const onMapClick = useCallback((e) => {
    setMarkerPosition({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    });
  }, []);

  // When user drags marker, update position
  const onMarkerDragEnd = useCallback((e) => {
    setMarkerPosition({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    });
  }, []);

  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div>
      <h2>Select Location</h2>
      {/* Map 1 */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={initialCenter}
        zoom={8}
        onClick={onMapClick}
        clickableIcons={false}
      >
        {markerPosition && (
          <Marker
            position={markerPosition}
            draggable={true}
            onDragEnd={onMarkerDragEnd}
          />
        )}
      </GoogleMap>

      <h2>Preview Location</h2>
      {/* Map 2 */}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={markerPosition || initialCenter}
        zoom={markerPosition ? 12 : 8}
      >
        {markerPosition && <Marker position={markerPosition} />}
      </GoogleMap>
    </div>
  );
}
