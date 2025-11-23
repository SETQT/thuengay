"use client";

import { useEffect, useState } from 'react';
import JobCard, { JobProps } from '@/components/JobCard';
import { api } from '@/services/api';

export default function Home() {
  const [jobs, setJobs] = useState<JobProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await api.get('/jobs');
        if (res.success) {
          const mappedJobs = res.data.map((job: any) => ({
            id: job.id,
            title: job.title,
            location: job.location,
            distance: "Unknown", // API doesn't return distance yet
            price: `${job.price_min.toLocaleString()} - ${job.price_max.toLocaleString()} VNĐ`,
            tags: job.benefits ? job.benefits.split(',').map((b: string) => b.trim()) : [],
            postedAt: new Date(job.created_at).toLocaleDateString('vi-VN'),
            daysLeft: Math.ceil((new Date(job.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
            isUrgent: false,
            isVerified: true,
          }));
          setJobs(mappedJobs);
        }
      } catch (error) {
        console.error("Failed to fetch jobs", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
        padding: '4rem 0',
        color: 'white',
        textAlign: 'center'
      }}>
        <div className="container">
          <h1 style={{ marginBottom: '1rem', color: 'white' }}>Tìm Việc Làm Nông Nghiệp Lương Cao</h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.9, marginBottom: '2rem' }}>
            Kết nối trực tiếp với chủ vườn. Không qua trung gian.
          </p>

          <div style={{
            background: 'white',
            padding: '1rem',
            borderRadius: 'var(--radius)',
            maxWidth: '800px',
            margin: '0 auto',
            display: 'flex',
            gap: '1rem',
            flexWrap: 'wrap',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <input
              type="text"
              placeholder="Tìm công việc (VD: Hái cà phê...)"
              style={{
                flex: 1,
                padding: '0.75rem',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                minWidth: '200px'
              }}
            />
            <select style={{
              padding: '0.75rem',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              minWidth: '150px'
            }}>
              <option>Tất cả địa điểm</option>
              <option>Đắk Lắk</option>
              <option>Lâm Đồng</option>
              <option>Gia Lai</option>
            </select>
            <button className="btn btn-primary" style={{ minWidth: '120px' }}>Tìm Kiếm</button>
          </div>
        </div>
      </section>

      {/* Quick Filters */}
      <section className="container" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Việc làm phổ biến</h2>
        <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
          {['☕ Cà phê', '🌶️ Hồ tiêu', '🍈 Sầu riêng', '🐉 Thanh long', '🍠 Nhổ sắn', '🌾 Gặt lúa'].map(job => (
            <button key={job} style={{
              padding: '0.5rem 1.25rem',
              background: 'white',
              border: '1px solid var(--border)',
              borderRadius: '99px',
              whiteSpace: 'nowrap',
              fontWeight: 600,
              color: 'var(--text-secondary)'
            }}>
              {job}
            </button>
          ))}
        </div>
      </section>

      {/* Job List */}
      <section className="container" style={{ marginBottom: '4rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem' }}>Việc làm mới nhất</h2>
          <a href="/jobs" style={{ color: 'var(--primary)', fontWeight: 600 }}>Xem tất cả &rarr;</a>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>Đang tải...</div>
        ) : (
          <div className="grid-layout">
            {jobs.length > 0 ? jobs.map(job => (
              <JobCard key={job.id} job={job} />
            )) : (
              <p>Chưa có công việc nào.</p>
            )}
          </div>
        )}
      </section>

      {/* CTA for Owners */}
      <section style={{ background: '#ECFDF5', padding: '4rem 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: '1rem' }}>Bạn là Chủ Vườn?</h2>
          <p style={{ marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
            Đăng tin tuyển thợ nhanh chóng, tiếp cận hàng ngàn thợ lành nghề.
            Quy trình đơn giản chỉ trong 8 bước.
          </p>
          <a href="/post-job" className="btn btn-primary" style={{ fontSize: '1.125rem', padding: '1rem 2rem' }}>
            Đăng Tin Tuyển Thợ Ngay
          </a>
        </div>
      </section>
    </div>
  );
}
