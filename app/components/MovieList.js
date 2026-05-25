'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './MovieList.module.css';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

export default function MovieList({ initialMovies, genres, initialQuery = '' }) {
  const [movies, setMovies] = useState(initialMovies);
  const [query, setQuery] = useState(initialQuery);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  const [mensaje, setMensaje] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialQuery) performSearch(initialQuery);
  }, []);

  async function performSearch(q) {
    setMensaje('Buscando...');
    setPage(1);
    const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(q)}&language=es-ES&page=1`);
    const data = await res.json();
    setMovies(data.results || []);
    setMensaje(data.results?.length === 0 ? 'No se encontraron películas.' : '');
  }

  async function searchMovies() {
    if (!query.trim()) return;
    await performSearch(query);
  }

  async function filterByGenre(genreId) {
    setSelectedGenre(genreId);
    setPage(1);
    if (!genreId) {
      setMensaje('Cargando...');
      const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=es-ES&page=1`);
      const data = await res.json();
      setMovies(data.results || []);
      setMensaje('');
      return;
    }
    setMensaje('Cargando...');
    const res = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}&language=es-ES&with_genres=${genreId}&sort_by=popularity.desc&page=1`);
    const data = await res.json();
    setMovies(data.results || []);
    setMensaje('');
  }

  async function loadMore() {
    const nextPage = page + 1;
    setLoading(true);

    let url;
    if (query.trim()) {
      url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}&language=es-ES&page=${nextPage}`;
    } else if (selectedGenre) {
      url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=es-ES&with_genres=${selectedGenre}&sort_by=popularity.desc&page=${nextPage}`;
    } else {
      url = `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=es-ES&page=${nextPage}`;
    }

    const res = await fetch(url);
    const data = await res.json();
    setMovies(prev => [...prev, ...(data.results || [])]);
    setPage(nextPage);
    setLoading(false);
  }

  const sortedMovies = [...movies].sort((a, b) => {
    if (sortBy === 'rating') return b.vote_average - a.vote_average;
    if (sortBy === 'year') return new Date(b.release_date) - new Date(a.release_date);
    return b.popularity - a.popularity;
  });

  return (
    <div>
      <div className={styles.searchBox}>
        <input
          type="text"
          placeholder="Buscar película..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && searchMovies()}
          className={styles.input}
        />
        <button onClick={searchMovies} className={styles.btnPrimary}>Buscar</button>
        <button onClick={() => { setQuery(''); filterByGenre(''); }} className={styles.btnSecondary}>Ver populares</button>
      </div>

      <div className={styles.genreChips}>
        <button
          onClick={() => filterByGenre('')}
          className={selectedGenre === '' ? styles.chipActive : styles.chip}
        >
          Todos
        </button>
        {genres.map(g => (
          <button
            key={g.id}
            onClick={() => filterByGenre(String(g.id))}
            className={selectedGenre === String(g.id) ? styles.chipActive : styles.chip}
          >
            {g.name}
          </button>
        ))}
      </div>

      <div className={styles.controls}>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} className={styles.select}>
          <option value="popularity">Más populares</option>
          <option value="rating">Mejor puntuación</option>
          <option value="year">Más recientes</option>
        </select>
      </div>

      {mensaje && <p className={styles.mensaje}>{mensaje}</p>}

      <div className={styles.grid}>
        {sortedMovies.map(movie => (
          <Link key={movie.id} href={`/pelicula/${movie.id}`} className={styles.cardLink}>
            <div className={styles.card}>
              <img
                src={movie.poster_path ? `${IMG_URL}${movie.poster_path}` : 'https://via.placeholder.com/200x300?text=Sin+imagen'}
                alt={movie.title}
                className={styles.poster}
              />
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{movie.title}</h3>
                <p className={styles.cardInfo}><img src="/icons/strar.png" alt="" className={styles.starIcon} /> {movie.vote_average.toFixed(1)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className={styles.loadMoreBox}>
        <button onClick={loadMore} disabled={loading} className={loading ? styles.btnDisabled : styles.btnPrimary}>
          {loading ? 'Cargando...' : 'Ver más'}
        </button>
      </div>
    </div>
  );
}