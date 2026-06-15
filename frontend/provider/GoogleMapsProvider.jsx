// MapProvider.jsx
import { createContext, useContext } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

const MapContext = createContext();

const LIBRARIES = ["places"];

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
console.log("Google Maps API Key:", import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
console.log("Google Maps API Key:", apiKey ? "[loaded]" : "[MISSING]");

export const MapProvider = ({ children }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: apiKey,
    libraries: LIBRARIES,
  });

  console.log("Google Maps isLoaded:", isLoaded);
  if (loadError) console.error("Google Maps loadError:", loadError);

  return (
    <MapContext.Provider value={{ isLoaded, loadError }}>
      {children}
    </MapContext.Provider>
  );
};

export const useMap = () => useContext(MapContext);
