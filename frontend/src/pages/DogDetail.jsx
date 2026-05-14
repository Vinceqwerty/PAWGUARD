import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { dogsAPI } from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function DogDetail() {
  const { id }        = useParams();
  const navigate      = useNavigate();
  const { user }      = useAuth();
  const [dog, setDog] = useState(null);

  useEffect(() => { dogsAPI.detail(id).then(setDog); }, [id]);

  const handleDelete = async () => {
    if (!window.confirm(`Delete ${dog.name}?`)) return;
    await dogsAPI.delete(id);
    navigate('/dogs');
  };

  if (!dog) return <p>Loading...</p>;
  const canEdit = user?.role === 'admin' || dog.owner === user?.id;

  return (
    <div style={{ maxWidth: 600 }}>
      <Link to="/dogs">← Back to Dogs</Link>
      <h2>{dog.name}</h2>
      <table style={{ width:'100%', borderCollapse:'collapse' }}>
        {[
          ['Breed', dog.breed],
          ['Age', dog.age_display],
          ['Weight', `${dog.weight} kg`],
          ['Gender', dog.gender],
          ['Size', dog.size],
          ['Color', dog.color],
          ['Status', dog.status],
          ['Vaccinated', dog.is_vaccinated ? 'Yes' : 'No'],
          ['Vaccination Date', dog.vaccination_date || '—'],
          ['Microchip ID', dog.microchip_id || '—'],
          ['Owner', dog.owner_name],
          ['Added', new Date(dog.created_at).toLocaleDateString()],
        ].map(([label, value]) => (
          <tr key={label} style={{ borderBottom:'1px solid #e2e8f0' }}>
            <td style={{ padding:'10px', color:'#64748b', width:'35%', fontWeight:500 }}>{label}</td>
            <td style={{ padding:'10px' }}>{value}</td>
          </tr>
        ))}
      </table>
      {dog.description && <p style={{ marginTop:16, color:'#475569' }}>{dog.description}</p>}
      {canEdit && (
        <div style={{ display:'flex', gap:10, marginTop:20 }}>
          <Link to={`/dogs/${id}/edit`}>
            <button style={{ padding:'8px 20px', background:'#f59e0b', border:'none', borderRadius:6, cursor:'pointer' }}>Edit</button>
          </Link>
          <button onClick={handleDelete}
            style={{ padding:'8px 20px', background:'#dc2626', color:'#fff', border:'none', borderRadius:6, cursor:'pointer' }}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
