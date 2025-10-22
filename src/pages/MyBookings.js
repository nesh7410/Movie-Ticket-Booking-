import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './MyBookings.css';

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings/my-bookings');
      setBookings(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to load bookings');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="my-bookings-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-bookings-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="my-bookings-container">
      <h1 className="page-title">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="no-bookings">
          <p>You haven't made any bookings yet.</p>
          <button className="btn-primary" onClick={() => navigate('/')}>
            Browse Movies
          </button>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => {
            // Handle seats data - it might be a string or already parsed
            const seats = typeof booking.seats === 'string' 
              ? JSON.parse(booking.seats) 
              : booking.seats;
            const showDate = new Date(booking.show_date);
            const isPast = showDate < new Date();

            return (
              <div key={booking.id} className={`booking-card ${isPast ? 'past' : ''}`}>
                <div className="booking-header">
                  <div className="booking-id">Booking #{booking.id}</div>
                  <div className={`booking-status ${booking.status}`}>
                    {booking.status}
                  </div>
                </div>

                <div className="booking-content">
                  <div className="movie-section">
                    <img
                      src={booking.poster_url}
                      alt={booking.movie_title}
                      className="booking-poster"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/100x150?text=No+Image';
                      }}
                    />
                    <div className="movie-details">
                      <h2 className="movie-title">{booking.movie_title}</h2>
                      <p className="screen-info">{booking.screen_name}</p>
                      <p className="datetime-info">
                        {showDate.toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })} | {new Date(`2000-01-01T${booking.show_time}`).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="booking-info">
                    <div className="info-item">
                      <span className="info-label">Seats:</span>
                      <span className="info-value">{seats.sort().join(', ')}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Total Amount:</span>
                      <span className="info-value amount">₹{booking.total_amount}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Booked on:</span>
                      <span className="info-value">
                        {new Date(booking.booking_date).toLocaleDateString('en-US')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookings;

