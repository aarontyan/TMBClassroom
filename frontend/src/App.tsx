import React, {useState, useEffect} from 'react';
import ClassList from "./components/classList/classList";
import TitleBar from "./components/titleBar/titleBar"
import FilterMenu from './components/filterMenu/filterMenu';
import { SubmitProvider } from './components/filterMenu/submitContext';
import "./App.css"

interface Location {
  latitude: number | null;
  longitude: number | null;
}

function App() {

  const [location, setLocation] = useState<Location>({latitude : null, longitude : null})
  const [error, setError] = useState<string | null>(null);

  const sendLocationToBackend = async (location: Location) => {
    try {
      const response = await fetch('http://localhost:5000/api/location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(location),
      });
      if (!response.ok) {
        throw new Error('Failed to send location data to the backend');
      }
      const data = await response.json();
      console.log('Backend response:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  };


  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
          setLocation(newLocation);
          setError(null);
          sendLocationToBackend(newLocation)
        },
        (error) => {
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setError("User denied the request for Geolocation.");
              break;
            case error.POSITION_UNAVAILABLE:
              setError("Location information is unavailable.");
              break;
            case error.TIMEOUT:
              setError("The request to get user location timed out.");
              break;
            default:
              setError("An unknown error occurred.");
              break;
          }
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };


  useEffect(() => {
    getLocation();
  }, []);


  return (
    <SubmitProvider>
      <TitleBar />
      {location.latitude && location.longitude ? (
       <FilterMenu />
      ) : (
        <div/>
      )}
      {location.latitude && location.longitude ? (
        <div>
          <ClassList />
        </div>
        
      ) : (
        <p className="error-loading">{error ? error : "Fetching location..."}</p>
      )}
    </SubmitProvider>
  )
}

export default App;
