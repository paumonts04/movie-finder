'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const GenreContext = createContext(null);

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

export function GenreProvider({ children }) {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');

  useEffect(() => {
    fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}&language=es-ES`)
      .then(r => r.json())
      .then(d => setGenres(d.genres || []));
  }, []);

  return (
    <GenreContext.Provider value={{ genres, selectedGenre, setSelectedGenre }}>
      {children}
    </GenreContext.Provider>
  );
}

export const useGenreContext = () => useContext(GenreContext);
