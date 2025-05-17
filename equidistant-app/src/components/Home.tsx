import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const Home: React.FC = () => {
  const [location1, setLocation1] = useState('');
  const [location2, setLocation2] = useState('');
  const history = useHistory();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!location1.trim() || !location2.trim()) {
      alert('Please enter both postcodes');
      return;
    }
    history.push(`/activities?loc1=${encodeURIComponent(location1.trim())}&loc2=${encodeURIComponent(location2.trim())}`);
  };

  return (
    <div className="home">
      <div className="hero">
        <h1>Find Your Perfect Midpoint</h1>
        <p>Discover great places to meet halfway between two London locations</p>
      </div>

      <div className="search-container">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="location1">First Location</label>
            <input
              id="location1"
              type="text"
              placeholder="Enter first postcode (e.g., SW1A 1AA)"
              value={location1}
              onChange={(e) => setLocation1(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label htmlFor="location2">Second Location</label>
            <input
              id="location2"
              type="text"
              placeholder="Enter second postcode (e.g., E1 6AN)"
              value={location2}
              onChange={(e) => setLocation2(e.target.value)}
            />
          </div>

          <button type="submit">
            Find Activities
          </button>
        </form>

        <div className="features">
          <div className="feature">
            <span className="feature-icon">🎯</span>
            <h3>Perfect Location</h3>
            <p>Find the ideal meeting point</p>
          </div>
          <div className="feature">
            <span className="feature-icon">🍽️</span>
            <h3>Great Places</h3>
            <p>Discover restaurants & activities</p>
          </div>
          <div className="feature">
            <span className="feature-icon">📍</span>
            <h3>Easy Navigation</h3>
            <p>Get directions instantly</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;