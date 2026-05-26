import MovieList from './components/MovieList';
import Footer from './components/Footer';
import styles from './page.module.css';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

async function getInitialData() {
  const [moviesRes, genresRes] = await Promise.all([
    fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=es-ES`),
    fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=es-ES`)
  ]);

  const moviesData = await moviesRes.json();
  const genresData = await genresRes.json();

  return {
    movies: moviesData.results || [],
    genres: genresData.genres || []
  };
}

export default async function Home({ searchParams }) {
  const { q = '' } = await searchParams;
  const { movies, genres } = await getInitialData();

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>
        <img src="/icons/claqueta.png" alt="" className={styles.titleIcon} />
        Buscador de Películas
      </h1>
      <MovieList initialMovies={movies} genres={genres} initialQuery={q} />
      <Footer />
    </main>
  );
}