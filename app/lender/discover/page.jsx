'use client';

import RiskScoreBadge from '@/components/RiskScoreBadge';
import StatusBadge from '@/components/StatusBadge';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DiscoverLoans() {
    const router = useRouter();
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        minRisk: '',
        maxRisk: '',
        purpose: '',
        minAmount: '',
        maxAmount: '',
    });

    const fetchLoans = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');

        const params = new URLSearchParams();
        if (filters.minRisk) params.append('minRisk', filters.minRisk);
        if (filters.maxRisk) params.append('maxRisk', filters.maxRisk);
        if (filters.purpose) params.append('purpose', filters.purpose);
        if (filters.minAmount) params.append('minAmount', filters.minAmount);
        if (filters.maxAmount) params.append('maxAmount', filters.maxAmount);

        try {
            const res = await fetch(`/api/lender/loans?${params}`, {
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

    useEffect(() => {
        fetchLoans();
    }, []);

    const handleFund = async (loanId, amount) => {
        const token = localStorage.getItem('token');

        try {
            const res = await fetch('/api/lender/loans', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ loanId, fundAmount: amount }),
            });

            const data = await res.json();

            if (data.success) {
                alert(`Successfully funded loan! New wallet balance: ₹${data.newWalletBalance.toLocaleString()}`);
                fetchLoans();
            } else {
                alert(data.error || 'Failed to fund loan');
            }
        } catch (error) {
            alert('Error funding loan');
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
            <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '1rem 0' }}>
                <div className="container">
                    <Link href="/lender/dashboard" style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        ← Back to Dashboard
                    </Link>
                    <h2 style={{ marginTop: '0.5rem' }}>Discover Loan Opportunities</h2>
                </div>
            </div>

            <div className="container" style={{ padding: '2rem 1rem' }}>
                {/* Filters */}
                <div className="card mb-4">
                    <h4 className="mb-3">Filters</h4>
                    <div className="grid grid-4 gap-2">
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Min Risk Score</label>
                            <input
                                type="number"
                                className="form-input"
                                value={filters.minRisk}
                                onChange={(e) => setFilters({ ...filters, minRisk: e.target.value })}
                                placeholder="0"
                                min="0"
                                max="100"
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Max Risk Score</label>
                            <input
                                type="number"
                                className="form-input"
                                value={filters.maxRisk}
                                onChange={(e) => setFilters({ ...filters, maxRisk: e.target.value })}
                                placeholder="100"
                                min="0"
                                max="100"
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Purpose</label>
                            <input
                                type="text"
                                className="form-input"
                                value={filters.purpose}
                                onChange={(e) => setFilters({ ...filters, purpose: e.target.value })}
                                placeholder="e.g., Business"
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label className="form-label">Amount Range</label>
                            <div className="flex gap-1">
                                <input
                                    type="number"
                                    className="form-input"
                                    value={filters.minAmount}
                                    onChange={(e) => setFilters({ ...filters, minAmount: e.target.value })}
                                    placeholder="Min"
                                    style={{ width: '50%' }}
                                />
                                <input
                                    type="number"
                                    className="form-input"
                                    value={filters.maxAmount}
                                    onChange={(e) => setFilters({ ...filters, maxAmount: e.target.value })}
                                    placeholder="Max"
                                    style={{ width: '50%' }}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                        <button onClick={fetchLoans} className="btn btn-primary">
                            Apply Filters
                        </button>
                        <button
                            onClick={() => {
                                setFilters({ minRisk: '', maxRisk: '', purpose: '', minAmount: '', maxAmount: '' });
                                setTimeout(fetchLoans, 100);
                            }}
                            className="btn btn-outline"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>

                {/* Loans List */}
                {loading ? (
                    <div className="text-center" style={{ padding: '3rem' }}>
                        <div className="spinner" style={{ margin: '0 auto' }}></div>
                    </div>
                ) : loans.length === 0 ? (
                    <div className="card text-center" style={{ padding: '3rem' }}>
                        <p className="text-muted">No loan requests available matching your criteria</p>
                    </div>
                ) : (
                    <div className="grid gap-3">
                        {loans.map((loan) => (
                            <div key={loan._id} className="card">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 style={{ marginBottom: '0.5rem' }}>{loan.purpose}</h3>
                                        <p className="text-muted" style={{ fontSize: '0.875rem' }}>
                                            Requested by: {loan.borrowerId?.name}
                                        </p>
                                    </div>
                                    <RiskScoreBadge score={loan.riskScore} />
                                </div>

                                <div className="grid grid-4 gap-2 mb-3">
                                    <div>
                                        <p className="text-muted" style={{ fontSize: '0.75rem' }}>Loan Amount</p>
                                        <p style={{ fontWeight: '600', fontSize: '1.125rem' }}>₹{loan.amount.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted" style={{ fontSize: '0.75rem' }}>Duration</p>
                                        <p style={{ fontWeight: '600' }}>{loan.duration} months</p>
                                    </div>
                                    <div>
                                        <p className="text-muted" style={{ fontSize: '0.75rem' }}>Interest Rate</p>
                                        <p style={{ fontWeight: '600', color: 'var(--secondary)' }}>{loan.interestRate}% APR</p>
                                    </div>
                                    <div>
                                        <p className="text-muted" style={{ fontSize: '0.75rem' }}>Repayment</p>
                                        <p style={{ fontWeight: '600' }}>{loan.repaymentFrequency}</p>
                                    </div>
                                </div>

                                {loan.description && (
                                    <p className="text-muted mb-3" style={{ fontSize: '0.875rem' }}>
                                        {loan.description}
                                    </p>
                                )}

                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-muted" style={{ fontSize: '0.75rem' }}>Borrower History</p>
                                        <p style={{ fontSize: '0.875rem' }}>
                                            Total Loans: {loan.borrowerProfile?.totalLoansCount || 0} |
                                            KYC: <StatusBadge status={loan.borrowerProfile?.kycStatus} />
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => handleFund(loan._id, loan.amount)}
                                        className="btn btn-primary"
                                    >
                                        Fund This Loan
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
