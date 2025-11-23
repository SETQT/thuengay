"use client";

import PostJobWizard from '@/components/PostJobWizard';

export default function EditJobPage({ params }: { params: { id: string } }) {
    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Chỉnh sửa tin tuyển dụng</h1>
                <PostJobWizard />
            </div>
        </div>
    );
}
