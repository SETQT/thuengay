import styles from './JobCard.module.css';
import Link from 'next/link';

export interface JobProps {
    id: number;
    title: string;
    location: string;
    distance: string;
    price: string;
    tags: string[];
    postedAt: string;
    daysLeft: number;
    isUrgent?: boolean;
    isVerified?: boolean;
}

export default function JobCard({ job }: { job: JobProps }) {
    return (
        <div className={styles.card}>
            {job.isUrgent && <span className={styles.urgent}>Cần gấp</span>}

            <div className={styles.header}>
                <div>
                    <h3 className={styles.title}>
                        {job.title}
                        {job.isVerified && (
                            <span style={{ marginLeft: '0.5rem', fontSize: '0.875rem', color: 'var(--primary)' }} title="Đã xác minh">
                                ✓
                            </span>
                        )}
                    </h3>
                    <div className={styles.location}>
                        <span>📍</span> {job.location} • Cách {job.distance}
                    </div>
                </div>
            </div>

            <div className={styles.price}>{job.price}</div>

            <div className={styles.tags}>
                {job.tags.map((tag, index) => (
                    <span key={index} className={styles.tag}>{tag}</span>
                ))}
            </div>

            <div className={styles.footer}>
                <span>🕒 {job.postedAt}</span>
                <span style={{ color: job.daysLeft < 3 ? 'var(--error)' : 'inherit' }}>
                    Còn {job.daysLeft} ngày
                </span>
            </div>

            <Link href={`/jobs/${job.id}`} className="btn btn-primary" style={{ width: '100%', textDecoration: 'none' }}>Xem chi tiết</Link>
        </div>
    );
}
