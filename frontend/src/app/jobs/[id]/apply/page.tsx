"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';

export default function ApplyPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [job, setJob] = useState<any>(null);
    const [user, setUser] = useState<any>(null);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const [phone, setPhone] = useState('');
    const [zalo, setZalo] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Fetch job details
        const fetchJob = async () => {
            try {
                const res = await api.get(`/jobs/${params.id}`);
                if (res.success) {
                    setJob(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch job", error);
            }
        };

        // Get user info
        const userStr = localStorage.getItem('user');
        if (userStr) {
            const u = JSON.parse(userStr);
            setUser(u);
            setPhone(u.phone || '');
        } else {
            router.push(`/login?redirect=/jobs/${params.id}/apply`);
        }

        fetchJob();
    }, [params.id, router]);

    const handleSubmit = async () => {
        if (!phone) {
            alert('Vui lòng nhập số điện thoại');
            return;
        }

        setLoading(true);
        try {
            const fullMessage = `
Thông tin ứng viên:
- Họ tên: ${user?.name}
- SĐT: ${phone}
- Zalo: ${zalo || 'Không có'}
- Lời nhắn: ${message || 'Tôi muốn ứng tuyển công việc này.'}
            `.trim();

            const res = await api.post(`/jobs/${params.id}/apply`, {
                message: fullMessage
            });

            if (res.success) {
                setSubmitted(true);
            } else {
                alert(res.message || 'Ứng tuyển thất bại');
            }
        } catch (error) {
            console.error(error);
            alert('Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
                <h1>Đã gửi hồ sơ thành công!</h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                    Chủ vườn sẽ liên lạc qua SĐT/Zalo trong 24h.
                </p>
                <Link href="/" className="btn btn-primary">Về Trang Chủ</Link>
            </div>
        );
    }

    if (!job) return <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>Đang tải...</div>;

    return (
        <div className="container" style={{ padding: '2rem 0', maxWidth: '600px' }}>
            <h1 style={{ marginBottom: '2rem' }}>Ứng tuyển: {job.title}</h1>

            <div className="card">
                <h3 style={{ marginBottom: '1.5rem' }}>Thông tin bắt buộc</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <div style={{ background: '#F9FAFB', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                            <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                                Đang ứng tuyển với tên: <strong>{user?.name}</strong>
                            </p>
                        </div>          </div>

                    <div>
                        <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Số điện thoại <span style={{ color: 'red' }}>*</span></label>
                        <input
                            type="tel"
                            className="input"
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '8px' }}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>

                    <div>
                        <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Zalo</label>
                        <input
                            type="text"
                            className="input"
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '8px' }}
                            placeholder="SĐT hoặc Link Zalo"
                            value={zalo}
                            onChange={(e) => setZalo(e.target.value)}
                        />
                    </div>

                    <div>
                        <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Lời nhắn cho chủ vườn</label>
                        <textarea
                            className="input"
                            style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: '8px' }}
                            placeholder="Giới thiệu ngắn gọn về kinh nghiệm..."
                            rows={3}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                    </div>

                    <button
                        className="btn btn-primary"
                        style={{ marginTop: '1rem', opacity: loading ? 0.7 : 1 }}
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Đang gửi...' : 'Gửi Hồ Sơ'}
                    </button>
                </div>
            </div>
        </div>
    );
}
