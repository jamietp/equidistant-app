import axios from 'axios';

export interface Review {
  rating: number;
  text: string;
  date: string;
  author?: string;
  profileUrl?: string;
}

export interface Place {
  id: string;
  name: string;
  type: string;
  latitude: number;
  longitude: number;
  address?: string;
  rating?: number;
  imageUrl?: string;
  reviews?: Review[];
  distanceToMid?: number;
  distanceToLoc1?: number;
  distanceToLoc2?: number;
  googleMapsUrl?: string;
}

// Google Places API key from environment variable
const GOOGLE_PLACES_API_KEY = process.env.REACT_APP_GOOGLE_PLACES_API_KEY;

/**
 * Fetch place details including reviews
 * @param placeId The place ID to fetch details for
 * @returns Promise with place details
 */
export const getPlaceDetails = async (placeId: string) => {
  try {
    const response = await axios.get('/maps/api/place/details/json', {
      params: {
        place_id: placeId,
        fields: 'reviews,url',
        key: GOOGLE_PLACES_API_KEY,
      }
    });

    if (response.data && response.data.result) {
      const result = response.data.result;
      return {
        reviews: result.reviews ? result.reviews.slice(0, 3).map((review: any) => ({
          author: review.author_name,
          rating: review.rating,
          text: review.text,
          date: review.time,
          profileUrl: review.profile_photo_url
        })) : [],
        url: result.url
      };
    }
    return { reviews: [], url: null };
  } catch (error) {
    console.error('Error fetching place details:', error);
    return { reviews: [], url: null };
  }
};

/**
 * Search for nearby places based on latitude, longitude, and search radius
 * @param lat Latitude of the search center
 * @param lng Longitude of the search center
 * @param radius Search radius in meters
 * @param type Type of places to search for (e.g. 'restaurant', 'cafe', 'bar', 'pub' or multiple with '|' separator)
 * @returns Promise with search results (limited to 10 places)
 */
export const searchNearbyPlaces = async (lat: number, lng: number, radius: number, type: string) => {
  console.log('Searching for nearby places:', { lat, lng, radius, type });
  
  try {
    // Ensure we have proper type checking for the API response
    const response = await axios.get('/maps/api/place/nearbysearch/json', {
      params: {
        location: `${lat},${lng}`,
        radius,
        type,
        key: GOOGLE_PLACES_API_KEY,
        // Add any other required parameters here
      }
    });

    // Check if the response is valid
    if (response.data && response.data.results) {
      // Map the places and fetch details for each
      const places = response.data.results.slice(0, 10).map((place: any) => ({
        id: place.place_id,
        name: place.name,
        type: place.types[0].replace('_', ' '),
        rating: place.rating,
        address: place.vicinity,
        latitude: place.geometry.location.lat,
        longitude: place.geometry.location.lng,
        imageUrl: place.photos && place.photos[0] ? 
          `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${GOOGLE_PLACES_API_KEY}` : null,
        googleMapsUrl: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
        reviews: []
      }));
      
      // Fetch details for each place to get reviews
      for (const place of places) {
        const details = await getPlaceDetails(place.id);
        place.reviews = details.reviews;
        if (!place.googleMapsUrl && details.url) {
          place.googleMapsUrl = details.url;
        }
      }
      
      return places;
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching nearby places:', error);
    throw new Error('Failed to fetch places nearby');
  }
};