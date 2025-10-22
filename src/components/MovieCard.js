import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MovieCard.css';

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/movie/${movie.id}`);
  };

  return (
    <div className="movie-card" onClick={handleClick}>
      <img 
        src={movie.poster_url} 
        alt={movie.title}
        className="movie-poster"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
        }}
      />
      <div className="movie-info">
        <h3 className="movie-title">{movie.title}</h3>
        <p className="movie-duration">{movie.duration} mins</p>
      </div>
    </div>
  );
};

export default MovieCard;

