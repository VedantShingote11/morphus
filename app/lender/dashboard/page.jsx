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
            <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '1rem 0' }}>
                <div className="container flex justify-between items-center">
                    <h2 style={{ margin: 0 }}>💰 Lender Dashboard</h2>
                    <div className="flex gap-2">
                        <Link href="/lender/discover" className="btn btn-primary">
                            Discover Loans
                        </Link>
                        <button onClick={handleLogout} className="btn btn-outline">
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className="container" style={{ padding: '2rem 1rem' }}>
                {/* Wallet Balance */}
                <div className="card mb-4" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                    <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>Wallet Balance</h3>
                    <h1 style={{ color: 'white', fontSize: '3rem', margin: 0 }}>
                        ₹{profile?.walletBalance?.toLocaleString() || 0}
                    </h1>
                    <p style={{ opacity: 0.9, marginTop: '0.5rem' }}>Available for investment</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-4 mb-4">
                    <div className="card">
                        <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Invested</p>
                        <h2 style={{ margin: 0, color: 'var(--primary)' }}>₹{profile?.totalInvested?.toLocaleString() || 0}</h2>
                    </div>
                    <div className="card">
                        <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Active Loans</p>
                        <h2 style={{ margin: 0, color: 'var(--secondary)' }}>{metrics?.activeLoanCount || 0}</h2>
                    </div>
                    <div className="card">
                        <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Returns Earned</p>
                        <h2 style={{ margin: 0, color: 'var(--success)' }}>₹{profile?.totalReturns?.toLocaleString() || 0}</h2>
                    </div>
                    <div className="card">
                        <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Defaults</p>
                        <h2 style={{ margin: 0, color: 'var(--error)' }}>{metrics?.defaultedLoanCount || 0}</h2>
                    </div>
                </div>

                {/* Portfolio Summary */}
                <div className="grid grid-2">
                    <div className="card">
                        <h4 className="mb-3">Active Investments</h4>
                        {portfolio?.portfolio?.activeLoans?.length === 0 ? (
                            <p className="text-muted">No active investments</p>
                        ) : (
                            <div>
                                {portfolio?.portfolio?.activeLoans?.slice(0, 5).map((loan) => (
                                    <div key={loan._id} className="flex justify-between items-center mb-2" style={{ padding: '0.75rem', background: 'var(--surface-hover)', borderRadius: 'var(--radius)' }}>
                                        <div>
                                            <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>{loan.purpose}</p>
                                            <p className="text-muted" style={{ fontSize: '0.75rem' }}>
                                                {loan.borrowerId?.name}
                                            </p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <p style={{ fontWeight: '600' }}>₹{loan.fundedAmount?.toLocaleString()}</p>
                                            <p className="text-muted" style={{ fontSize: '0.75rem' }}>{loan.interestRate}% APR</p>
                                        </div>
                                    </div>
                                ))}
                                {portfolio?.portfolio?.activeLoans?.length > 5 && (
                                    <Link href="/lender/portfolio" className="btn btn-sm btn-outline" style={{ width: '100%', marginTop: '1rem' }}>
                                        View All ({portfolio.portfolio.activeLoans.length})
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="card">
                        <h4 className="mb-3">Portfolio Performance</h4>
                        <div className="mb-3">
                            <div className="flex justify-between mb-1">
                                <span className="text-muted" style={{ fontSize: '0.875rem' }}>Completed Loans</span>
                                <span style={{ fontWeight: '600' }}>{metrics?.completedLoanCount || 0}</span>
                            </div>
                            <div className="flex justify-between mb-1">
                                <span className="text-muted" style={{ fontSize: '0.875rem' }}>Total Completed Amount</span>
                                <span style={{ fontWeight: '600', color: 'var(--success)' }}>
                                    ₹{metrics?.totalCompletedAmount?.toLocaleString() || 0}
                                </span>
                            </div>
                        </div>
                        <div className="mb-3">
                            <div className="flex justify-between mb-1">
                                <span className="text-muted" style={{ fontSize: '0.875rem' }}>Defaulted Loans</span>
                                <span style={{ fontWeight: '600' }}>{metrics?.defaultedLoanCount || 0}</span>
                            </div>
                            <div className="flex justify-between mb-1">
                                <span className="text-muted" style={{ fontSize: '0.875rem' }}>Default Exposure</span>
                                <span style={{ fontWeight: '600', color: 'var(--error)' }}>
                                    ₹{metrics?.totalDefaultedAmount?.toLocaleString() || 0}
                                </span>
                            </div>
                        </div>
                        <Link href="/lender/portfolio" className="btn btn-primary" style={{ width: '100%' }}>
                            View Full Portfolio
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
