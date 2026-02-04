export default function StatusBadge({ status }) {
    const statusConfig = {
        // KYC Status
        pending: { label: 'Pending', className: 'badge-warning' },
        approved: { label: 'Approved', className: 'badge-success' },
        rejected: { label: 'Rejected', className: 'badge-error' },

        // Loan Status
        requested: { label: 'Requested', className: 'badge-info' },
        funded: { label: 'Funded', className: 'badge-success' },
        active: { label: 'Active', className: 'badge-success' },
        repaid: { label: 'Repaid', className: 'badge-success' },
        defaulted: { label: 'Defaulted', className: 'badge-error' },

        // Repayment Status
        paid: { label: 'Paid', className: 'badge-success' },
        overdue: { label: 'Overdue', className: 'badge-error' },
    };

    const config = statusConfig[status] || { label: status, className: 'badge-info' };

    return (
        <span className={`badge ${config.className}`}>
            {config.label}
        </span>
    );
}
