import { useState, useCallback } from 'react';

export const LOCATION_STATUS = {
  IDLE: 'idle',
  REQUESTING: 'requesting',
  SUCCESS: 'success',
  DENIED: 'denied',
  TIMEOUT: 'timeout',
  UNAVAILABLE: 'unavailable',
  LOW_ACCURACY: 'low_accuracy',
};

export const useGeolocation = () => {
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState(LOCATION_STATUS.IDLE);
  const [coordinates, setCoordinates] = useState(null); // { lat, lng, accuracy }
  const [errorMessage, setErrorMessage] = useState('');

  const requestPosition = useCallback(() => {
    if (!consent) {
      setErrorMessage('Please check the consent box before acquiring location.');
      return;
    }

    if (!('geolocation' in navigator)) {
      setStatus(LOCATION_STATUS.UNAVAILABLE);
      setErrorMessage('Geolocation is not supported by your browser.');
      return;
    }

    setStatus(LOCATION_STATUS.REQUESTING);
    setErrorMessage('');

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setCoordinates({
          lat: latitude,
          lng: longitude,
          accuracy: Math.round(accuracy),
        });

        if (accuracy > 100) {
          setStatus(LOCATION_STATUS.LOW_ACCURACY);
          setErrorMessage('Low GPS accuracy (>100m). Please drag the pin on the map to pinpoint the exact shop.');
        } else {
          setStatus(LOCATION_STATUS.SUCCESS);
          setErrorMessage('');
        }
      },
      (error) => {
        console.warn('Geolocation error:', error);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setStatus(LOCATION_STATUS.DENIED);
            setErrorMessage('Location permission was denied. Click the site settings icon in your browser URL bar to allow location.');
            break;
          case error.TIMEOUT:
            setStatus(LOCATION_STATUS.TIMEOUT);
            setErrorMessage('GPS request timed out. You can drag the pin on the map or select your market from the list.');
            break;
          case error.POSITION_UNAVAILABLE:
          default:
            setStatus(LOCATION_STATUS.UNAVAILABLE);
            setErrorMessage('GPS position is currently unavailable. Please pick your market from the dropdown.');
            break;
        }
      },
      options
    );
  }, [consent]);

  // Manually update coordinates (e.g., when citizen drags the pin on the map)
  const updateManualCoordinates = useCallback((lat, lng, accuracy = 10) => {
    setCoordinates({
      lat,
      lng,
      accuracy,
    });
    setStatus(LOCATION_STATUS.SUCCESS);
    setErrorMessage('');
  }, []);

  const clearLocation = useCallback(() => {
    setCoordinates(null);
    setStatus(LOCATION_STATUS.IDLE);
    setErrorMessage('');
  }, []);

  return {
    consent,
    setConsent,
    status,
    coordinates,
    errorMessage,
    requestPosition,
    updateManualCoordinates,
    clearLocation,
  };
};

