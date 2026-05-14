import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { dogsAPI } from '../api/api';

export default function Dashboard() {
  const { user }        = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => { dogsAPI.dashboard().then(setStats).catch(console.error); }, []);

  const card = (label, value, color = '#2563eb') => (
    <div style={{ background: '#f1f5f9', borderRadius: 8, padding: '20px 24px', minWidth: 140 }}>
      <p style={{ margin: 0, color: '#64748b', fontSize: 13 }}>{label}</p>
      <p style={{ margin: 0, fontSize: 32, fontWeight: 700, color }}>{value ?? '—'}</p>
    </div>
  );

  return (
    <div>
      <h2>Welcome, {user?.first_name}! 🐾</h2>
      <p style={{ color: '#64748b' }}>Role: <strong>{user?.role?.replace('_', ' ')}</strong></p>

      {stats && (
        <>
          <h3>Dog Statistics</h3>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {card('Total Dogs',  stats.dogs?.total)}
            {card('Active',      stats.dogs?.active,     '#16a34a')}
            {card('Vaccinated',  stats.dogs?.vaccinated, '#0891b2')}
          </div>

          {stats.users && (
            <>
              <h3 style={{ marginTop: 32 }}>User Statistics</h3>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {card('Total Users',    stats.users.total)}
                {card('Dog Owners',     stats.users.dog_owners,     '#7c3aed')}
                {card('Event Managers', stats.users.event_managers, '#b45309')}
                {card('Admins',         stats.users.admins,         '#dc2626')}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
