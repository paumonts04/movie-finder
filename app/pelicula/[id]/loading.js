import styles from './loading.module.css';

export default function Loading() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.spinner} />
      <p className={styles.text}>Cargando película...</p>
    </div>
  );
}
