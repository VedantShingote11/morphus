'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AdminDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/auth/login?role=admin');
                return;
            }

            try {
                const [usersRes, loansRes, kycRes, blockchainRes] = await Promise.all([
                    fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } }),
                    fetch('/api/admin/loans', { headers: { Authorization: `Bearer ${token}` } }),
                    fetch('/api/admin/kyc?status=pending', { headers: { Authorization: `Bearer ${token}` } }),
                    fetch('/api/admin/blockchain', { headers: { Authorization: `Bearer ${token}` } }),
                ]);

                const [usersData, loansData, kycData, blockchainData] = await Promise.all([
                    usersRes.json(),
                    loansRes.json(),
                    kycRes.json(),
                    blockchainRes.json(),
                ]);

                setStats({
                    users: usersData.users || [],
                    loans: loansData.stats || {},
                    pendingKYC: kycData.kycRequests?.length || 0,
                    blockchain: blockchainData.stats || {},
                });
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

    const borrowerCount = stats?.users?.filter(u => u.role === 'borrower').length || 0;
    const lenderCount = stats?.users?.filter(u => u.role === 'lender').length || 0;

    return (
        <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
            {/* Navigation Bar */}
            <div className="navbar">
                <div className="container flex justify-between items-center">
                    <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '700', background: 'var(--gradient-primary)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        ⚙️ Admin Dashboard
                    </h2>
                    <button onClick={handleLogout} className="btn btn-outline">
                        Logout
                    </button>
                </div>
            </div>

            <div className="container" style={{ padding: '2rem 1rem' }}>
                {/* Stats Grid */}
                <div className="grid grid-4 mb-4">
                    <div className="stat-card fade-in" style={{ borderLeftColor: 'var(--primary)', animationDelay: '0.1s' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <p className="text-muted" style={{ fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Total Users
                            </p>
                            <div style={{ fontSize: '1.5rem' }}>👥</div>
                        </div>
                        <h2 style={{ margin: 0, color: 'var(--primary)', fontSize: '2.5rem', fontWeight: '800' }}>
                            {stats?.users?.length || 0}
                        </h2>
                        <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: '0.5rem', fontWeight: '600' }}>
                            {borrowerCount} Borrowers • {lenderCount} Lenders
                        </p>
                    </div>
                    <div className="stat-card fade-in" style={{ borderLeftColor: 'var(--warning)', animationDelay: '0.2s' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <p className="text-muted" style={{ fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Pending KYC
                            </p>
                            <div style={{ fontSize: '1.5rem' }}>⏳</div>
                        </div>
                        <h2 style={{ margin: 0, color: 'var(--warning)', fontSize: '2.5rem', fontWeight: '800' }}>
                            {stats?.pendingKYC || 0}
                        </h2>
                        <Link href="/admin/kyc" style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: '0.5rem', display: 'block', fontWeight: '600' }}>
                            Review KYC →
                        </Link>
                    </div>
                    <div className="stat-card fade-in" style={{ borderLeftColor: 'var(--secondary)', animationDelay: '0.3s' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <p className="text-muted" style={{ fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Total Loans
                            </p>
                            <div style={{ fontSize: '1.5rem' }}>📋</div>
                        </div>
                        <h2 style={{ margin: 0, color: 'var(--secondary)', fontSize: '2.5rem', fontWeight: '800' }}>
                            {stats?.loans?.totalLoans || 0}
                        </h2>
                        <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: '0.5rem', fontWeight: '600' }}>
                            ₹{stats?.loans?.totalAmount?.toLocaleString() || 0}
                        </p>
                    </div>
                    <div className="stat-card fade-in" style={{ borderLeftColor: 'var(--accent)', animationDelay: '0.4s' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                            <p className="text-muted" style={{ fontSize: '0.875rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                Blockchain Blocks
                            </p>
                            <div style={{ fontSize: '1.5rem' }}>⛓️</div>
                        </div>
                        <h2 style={{ margin: 0, color: 'var(--accent)', fontSize: '2.5rem', fontWeight: '800' }}>
                            {stats?.blockchain?.totalBlocks || 0}
                        </h2>
                        <Link href="/admin/blockchain" style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: '0.5rem', display: 'block', fontWeight: '600' }}>
                            View Explorer →
                        </Link>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-3 mb-4">
                    <Link href="/admin/kyc" className="card fade-in" style={{ 
                        textAlign: 'center', 
                        padding: '2.5rem',
                        background: 'var(--gradient-primary)',
                        color: 'white',
                        border: 'none',
                        animationDelay: '0.1s'
                    }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1.5rem', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }}>✅</div>
                        <h4 style={{ color: 'white', marginBottom: '0.75rem', fontSize: '1.5rem', fontWeight: '700' }}>KYC Management</h4>
                        <p style={{ fontSize: '0.9375rem', opacity: 0.9, lineHeight: '1.6' }}>
                            Approve or reject borrower KYC requests
                        </p>
                    </Link>

                    <Link href="/admin/users" className="card fade-in" style={{ 
                        textAlign: 'center', 
                        padding: '2.5rem',
                        background: 'var(--gradient-success)',
                        color: 'white',
                        border: 'none',
                        animationDelay: '0.2s'
                    }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1.5rem', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }}>👥</div>
                        <h4 style={{ color: 'white', marginBottom: '0.75rem', fontSize: '1.5rem', fontWeight: '700' }}>User Management</h4>
                        <p style={{ fontSize: '0.9375rem', opacity: 0.9, lineHeight: '1.6' }}>
                            View all users and their profiles
                        </p>
                    </Link>

                    <Link href="/admin/blockchain" className="card fade-in" style={{ 
                        textAlign: 'center', 
                        padding: '2.5rem',
                        background: 'var(--gradient-ocean)',
                        color: 'white',
                        border: 'none',
                        animationDelay: '0.3s'
                    }}>
                        <div style={{ fontSize: '4rem', marginBottom: '1.5rem', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))' }}>⛓️</div>
                        <h4 style={{ color: 'white', marginBottom: '0.75rem', fontSize: '1.5rem', fontWeight: '700' }}>Blockchain Explorer</h4>
                        <p style={{ fontSize: '0.9375rem', opacity: 0.9, lineHeight: '1.6' }}>
                            View the complete transaction ledger
                        </p>
                    </Link>
                </div>

                {/* Loan Statistics */}
                <div className="card">
                    <h4 className="mb-3">Loan Statistics</h4>
                    <div className="grid grid-4 gap-3">
                        <div>
                            <p className="text-muted" style={{ fontSize: '0.75rem' }}>Active Loans</p>
                            <p style={{ fontWeight: '600', fontSize: '1.5rem', color: 'var(--success)' }}>
                                {stats?.loans?.activeLoans || 0}
                            </p>
                        </div>
                        <div>
                            <p className="text-muted" style={{ fontSize: '0.75rem' }}>Funded Loans</p>
                            <p style={{ fontWeight: '600', fontSize: '1.5rem', color: 'var(--info)' }}>
                                {stats?.loans?.fundedLoans || 0}
                            </p>
                        </div>
                        <div>
                            <p className="text-muted" style={{ fontSize: '0.75rem' }}>Repaid Loans</p>
                            <p style={{ fontWeight: '600', fontSize: '1.5rem', color: 'var(--secondary)' }}>
                                {stats?.loans?.repaidLoans || 0}
                            </p>
                        </div>
                        <div>
                            <p className="text-muted" style={{ fontSize: '0.75rem' }}>Defaulted Loans</p>
                            <p style={{ fontWeight: '600', fontSize: '1.5rem', color: 'var(--error)' }}>
                                {stats?.loans?.defaultedLoans || 0}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
