import './globals.css';

export const metadata = {
    title: 'Project Morpheus - Blockchain Microfinance',
    description: 'Transparent blockchain-based microfinance platform',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
