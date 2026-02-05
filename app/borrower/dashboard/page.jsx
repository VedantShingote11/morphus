'use client';

import RiskScoreBadge from '@/components/RiskScoreBadge';
import StatusBadge from '@/components/StatusBadge';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function BorrowerDashboard() {
    const router = useRouter();
    const [profile, setProfile] = useState(null);
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            const user = localStorage.getItem('user');

            console.log('Token:', token ? 'exists' : 'missing');
            console.log('User:', user);

            if (!token) {
                router.push('/auth/login?role=borrower');
                return;
            }

            try {
                const [profileRes, loansRes] = await Promise.all([
                    fetch('/api/borrower/profile', {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch('/api/borrower/loans', {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                console.log('Profile response status:', profileRes.status);
                console.log('Loans response status:', loansRes.status);

                const profileData = await profileRes.json();
                const loansData = await loansRes.json();

                console.log('Profile data:', profileData);
                console.log('Loans data:', loansData);

                if (profileData.success) setProfile(profileData.profile);
                if (loansData.success) setLoans(loansData.loans);
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

    const activeLoans = loans.filter(l => l.status === 'active' || l.status === 'funded');
    const totalBorrowed = profile?.totalBorrowed || 0;
    const totalRepaid = profile?.totalRepaid || 0;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
            {/* Navigation Bar */}
            <div className="navbar">
                <div className="container flex justify-between items-center">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            📊 Borrower Dashboard
                        </h2>
                    </div>
                    <div className="flex gap-2 items-center">
                        <Link href="/borrower/voice-assistant" className="btn btn-secondary" style={{ gap: '0.5rem' }}>
                            <span>🎤</span> Voice Assistant
                        </Link>
                        <Link href="/borrower/loans/new" className="btn btn-primary" style={{ gap: '0.5rem' }}>
                            <span>+</span> New Loan Request
                        </Link>
                        <button onClick={handleLogout} className="btn btn-outline">
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className="container" style={{ padding: '2rem 1rem' }}>
                {/* Profile Summary */}
                <div className="card mb-4 fade-in" style={{ 
                    background: 'var(--gradient-primary)', 
                    color: 'white',
                    border: 'none',
                    padding: '2rem'
                }}>
                    <div className="flex justify-between items-center" style={{ flexWrap: 'wrap', gap: '1.5rem' }}>
                        <div>
                            <div style={{ 
                                display: 'inline-block',
                                padding: '0.5rem 1rem',
                                background: 'rgba(255, 255, 255, 0.2)',
                                borderRadius: '50px',
                                marginBottom: '1rem',
                                fontSize: '0.75rem',
                                fontWeight: '600'
                            }}>
                                👋 Welcome back
                            </div>
                            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.75rem', color: 'white' }}>
                                {profile?.user?.name || 'User'}
                            </h3>
                            <p style={{ fontSize: '0.9375rem', opacity: 0.9, marginBottom: '0.5rem' }}>
                                {profile?.user?.email}
                            </p>
                            {profile?.aadhaarNumber && (
                                <p style={{ fontSize: '0.875rem', opacity: 0.8 }}>
                                    Aadhaar: ****-****-{profile.aadhaarNumber.slice(-4)}
                                </p>
                            )}
                        </div>
                        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <StatusBadge status={profile?.kycStatus} />
                            </div>
                            <RiskScoreBadge score={profile?.riskScore || 50} />
                        </div>
                    </div>
                </div>

                {/* KYC Warning */}
                {profile?.kycStatus !== 'approved' && (
                    <div className="card mb-4 fade-in" style={{ 
                        background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)', 
                        border: '2px solid var(--warning)',
                        padding: '1.5rem'
                    }}>
                        <div className="flex items-center gap-3">
                            <div style={{ 
                                fontSize: '2.5rem',
                                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                            }}>⚠️</div>
                            <div style={{ flex: 1 }}>
                                <h4 style={{ 
                                    marginBottom: '0.5rem', 
                                    color: 'var(--warning)',
                                    fontSize: '1.125rem',
                                    fontWeight: '700'
                                }}>
                                    KYC Verification Required
                                </h4>
                                <p style={{ fontSize: '0.9375rem', margin: 0, color: 'var(--text-secondary)' }}>
                                    Complete your KYC verification to start requesting loans.{' '}
                                    <Link href="/borrower/profile" style={{ 
                                        fontWeight: '700', 
                                        color: 'var(--warning)',
                                        textDecoration: 'underline'
                                    }}>
                                        Submit KYC Now →
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-4 mb-4">
                    <div className="stat-card fade-in" style={{ borderLeftColor: 'var(--primary)', animationDelay: '0.1s' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <p className="text-muted" style={{ fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Active Loans
                            </p>
                            <div style={{ fontSize: '1.5rem' }}>📋</div>
                        </div>
                        <h2 style={{ margin: 0, color: 'var(--primary)', fontSize: '2.5rem', fontWeight: '800' }}>
                            {profile?.activeLoanCount || 0}
                        </h2>
                    </div>
                    <div className="stat-card fade-in" style={{ borderLeftColor: 'var(--accent)', animationDelay: '0.2s' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <p className="text-muted" style={{ fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Total Loans
                            </p>
                            <div style={{ fontSize: '1.5rem' }}>📊</div>
                        </div>
                        <h2 style={{ margin: 0, color: 'var(--accent)', fontSize: '2.5rem', fontWeight: '800' }}>
                            {profile?.totalLoansCount || 0}
                        </h2>
                    </div>
                    <div className="stat-card fade-in" style={{ borderLeftColor: 'var(--secondary)', animationDelay: '0.3s' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <p className="text-muted" style={{ fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Total Borrowed
                            </p>
                            <div style={{ fontSize: '1.5rem' }}>💵</div>
                        </div>
                        <h2 style={{ margin: 0, color: 'var(--secondary)', fontSize: '2.5rem', fontWeight: '800' }}>
                            ₹{totalBorrowed.toLocaleString()}
                        </h2>
                    </div>
                    <div className="stat-card fade-in" style={{ borderLeftColor: 'var(--success)', animationDelay: '0.4s' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <p className="text-muted" style={{ fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Total Repaid
                            </p>
                            <div style={{ fontSize: '1.5rem' }}>✅</div>
                        </div>
                        <h2 style={{ margin: 0, color: 'var(--success)', fontSize: '2.5rem', fontWeight: '800' }}>
                            ₹{totalRepaid.toLocaleString()}
                        </h2>
                    </div>
                </div>

                {/* Active Loans */}
                <div className="card fade-in">
                    <div className="card-header">
                        <div className="flex justify-between items-center">
                            <h3 className="card-title" style={{ fontSize: '1.5rem', fontWeight: '700' }}>
                                Active Loans
                            </h3>
                            <Link href="/borrower/loans" className="btn btn-sm btn-outline">
                                View All →
                            </Link>
                        </div>
                    </div>

                    {activeLoans.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-state-icon">📝</div>
                            <h4 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                                No Active Loans
                            </h4>
                            <p className="text-muted" style={{ marginBottom: '1.5rem' }}>
                                Start your journey by creating your first loan request
                            </p>
                            <Link href="/borrower/loans/new" className="btn btn-primary">
                                Create Loan Request
                            </Link>
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th style={{ fontWeight: '700' }}>Purpose</th>
                                        <th style={{ fontWeight: '700' }}>Amount</th>
                                        <th style={{ fontWeight: '700' }}>Duration</th>
                                        <th style={{ fontWeight: '700' }}>Interest Rate</th>
                                        <th style={{ fontWeight: '700' }}>Status</th>
                                        <th style={{ fontWeight: '700' }}>Funded By</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activeLoans.map((loan, index) => (
                                        <tr key={loan._id} className="fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                                            <td style={{ fontWeight: '600' }}>{loan.purpose}</td>
                                            <td style={{ fontWeight: '700', color: 'var(--primary)' }}>₹{loan.amount.toLocaleString()}</td>
                                            <td>{loan.duration} months</td>
                                            <td style={{ fontWeight: '600' }}>{loan.interestRate}%</td>
                                            <td><StatusBadge status={loan.status} /></td>
                                            <td>{loan.fundedBy?.name || '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
