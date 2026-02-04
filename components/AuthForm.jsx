'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function AuthForm({ mode = 'login' }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const roleParam = searchParams.get('role') || 'borrower';

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        role: roleParam,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Authentication failed');
            }

            // Store token
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // Redirect based on role
            const dashboardRoutes = {
                borrower: '/borrower/dashboard',
                lender: '/lender/dashboard',
                admin: '/admin/dashboard',
            };

            router.push(dashboardRoutes[data.user.role]);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <h2 className="text-center mb-3">
                    {mode === 'login' ? 'Login' : 'Register'} as {formData.role.charAt(0).toUpperCase() + formData.role.slice(1)}
                </h2>

                {error && (
                    <div className="badge badge-error" style={{ width: '100%', marginBottom: '1rem', padding: '0.75rem' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {mode === 'register' && (
                        <div className="form-group">
                            <label className="form-label">Full Name</label>
                            <input
                                type="text"
                                className="form-input"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <input
                            type="email"
                            className="form-input"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-input"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            minLength={6}
                        />
                    </div>

                    {mode === 'register' && (
                        <div className="form-group">
                            <label className="form-label">Role</label>
                            <select
                                className="form-select"
                                value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            >
                                <option value="borrower">Borrower</option>
                                <option value="lender">Lender</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Register'}
                    </button>
                </form>

                <div className="text-center mt-3">
                    {mode === 'login' ? (
                        <p className="text-muted">
                            Don't have an account?{' '}
                            <Link href={`/auth/register?role=${formData.role}`} style={{ color: 'var(--primary)', fontWeight: '500' }}>
                                Register
                            </Link>
                        </p>
                    ) : (
                        <p className="text-muted">
                            Already have an account?{' '}
                            <Link href={`/auth/login?role=${formData.role}`} style={{ color: 'var(--primary)', fontWeight: '500' }}>
                                Login
                            </Link>
                        </p>
                    )}
                </div>

                <div className="text-center mt-2">
                    <Link href="/" style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
