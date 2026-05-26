import Link from 'next/link';
import Footer from '../../components/Footer';
import styles from './page.module.css';

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

async function getMovie(id) {
  const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=es-ES`);
  return res.json();
}

async function getSimilar(id) {
  const res = await fetch(`${BASE_URL}/movie/${id}/similar?api_key=${API_KEY}&language=es-ES`);
  const data = await res.json();
  return data.results?.slice(0, 8) || [];
}

async function getVideos(id) {
  const res = await fetch(`${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}&language=es-ES`);
  const data = await res.json();
  const trailer = data.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
  return trailer || null;
}

export default async function PeliculaPage({ params }) {
  const { id } = await params;
  const [movie, similar, trailer] = await Promise.all([
    getMovie(id),
    getSimilar(id),
    getVideos(id)
  ]);

  const poster = movie.poster_path
    ? `${IMG_URL}${movie.poster_path}`
    : 'https://via.placeholder.com/200x300?text=Sin+imagen';

  return (
    <>
    <main className={styles.main}>
      <Link href="/" className={styles.back}>← Volver</Link>

      <div className={styles.detail}>
        <img src={poster} alt={movie.title} className={styles.poster} />
        <div className={styles.info}>
          <h1>{movie.title}</h1>
          <p className={styles.meta}><img src="/icons/calendar.png" alt="" className={styles.metaIcon} /> {movie.release_date?.slice(0, 4) || 'Sin fecha'}</p>
          <p className={styles.meta}><img src="/icons/strar.png" alt="" className={styles.metaIcon} /> {movie.vote_average?.toFixed(1)} / 10</p>
          <p className={styles.meta}><img src="/icons/reloj.png" alt="" className={styles.metaIcon} /> {movie.runtime} min</p>
          <p className={styles.overview}>{movie.overview || 'Sin descripción disponible.'}</p>
          <div className={styles.genres}>
            {movie.genres?.map(g => (
              <span key={g.id} className={styles.genre}>{g.name}</span>
            ))}
          </div>
          {trailer && (
            <a
              href={`https://www.youtube.com/watch?v=${trailer.key}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.trailerBtn}
            >
              <img src="/icons/trailer.png" alt="" className={styles.trailerIcon} /> Ver trailer
            </a>
          )}
        </div>
      </div>

      {similar.length > 0 && (
        <div className={styles.similar}>
          <h2>Películas similares</h2>
          <div className={styles.grid}>
            {similar.map(m => (
              <Link key={m.id} href={`/pelicula/${m.id}`} className={styles.card}>
                <img
                  src={m.poster_path ? `${IMG_URL}${m.poster_path}` : 'https://via.placeholder.com/140x210?text=Sin+imagen'}
                  alt={m.title}
                />
                <p>{m.title}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
    <Footer />
    </>
  );
}