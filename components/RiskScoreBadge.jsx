export default function RiskScoreBadge({ score }) {
    let label, className, icon, color;

    if (score <= 35) {
        label = 'Low Risk';
        className = 'badge-success';
        icon = '🟢';
        color = 'var(--success)';
    } else if (score <= 65) {
        label = 'Medium Risk';
        className = 'badge-warning';
        icon = '🟡';
        color = 'var(--warning)';
    } else {
        label = 'High Risk';
        className = 'badge-error';
        icon = '🔴';
        color = 'var(--error)';
    }

    return (
        <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.75rem',
            padding: '0.5rem 1rem',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 'var(--radius-lg)',
            backdropFilter: 'blur(10px)'
        }}>
            <span className={`badge ${className}`} style={{
                fontWeight: '700',
                padding: '0.375rem 0.75rem',
                fontSize: '0.8125rem'
            }}>
                <span>{icon}</span> {label}
            </span>
            <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'flex-end'
            }}>
                <span style={{ 
                    fontSize: '1.125rem', 
                    fontWeight: '800', 
                    color: 'white',
                    lineHeight: '1'
                }}>
                    {score}
                </span>
                <span style={{ 
                    fontSize: '0.625rem', 
                    fontWeight: '600', 
                    color: 'rgba(255, 255, 255, 0.8)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}>
                    /100
                </span>
            </div>
        </div>
    );
}
