"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './profile.module.css';
import { api } from '@/services/api';

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState<'posted' | 'applied' | 'info'>('posted');
    const [user, setUser] = useState<any>(null);
    const [postedJobs, setPostedJobs] = useState<any[]>([]);
    const [appliedJobs, setAppliedJobs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [avatar, setAvatar] = useState<string | null>(null);

    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 1. Get Profile
                const profileRes = await api.get('/users/me');
                if (profileRes.success) {
                    setUser(profileRes.data);

                    // 2. Get Posted Jobs (if owner)
                    if (profileRes.data.role === 'owner') {
                        const jobsRes = await api.get(`/jobs?owner_id=${profileRes.data.id}`);
                        if (jobsRes.success) {
                            setPostedJobs(jobsRes.data.map((job: any) => ({
                                ...job,
                                postedAt: new Date(job.created_at).toLocaleDateString('vi-VN'),
                                views: 0, // Not in API yet
                                applicants: 0 // Not in API list yet
                            })));
                        }
                    }

                    // 3. Get Applied Jobs (if worker)
                    if (profileRes.data.role === 'worker') {
                        setActiveTab('applied'); // Default tab for worker
                        const appsRes = await api.get('/users/me/applications');
                        if (appsRes.success) {
                            setAppliedJobs(appsRes.data.map((app: any) => ({
                                id: app.id,
                                title: app.job.title,
                                owner: app.job.owner.name,
                                price: `${app.job.price_min.toLocaleString()} - ${app.job.price_max.toLocaleString()} VNĐ`,
                                appliedAt: new Date(app.created_at).toLocaleDateString('vi-VN'),
                                status: app.status
                            })));
                        }
                    }
                } else {
                    router.push('/login');
                }
            } catch (error) {
                console.error("Failed to fetch profile data", error);
                router.push('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    if (loading) return <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>Đang tải...</div>;
    if (!user) return null;
    const [confirmModal, setConfirmModal] = useState<{
        isOpen: boolean;
        type: 'close' | 'edit' | null;
        jobId: number | null;
    }>({ isOpen: false, type: null, jobId: null });

    const handleActionClick = (type: 'close' | 'edit', jobId: number) => {
        setConfirmModal({ isOpen: true, type, jobId });
    };

    const handleConfirm = () => {
        if (confirmModal.type === 'edit' && confirmModal.jobId) {
            router.push(`/jobs/${confirmModal.jobId}/edit`);
        } else if (confirmModal.type === 'close' && confirmModal.jobId) {
            alert(`Đã đóng tin #${confirmModal.jobId}`);
        }
        setConfirmModal({ isOpen: false, type: null, jobId: null });
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpdateProfile = () => {
        alert("Đã cập nhật hồ sơ thành công!");
        // In a real app, this would save to backend
    };

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>

            {/* Confirmation Modal */}
            {confirmModal.isOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', zIndex: 1000,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <div className="card" style={{ width: '90%', maxWidth: '400px', animation: 'fadeIn 0.2s' }}>
                        <h3 style={{ marginBottom: '1rem' }}>Xác nhận</h3>
                        <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                            {confirmModal.type === 'close'
                                ? 'Bạn có chắc chắn muốn đóng tin tuyển dụng này? Người tìm việc sẽ không thấy tin này nữa.'
                                : 'Bạn có muốn chỉnh sửa tin tuyển dụng này không?'}
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <button
                                className="btn btn-outline"
                                onClick={() => setConfirmModal({ isOpen: false, type: null, jobId: null })}
                            >
                                Hủy bỏ
                            </button>
                            <button
                                className="btn btn-primary"
                                style={{ background: confirmModal.type === 'close' ? '#EF4444' : 'var(--primary)' }}
                                onClick={handleConfirm}
                            >
                                {confirmModal.type === 'close' ? 'Đóng tin' : 'Đồng ý sửa'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Profile Header */}
            <div className={styles.profileHeader}>
                <div className={styles.avatar} style={{ overflow: 'hidden', position: 'relative' }}>
                    {avatar ? (
                        <img src={avatar} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                        '👤'
                    )}
                </div>
                <div className={styles.info}>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span className={styles.roleBadge}>Chủ Vườn</span>
                        <span className={styles.roleBadge} style={{ background: 'var(--secondary)' }}>Thợ</span>
                    </div>
                    <h1>{user.name}</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>📍 {user.address} • 📞 {user.phone}</p>

                    <div className={styles.stats}>
                        <div className={styles.statItem}>
                            <div className={styles.statValue}>{user.rating || 0} ⭐</div>
                            <div className={styles.statLabel}>Đánh giá ({user.reviews || 0})</div>
                        </div>
                        <div className={styles.statItem}>
                            <div className={styles.statValue}>{postedJobs.length}</div>
                            <div className={styles.statLabel}>Tin đã đăng</div>
                        </div>
                        <div className={styles.statItem}>
                            <div className={styles.statValue}>{appliedJobs.length}</div>
                            <div className={styles.statLabel}>Việc đã ứng tuyển</div>
                        </div>
                    </div>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                    <button
                        className="btn btn-outline"
                        onClick={() => setActiveTab('info')}
                    >
                        Chỉnh sửa hồ sơ
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'posted' ? styles.active : ''}`}
                    onClick={() => setActiveTab('posted')}
                >
                    Tin tuyển dụng của tôi
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'applied' ? styles.active : ''}`}
                    onClick={() => setActiveTab('applied')}
                >
                    Việc đã ứng tuyển
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'info' ? styles.active : ''}`}
                    onClick={() => setActiveTab('info')}
                >
                    Thông tin cá nhân
                </button>
            </div>

            {/* Content */}
            {activeTab === 'posted' && (
                <div className={styles.jobList}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2>Danh sách tin đăng</h2>
                        <Link href="/post-job" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                            + Đăng tin mới
                        </Link>
                    </div>

                    {postedJobs.map(job => (
                        <div key={job.id} className={styles.jobItem}>
                            <div className={styles.jobInfo}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <Link href={`/jobs/${job.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <h3 style={{ cursor: 'pointer' }}>{job.title}</h3>
                                    </Link>
                                    <span className={`${styles.statusBadge} ${job.status === 'active' ? styles.statusActive : styles.statusClosed}`}>
                                        {job.status === 'active' ? 'Đang hiển thị' : 'Đã đóng'}
                                    </span>
                                </div>
                                <div className={styles.jobMeta}>
                                    <span>📅 Đăng ngày: {job.postedAt}</span>
                                    <span>👁️ {job.views} lượt xem</span>
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <div className={styles.applicantCount}>{job.applicants}</div>
                                    <div style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>Ứng viên</div>
                                </div>
                                <div className="jobActions" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <Link href={`/profile/jobs/${job.id}/applicants`} className="btn btn-primary" style={{ textDecoration: 'none', fontSize: '0.875rem', padding: '0.5rem 1rem' }}>
                                        Xem hồ sơ
                                    </Link>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            className="btn btn-outline"
                                            style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', color: '#EF4444', borderColor: '#EF4444' }}
                                            onClick={() => handleActionClick('close', job.id)}
                                        >
                                            Đóng tin
                                        </button>
                                        <button
                                            className="btn btn-outline"
                                            style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                                            onClick={() => handleActionClick('edit', job.id)}
                                        >
                                            Sửa
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {postedJobs.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                            <p>Bạn chưa đăng tin tuyển dụng nào.</p>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'applied' && (
                <div className={styles.jobList}>
                    <h2 style={{ marginBottom: '1rem' }}>Công việc đã ứng tuyển</h2>

                    {appliedJobs.map(job => (
                        <div key={job.id} className={styles.jobItem}>
                            <div className={styles.jobInfo}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <h3>{job.title}</h3>
                                    <span className={`${styles.statusBadge} ${job.status === 'accepted' ? styles.statusActive :
                                        job.status === 'pending' ? styles.statusPending : styles.statusClosed
                                        }`}>
                                        {job.status === 'accepted' ? 'Được nhận' :
                                            job.status === 'pending' ? 'Chờ duyệt' : 'Từ chối'}
                                    </span>
                                </div>
                                <div className={styles.jobMeta}>
                                    <span>👤 Chủ vườn: {job.owner}</span>
                                    <span>💰 {job.price}</span>
                                    <span>📅 Ứng tuyển: {job.appliedAt}</span>
                                </div>
                            </div>
                            <div>
                                <button className="btn btn-outline" disabled={job.status !== 'accepted'}>
                                    {job.status === 'accepted' ? 'Liên hệ chủ vườn' : 'Đang chờ...'}
                                </button>
                            </div>
                        </div>
                    ))}

                    {appliedJobs.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                            <p>Bạn chưa ứng tuyển công việc nào.</p>
                            <Link href="/" className="btn btn-primary" style={{ marginTop: '1rem', textDecoration: 'none' }}>
                                Tìm việc ngay
                            </Link>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'info' && (
                <div className="card">
                    <h3>Thông tin cá nhân</h3>

                    <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {/* Avatar Upload */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <div style={{
                                width: '80px', height: '80px', borderRadius: '50%',
                                background: '#F3F4F6', overflow: 'hidden',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '2rem', border: '1px solid var(--border)'
                            }}>
                                {avatar ? <img src={avatar} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '👤'}
                            </div>
                            <div>
                                <label className="btn btn-outline" style={{ cursor: 'pointer', display: 'inline-block' }}>
                                    Thay đổi ảnh đại diện
                                    <input type="file" accept="image/*" hidden onChange={handleAvatarChange} />
                                </label>
                                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                                    Chấp nhận JPG, PNG hoặc GIF.
                                </p>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <div>
                                <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Họ tên</label>
                                <input
                                    className="input"
                                    value={user.name}
                                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                                />
                            </div>
                            <div>
                                <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Số điện thoại</label>
                                <input
                                    className="input"
                                    value={user.phone}
                                    onChange={(e) => setUser({ ...user, phone: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                                />
                            </div>
                            <div>
                                <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Địa chỉ</label>
                                <input
                                    className="input"
                                    value={user.address}
                                    onChange={(e) => setUser({ ...user, address: e.target.value })}
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                                />
                            </div>
                        </div>

                        <button
                            className="btn btn-primary"
                            style={{ width: 'fit-content' }}
                            onClick={handleUpdateProfile}
                        >
                            Lưu thay đổi
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
