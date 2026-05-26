'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styles from './MovieList.module.css';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

function dedup(arr) {
  const seen = new Set();
  return arr.filter(m => seen.has(m.id) ? false : seen.add(m.id));
}

export default function MovieList({ initialMovies, genres, initialQuery = '' }) {
  const [movies, setMovies] = useState(() => dedup(initialMovies));
  const [query, setQuery] = useState(initialQuery);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortBy, setSortBy] = useState('popularity');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const [noMore, setNoMore] = useState(false);
  const [cols, setCols] = useState(8);
  const gridRef = useRef(null);
  const autoFilling = useRef(false);
  const pageRef = useRef(1);
  const queryRef = useRef('');
  const genreRef = useRef('');

  useEffect(() => {
    if (initialQuery) performSearch(initialQuery);
  }, []);

  // Detect column count
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    const updateCols = () => {
      const count = getComputedStyle(grid).gridTemplateColumns.trim().split(/\s+/).length;
      setCols(count);
    };
    updateCols();
    const observer = new ResizeObserver(updateCols);
    observer.observe(grid);
    return () => observer.disconnect();
  }, []);

  // Auto-fill last row with real movies
  useEffect(() => {
    if (cols < 2 || movies.length === 0 || loading || noMore) return;
    if (movies.length % cols === 0) {
      autoFilling.current = false;
      return;
    }
    if (autoFilling.current) return;
    autoFilling.current = true;
    fetchNextPage();
  }, [cols, movies.length, loading, noMore]);

  async function buildUrl(p) {
    if (queryRef.current.trim()) {
      return `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(queryRef.current)}&language=es-ES&page=${p}`;
    }
    if (genreRef.current) {
      return `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=es-ES&with_genres=${genreRef.current}&sort_by=popularity.desc&page=${p}`;
    }
    return `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=es-ES&page=${p}`;
  }

  async function fetchNextPage() {
    const nextPage = pageRef.current + 1;
    const url = await buildUrl(nextPage);
    const res = await fetch(url);
    const data = await res.json();
    const results = data.results || [];
    if (results.length === 0) {
      setNoMore(true);
      autoFilling.current = false;
      return;
    }
    pageRef.current = nextPage;
    setMovies(prev => {
      const existingIds = new Set(prev.map(m => m.id));
      return dedup([...prev, ...results.filter(m => !existingIds.has(m.id))]);
    });
  }

  async function performSearch(q) {
    queryRef.current = q;
    genreRef.current = '';
    setMensaje('Buscando...');
    pageRef.current = 1;
    setNoMore(false);
    autoFilling.current = false;
    const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(q)}&language=es-ES&page=1`);
    const data = await res.json();
    setMovies(dedup(data.results || []));
    setMensaje(data.results?.length === 0 ? 'No se encontraron películas.' : '');
  }

  async function searchMovies() {
    if (!query.trim()) return;
    await performSearch(query);
  }

  async function filterByGenre(genreId) {
    genreRef.current = genreId;
    queryRef.current = '';
    setSelectedGenre(genreId);
    pageRef.current = 1;
    setNoMore(false);
    autoFilling.current = false;
    setMensaje('Cargando...');
    const endpoint = genreId
      ? `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=es-ES&with_genres=${genreId}&sort_by=popularity.desc&page=1`
      : `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=es-ES&page=1`;
    const res = await fetch(endpoint);
    const data = await res.json();
    setMovies(dedup(data.results || []));
    setMensaje('');
  }

  async function loadMore() {
    if (loading || noMore) return;
    setLoading(true);
    const nextPage = pageRef.current + 1;
    const url = await buildUrl(nextPage);
    const res = await fetch(url);
    const data = await res.json();
    const results = data.results || [];
    if (results.length === 0) setNoMore(true);
    pageRef.current = nextPage;
    setMovies(prev => {
      const existingIds = new Set(prev.map(m => m.id));
      return dedup([...prev, ...results.filter(m => !existingIds.has(m.id))]);
    });
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

      <div className={styles.grid} ref={gridRef}>
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
        {!noMore && (
          <button onClick={loadMore} disabled={loading} className={loading ? styles.btnDisabled : styles.btnPrimary}>
            {loading ? 'Cargando...' : 'Ver más'}
          </button>
        )}
      </div>
    </div>
  );
}
