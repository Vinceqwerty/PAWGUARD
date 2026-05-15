import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dogsAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function DogList() {
  const { user } = useAuth();
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchDogs = (q = '') => {
    setLoading(true);
    dogsAPI.list(q ? `?search=${q}` : '')
      .then(data => setDogs(data.results || data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchDogs(); }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete ${name}?`)) return;
    await dogsAPI.delete(id);
    fetchDogs();
  };

  const canEdit = (dog) => user?.role === 'admin' || dog.owner === user?.id;

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>🐕 Dogs</h2>
          <p style={styles.subtitle}>Manage your furry friends</p>
        </div>
        {user?.role !== 'event_manager' && (
          <Link to="/dogs/new" style={styles.addButtonLink}>
            <button style={styles.addButton}>+ Add Dog</button>
          </Link>
        )}
      </div>

      {/* Search Section */}
      <div style={styles.searchSection}>
        <div style={styles.searchIcon}>🔍</div>
        <input 
          placeholder="Search by name, breed, color... (press Enter)"
          value={search} 
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && fetchDogs(search)}
          style={styles.searchInput}
        />
        {search && (
          <button 
            onClick={() => {
              setSearch('');
              fetchDogs('');
            }} 
            style={styles.clearButton}
          >
            ✕
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <p style={styles.loadingText}>Loading dogs...</p>
        </div>
      ) : dogs.length === 0 ? (
        /* Empty State */
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>🐕</div>
          <h3 style={styles.emptyTitle}>No dogs found</h3>
          <p style={styles.emptyText}>
            {search ? 'Try a different search term' : 'Get started by adding your first dog'}
          </p>
          {search && (
            <button 
              onClick={() => {
                setSearch('');
                fetchDogs('');
              }} 
              style={styles.clearSearchButton}
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        /* Dogs Table */
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeader}>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Breed</th>
                <th style={styles.th}>Age</th>
                <th style={styles.th}>Weight</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Owner</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {dogs.map((dog, index) => (
                <tr key={dog.id} style={{ 
                  ...styles.tableRow,
                  backgroundColor: index % 2 === 0 ? '#ffffff' : '#fafafa'
                }}>
                  <td style={styles.td}>
                    <Link to={`/dogs/${dog.id}`} style={styles.dogLink}>
                      {dog.name}
                    </Link>
                  </td>
                  <td style={styles.td}>{dog.breed || '—'}</td>
                  <td style={styles.td}>{dog.age_display || '—'}</td>
                  <td style={styles.td}>{dog.weight ? `${dog.weight} kg` : '—'}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: dog.status === 'active' ? '#dcfce7' : '#fee2e2',
                      color: dog.status === 'active' ? '#166534' : '#991b1b'
                    }}>
                      {dog.status || 'unknown'}
                    </span>
                  </td>
                  <td style={styles.td}>{dog.owner_name || '—'}</td>
                  <td style={styles.td}>
                    {canEdit(dog) && (
                      <div style={styles.actionButtons}>
                        <Link to={`/dogs/${dog.id}/edit`} style={styles.editLink}>
                          <button style={styles.editButton}>Edit</button>
                        </Link>
                        <button 
                          onClick={() => handleDelete(dog.id, dog.name)}
                          style={styles.deleteButton}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Table Footer with count */}
          <div style={styles.tableFooter}>
            <span style={styles.tableCount}>
              Showing {dogs.length} dog{dogs.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '32px 24px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backgroundColor: '#ffffff',
    minHeight: '100vh'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '32px',
    flexWrap: 'wrap',
    gap: '16px'
  },
  title: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '8px',
    letterSpacing: '-0.025em'
  },
  subtitle: {
    fontSize: '14px',
    color: '#6b7280',
    margin: 0
  },
  addButtonLink: {
    textDecoration: 'none'
  },
  addButton: {
    padding: '10px 20px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    fontFamily: 'inherit',
    transition: 'background-color 0.15s ease'
  },
  searchSection: {
    position: 'relative',
    marginBottom: '24px'
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '16px',
    opacity: 0.5,
    pointerEvents: 'none'
  },
  searchInput: {
    width: '100%',
    padding: '10px 12px 10px 38px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    fontFamily: 'inherit',
    transition: 'border-color 0.15s ease',
    outline: 'none'
  },
  clearButton: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    color: '#9ca3af',
    padding: '4px'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px'
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '3px solid #e5e7eb',
    borderTopColor: '#2563eb',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite'
  },
  loadingText: {
    marginTop: '16px',
    color: '#6b7280',
    fontSize: '14px'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    backgroundColor: '#f9fafb',
    borderRadius: '12px',
    border: '1px solid #e5e7eb'
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
    opacity: 0.5
  },
  emptyTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#111827',
    marginBottom: '8px'
  },
  emptyText: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '20px'
  },
  clearSearchButton: {
    padding: '8px 16px',
    backgroundColor: '#6b7280',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontFamily: 'inherit'
  },
  tableContainer: {
    overflowX: 'auto',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    backgroundColor: '#ffffff'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '800px'
  },
  tableHeader: {
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e5e7eb'
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: '13px',
    fontWeight: '600',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  tableRow: {
    borderBottom: '1px solid #f0f0f0',
    transition: 'background-color 0.15s ease'
  },
  td: {
    padding: '12px 16px',
    fontSize: '14px',
    color: '#374151'
  },
  dogLink: {
    color: '#2563eb',
    textDecoration: 'none',
    fontWeight: '500'
  },
  statusBadge: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'capitalize'
  },
  actionButtons: {
    display: 'flex',
    gap: '8px'
  },
  editButton: {
    padding: '5px 12px',
    backgroundColor: '#f59e0b',
    color: '#000000',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500',
    fontFamily: 'inherit',
    transition: 'opacity 0.15s ease'
  },
  deleteButton: {
    padding: '5px 12px',
    backgroundColor: '#dc2626',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '500',
    fontFamily: 'inherit',
    transition: 'opacity 0.15s ease'
  },
  editLink: {
    textDecoration: 'none'
  },
  tableFooter: {
    padding: '12px 16px',
    backgroundColor: '#fafafa',
    borderTop: '1px solid #e5e7eb',
    textAlign: 'right'
  },
  tableCount: {
    fontSize: '13px',
    color: '#6b7280'
  }
};

// Add CSS for hover effects
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  .addButton:hover {
    background-color: #1d4ed8;
  }
  
  .searchInput:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }
  
  .clearButton:hover {
    color: #6b7280;
  }
  
  .tableRow:hover {
    background-color: #f9fafb !important;
  }
  
  .dogLink:hover {
    text-decoration: underline;
  }
  
  .editButton:hover {
    opacity: 0.9;
  }
  
  .deleteButton:hover {
    background-color: #b91c1c;
  }
  
  .clearSearchButton:hover {
    background-color: #5a6268;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;
document.head.appendChild(styleSheet);