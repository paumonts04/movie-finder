import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.logo}>
        <img src="/icons/claqueta.png" alt="" className={styles.logoIcon} />
        MovieApp
      </Link>
      <form action="/" className={styles.searchForm}>
        <input
          name="q"
          type="text"
          placeholder="Buscar película..."
          className={styles.searchInput}
        />
        <button type="submit" className={styles.searchBtn}>
          <img src="/icons/lupa.png" alt="Buscar" className={styles.searchIcon} />
        </button>
      </form>
    </nav>
  );
}