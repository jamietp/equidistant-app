import axios from 'axios';

interface GeocodingResult {
  lat: number;
  lon: number;
  display_name: string;
}

export const geocodeAddress = async (address: string): Promise<GeocodingResult> => {
  try {
    console.log('Geocoding postcode:', address);
    const cleanPostcode = address.trim().toUpperCase().replace(/\s+/g, '');
    const encodedPostcode = encodeURIComponent(cleanPostcode + ', London, UK');
    
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodedPostcode}&countrycodes=gb&bounded=1&viewbox=-0.5339,51.7225,0.3177,51.2867&limit=1`
    );

    if (!response.data || response.data.length === 0) {
      console.error('Invalid postcode:', address);
      throw new Error(`Invalid London postcode: ${address}`);
    }

    const result = {
      lat: parseFloat(response.data[0].lat),
      lon: parseFloat(response.data[0].lon),
      display_name: response.data[0].display_name
    };

    console.log('Geocoding result:', result);
    return result;
  } catch (error) {
    console.error('Geocoding error:', error);
    throw new Error(`Please enter a valid London postcode`);
  }
};