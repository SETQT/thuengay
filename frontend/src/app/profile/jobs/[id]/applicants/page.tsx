"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { api } from '@/services/api';

export default function JobApplicantsPage({ params }: { params: { id: string } }) {
    const [applicants, setApplicants] = useState<any[]>([]);
    const [job, setJob] = useState<any>(null);
    const [filter, setFilter] = useState('all'); // all, pending, accepted
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Job
                const jobRes = await api.get(`/jobs/${params.id}`);
                if (jobRes.success) {
                    setJob(jobRes.data);
                }

                // Fetch Applicants
                const appRes = await api.get(`/jobs/${params.id}/applicants`);
                if (appRes.success) {
                    setApplicants(appRes.data.map((app: any) => ({
                        id: app.id,
                        name: app.worker.name,
                        phone: app.worker.phone,
                        zalo: app.worker.phone, // Assuming phone is used for Zalo
                        experience: app.message, // Using message as experience/intro
                        hometown: app.worker.address || "Chưa cập nhật",
                        appliedAt: new Date(app.created_at).toLocaleDateString('vi-VN'),
                        status: app.status,
                        avatar: "👷‍♂️"
                    })));
                }
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [params.id]);

    const updateStatus = async (id: number, newStatus: string) => {
        try {
            const res = await api.patch(`/applications/${id}/status`, { status: newStatus });
            if (res.success) {
                setApplicants(prev => prev.map(app =>
                    app.id === id ? { ...app, status: newStatus } : app
                ));
            } else {
                alert(res.message || 'Cập nhật thất bại');
            }
        } catch (error) {
            console.error("Failed to update status", error);
            alert('Có lỗi xảy ra');
        }
    };

    const filteredApplicants = filter === 'all'
        ? applicants
        : applicants.filter(app => app.status === filter);

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <Link href="/profile" style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    &larr; Quay lại trang cá nhân
                </Link>
                <h1>Danh sách ứng viên (Tin #{params.id})</h1>
                <p style={{ color: 'var(--text-secondary)' }}>{job ? job.title : 'Đang tải...'}</p>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', overflowX: 'auto' }}>
                {['all', 'pending', 'called', 'accepted', 'rejected'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        style={{
                            padding: '0.5rem 1rem',
                            borderRadius: '99px',
                            border: '1px solid var(--border)',
                            background: filter === f ? 'var(--primary)' : 'white',
                            color: filter === f ? 'white' : 'var(--text-secondary)',
                            textTransform: 'capitalize'
                        }}
                    >
                        {f === 'all' ? 'Tất cả' : f}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="grid-layout">
                {filteredApplicants.map(app => (
                    <div key={app.id} className="card" style={{ gap: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{
                                    width: '50px', height: '50px', background: '#F3F4F6',
                                    borderRadius: '50%', display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', fontSize: '1.5rem'
                                }}>
                                    {app.avatar}
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '1.125rem', marginBottom: '0.25rem' }}>{app.name}</h3>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                        {app.hometown} • {app.appliedAt}
                                    </p>
                                </div>
                            </div>
                            <span style={{
                                fontSize: '0.75rem', fontWeight: 600, padding: '0.25rem 0.5rem', borderRadius: '4px',
                                background: app.status === 'rejected' ? '#FEE2E2' : '#ECFDF5',
                                color: app.status === 'rejected' ? '#991B1B' : '#065F46'
                            }}>
                                {app.status.toUpperCase()}
                            </span>
                        </div>

                        <div style={{ background: '#F9FAFB', padding: '1rem', borderRadius: '8px', marginTop: '0.5rem' }}>
                            <p style={{ marginBottom: '0.5rem' }}><strong>Kinh nghiệm:</strong> {app.experience}</p>
                            <p style={{ marginBottom: '0.5rem' }}><strong>SĐT:</strong> {app.phone}</p>
                            <p><strong>Zalo:</strong> <a href="#" style={{ color: 'var(--primary)' }}>{app.zalo}</a></p>
                        </div>

                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                            <a href={`tel:${app.phone}`} className="btn btn-primary" style={{ flex: 1, textDecoration: 'none' }} onClick={() => updateStatus(app.id, 'called')}>
                                📞 Gọi điện
                            </a>
                            <a href={`https://zalo.me/${app.phone}`} target="_blank" className="btn btn-outline" style={{ flex: 1, textDecoration: 'none' }}>
                                💬 Zalo
                            </a>
                        </div>

                        {app.status !== 'rejected' && app.status !== 'accepted' && (
                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                                <button
                                    className="btn"
                                    style={{ flex: 1, background: '#D1FAE5', color: '#065F46' }}
                                    onClick={() => updateStatus(app.id, 'accepted')}
                                >
                                    ✅ Duyệt
                                </button>
                                <button
                                    className="btn"
                                    style={{ flex: 1, background: '#FEE2E2', color: '#991B1B' }}
                                    onClick={() => updateStatus(app.id, 'rejected')}
                                >
                                    ❌ Từ chối
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
