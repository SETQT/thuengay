"use client";

import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './job-detail.module.css';

export default function JobDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [job, setJob] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await api.get(`/jobs/${params.id}`);
                if (res.success) {
                    setJob({
                        ...res.data,
                        price: `${res.data.price_min.toLocaleString()} - ${res.data.price_max.toLocaleString()} VNĐ`,
                        requirements: res.data.requirements ? res.data.requirements.split('\n') : [],
                        benefits: res.data.benefits ? res.data.benefits.split('\n') : [],
                        postedAt: new Date(res.data.created_at).toLocaleDateString('vi-VN'),
                        deadline: new Date(res.data.deadline).toLocaleDateString('vi-VN'),
                        owner: {
                            ...res.data.owner,
                            joined: "Unknown" // API doesn't return joined date yet
                        }
                    });
                }
            } catch (error) {
                console.error("Failed to fetch job", error);
            } finally {
                setLoading(false);
            }
        };

        const userStr = localStorage.getItem('user');
        if (userStr) {
            setCurrentUser(JSON.parse(userStr));
            setIsLoggedIn(true);
        }

        fetchJob();
    }, [params.id]);

    if (loading) return <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>Đang tải...</div>;
    if (!job) return <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>Không tìm thấy công việc</div>;

    const isOwner = currentUser && currentUser.id === job.owner_id;

    const handleApply = () => {
        if (isLoggedIn) {
            router.push(`/jobs/${params.id}/apply`);
        } else {
            router.push(`/login?redirect=/jobs/${params.id}/apply`);
        }
    };

    return (
        <div className={`container ${styles.container}`}>
            <div style={{ marginBottom: '1rem' }}>
                <Link href="/" className={styles.backLink}>
                    &larr; Quay lại
                </Link>
            </div>

            <div className={styles.grid}>

                {/* Main Content */}
                <div className={styles.mainContent}>
                    <div className="card" style={{ marginBottom: '2rem' }}>
                        <h1 className={styles.title}>{job.title}</h1>
                        <div className={styles.meta}>
                            <span>📍 {job.location}</span>
                            <span>🕒 {job.postedAt}</span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.5rem', marginBottom: '2rem', height: '300px' }}>
                            <div style={{ background: '#E5E7EB', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: '#9CA3AF' }}>
                                🖼️ Ảnh vườn 1
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                <div style={{ flex: 1, background: '#E5E7EB', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' }}>
                                    🖼️ Ảnh 2
                                </div>
                                <div style={{ flex: 1, background: '#E5E7EB', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF' }}>
                                    🖼️ Ảnh 3
                                </div>
                            </div>
                        </div>

                        <div className={styles.salaryBox}>
                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Mức lương</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>{job.price}</div>
                        </div>

                        <h3 className={styles.sectionTitle}>Mô tả công việc</h3>
                        <p className={styles.description}>
                            {job.description}
                        </p>

                        <h3 className={styles.sectionTitle}>Yêu cầu</h3>
                        <ul className={styles.list}>
                            {job.requirements.map((req: string, i: number) => <li key={i} className={styles.listItem}>{req}</li>)}
                        </ul>

                        <h3 className={styles.sectionTitle}>Quyền lợi</h3>
                        <ul className={styles.list}>
                            {job.benefits.map((ben: string, i: number) => <li key={i} className={styles.listItem}>{ben}</li>)}
                        </ul>
                    </div>
                </div>

                {/* Sidebar */}
                <div className={styles.sidebar}>
                    <div className={styles.stickyCard}>
                        <h3 className={styles.sectionTitle}>Thông tin chủ vườn</h3>
                        <div className={styles.ownerInfo}>
                            <div className={styles.ownerAvatar}>
                                👨‍🌾
                            </div>
                            <div>
                                <div style={{ fontWeight: 700 }}>{job.owner.name}</div>
                                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Tham gia {job.owner.joined}</div>
                            </div>
                        </div>

                        <div className={styles.trustBadge}>
                            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#F59E0B' }}>{job.owner.rating} ⭐</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Đánh giá uy tín</div>
                        </div>

                        {/* Desktop Apply/Edit Button */}
                        <div className="desktop-only">
                            {isOwner ? (
                                <button
                                    className="btn btn-outline"
                                    style={{ width: '100%', marginBottom: '1rem', padding: '1rem', borderColor: 'var(--primary)', color: 'var(--primary)' }}
                                    onClick={() => router.push(`/jobs/${params.id}/edit`)}
                                >
                                    ✏️ Chỉnh sửa tin này
                                </button>
                            ) : (
                                <button
                                    className="btn btn-primary"
                                    style={{ width: '100%', marginBottom: '1rem', padding: '1rem' }}
                                    onClick={handleApply}
                                >
                                    Ứng Tuyển Ngay
                                </button>
                            )}
                        </div>

                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
                            Hạn nộp: {job.deadline}
                        </p>
                    </div>
                </div>

            </div>

            {/* Mobile Fixed Apply Button */}
            <div className={styles.mobileApplyBar}>
                {isOwner ? (
                    <button
                        className="btn btn-outline"
                        style={{ width: '100%', padding: '1rem', fontSize: '1.125rem', background: 'white', borderColor: 'var(--primary)', color: 'var(--primary)' }}
                        onClick={() => router.push(`/jobs/${params.id}/edit`)}
                    >
                        ✏️ Chỉnh sửa
                    </button>
                ) : (
                    <button
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '1rem', fontSize: '1.125rem' }}
                        onClick={handleApply}
                    >
                        Ứng Tuyển Ngay
                    </button>
                )}
            </div>
        </div>
    );
}
