import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => { await logout(); navigate('/login'); };

  if (!user) return null;

  return (
    <nav style={{ background:'#1e3a5f', color:'#fff', padding:'12px 24px',
      display:'flex', alignItems:'center', gap:24 }}>
      <span style={{ fontWeight:700, fontSize:18 }}>🐾 PawTrack</span>
      <Link to="/dashboard"    style={nl}>Dashboard</Link>
      <Link to="/dogs"         style={nl}>Dogs</Link>
      {user.role === 'admin' && <Link to="/admin/users" style={nl}>Manage Users</Link>}
      <span style={{ marginLeft:'auto', fontSize:13, opacity:0.8 }}>
        {user.first_name} · {user.role?.replace('_',' ')}
      </span>
      <button onClick={handleLogout}
        style={{ background:'transparent', border:'1px solid rgba(255,255,255,0.4)',
          color:'#fff', padding:'5px 14px', borderRadius:5, cursor:'pointer' }}>
        Logout
      </button>
    </nav>
  );
}
const nl = { color:'#fff', textDecoration:'none', fontSize:14 };
