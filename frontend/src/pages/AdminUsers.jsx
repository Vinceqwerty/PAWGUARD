import { useEffect, useState } from 'react';
import { usersAPI } from '../api/api';

const ROLES = ['admin', 'dog_owner', 'event_manager'];

export default function AdminUsers() {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    setLoading(true);
    usersAPI.list()
      .then(data => setUsers(data.results || data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleChange = async (id, role) => {
    await usersAPI.update(id, { role });
    fetchUsers();
  };

  const handleToggleActive = async (u) => {
    await usersAPI.update(u.id, { is_active: !u.is_active });
    fetchUsers();
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user ${name}?`)) return;
    await usersAPI.delete(id);
    fetchUsers();
  };

  return (
    <div>
      <h2>👥 Manage Users</h2>
      {loading ? <p>Loading...</p> : (
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'#f8fafc' }}>
              {['Name','Email','Role','Active','Verified','Actions'].map(h => (
                <th key={h} style={{ padding:'10px 12px', textAlign:'left', fontSize:13, color:'#475569' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderBottom:'1px solid #e2e8f0' }}>
                <td style={{ padding:'10px 12px' }}>{u.full_name}</td>
                <td style={{ padding:'10px 12px', fontSize:13 }}>{u.email}</td>
                <td style={{ padding:'10px 12px' }}>
                  <select value={u.role} onChange={e => handleRoleChange(u.id, e.target.value)}
                    style={{ padding:'4px 8px', border:'1px solid #ccc', borderRadius:4 }}>
                    {ROLES.map(r => <option key={r} value={r}>{r.replace('_',' ')}</option>)}
                  </select>
                </td>
                <td style={{ padding:'10px 12px', color: u.is_active ? '#16a34a' : '#dc2626', fontWeight:600 }}>
                  {u.is_active ? 'Active' : 'Inactive'}
                </td>
                <td style={{ padding:'10px 12px' }}>{u.is_email_verified ? '✅' : '❌'}</td>
                <td style={{ padding:'10px 12px', display:'flex', gap:6 }}>
                  <button onClick={() => handleToggleActive(u)}
                    style={{ padding:'4px 10px', fontSize:12, border:'none', borderRadius:4, cursor:'pointer',
                      background: u.is_active ? '#fee2e2' : '#dcfce7',
                      color:      u.is_active ? '#dc2626' : '#16a34a' }}>
                    {u.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button onClick={() => handleDelete(u.id, u.username)}
                    style={{ padding:'4px 10px', background:'#dc2626', color:'#fff', border:'none', borderRadius:4, cursor:'pointer', fontSize:12 }}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
