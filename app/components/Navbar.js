'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import styles from './Navbar.module.css';
import { useGenreContext } from '../context/GenreContext';

export default function Navbar() {
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const { genres, selectedGenre, setSelectedGenre } = useGenreContext();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 180);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!visible) setOpen(false);
  }, [visible]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const onClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const activeGenreName = genres.find(g => String(g.id) === selectedGenre)?.name;

  function selectGenre(id) {
    setSelectedGenre(id);
    setOpen(false);
  }

  return (
    <nav className={`${styles.nav} ${visible ? styles.navVisible : ''}`}>
      <div className={styles.left}>
        <Link href="/" className={styles.logo}>
          <img src="/icons/claqueta.png" alt="" className={styles.logoIcon} />
          MovieApp
        </Link>

        <div className={styles.dropdown} ref={dropdownRef}>
        <button
          className={`${styles.dropdownBtn} ${selectedGenre ? styles.dropdownBtnActive : ''}`}
          onClick={() => setOpen(o => !o)}
        >
          {activeGenreName ?? 'Géneros'}
          <span className={`${styles.arrow} ${open ? styles.arrowUp : ''}`}>▾</span>
        </button>

        {open && (
          <div className={styles.dropdownMenu}>
            <button
              className={selectedGenre === '' ? styles.dropdownItemActive : styles.dropdownItem}
              onClick={() => selectGenre('')}
            >
              Todos
            </button>
            {genres.map(g => (
              <button
                key={g.id}
                className={selectedGenre === String(g.id) ? styles.dropdownItemActive : styles.dropdownItem}
                onClick={() => selectGenre(String(g.id))}
              >
                {g.name}
              </button>
            ))}
          </div>
        )}
      </div>
      </div>

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
