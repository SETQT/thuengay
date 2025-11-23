"use client";

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import { api } from '@/services/api';

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect') || '/profile';
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/auth/login', { phone, password });
            if (res.success) {
                api.setToken(res.data.token);
                localStorage.setItem('user', JSON.stringify(res.data.user));
                router.push(redirect);
            } else {
                setError(res.message || 'Đăng nhập thất bại');
            }
        } catch (err) {
            setError('Có lỗi xảy ra, vui lòng thử lại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.75rem' }}>Đăng Nhập</h1>

            {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

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
                onClick={handleLogin}
                disabled={loading}
                className="btn btn-primary"
                style={{ width: '100%', marginBottom: '1rem', opacity: loading ? 0.7 : 1 }}
            >
                {loading ? 'Đang xử lý...' : 'Đăng Nhập'}
            </button>

            <div style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Chưa có tài khoản? <Link href={`/register?redirect=${redirect}`} style={{ color: 'var(--primary)', fontWeight: 600 }}>Đăng ký ngay</Link>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div style={{
            minHeight: 'calc(100vh - 80px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#F3F4F6'
        }}>
            <Suspense fallback={<div>Loading...</div>}>
                <LoginForm />
            </Suspense>
        </div>
    );
}
