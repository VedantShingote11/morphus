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
            <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '1rem 0' }}>
                <div className="container flex justify-between items-center">
                    <h2 style={{ margin: 0 }}>⚙️ Admin Dashboard</h2>
                    <button onClick={handleLogout} className="btn btn-outline">
                        Logout
                    </button>
                </div>
            </div>

            <div className="container" style={{ padding: '2rem 1rem' }}>
                {/* Stats Grid */}
                <div className="grid grid-4 mb-4">
                    <div className="card">
                        <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Users</p>
                        <h2 style={{ margin: 0, color: 'var(--primary)' }}>{stats?.users?.length || 0}</h2>
                        <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>
                            {borrowerCount} Borrowers | {lenderCount} Lenders
                        </p>
                    </div>
                    <div className="card">
                        <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Pending KYC</p>
                        <h2 style={{ margin: 0, color: 'var(--warning)' }}>{stats?.pendingKYC || 0}</h2>
                        <Link href="/admin/kyc" style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: '0.5rem', display: 'block' }}>
                            Review KYC →
                        </Link>
                    </div>
                    <div className="card">
                        <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Total Loans</p>
                        <h2 style={{ margin: 0, color: 'var(--secondary)' }}>{stats?.loans?.totalLoans || 0}</h2>
                        <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>
                            ₹{stats?.loans?.totalAmount?.toLocaleString() || 0}
                        </p>
                    </div>
                    <div className="card">
                        <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Blockchain Blocks</p>
                        <h2 style={{ margin: 0, color: 'var(--accent)' }}>{stats?.blockchain?.totalBlocks || 0}</h2>
                        <Link href="/admin/blockchain" style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: '0.5rem', display: 'block' }}>
                            View Explorer →
                        </Link>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-3 mb-4">
                    <Link href="/admin/kyc" className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                        <h4>KYC Management</h4>
                        <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                            Approve or reject borrower KYC requests
                        </p>
                    </Link>

                    <Link href="/admin/users" className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
                        <h4>User Management</h4>
                        <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                            View all users and their profiles
                        </p>
                    </Link>

                    <Link href="/admin/blockchain" className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⛓️</div>
                        <h4>Blockchain Explorer</h4>
                        <p className="text-muted" style={{ fontSize: '0.875rem' }}>
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
