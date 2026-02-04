'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function NewLoanRequest() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        amount: '',
        purpose: '',
        duration: '',
        preferredInterestRate: '',
        repaymentFrequency: 'monthly',
        description: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [suggestedRate, setSuggestedRate] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/borrower/loans', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...formData,
                    amount: parseFloat(formData.amount),
                    duration: parseInt(formData.duration),
                    preferredInterestRate: formData.preferredInterestRate ? parseFloat(formData.preferredInterestRate) : undefined,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to create loan request');
            }

            setSuggestedRate(data.suggestedInterestRate);
            alert('Loan request created successfully!');
            router.push('/borrower/loans');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
            <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '1rem 0' }}>
                <div className="container">
                    <Link href="/borrower/dashboard" style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        ← Back to Dashboard
                    </Link>
                    <h2 style={{ marginTop: '0.5rem' }}>Create New Loan Request</h2>
                </div>
            </div>

            <div className="container" style={{ padding: '2rem 1rem', maxWidth: '600px' }}>
                <div className="card">
                    {error && (
                        <div className="badge badge-error" style={{ width: '100%', marginBottom: '1rem', padding: '0.75rem' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="form-label">Loan Amount (₹)</label>
                            <input
                                type="number"
                                className="form-input"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                required
                                min="1000"
                                step="100"
                            />
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                Minimum: ₹1,000
                            </p>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Loan Purpose</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.purpose}
                                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
                                required
                                placeholder="e.g., Business expansion, Education, Medical"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Duration (Months)</label>
                            <input
                                type="number"
                                className="form-input"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                required
                                min="1"
                                max="60"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Preferred Interest Rate (% per annum) - Optional</label>
                            <input
                                type="number"
                                className="form-input"
                                value={formData.preferredInterestRate}
                                onChange={(e) => setFormData({ ...formData, preferredInterestRate: e.target.value })}
                                min="6"
                                max="25"
                                step="0.1"
                                placeholder="Leave blank for system suggestion"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Repayment Frequency</label>
                            <select
                                className="form-select"
                                value={formData.repaymentFrequency}
                                onChange={(e) => setFormData({ ...formData, repaymentFrequency: e.target.value })}
                            >
                                <option value="monthly">Monthly</option>
                                <option value="quarterly">Quarterly</option>
                                <option value="yearly">Yearly</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Additional Description</label>
                            <textarea
                                className="form-textarea"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Provide additional details about your loan request..."
                            />
                        </div>

                        <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
                            {loading ? 'Creating...' : 'Create Loan Request'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
