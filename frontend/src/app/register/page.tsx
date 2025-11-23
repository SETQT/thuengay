"use client";

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import { api } from '@/services/api';

function RegisterForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect') || '/profile';

    const [role, setRole] = useState('worker');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRegister = async () => {
        if (!name || !phone || !password || !address) {
            setError('Vui lòng điền đầy đủ thông tin');
            return;
        }

        setLoading(true);
        setError('');
        try {
            const res = await api.post('/auth/register', { name, phone, password, role, address });
            if (res.success) {
                api.setToken(res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                router.push(redirect);
            } else {
                setError(res.message || 'Đăng ký thất bại');
            }
        } catch (err) {
            setError('Có lỗi xảy ra, vui lòng thử lại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.75rem' }}>Đăng Ký</h1>

            {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <button
                    className={`btn ${role === 'worker' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ flex: 1 }}
                    onClick={() => setRole('worker')}
                >
                    Tôi là Thợ
                </button>
                <button
                    className={`btn ${role === 'owner' ? 'btn-primary' : 'btn-outline'}`}
                    style={{ flex: 1 }}
                    onClick={() => setRole('owner')}
                >
                    Tôi là Chủ
                </button>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Họ tên</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                    placeholder="Nguyễn Văn A"
                />
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Số điện thoại</label>
                <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                    placeholder="0912..."
                />
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Địa chỉ</label>
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                    placeholder="Buôn Ma Thuột, Đắk Lắk"
                />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Mật khẩu</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                    placeholder="••••••"
                />
            </div>

            <button
                onClick={handleRegister}
                disabled={loading}
                className="btn btn-primary"
                style={{ width: '100%', marginBottom: '1rem', opacity: loading ? 0.7 : 1 }}
            >
                {loading ? 'Đang xử lý...' : 'Đăng Ký Ngay'}
            </button>

            <div style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Đã có tài khoản? <Link href={`/login?redirect=${redirect}`} style={{ color: 'var(--primary)', fontWeight: 600 }}>Đăng nhập</Link>
            </div>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <div style={{
            minHeight: 'calc(100vh - 80px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#F3F4F6'
        }}>
            <Suspense fallback={<div>Loading...</div>}>
                <RegisterForm />
            </Suspense>
        </div>
    );
}
