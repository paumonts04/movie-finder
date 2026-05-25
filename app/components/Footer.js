import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>Datos proporcionados por <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer" className={styles.link}>TMDB</a></p>
      <p>Iconos por varios autores vía <a href="https://icon-icons.com" target="_blank" rel="noopener noreferrer" className={styles.link}>icon-icons.com</a> — <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" className={styles.link}>CC BY 4.0</a></p>
    </footer>
  );
}