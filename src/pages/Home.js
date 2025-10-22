import React, { useState, useEffect } from 'react';
import MovieCard from '../components/MovieCard';
import api from '../services/api';
import './Home.css';

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await api.get('/movies');
      setMovies(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to load movies');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="home-container">
        <div className="loading">Loading movies...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="home-container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <h1 className="home-title">Now Showing</h1>
      <div className="movies-grid">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default Home;

