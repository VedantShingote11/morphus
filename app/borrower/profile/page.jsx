'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function BorrowerProfile() {
    const router = useRouter();
    const [profile, setProfile] = useState(null);
    const [aadhaarNumber, setAadhaarNumber] = useState('');
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/auth/login?role=borrower');
                return;
            }

            try {
                const res = await fetch('/api/borrower/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const data = await res.json();
                if (data.success) {
                    setProfile(data.profile);
                    setAadhaarNumber(data.profile.aadhaarNumber || '');
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [router]);

    const handleSubmitKYC = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('/api/borrower/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ aadhaarNumber }),
            });

            const data = await res.json();

            if (data.success) {
                alert('KYC submitted successfully! Awaiting admin approval.');
                setProfile(data.profile);
            } else {
                alert(data.error || 'Failed to submit KYC');
            }
        } catch (error) {
            alert('Error submitting KYC');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
            <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '1rem 0' }}>
                <div className="container">
                    <Link href="/borrower/dashboard" style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                        ← Back to Dashboard
                    </Link>
                    <h2 style={{ marginTop: '0.5rem' }}>My Profile</h2>
                </div>
            </div>

            <div className="container" style={{ padding: '2rem 1rem', maxWidth: '800px' }}>
                <div className="grid grid-2 mb-4">
                    <div className="card">
                        <h4 className="mb-2">Personal Information</h4>
                        <div className="mb-2">
                            <p className="text-muted" style={{ fontSize: '0.75rem' }}>Name</p>
                            <p style={{ fontWeight: '600' }}>{profile?.user?.name}</p>
                        </div>
                        <div className="mb-2">
                            <p className="text-muted" style={{ fontSize: '0.75rem' }}>Email</p>
                            <p style={{ fontWeight: '600' }}>{profile?.user?.email}</p>
                        </div>
                        <div>
                            <p className="text-muted" style={{ fontSize: '0.75rem' }}>Member Since</p>
                            <p style={{ fontWeight: '600' }}>
                                {new Date(profile?.user?.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    <div className="card">
                        <h4 className="mb-2">Loan Statistics</h4>
                        <div className="mb-2">
                            <p className="text-muted" style={{ fontSize: '0.75rem' }}>Risk Score</p>
                            <p style={{ fontWeight: '600', color: 'var(--primary)' }}>{profile?.riskScore}/100</p>
                        </div>
                        <div className="mb-2">
                            <p className="text-muted" style={{ fontSize: '0.75rem' }}>Active Loans</p>
                            <p style={{ fontWeight: '600' }}>{profile?.activeLoanCount}</p>
                        </div>
                        <div>
                            <p className="text-muted" style={{ fontSize: '0.75rem' }}>Total Loans</p>
                            <p style={{ fontWeight: '600' }}>{profile?.totalLoansCount}</p>
                        </div>
                    </div>
                </div>

                <div className="card">
                    <h4 className="mb-3">KYC Verification</h4>

                    <div className="mb-3">
                        <p className="text-muted" style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}>Current Status</p>
                        <div className={`badge ${profile?.kycStatus === 'approved' ? 'badge-success' :
                                profile?.kycStatus === 'rejected' ? 'badge-error' :
                                    'badge-warning'
                            }`}>
                            {profile?.kycStatus?.toUpperCase()}
                        </div>
                    </div>

                    {profile?.kycStatus !== 'approved' && (
                        <form onSubmit={handleSubmitKYC}>
                            <div className="form-group">
                                <label className="form-label">Aadhaar Number (12 digits)</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={aadhaarNumber}
                                    onChange={(e) => setAadhaarNumber(e.target.value)}
                                    required
                                    pattern="[0-9]{12}"
                                    maxLength="12"
                                    placeholder="Enter 12-digit Aadhaar number"
                                />
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                                    ⚠️ This is a simulated KYC process. Your data is not verified with real Aadhaar systems.
                                </p>
                            </div>

                            <button type="submit" className="btn btn-primary" disabled={submitting}>
                                {submitting ? 'Submitting...' : 'Submit KYC for Approval'}
                            </button>
                        </form>
                    )}

                    {profile?.kycStatus === 'approved' && (
                        <div className="badge badge-success" style={{ padding: '1rem', width: '100%' }}>
                            ✓ Your KYC has been approved. You can now request loans!
                        </div>
                    )}

                    {profile?.kycStatus === 'rejected' && (
                        <div className="badge badge-error" style={{ padding: '1rem', width: '100%' }}>
                            ✗ Your KYC was rejected. Please contact support or resubmit with correct information.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
