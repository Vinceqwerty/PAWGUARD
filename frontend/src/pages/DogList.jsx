import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dogsAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function DogList() {
  const { user }              = useAuth();
  const [dogs, setDogs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');

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
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>🐕 Dogs</h2>
        {user?.role !== 'event_manager' && (
          <Link to="/dogs/new">
            <button style={btn('#2563eb')}>+ Add Dog</button>
          </Link>
        )}
      </div>

      <input placeholder="Search by name, breed, color... (press Enter)"
        value={search} onChange={e => setSearch(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && fetchDogs(search)}
        style={{ padding: '8px 12px', border: '1px solid #ccc', borderRadius: 6, width: '100%', marginBottom: 16 }} />

      {loading ? <p>Loading...</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              {['Name','Breed','Age','Weight','Status','Owner','Actions'].map(h => (
                <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 13, color: '#475569' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dogs.map(dog => (
              <tr key={dog.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                <td style={td}><Link to={`/dogs/${dog.id}`}>{dog.name}</Link></td>
                <td style={td}>{dog.breed}</td>
                <td style={td}>{dog.age_display}</td>
                <td style={td}>{dog.weight} kg</td>
                <td style={td}>
                  <span style={{ padding: '2px 8px', borderRadius: 12, fontSize: 12, fontWeight: 600,
                    background: dog.status === 'active' ? '#dcfce7' : '#fee2e2',
                    color:      dog.status === 'active' ? '#166534' : '#991b1b' }}>
                    {dog.status}
                  </span>
                </td>
                <td style={td}>{dog.owner_name}</td>
                <td style={td}>
                  {canEdit(dog) && (
                    <>
                      <Link to={`/dogs/${dog.id}/edit`}>
                        <button style={btn('#f59e0b','#000')}>Edit</button>
                      </Link>{' '}
                      <button onClick={() => handleDelete(dog.id, dog.name)}
                        style={btn('#dc2626')}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const td  = { padding: '10px 12px', fontSize: 14 };
const btn = (bg, color = '#fff') => ({
  padding: '5px 12px', background: bg, color, border: 'none',
  borderRadius: 5, cursor: 'pointer', fontSize: 13,
});
