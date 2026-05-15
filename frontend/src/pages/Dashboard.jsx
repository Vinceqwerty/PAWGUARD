import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { dogsAPI } from '../api/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    dogsAPI.dashboard()
      .then(setStats)
      .catch(err => setError('Failed to load dashboard data'))
      .finally(() => setLoading(false));
  }, []);

  const Card = ({ label, value, color = '#3b82f6' }) => (
    <div style={styles.card}>
      <p style={styles.cardLabel}>{label}</p>
      <p style={{ ...styles.cardValue, color }}>{value ?? '—'}</p>
    </div>
  );

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p style={styles.loadingText}>Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <div style={styles.errorIcon}>⚠️</div>
        <p style={styles.errorText}>{error}</p>
        <button onClick={() => window.location.reload()} style={styles.retryButton}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Welcome, {user?.first_name}! 🐾</h1>
          <div style={styles.roleChip}>
            <span style={styles.roleText}>{user?.role?.replace('_', ' ')}</span>
          </div>
        </div>
      </div>

      {stats && (
        <>
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Dog Statistics</h2>
            <div style={styles.grid}>
              <Card label="Total Dogs" value={stats.dogs?.total} />
              <Card label="Active" value={stats.dogs?.active} color="#16a34a" />
              <Card label="Vaccinated" value={stats.dogs?.vaccinated} color="#0891b2" />
            </div>
          </div>

          {stats.users && (
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>User Statistics</h2>
              <div style={styles.grid}>
                <Card label="Total Users" value={stats.users.total} />
                <Card label="Dog Owners" value={stats.users.dog_owners} color="#7c3aed" />
                <Card label="Event Managers" value={stats.users.event_managers} color="#b45309" />
                <Card label="Admins" value={stats.users.admins} color="#dc2626" />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 24px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: '#f9fafb',
    minHeight: '100vh'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #e5e7eb',
    borderTopColor: '#3b82f6',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite'
  },
  loadingText: {
    marginTop: '16px',
    color: '#6b7280',
    fontSize: '14px'
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    padding: '20px',
    textAlign: 'center'
  },
  errorIcon: {
    fontSize: '48px',
    marginBottom: '16px'
  },
  errorText: {
    color: '#dc2626',
    fontSize: '14px',
    marginBottom: '20px'
  },
  retryButton: {
    padding: '10px 20px',
    backgroundColor: '#3b82f6',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  },
  header: {
    marginBottom: '40px',
    paddingBottom: '20px',
    borderBottom: '2px solid #e5e7eb'
  },
  title: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '12px',
    letterSpacing: '-0.025em'
  },
  roleChip: {
    display: 'inline-block',
    backgroundColor: '#f3f4f6',
    padding: '4px 12px',
    borderRadius: '20px'
  },
  roleText: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#4b5563',
    textTransform: 'capitalize'
  },
  section: {
    marginBottom: '48px'
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: '20px',
    letterSpacing: '-0.015em'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px'
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '24px 20px',
    border: '1px solid #e5e7eb',
    transition: 'all 0.2s ease'
  },
  cardLabel: {
    margin: '0 0 12px 0',
    color: '#6b7280',
    fontSize: '13px',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  cardValue: {
    margin: 0,
    fontSize: '36px',
    fontWeight: '700',
    lineHeight: '1.2'
  }
};

// Add CSS for hover effects and animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .card:hover {
    border-color: #d1d5db;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    transform: translateY(-2px);
  }
  
  .retryButton:hover {
    background-color: #2563eb;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
document.head.appendChild(styleSheet);