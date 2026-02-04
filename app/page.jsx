import Link from 'next/link';

export default function HomePage() {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
            <div className="container text-center" style={{ color: 'white' }}>
                <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem', fontWeight: '700' }}>
                    Project Morpheus
                </h1>
                <p style={{ fontSize: '1.5rem', marginBottom: '3rem', opacity: 0.9 }}>
                    Blockchain-Based Microfinance Platform
                </p>

                <div className="grid grid-3" style={{ maxWidth: '900px', margin: '0 auto' }}>
                    <Link href="/auth/login?role=borrower" className="card" style={{ textAlign: 'center', padding: '2rem', cursor: 'pointer', transform: 'translateY(0)', transition: 'transform 0.3s' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👤</div>
                        <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Borrower</h3>
                        <p style={{ fontSize: '0.875rem' }}>Request loans and manage repayments</p>
                    </Link>

                    <Link href="/auth/login?role=lender" className="card" style={{ textAlign: 'center', padding: '2rem', cursor: 'pointer', transform: 'translateY(0)', transition: 'transform 0.3s' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💰</div>
                        <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Lender</h3>
                        <p style={{ fontSize: '0.875rem' }}>Fund loans and track your portfolio</p>
                    </Link>

                    <Link href="/auth/login?role=admin" className="card" style={{ textAlign: 'center', padding: '2rem', cursor: 'pointer', transform: 'translateY(0)', transition: 'transform 0.3s' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚙️</div>
                        <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>Admin</h3>
                        <p style={{ fontSize: '0.875rem' }}>Manage KYC and view blockchain</p>
                    </Link>
                </div>

                <div style={{ marginTop: '3rem', padding: '1.5rem', background: 'rgba(255,255,255,0.1)', borderRadius: '1rem', maxWidth: '600px', margin: '3rem auto 0' }}>
                    <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>
                        ⛓️ Powered by simulated blockchain technology<br />
                        🔒 Transparent, secure, and decentralized lending
                    </p>
                </div>
            </div>
        </div>
    );
}
