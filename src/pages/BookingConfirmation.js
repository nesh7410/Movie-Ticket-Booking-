import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './BookingConfirmation.css';

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const response = await api.get(`/bookings/${bookingId}`);
      setBooking(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to load booking details');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="confirmation-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="confirmation-container">
        <div className="error">{error || 'Booking not found'}</div>
      </div>
    );
  }

  // Handle seats data - it might be a string or already parsed
  const seats = typeof booking.seats === 'string' 
    ? JSON.parse(booking.seats) 
    : booking.seats;

  return (
    <div className="confirmation-container">
      <div className="confirmation-card">
        <div className="success-icon">✓</div>
        <h1 className="confirmation-title">Booking Confirmed!</h1>
        <p className="confirmation-subtitle">Your tickets have been booked successfully</p>

        <div className="booking-details">
          <div className="detail-row">
            <span className="detail-label">Booking ID:</span>
            <span className="detail-value">#{booking.id}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Movie:</span>
            <span className="detail-value">{booking.movie_title}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Screen:</span>
            <span className="detail-value">{booking.screen_name}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Date:</span>
            <span className="detail-value">
              {new Date(booking.show_date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Time:</span>
            <span className="detail-value">
              {new Date(`2000-01-01T${booking.show_time}`).toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Seats:</span>
            <span className="detail-value seats-list">{seats.sort().join(', ')}</span>
          </div>

          <div className="detail-row highlight">
            <span className="detail-label">Total Amount:</span>
            <span className="detail-value">₹{booking.total_amount}</span>
          </div>

          <div className="detail-row">
            <span className="detail-label">Booked on:</span>
            <span className="detail-value">
              {new Date(booking.booking_date).toLocaleString('en-US')}
            </span>
          </div>
        </div>

        <div className="action-buttons">
          <button className="btn-primary" onClick={() => navigate('/')}>
            Book More Tickets
          </button>
          <button className="btn-secondary" onClick={() => navigate('/my-bookings')}>
            View My Bookings
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;

