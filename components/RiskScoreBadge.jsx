export default function RiskScoreBadge({ score }) {
    let label, className, bgColor;

    if (score <= 35) {
        label = 'Low Risk';
        className = 'badge-success';
        bgColor = 'var(--risk-low-bg)';
    } else if (score <= 65) {
        label = 'Medium Risk';
        className = 'badge-warning';
        bgColor = 'var(--risk-medium-bg)';
    } else {
        label = 'High Risk';
        className = 'badge-error';
        bgColor = 'var(--risk-high-bg)';
    }

    return (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className={`badge ${className}`}>
                {label}
            </span>
            <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                {score}/100
            </span>
        </div>
    );
}
