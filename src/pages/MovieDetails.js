import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import './MovieDetails.css';

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [screens, setScreens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMovieAndScreens();
  }, [id]);

  const fetchMovieAndScreens = async () => {
    try {
      const [movieResponse, screensResponse] = await Promise.all([
        api.get(`/movies/${id}`),
        api.get('/screens')
      ]);
      
      setMovie(movieResponse.data);
      setScreens(screensResponse.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to load movie details');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="movie-details-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="movie-details-container">
        <div className="error">{error || 'Movie not found'}</div>
      </div>
    );
  }

  return (
    <div className="movie-details-container">
      <div className="movie-details-content">
        <div className="movie-poster-section">
          <img 
            src={movie.poster_url} 
            alt={movie.title}
            className="movie-details-poster"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
            }}
          />
        </div>
        <div className="movie-info-section">
          <h1 className="movie-details-title">{movie.title}</h1>
          <p className="movie-details-duration">Duration: {movie.duration} minutes</p>
          <p className="movie-details-description">{movie.description}</p>
          
          <div className="screens-section">
            <h2 className="screens-title">Available Screens</h2>
            <div className="screens-list">
              {screens.map((screen) => (
                <div key={screen.id} className="screen-card">
                  <h3>{screen.name}</h3>
                  <p>{screen.total_seats} seats</p>
                </div>
              ))}
            </div>
            <p className="booking-note">
              * Booking functionality will be available in Phase 2
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;

