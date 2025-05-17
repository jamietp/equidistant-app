import React, { useState } from 'react';

const LocationInput: React.FC<{ onLocationChange: (location: string) => void }> = ({ onLocationChange }) => {
    const [location, setLocation] = useState('');

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setLocation(event.target.value);
    };

    const handleGeolocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                onLocationChange(`${latitude}, ${longitude}`);
            });
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onLocationChange(location);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={location}
                onChange={handleInputChange}
                placeholder="Enter your location"
            />
            <button type="button" onClick={handleGeolocation}>
                Use my location
            </button>
            <button type="submit">Submit</button>
        </form>
    );
};

export default LocationInput;