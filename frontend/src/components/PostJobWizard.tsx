"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './PostJobWizard.module.css';
import { api } from '@/services/api';

const JOB_TYPES = [
    "Cà phê", "Hồ tiêu", "Sầu riêng", "Thanh long", "Bưởi",
    "Nhổ sắn", "Làm cỏ", "Bón phân", "Tỉa cành", "Gặt lúa"
];

const REQUIREMENTS = [
    { id: 'name', label: 'Họ tên đầy đủ' },
    { id: 'phone', label: 'Số điện thoại (Bắt buộc)', required: true },
    { id: 'zalo', label: 'Zalo (SĐT hoặc Link)' },
    { id: 'photo', label: 'Ảnh chân dung' },
    { id: 'available', label: 'Có thể đi ngay (1-2 ngày tới)' },
];

export default function PostJobWizard() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        jobType: '',
        title: '',
        quantity: 10,
        priceType: 'day',
        price: '',
        startDate: '',
        endDate: '',
        amenities: [] as string[],
        description: '',
        location: '',
        requirements: ['phone'],
        images: [] as string[],
        package: 'free'
    });

    const nextStep = () => setStep(s => Math.min(s + 1, 8));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    const updateField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const toggleRequirement = (id: string) => {
        if (id === 'phone') return; // Always required
        setFormData(prev => {
            const reqs = prev.requirements.includes(id)
                ? prev.requirements.filter(r => r !== id)
                : [...prev.requirements, id];
            return { ...prev, requirements: reqs };
        });
    };

    const handlePostJob = async () => {
        setLoading(true);
        try {
            // Parse price
            const priceValue = parseInt(formData.price.replace(/\D/g, '')) || 0;

            const payload = {
                title: formData.title,
                description: `${formData.description}\n\nSố lượng: ${formData.quantity} người\nHình thức: ${formData.priceType === 'day' ? 'Theo ngày' : 'Theo kg'}`,
                location: formData.location || "Chưa cập nhật",
                price_min: priceValue,
                price_max: priceValue, // Simple mapping for now
                requirements: formData.requirements.map(r => REQUIREMENTS.find(req => req.id === r)?.label).join('\n'),
                benefits: "Bao ăn ở, Có xe đưa đón", // Default for now
                deadline: "2025-12-31", // Default for now
                images: formData.images
            };

            const res = await api.post('/jobs', payload);
            if (res.success) {
                alert('Đăng tin thành công!');
                router.push('/');
            } else {
                alert(res.message || 'Đăng tin thất bại');
            }
        } catch (error) {
            console.error(error);
            alert('Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    const renderStep1 = () => (
        <div>
            <h2 className={styles.stepTitle}>Bước 1: Chọn loại công việc</h2>
            <div className={styles.grid}>
                {JOB_TYPES.map(type => (
                    <button
                        key={type}
                        className={`${styles.optionBtn} ${formData.jobType === type ? styles.active : ''}`}
                        onClick={() => {
                            updateField('jobType', type);
                            updateField('title', `Tuyển thợ ${type.toLowerCase()}`);
                            setTimeout(nextStep, 200);
                        }}
                    >
                        {type}
                    </button>
                ))}
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div>
            <h2 className={styles.stepTitle}>Bước 2: Tiêu đề tin</h2>
            <div className={styles.formGroup}>
                <label className={styles.label}>Tiêu đề (Tự động gợi ý)</label>
                <input
                    className={styles.input}
                    value={formData.title}
                    onChange={(e) => updateField('title', e.target.value)}
                />
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div>
            <h2 className={styles.stepTitle}>Bước 3: Thông tin chi tiết</h2>
            <div className={styles.formGroup}>
                <label className={styles.label}>Số lượng người cần</label>
                <input
                    type="number"
                    className={styles.input}
                    value={formData.quantity}
                    onChange={(e) => updateField('quantity', e.target.value)}
                />
            </div>
            <div className={styles.formGroup}>
                <label className={styles.label}>Hình thức trả lương</label>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                            type="radio"
                            checked={formData.priceType === 'day'}
                            onChange={() => updateField('priceType', 'day')}
                        /> Theo ngày
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <input
                            type="radio"
                            checked={formData.priceType === 'kg'}
                            onChange={() => updateField('priceType', 'kg')}
                        /> Theo kg
                    </label>
                </div>
                <input
                    className={styles.input}
                    placeholder={formData.priceType === 'day' ? "VD: 350.000" : "VD: 1.000"}
                    value={formData.price}
                    onChange={(e) => updateField('price', e.target.value)}
                />
            </div>
            <div className={styles.formGroup}>
                <label className={styles.label}>Mô tả thêm</label>
                <textarea
                    className={styles.textarea}
                    rows={4}
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    placeholder="Mô tả công việc, yêu cầu cụ thể..."
                />
            </div>
        </div>
    );

    const renderStep5 = () => (
        <div>
            <h2 className={styles.stepTitle}>Bước 5: Yêu cầu hồ sơ thợ</h2>
            <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                Chọn những thông tin thợ BẮT BUỘC phải cung cấp khi ứng tuyển:
            </p>
            <div className={styles.checkboxGroup}>
                {REQUIREMENTS.map(req => (
                    <label key={req.id} className={styles.checkboxLabel}>
                        <input
                            type="checkbox"
                            checked={formData.requirements.includes(req.id)}
                            onChange={() => toggleRequirement(req.id)}
                            disabled={req.required}
                        />
                        {req.label}
                    </label>
                ))}
            </div>
        </div>
    );

    const renderStep8 = () => {
        // Check auth
        const isLoggedIn = api.getToken();

        if (!isLoggedIn) {
            return (
                <div style={{ textAlign: 'center' }}>
                    <h2 className={styles.stepTitle}>🔒 Đăng nhập để đăng tin</h2>
                    <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
                        Bạn cần có tài khoản để quản lý tin đăng và ứng viên.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <Link href="/login?redirect=/post-job" className="btn btn-outline">Đăng nhập</Link>
                        <Link href="/register?redirect=/post-job" className="btn btn-primary">Đăng ký ngay</Link>
                    </div>
                </div>
            );
        }

        return (
            <div style={{ textAlign: 'center' }}>
                <h2 className={styles.stepTitle}>🎉 Sẵn sàng đăng tin!</h2>
                <div style={{ background: '#F9FAFB', padding: '1.5rem', borderRadius: '12px', textAlign: 'left', marginBottom: '2rem' }}>
                    <h3 style={{ marginBottom: '0.5rem' }}>{formData.title}</h3>
                    <p><strong>Loại:</strong> {formData.jobType}</p>
                    <p><strong>Lương:</strong> {formData.price} / {formData.priceType === 'day' ? 'ngày' : 'kg'}</p>
                    <p><strong>Số lượng:</strong> {formData.quantity} người</p>
                    <p><strong>Địa điểm:</strong> {formData.location}</p>
                    <p><strong>Yêu cầu hồ sơ:</strong> {formData.requirements.join(', ')}</p>
                </div>
                <button
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '1rem', opacity: loading ? 0.7 : 1 }}
                    onClick={handlePostJob}
                    disabled={loading}
                >
                    {loading ? 'Đang xử lý...' : 'Xác nhận & Đăng tin ngay'}
                </button>
            </div>
        );
    };

    return (
        <div className={styles.wizard}>
            <div className={styles.progress}>
                <div className={styles.progressBar} style={{ width: `${(step / 8) * 100}%` }}></div>
            </div>

            <div style={{ minHeight: '300px' }}>
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
                {step === 4 && (
                    <div>
                        <h2 className={styles.stepTitle}>Bước 4: Địa điểm</h2>
                        <input
                            className={styles.input}
                            placeholder="Nhập địa chỉ vườn..."
                            value={formData.location}
                            onChange={(e) => updateField('location', e.target.value)}
                        />
                        <div style={{ height: '200px', background: '#eee', marginTop: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            Google Maps Placeholder
                        </div>
                    </div>
                )}
                {step === 5 && renderStep5()}
                {step === 6 && (
                    <div>
                        <h2 className={styles.stepTitle}>Bước 6: Hình ảnh</h2>
                        <div style={{ border: '2px dashed var(--border)', padding: '2rem', borderRadius: '12px', textAlign: 'center' }}>
                            <p>Kéo thả ảnh hoặc bấm để chọn</p>
                        </div>
                    </div>
                )}
                {step === 7 && (
                    <div>
                        <h2 className={styles.stepTitle}>Bước 7: Chọn gói tin</h2>
                        <div className={styles.grid}>
                            <div className={styles.optionBtn} style={{ border: '2px solid var(--primary)' }}>
                                <h3>Miễn phí</h3>
                                <p>Tin thường</p>
                            </div>
                            <div className={styles.optionBtn}>
                                <h3>VIP 1</h3>
                                <p>Đẩy top (20k)</p>
                            </div>
                        </div>
                    </div>
                )}
                {step === 8 && renderStep8()}
            </div>

            <div className={styles.actions}>
                {step > 1 && (
                    <button className="btn btn-outline" onClick={prevStep}>Quay lại</button>
                )}
                {step < 8 && (
                    <button className="btn btn-primary" onClick={nextStep} style={{ marginLeft: 'auto' }}>
                        Tiếp tục
                    </button>
                )}
            </div>
        </div>
    );
}
