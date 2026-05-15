import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => { 
    await logout(); 
    navigate('/login'); 
  };

  if (!user) return null;

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        {/* Logo */}
        <Link to="/dashboard" style={styles.logo}>
          <span style={styles.logoIcon}>🐾</span>
          <span style={styles.logoText}>PawGuard</span>
        </Link>

        {/* Navigation Links */}
        <div style={styles.navLinks}>
          <Link to="/dashboard" style={styles.navLink}>Dashboard</Link>
          <Link to="/dogs" style={styles.navLink}>Dogs</Link>
          {user.role === 'admin' && (
            <Link to="/admin/users" style={styles.navLink}>Manage Users</Link>
          )}
        </div>

        {/* User Info & Logout */}
        <div style={styles.userSection}>
          <div style={styles.userInfo}>
            <div style={styles.userAvatar}>
              <span style={styles.userInitial}>
                {user.first_name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div style={styles.userDetails}>
              <span style={styles.userName}>{user.first_name}</span>
              <span style={styles.userRole}>
                {user.role?.replace('_', ' ')}
              </span>
            </div>
          </div>
          <button onClick={handleLogout} style={styles.logoutButton}>
            <span style={styles.logoutIcon}>🚪</span>
            <span style={styles.logoutText}>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}

const styles = {
  navbar: {
    backgroundColor: '#1e3a5f',
    borderBottom: '1px solid #e5e7eb',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '12px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '32px',
    flexWrap: 'wrap'
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    textDecoration: 'none',
    transition: 'opacity 0.15s ease',
  },
  logoIcon: {
    fontSize: '24px'
  },
  logoText: {
    fontWeight: '700',
    fontSize: '18px',
    color: '#fff',
    letterSpacing: '-0.025em'
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    flexWrap: 'wrap'
  },
  navLink: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500',
    padding: '6px 0',
    transition: 'color 0.15s ease',
    borderBottom: '2px solid transparent'
  },
  userSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginLeft: 'auto'
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '6px 12px',
    backgroundColor: '#f9fafb',
    borderRadius: '8px',
    border: '1px solid #e5e7eb'
  },
  userAvatar: {
    width: '32px',
    height: '32px',
    backgroundColor: '#3b82f6',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  userInitial: {
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '600'
  },
  userDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  userName: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#111827',
    lineHeight: '1.3'
  },
  userRole: {
    fontSize: '11px',
    color: '#6b7280',
    textTransform: 'capitalize',
    lineHeight: '1.2'
  },
  logoutButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'transparent',
    border: '1px solid #e5e7eb',
    color: '#fff',
    padding: '8px 16px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    transition: 'all 0.15s ease',
    fontFamily: 'inherit'
  },
  logoutIcon: {
    fontSize: '14px'
  },
  logoutText: {
    display: 'inline'
  }
};

// Add hover styles via CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .logo:hover {
    opacity: 0.8;
  }
  
  .navLink:hover {
    color: #111827;
  }
  
  .navLink.active {
    color: #3b82f6;
    border-bottom-color: #3b82f6;
  }
  
  .logoutButton:hover {
    background-color: #f9fafb;
    border-color: #d1d5db;
    color: #111827;
  }
  
  .userInfo:hover {
    background-color: #f3f4f6;
  }
`;
document.head.appendChild(styleSheet);