import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './SeatSelection.css';

const SeatSelection = () => {
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  const [showtime, setShowtime] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingInProgress, setBookingInProgress] = useState(false);

  useEffect(() => {
    fetchShowtimeAndSeats();
  }, [showtimeId]);

  const fetchShowtimeAndSeats = async () => {
    try {
      const [showtimeResponse, seatsResponse] = await Promise.all([
        api.get(`/showtimes/${showtimeId}`),
        api.get(`/bookings/seats/${showtimeId}`)
      ]);

      setShowtime(showtimeResponse.data);
      setSeats(seatsResponse.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to load showtime details');
      setLoading(false);
    }
  };

  const handleSeatClick = (seatNumber, isBooked) => {
    if (isBooked) return;

    setSelectedSeats((prev) => {
      if (prev.includes(seatNumber)) {
        return prev.filter((s) => s !== seatNumber);
      } else {
        return [...prev, seatNumber];
      }
    });
  };

  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      alert('Please select at least one seat');
      return;
    }

    setBookingInProgress(true);
    try {
      const response = await api.post('/bookings', {
        showtimeId,
        seats: selectedSeats
      });

      navigate(`/booking-confirmation/${response.data.booking.id}`);
    } catch (error) {
      alert(error.response?.data?.message || 'Booking failed. Please try again.');
      // Refresh seats to show updated availability
      fetchShowtimeAndSeats();
      setSelectedSeats([]);
    } finally {
      setBookingInProgress(false);
    }
  };

  const renderSeatGrid = () => {
    const rows = ['A', 'B', 'C', 'D', 'E'];
    const columns = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    return (
      <div className="seat-grid">
        <div className="screen-indicator">
          <div className="screen">SCREEN</div>
        </div>
        {rows.map((row) => (
          <div key={row} className="seat-row">
            <span className="row-label">{row}</span>
            <div className="seats">
              {columns.map((col) => {
                const seatNumber = `${row}${col}`;
                const seat = seats.find((s) => s.seat_number === seatNumber);
                const isBooked = seat?.is_booked || false;
                const isSelected = selectedSeats.includes(seatNumber);

                return (
                  <button
                    key={seatNumber}
                    className={`seat ${isBooked ? 'booked' : ''} ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSeatClick(seatNumber, isBooked)}
                    disabled={isBooked}
                    title={seatNumber}
                  >
                    {col}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="seat-selection-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error || !showtime) {
    return (
      <div className="seat-selection-container">
        <div className="error">{error || 'Showtime not found'}</div>
      </div>
    );
  }

  const totalAmount = selectedSeats.length * showtime.price;

  return (
    <div className="seat-selection-container">
      <div className="seat-selection-header">
        <div className="movie-info">
          <h1>{showtime.movie_title}</h1>
          <p className="showtime-info">
            {showtime.screen_name} | {new Date(showtime.show_date).toLocaleDateString('en-US', {
              weekday: 'short',
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })} | {new Date(`2000-01-01T${showtime.show_time}`).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>

      {renderSeatGrid()}

      <div className="seat-legend">
        <div className="legend-item">
          <div className="seat available"></div>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="seat selected"></div>
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <div className="seat booked"></div>
          <span>Booked</span>
        </div>
      </div>

      {selectedSeats.length > 0 && (
        <div className="booking-summary">
          <div className="summary-details">
            <div className="selected-seats-info">
              <strong>Selected Seats:</strong> {selectedSeats.sort().join(', ')}
            </div>
            <div className="total-amount">
              <strong>Total Amount:</strong> ₹{totalAmount}
            </div>
          </div>
          <button
            className="book-btn"
            onClick={handleBooking}
            disabled={bookingInProgress}
          >
            {bookingInProgress ? 'Processing...' : `Book ${selectedSeats.length} Seat${selectedSeats.length > 1 ? 's' : ''}`}
          </button>
        </div>
      )}
    </div>
  );
};

export default SeatSelection;

