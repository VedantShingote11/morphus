import Link from 'next/link';

export default function HomePage() {
    return (
        <div style={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Animated background elements */}
            <div style={{
                position: 'absolute',
                top: '-50%',
                right: '-50%',
                width: '200%',
                height: '200%',
                background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                animation: 'spin 20s linear infinite'
            }}></div>
            
            <div className="container" style={{ 
                position: 'relative', 
                zIndex: 1,
                paddingTop: '4rem',
                paddingBottom: '4rem'
            }}>
                {/* Hero Section */}
                <div className="text-center fade-in" style={{ color: 'white', marginBottom: '4rem' }}>
                    <div style={{
                        display: 'inline-block',
                        padding: '0.75rem 1.5rem',
                        background: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '50px',
                        marginBottom: '2rem',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.3)'
                    }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>⛓️ Blockchain-Powered</span>
                    </div>
                    
                    <h1 style={{ 
                        fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', 
                        marginBottom: '1.5rem', 
                        fontWeight: '800',
                        lineHeight: '1.1',
                        textShadow: '0 4px 20px rgba(0,0,0,0.2)'
                    }}>
                        Project Morpheus
                    </h1>
                    
                    <p style={{ 
                        fontSize: 'clamp(1.125rem, 2vw, 1.5rem)', 
                        marginBottom: '3rem', 
                        opacity: 0.95,
                        maxWidth: '700px',
                        margin: '0 auto 3rem',
                        lineHeight: '1.6'
                    }}>
                        Transparent, secure, and decentralized microfinance platform
                        <br />Connecting borrowers with lenders through blockchain technology
                    </p>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <Link href="/auth/register?role=borrower" className="btn btn-lg" style={{
                            background: 'white',
                            color: '#667eea',
                            padding: '1rem 2rem',
                            fontSize: '1rem',
                            fontWeight: '700'
                        }}>
                            Get Started as Borrower →
                        </Link>
                        <Link href="/auth/register?role=lender" className="btn btn-lg" style={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            border: '2px solid white',
                            padding: '1rem 2rem',
                            fontSize: '1rem',
                            fontWeight: '700'
                        }}>
                            Become a Lender →
                        </Link>
                    </div>
                </div>

                {/* Role Cards */}
                <div className="grid grid-3" style={{ maxWidth: '1100px', margin: '4rem auto 0' }}>
                    <Link 
                        href="/auth/login?role=borrower" 
                        className="card fade-in" 
                        style={{ 
                            textAlign: 'center', 
                            padding: '2.5rem', 
                            cursor: 'pointer',
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)',
                            animationDelay: '0.1s'
                        }}
                    >
                        <div style={{ 
                            fontSize: '4rem', 
                            marginBottom: '1.5rem',
                            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
                        }}>👤</div>
                        <h3 style={{ 
                            color: 'var(--text-primary)', 
                            marginBottom: '0.75rem',
                            fontSize: '1.5rem',
                            fontWeight: '700'
                        }}>Borrower</h3>
                        <p style={{ 
                            fontSize: '0.9375rem', 
                            color: 'var(--text-secondary)',
                            lineHeight: '1.6',
                            marginBottom: '1.5rem'
                        }}>
                            Request loans with flexible terms and track your repayment progress
                        </p>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: 'var(--primary)',
                            fontWeight: '600',
                            fontSize: '0.875rem'
                        }}>
                            Get Started <span>→</span>
                        </div>
                    </Link>

                    <Link 
                        href="/auth/login?role=lender" 
                        className="card fade-in" 
                        style={{ 
                            textAlign: 'center', 
                            padding: '2.5rem', 
                            cursor: 'pointer',
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)',
                            animationDelay: '0.2s'
                        }}
                    >
                        <div style={{ 
                            fontSize: '4rem', 
                            marginBottom: '1.5rem',
                            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
                        }}>💰</div>
                        <h3 style={{ 
                            color: 'var(--text-primary)', 
                            marginBottom: '0.75rem',
                            fontSize: '1.5rem',
                            fontWeight: '700'
                        }}>Lender</h3>
                        <p style={{ 
                            fontSize: '0.9375rem', 
                            color: 'var(--text-secondary)',
                            lineHeight: '1.6',
                            marginBottom: '1.5rem'
                        }}>
                            Fund loans, track portfolio performance, and earn returns
                        </p>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: 'var(--primary)',
                            fontWeight: '600',
                            fontSize: '0.875rem'
                        }}>
                            Start Investing <span>→</span>
                        </div>
                    </Link>

                    <Link 
                        href="/auth/login?role=admin" 
                        className="card fade-in" 
                        style={{ 
                            textAlign: 'center', 
                            padding: '2.5rem', 
                            cursor: 'pointer',
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)',
                            animationDelay: '0.3s'
                        }}
                    >
                        <div style={{ 
                            fontSize: '4rem', 
                            marginBottom: '1.5rem',
                            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
                        }}>⚙️</div>
                        <h3 style={{ 
                            color: 'var(--text-primary)', 
                            marginBottom: '0.75rem',
                            fontSize: '1.5rem',
                            fontWeight: '700'
                        }}>Admin</h3>
                        <p style={{ 
                            fontSize: '0.9375rem', 
                            color: 'var(--text-secondary)',
                            lineHeight: '1.6',
                            marginBottom: '1.5rem'
                        }}>
                            Manage KYC requests, view blockchain explorer, and oversee system
                        </p>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            color: 'var(--primary)',
                            fontWeight: '600',
                            fontSize: '0.875rem'
                        }}>
                            Admin Portal <span>→</span>
                        </div>
                    </Link>
                </div>

                {/* Features Section */}
                <div style={{ 
                    marginTop: '5rem', 
                    padding: '2.5rem', 
                    background: 'rgba(255,255,255,0.15)', 
                    borderRadius: '1.5rem', 
                    maxWidth: '900px', 
                    margin: '5rem auto 0',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                    <div className="grid grid-3" style={{ gap: '2rem', textAlign: 'center' }}>
                        <div>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>⛓️</div>
                            <p style={{ fontSize: '0.875rem', opacity: 0.95, fontWeight: '500' }}>
                                Blockchain Technology
                            </p>
                        </div>
                        <div>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🔒</div>
                            <p style={{ fontSize: '0.875rem', opacity: 0.95, fontWeight: '500' }}>
                                Secure & Transparent
                            </p>
                        </div>
                        <div>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
                            <p style={{ fontSize: '0.875rem', opacity: 0.95, fontWeight: '500' }}>
                                Real-time Analytics
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
