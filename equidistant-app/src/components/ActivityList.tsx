import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Place, searchNearbyPlaces } from '../services/placesService';
import { geocodeAddress } from '../services/geocodingService';
import { calculateDistance } from '../utils/distance';
import Map from './Map';

const ActivityList: React.FC = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedReviews, setExpandedReviews] = useState<{ [key: string]: boolean }>({});
  const [locations, setLocations] = useState<{
    location1: [number, number];
    location2: [number, number];
    midpoint: [number, number];
  } | null>(null);

  const toggleReviews = (placeId: string) => {
    setExpandedReviews(prev => ({
      ...prev,
      [placeId]: !prev[placeId]
    }));
  };

  const truncateText = (text: string, maxLength: number = 100): string => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substring(0, text.lastIndexOf(' ', maxLength)) + '...';
  };

  const location = useLocation();

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams(location.search);
        const loc1 = params.get('loc1');
        const loc2 = params.get('loc2');

        if (!loc1 || !loc2) {
          throw new Error('Please provide both locations');
        }

        console.log('Fetching coordinates for:', { loc1, loc2 });

        const [pos1, pos2] = await Promise.all([
          geocodeAddress(loc1),
          geocodeAddress(loc2)
        ]).catch(error => {
          console.error('Geocoding error:', error);
          throw new Error('Could not find one or both locations. Please try more specific addresses.');
        });

        const midLat = (pos1.lat + pos2.lat) / 2;
        const midLon = (pos1.lon + pos2.lon) / 2;

        console.log('Calculated midpoint:', { midLat, midLon });

        const newLocations = {
          location1: [pos1.lat, pos1.lon] as [number, number],
          location2: [pos2.lat, pos2.lon] as [number, number],
          midpoint: [midLat, midLon] as [number, number]
        };
        setLocations(newLocations);

        // Search for various establishment types at the midpoint
        const radius = 500; // 500 meters radius
        const nearbyPlaces = await searchNearbyPlaces(midLat, midLon, radius, 'restaurant|bar|cafe|pub');
        console.log('Found nearby places:', nearbyPlaces);
        
        if (!nearbyPlaces.length) {
          throw new Error('No places found. Try different locations or a larger search area.');
        }

        const placesWithDistances = nearbyPlaces
          .map((place: any) => ({
            ...place,
            distanceToMid: calculateDistance(midLat, midLon, place.latitude, place.longitude),
            distanceToLoc1: calculateDistance(pos1.lat, pos1.lon, place.latitude, place.longitude),
            distanceToLoc2: calculateDistance(pos2.lat, pos2.lon, place.latitude, place.longitude)
          }))
          .sort((a: any, b: any) => a.distanceToMid - b.distanceToMid);

        setPlaces(placesWithDistances);
        setError(null);
      } catch (err) {
        console.error('Error in ActivityList:', err);
        setError(err instanceof Error ? err.message : 'Failed to load places');
        setPlaces([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [location]);

  return (
    <div>
      <div className="header-container">
        <h1>MidPoint</h1>
        <Link to="/" className="search-again-button">
          Search Again
        </Link>
      </div>
      {locations && (
        <div className="map-container">
          <Map locations={locations} />
        </div>
      )}

      <div className="activity-list">
        {loading && (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Finding the best places for you...</p>
          </div>
        )}
        
        {error && <div className="error">{error}</div>}
        
        {!loading && !error && (
          <>
            <div className="activity-grid">
              {places.map(place => (
                <div key={place.id} className="activity-item">
                  {place.imageUrl && (
                    <a 
                      href={place.googleMapsUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="place-image-link"
                    >
                      <img 
                        src={place.imageUrl} 
                        alt={place.name}
                        className="place-image"
                        title="Click to open in Google Maps"
                      />
                    </a>
                  )}
                  <div className="place-details">
                    <div className="place-header">
                      <h3>{place.name}</h3>
                      <span className="place-type">{place.type}</span>
                    </div>
                    {place.rating && (
                      <div className="rating">
                        {place.rating.toFixed(1)} ⭐
                      </div>
                    )}
                    {place.address && (
                      <address>{place.address}</address>
                    )}
                    <div className="distance-info">
                      <span>📍 {place.distanceToLoc1?.toFixed(1)}km from location 1</span>
                      <span>📍 {place.distanceToLoc2?.toFixed(1)}km from location 2</span>
                    </div>
                    
                    {place.reviews && place.reviews.length > 0 && (
                      <div className="reviews">
                        <h4>Top Reviews</h4>
                        
                        <div className="review">
                          <div className="review-content">
                            <div className="review-header">
                              <span className="reviewer-name">{place.reviews[0].author || "Anonymous"}</span>
                              <div className="review-rating">{place.reviews[0].rating} ⭐</div>
                            </div>
                            <p className="review-text">
                              {expandedReviews[place.id] 
                                ? place.reviews[0].text 
                                : truncateText(place.reviews[0].text)}
                            </p>
                            <time className="review-date">
                              {place.reviews[0].date ? new Date(Number(place.reviews[0].date) * 1000).toLocaleDateString() : ''}
                            </time>
                          </div>
                        </div>
                        
                        <button 
                          className="show-more-button"
                          onClick={() => toggleReviews(place.id)}
                        >
                          {expandedReviews[place.id] ? 'Show Less' : 'Show More Reviews'}
                        </button>
                        
                        {expandedReviews[place.id] && place.reviews.slice(1).map((review, index) => (
                          <div key={index} className="review">
                            <div className="review-content">
                              <div className="review-header">
                                <span className="reviewer-name">{review.author || "Anonymous"}</span>
                                <div className="review-rating">{review.rating} ⭐</div>
                              </div>
                              <p className="review-text">{review.text}</p>
                              <time className="review-date">
                                {review.date ? new Date(Number(review.date) * 1000).toLocaleDateString() : ''}
                              </time>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ActivityList;