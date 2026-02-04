'use client';

import StatusBadge from '@/components/StatusBadge';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function BorrowerLoans() {
    const router = useRouter();
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchLoans = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/auth/login?role=borrower');
                return;
            }

            try {
                const res = await fetch('/api/borrower/loans', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data = await res.json();
                if (data.success) {
                    setLoans(data.loans);
                }
            } catch (error) {
                console.error('Error fetching loans:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLoans();
    }, [router]);

    const filteredLoans = filter === 'all'
        ? loans
        : loans.filter(loan => loan.status === filter);

    return (
        <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
            <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '1rem 0' }}>
                <div className="container flex justify-between items-center">
                    <div>
                        <Link href="/borrower/dashboard" style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                            ← Back to Dashboard
                        </Link>
                        <h2 style={{ marginTop: '0.5rem' }}>My Loans</h2>
                    </div>
                    <Link href="/borrower/loans/new" className="btn btn-primary">
                        + New Loan Request
                    </Link>
                </div>
            </div>

            <div className="container" style={{ padding: '2rem 1rem' }}>
                {/* Filter Tabs */}
                <div className="flex gap-2 mb-4">
                    <button
                        onClick={() => setFilter('all')}
                        className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
                    >
                        All ({loans.length})
                    </button>
                    <button
                        onClick={() => setFilter('requested')}
                        className={`btn btn-sm ${filter === 'requested' ? 'btn-primary' : 'btn-outline'}`}
                    >
                        Requested
                    </button>
                    <button
                        onClick={() => setFilter('funded')}
                        className={`btn btn-sm ${filter === 'funded' ? 'btn-primary' : 'btn-outline'}`}
                    >
                        Funded
                    </button>
                    <button
                        onClick={() => setFilter('active')}
                        className={`btn btn-sm ${filter === 'active' ? 'btn-primary' : 'btn-outline'}`}
                    >
                        Active
                    </button>
                    <button
                        onClick={() => setFilter('repaid')}
                        className={`btn btn-sm ${filter === 'repaid' ? 'btn-primary' : 'btn-outline'}`}
                    >
                        Repaid
                    </button>
                </div>

                {/* Loans List */}
                {loading ? (
                    <div className="text-center" style={{ padding: '3rem' }}>
                        <div className="spinner" style={{ margin: '0 auto' }}></div>
                    </div>
                ) : filteredLoans.length === 0 ? (
                    <div className="card text-center" style={{ padding: '3rem' }}>
                        <p className="text-muted">No loans found</p>
                    </div>
                ) : (
                    <div className="grid gap-3">
                        {filteredLoans.map((loan) => (
                            <div key={loan._id} className="card">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 style={{ marginBottom: '0.5rem' }}>{loan.purpose}</h3>
                                        <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                                            Created: {new Date(loan.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <StatusBadge status={loan.status} />
                                </div>

                                <div className="grid grid-4 gap-2 mb-3">
                                    <div>
                                        <p className="text-muted" style={{ fontSize: '0.75rem' }}>Amount</p>
                                        <p style={{ fontWeight: '600', fontSize: '1.125rem' }}>₹{loan.amount.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted" style={{ fontSize: '0.75rem' }}>Duration</p>
                                        <p style={{ fontWeight: '600' }}>{loan.duration} months</p>
                                    </div>
                                    <div>
                                        <p className="text-muted" style={{ fontSize: '0.75rem' }}>Interest Rate</p>
                                        <p style={{ fontWeight: '600', color: 'var(--secondary)' }}>{loan.interestRate}%</p>
                                    </div>
                                    <div>
                                        <p className="text-muted" style={{ fontSize: '0.75rem' }}>Risk Score</p>
                                        <p style={{ fontWeight: '600' }}>{loan.riskScore}/100</p>
                                    </div>
                                </div>

                                {loan.description && (
                                    <p className="text-muted mb-2" style={{ fontSize: '0.875rem' }}>
                                        {loan.description}
                                    </p>
                                )}

                                {loan.fundedBy && (
                                    <div style={{ padding: '0.75rem', background: 'var(--surface-hover)', borderRadius: 'var(--radius)' }}>
                                        <p className="text-muted" style={{ fontSize: '0.75rem' }}>Funded by</p>
                                        <p style={{ fontWeight: '600' }}>{loan.fundedBy.name}</p>
                                        {loan.fundedDate && (
                                            <p className="text-muted" style={{ fontSize: '0.75rem' }}>
                                                on {new Date(loan.fundedDate).toLocaleDateString()}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
