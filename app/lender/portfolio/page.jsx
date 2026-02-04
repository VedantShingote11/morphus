'use client';

import StatusBadge from '@/components/StatusBadge';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LenderPortfolio() {
    const router = useRouter();
    const [portfolio, setPortfolio] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPortfolio = async () => {
            const token = localStorage.getItem('token');

            try {
                const res = await fetch('/api/lender/portfolio', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data = await res.json();
                if (data.success) {
                    setPortfolio(data);
                }
            } catch (error) {
                console.error('Error fetching portfolio:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPortfolio();
    }, []);

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    const { activeLoans, completedLoans, defaultedLoans, metrics } = portfolio?.portfolio || {};

    return (
        <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
            <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '1rem 0' }}>
                <div className="container">
                    <Link href="/lender/dashboard" style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        ← Back to Dashboard
                    </Link>
                    <h2 style={{ marginTop: '0.5rem' }}>My Portfolio</h2>
                </div>
            </div>

            <div className="container" style={{ padding: '2rem 1rem' }}>
                {/* Summary Cards */}
                <div className="grid grid-3 mb-4">
                    <div className="card">
                        <h4 className="mb-2">Active Investments</h4>
                        <h2 style={{ color: 'var(--primary)' }}>{metrics?.activeLoanCount || 0}</h2>
                        <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                            ₹{metrics?.totalActiveAmount?.toLocaleString() || 0}
                        </p>
                    </div>
                    <div className="card">
                        <h4 className="mb-2">Completed Loans</h4>
                        <h2 style={{ color: 'var(--success)' }}>{metrics?.completedLoanCount || 0}</h2>
                        <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                            ₹{metrics?.totalCompletedAmount?.toLocaleString() || 0}
                        </p>
                    </div>
                    <div className="card">
                        <h4 className="mb-2">Defaulted Loans</h4>
                        <h2 style={{ color: 'var(--error)' }}>{metrics?.defaultedLoanCount || 0}</h2>
                        <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                            ₹{metrics?.totalDefaultedAmount?.toLocaleString() || 0}
                        </p>
                    </div>
                </div>

                {/* Active Loans */}
                <div className="card mb-4">
                    <h4 className="mb-3">Active Loans</h4>
                    {activeLoans?.length === 0 ? (
                        <p className="text-muted">No active loans</p>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Borrower</th>
                                        <th>Purpose</th>
                                        <th>Amount</th>
                                        <th>Interest Rate</th>
                                        <th>Duration</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activeLoans?.map((loan) => (
                                        <tr key={loan._id}>
                                            <td>{loan.borrowerId?.name}</td>
                                            <td>{loan.purpose}</td>
                                            <td>₹{loan.fundedAmount?.toLocaleString()}</td>
                                            <td>{loan.interestRate}%</td>
                                            <td>{loan.duration} months</td>
                                            <td><StatusBadge status={loan.status} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Completed Loans */}
                <div className="card mb-4">
                    <h4 className="mb-3">Completed Loans</h4>
                    {completedLoans?.length === 0 ? (
                        <p className="text-muted">No completed loans</p>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Borrower</th>
                                        <th>Purpose</th>
                                        <th>Amount</th>
                                        <th>Interest Rate</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {completedLoans?.map((loan) => (
                                        <tr key={loan._id}>
                                            <td>{loan.borrowerId?.name}</td>
                                            <td>{loan.purpose}</td>
                                            <td>₹{loan.fundedAmount?.toLocaleString()}</td>
                                            <td>{loan.interestRate}%</td>
                                            <td><StatusBadge status={loan.status} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Defaulted Loans */}
                {defaultedLoans?.length > 0 && (
                    <div className="card">
                        <h4 className="mb-3">Defaulted Loans</h4>
                        <div style={{ overflowX: 'auto' }}>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Borrower</th>
                                        <th>Purpose</th>
                                        <th>Amount</th>
                                        <th>Interest Rate</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {defaultedLoans.map((loan) => (
                                        <tr key={loan._id}>
                                            <td>{loan.borrowerId?.name}</td>
                                            <td>{loan.purpose}</td>
                                            <td>₹{loan.fundedAmount?.toLocaleString()}</td>
                                            <td>{loan.interestRate}%</td>
                                            <td><StatusBadge status={loan.status} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
