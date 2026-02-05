'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LenderDashboard() {
    const router = useRouter();
    const [portfolio, setPortfolio] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/auth/login?role=lender');
                return;
            }

            try {
                const res = await fetch('/api/lender/portfolio', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data = await res.json();
                if (data.success) {
                    setPortfolio(data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/');
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    const profile = portfolio?.profile;
    const metrics = portfolio?.portfolio?.metrics;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
            {/* Navigation Bar */}
            <div className="navbar">
                <div className="container flex justify-between items-center">
                    <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        💰 Lender Dashboard
                    </h2>
                    <div className="flex gap-2">
                        <Link href="/lender/discover" className="btn btn-primary" style={{ gap: '0.5rem' }}>
                            <span>🔍</span> Discover Loans
                        </Link>
                        <button onClick={handleLogout} className="btn btn-outline">
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className="container" style={{ padding: '2rem 1rem' }}>
                {/* Wallet Balance */}
                <div className="card card-gradient mb-4 fade-in" style={{ padding: '2.5rem', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: '-50%', right: '-50%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)', borderRadius: '50%' }}></div>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ 
                            display: 'inline-block',
                            padding: '0.5rem 1rem',
                            background: 'rgba(255, 255, 255, 0.2)',
                            borderRadius: '50px',
                            marginBottom: '1rem',
                            fontSize: '0.75rem',
                            fontWeight: '600'
                        }}>
                            💼 Investment Wallet
                        </div>
                        <h3 style={{ color: 'white', marginBottom: '0.5rem', fontSize: '1.25rem', fontWeight: '600', opacity: 0.9 }}>
                            Available Balance
                        </h3>
                        <h1 style={{ color: 'white', fontSize: 'clamp(2.5rem, 5vw, 4rem)', margin: '0 0 0.5rem 0', fontWeight: '800', textShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
                            ₹{profile?.walletBalance?.toLocaleString() || 0}
                        </h1>
                        <p style={{ opacity: 0.9, marginTop: '0.5rem', fontSize: '1rem' }}>
                            Ready to invest in promising opportunities
                        </p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-4 mb-4">
                    <div className="stat-card fade-in" style={{ borderLeftColor: 'var(--primary)', animationDelay: '0.1s' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <p className="text-muted" style={{ fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Total Invested
                            </p>
                            <div style={{ fontSize: '1.5rem' }}>💎</div>
                        </div>
                        <h2 style={{ margin: 0, color: 'var(--primary)', fontSize: '2.5rem', fontWeight: '800' }}>
                            ₹{profile?.totalInvested?.toLocaleString() || 0}
                        </h2>
                    </div>
                    <div className="stat-card fade-in" style={{ borderLeftColor: 'var(--secondary)', animationDelay: '0.2s' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <p className="text-muted" style={{ fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Active Loans
                            </p>
                            <div style={{ fontSize: '1.5rem' }}>📈</div>
                        </div>
                        <h2 style={{ margin: 0, color: 'var(--secondary)', fontSize: '2.5rem', fontWeight: '800' }}>
                            {metrics?.activeLoanCount || 0}
                        </h2>
                    </div>
                    <div className="stat-card fade-in" style={{ borderLeftColor: 'var(--success)', animationDelay: '0.3s' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <p className="text-muted" style={{ fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Returns Earned
                            </p>
                            <div style={{ fontSize: '1.5rem' }}>💰</div>
                        </div>
                        <h2 style={{ margin: 0, color: 'var(--success)', fontSize: '2.5rem', fontWeight: '800' }}>
                            ₹{profile?.totalReturns?.toLocaleString() || 0}
                        </h2>
                    </div>
                    <div className="stat-card fade-in" style={{ borderLeftColor: 'var(--error)', animationDelay: '0.4s' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <p className="text-muted" style={{ fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Defaults
                            </p>
                            <div style={{ fontSize: '1.5rem' }}>⚠️</div>
                        </div>
                        <h2 style={{ margin: 0, color: 'var(--error)', fontSize: '2.5rem', fontWeight: '800' }}>
                            {metrics?.defaultedLoanCount || 0}
                        </h2>
                    </div>
                </div>

                {/* Portfolio Summary */}
                <div className="grid grid-2">
                    <div className="card fade-in">
                        <div className="flex justify-between items-center mb-4">
                            <h4 style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0 }}>Active Investments</h4>
                            <span className="badge badge-info">{portfolio?.portfolio?.activeLoans?.length || 0}</span>
                        </div>
                        {portfolio?.portfolio?.activeLoans?.length === 0 ? (
                            <div className="empty-state" style={{ padding: '2rem 1rem' }}>
                                <div className="empty-state-icon" style={{ fontSize: '3rem' }}>💼</div>
                                <p className="text-muted">No active investments</p>
                                <Link href="/lender/discover" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                                    Discover Loans
                                </Link>
                            </div>
                        ) : (
                            <div>
                                {portfolio?.portfolio?.activeLoans?.slice(0, 5).map((loan, index) => (
                                    <div 
                                        key={loan._id} 
                                        className="fade-in" 
                                        style={{ 
                                            padding: '1.25rem', 
                                            background: 'var(--surface-hover)', 
                                            borderRadius: 'var(--radius-lg)',
                                            marginBottom: '1rem',
                                            border: '1px solid var(--border)',
                                            transition: 'var(--transition)',
                                            animationDelay: `${index * 0.1}s`
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateX(4px)';
                                            e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateX(0)';
                                            e.currentTarget.style.boxShadow = 'none';
                                        }}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontWeight: '700', marginBottom: '0.5rem', fontSize: '1rem' }}>{loan.purpose}</p>
                                                <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                                                    Borrower: {loan.borrowerId?.name}
                                                </p>
                                                <p className="text-muted" style={{ fontSize: '0.75rem' }}>
                                                    {loan.duration} months • {loan.interestRate}% APR
                                                </p>
                                            </div>
                                            <div style={{ textAlign: 'right', marginLeft: '1rem' }}>
                                                <p style={{ fontWeight: '800', fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '0.25rem' }}>
                                                    ₹{loan.fundedAmount?.toLocaleString()}
                                                </p>
                                                <p className="text-muted" style={{ fontSize: '0.75rem' }}>Invested</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {portfolio?.portfolio?.activeLoans?.length > 5 && (
                                    <Link href="/lender/portfolio" className="btn btn-outline" style={{ width: '100%', marginTop: '1rem' }}>
                                        View All ({portfolio.portfolio.activeLoans.length}) →
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="card fade-in" style={{ animationDelay: '0.2s' }}>
                        <h4 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem' }}>Portfolio Performance</h4>
                        
                        <div style={{ 
                            padding: '1.5rem', 
                            background: 'var(--gradient-success)', 
                            borderRadius: 'var(--radius-lg)',
                            marginBottom: '1.5rem',
                            color: 'white'
                        }}>
                            <p style={{ fontSize: '0.875rem', opacity: 0.9, marginBottom: '0.5rem' }}>Completed Loans</p>
                            <div className="flex justify-between items-end">
                                <h3 style={{ fontSize: '2rem', fontWeight: '800', margin: 0, color: 'white' }}>
                                    {metrics?.completedLoanCount || 0}
                                </h3>
                                <p style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0, opacity: 0.9 }}>
                                    ₹{metrics?.totalCompletedAmount?.toLocaleString() || 0}
                                </p>
                            </div>
                        </div>

                        <div style={{ 
                            padding: '1.5rem', 
                            background: 'var(--error-bg)', 
                            borderRadius: 'var(--radius-lg)',
                            marginBottom: '1.5rem',
                            border: '1px solid var(--error)'
                        }}>
                            <p style={{ fontSize: '0.875rem', color: 'var(--error)', marginBottom: '0.5rem', fontWeight: '600' }}>
                                Defaulted Loans
                            </p>
                            <div className="flex justify-between items-end">
                                <h3 style={{ fontSize: '2rem', fontWeight: '800', margin: 0, color: 'var(--error)' }}>
                                    {metrics?.defaultedLoanCount || 0}
                                </h3>
                                <p style={{ fontSize: '1.25rem', fontWeight: '700', margin: 0, color: 'var(--error)' }}>
                                    ₹{metrics?.totalDefaultedAmount?.toLocaleString() || 0}
                                </p>
                            </div>
                        </div>

                        <Link href="/lender/portfolio" className="btn btn-primary" style={{ width: '100%' }}>
                            View Full Portfolio →
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

