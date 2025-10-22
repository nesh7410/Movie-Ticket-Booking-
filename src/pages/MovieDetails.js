import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './MovieDetails.css';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMovieAndShowtimes();
  }, [id]);

  const fetchMovieAndShowtimes = async () => {
    try {
      const [movieResponse, showtimesResponse] = await Promise.all([
        api.get(`/movies/${id}`),
        api.get(`/showtimes/movie/${id}`)
      ]);
      
      setMovie(movieResponse.data);
      setShowtimes(showtimesResponse.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to load movie details');
      setLoading(false);
    }
  };

  const groupShowtimesByDate = () => {
    const grouped = {};
    showtimes.forEach(showtime => {
      const date = new Date(showtime.show_date).toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      if (!grouped[date]) {
        grouped[date] = {};
      }
      if (!grouped[date][showtime.screen_name]) {
        grouped[date][showtime.screen_name] = [];
      }
      grouped[date][showtime.screen_name].push(showtime);
    });
    return grouped;
  };

  const handleShowtimeClick = (showtimeId) => {
    navigate(`/booking/${showtimeId}`);
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

  const groupedShowtimes = groupShowtimesByDate();

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
          
          <div className="showtimes-section">
            <h2 className="showtimes-title">Select Showtime</h2>
            {Object.keys(groupedShowtimes).length === 0 ? (
              <p className="no-showtimes">No showtimes available for this movie.</p>
            ) : (
              Object.entries(groupedShowtimes).map(([date, screens]) => (
                <div key={date} className="date-group">
                  <h3 className="date-header">{date}</h3>
                  {Object.entries(screens).map(([screenName, times]) => (
                    <div key={screenName} className="screen-group">
                      <h4 className="screen-header">{screenName}</h4>
                      <div className="showtime-slots">
                        {times.map((showtime) => {
                          const availableSeats = showtime.total_seats - showtime.booked_seats;
                          const isAlmostFull = availableSeats < 10;
                          
                          return (
                            <button
                              key={showtime.id}
                              className={`showtime-btn ${isAlmostFull ? 'almost-full' : ''}`}
                              onClick={() => handleShowtimeClick(showtime.id)}
                              disabled={availableSeats === 0}
                            >
                              <span className="showtime-time">
                                {new Date(`2000-01-01T${showtime.show_time}`).toLocaleTimeString('en-US', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                              <span className="showtime-price">₹{showtime.price}</span>
                              <span className="showtime-seats">
                                {availableSeats === 0 ? 'Full' : `${availableSeats} seats`}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;

