import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Custom marker icons
const createCustomIcon = (color: string) => new L.Icon({
  iconUrl: `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32'%3E%3Cpath fill='${encodeURIComponent(color)}' d='M16 0c-5.523 0-10 4.477-10 10 0 10 10 22 10 22s10-12 10-22c0-5.523-4.477-10-10-10zM16 16a6 6 0 1 1 0-12 6 6 0 0 1 0 12z'/%3E%3C/svg%3E`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const startIcon = createCustomIcon('#4f46e5');
const endIcon = createCustomIcon('#4f46e5');
const midpointIcon = createCustomIcon('#ef4444');

const customPolylineStyle = {
  weight: 3,
  color: '#6366f1',
  opacity: 0.8,
  dashArray: '10, 10',
  animate: true
};

function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

interface MapProps {
  locations: {
    location1: [number, number];
    location2: [number, number];
    midpoint: [number, number];
  };
}

const Map: React.FC<MapProps> = ({ locations }) => {
  const bounds = L.latLngBounds([locations.location1, locations.location2]);
  const center = bounds.getCenter();
  const zoom = 12;

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .leaflet-tile-pane {
        filter: saturate(0.8) contrast(0.9);
      }
      .leaflet-popup-content-wrapper {
        background: var(--surface);
        color: var(--text);
        border-radius: var(--radius);
        box-shadow: var(--shadow);
      }
      .leaflet-popup-tip {
        background: var(--surface);
      }
      .marker-popup {
        font-family: 'Inter', sans-serif;
        font-weight: 500;
        padding: 4px 8px;
      }
      @keyframes dash {
        to {
          stroke-dashoffset: -20;
        }
      }
      .leaflet-polyline path {
        animation: dash 1.5s linear infinite;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <MapContainer 
      center={center}
      zoom={zoom}
      style={{ 
        height: '500px', 
        width: '100%',
        maxWidth: '900px',
        margin: '0 auto',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow)'
      }}
    >
      <ChangeView center={[center.lat, center.lng]} zoom={zoom} />
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; OpenStreetMap contributors, &copy; CARTO'
      />
      <Marker position={locations.location1} icon={startIcon}>
        <Popup>
          <div className="marker-popup">Starting Location</div>
        </Popup>
      </Marker>
      <Marker position={locations.location2} icon={endIcon}>
        <Popup>
          <div className="marker-popup">End Location</div>
        </Popup>
      </Marker>
      <Marker position={locations.midpoint} icon={midpointIcon}>
        <Popup>
          <div className="marker-popup">Meeting Point</div>
        </Popup>
      </Marker>
      <Polyline positions={[locations.location1, locations.midpoint, locations.location2]} pathOptions={customPolylineStyle} />
    </MapContainer>
  );
};

export default Map;