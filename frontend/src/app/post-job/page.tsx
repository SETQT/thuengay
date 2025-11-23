import PostJobWizard from '@/components/PostJobWizard';

export default function PostJobPage() {
    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Đăng Tin Tuyển Thợ</h1>
                <PostJobWizard />
            </div>
        </div>
    );
}
