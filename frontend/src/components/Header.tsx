import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className="container">
        <nav className={styles.nav}>
          <Link href="/" className={styles.logo}>
            THUENGAY.COM
          </Link>

          <div className={styles.links}>
            <Link href="/" className={styles.link}>Tìm việc</Link>
            <Link href="/post-job" className={styles.link}>Đăng tin tuyển thợ</Link>
            <Link href="/guides" className={styles.link}>Hướng dẫn</Link>
          </div>

          <div className={styles.auth}>
            <Link href="/profile" className="btn btn-outline" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>👤</span> Tài khoản
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
