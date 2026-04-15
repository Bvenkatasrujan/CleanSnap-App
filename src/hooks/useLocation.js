import { useState } from 'react';
import * as Location from 'expo-location';

export const useLocation = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLocation = async () => {
    setLoading(true);
    setError(null);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied. Please enable it in settings.');
        return null;
      }

      const coords = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const loc = {
        latitude: coords.coords.latitude,
        longitude: coords.coords.longitude,
      };
      setLocation(loc);
      return loc;
    } catch (err) {
      setError('Failed to fetch location. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { location, loading, error, fetchLocation };
};
