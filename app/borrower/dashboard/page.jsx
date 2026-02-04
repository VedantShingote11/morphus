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
            <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '1rem 0' }}>
                <div className="container flex justify-between items-center">
                    <h2 style={{ margin: 0 }}>📊 Borrower Dashboard</h2>
                    <div className="flex gap-2 items-center">
                        <Link href="/borrower/voice-assistant" className="btn btn-secondary">
                            🎤 Voice Assistant
                        </Link>
                        <Link href="/borrower/loans/new" className="btn btn-primary">
                            + New Loan Request
                        </Link>
                        <button onClick={handleLogout} className="btn btn-outline">
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className="container" style={{ padding: '2rem 1rem' }}>
                {/* Profile Summary */}
                <div className="card mb-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h3 style={{ marginBottom: '0.5rem' }}>{profile?.user?.name}</h3>
                            <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                                {profile?.user?.email}
                            </p>
                            {profile?.aadhaarNumber && (
                                <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                                    Aadhaar: ****-****-{profile.aadhaarNumber.slice(-4)}
                                </p>
                            )}
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div className="mb-2">
                                <StatusBadge status={profile?.kycStatus} />
                            </div>
                            <RiskScoreBadge score={profile?.riskScore || 50} />
                        </div>
                    </div>
                </div>

                {/* KYC Warning */}
                {profile?.kycStatus !== 'approved' && (
                    <div className="card mb-4" style={{ background: 'var(--warning-bg)', border: '1px solid var(--warning)' }}>
                        <div className="flex items-center gap-2">
                            <span style={{ fontSize: '1.5rem' }}>⚠️</span>
                            <div>
                                <h4 style={{ marginBottom: '0.25rem', color: 'var(--warning)' }}>KYC Verification Required</h4>
                                <p style={{ fontSize: '0.875rem', margin: 0 }}>
                                    Complete your KYC to request loans.{' '}
                                    <Link href="/borrower/profile" style={{ fontWeight: '600', color: 'var(--warning)' }}>
                                        Submit KYC →
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Stats Grid */}
                <div className="grid grid-4 mb-4">
                    <div className="card">
                        <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Active Loans</p>
                        <h2 style={{ margin: 0, color: 'var(--primary)' }}>{profile?.activeLoanCount || 0}</h2>
                    </div>
                    <div className="card">
                        <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Loans</p>
                        <h2 style={{ margin: 0 }}>{profile?.totalLoansCount || 0}</h2>
                    </div>
                    <div className="card">
                        <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Borrowed</p>
                        <h2 style={{ margin: 0, color: 'var(--secondary)' }}>₹{totalBorrowed.toLocaleString()}</h2>
                    </div>
                    <div className="card">
                        <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Repaid</p>
                        <h2 style={{ margin: 0, color: 'var(--success)' }}>₹{totalRepaid.toLocaleString()}</h2>
                    </div>
                </div>

                {/* Active Loans */}
                <div className="card">
                    <div className="card-header">
                        <div className="flex justify-between items-center">
                            <h3 className="card-title">Active Loans</h3>
                            <Link href="/borrower/loans" className="btn btn-sm btn-outline">
                                View All
                            </Link>
                        </div>
                    </div>

                    {activeLoans.length === 0 ? (
                        <p className="text-muted text-center" style={{ padding: '2rem' }}>
                            No active loans. <Link href="/borrower/loans/new" style={{ color: 'var(--primary)' }}>Create a loan request</Link>
                        </p>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Purpose</th>
                                        <th>Amount</th>
                                        <th>Duration</th>
                                        <th>Interest Rate</th>
                                        <th>Status</th>
                                        <th>Funded By</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activeLoans.map((loan) => (
                                        <tr key={loan._id}>
                                            <td>{loan.purpose}</td>
                                            <td>₹{loan.amount.toLocaleString()}</td>
                                            <td>{loan.duration} months</td>
                                            <td>{loan.interestRate}%</td>
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
