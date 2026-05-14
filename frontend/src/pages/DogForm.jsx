import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { dogsAPI } from '../api/api';

const EMPTY = {
  name:'', breed:'', age:'', weight:'', gender:'male', size:'medium',
  color:'', description:'', status:'active', is_vaccinated:false,
  vaccination_date:'', microchip_id:'',
};

export default function DogForm() {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const isEdit       = Boolean(id);
  const [form, setForm]   = useState(EMPTY);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEdit) dogsAPI.detail(id).then(dog => setForm({ ...EMPTY, ...dog }));
  }, [id, isEdit]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      if (isEdit) await dogsAPI.update(id, form);
      else        await dogsAPI.create(form);
      navigate('/dogs');
    } catch (err) {
      setError(JSON.stringify(err));
    }
  };

  const inp = (label, name, type = 'text', extra = {}) => (
    <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
      <label style={{ fontSize:13, color:'#475569' }}>{label}</label>
      <input name={name} type={type} value={form[name]} onChange={handleChange}
        style={{ padding:'8px 12px', border:'1px solid #ccc', borderRadius:6 }} {...extra} />
    </div>
  );

  const sel = (label, name, options) => (
    <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
      <label style={{ fontSize:13, color:'#475569' }}>{label}</label>
      <select name={name} value={form[name]} onChange={handleChange}
        style={{ padding:'8px 12px', border:'1px solid #ccc', borderRadius:6 }}>
        {options.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </div>
  );

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h2>{isEdit ? 'Edit Dog' : 'Add New Dog'} 🐾</h2>
      {error && <p style={{ color:'red', fontSize:13 }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
        {inp('Name',         'name',  'text',   { required:true })}
        {inp('Breed',        'breed', 'text',   { required:true })}
        {inp('Age (months)', 'age',   'number', { min:0, required:true })}
        {inp('Weight (kg)',  'weight','number', { step:'0.01', required:true })}
        {inp('Color',        'color', 'text',   { required:true })}
        {sel('Gender', 'gender', [['male','Male'],['female','Female']])}
        {sel('Size',   'size',   [['small','Small'],['medium','Medium'],['large','Large'],['extra_large','Extra Large']])}
        {sel('Status', 'status', [['active','Active'],['inactive','Inactive'],['adopted','Adopted'],['lost','Lost']])}
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <input type="checkbox" id="vacc" name="is_vaccinated"
            checked={form.is_vaccinated} onChange={handleChange} />
          <label htmlFor="vacc" style={{ fontSize:14 }}>Vaccinated</label>
        </div>
        {form.is_vaccinated && inp('Vaccination Date', 'vaccination_date', 'date')}
        {inp('Microchip ID', 'microchip_id')}
        <div style={{ display:'flex', flexDirection:'column', gap:4 }}>
          <label style={{ fontSize:13, color:'#475569' }}>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange}
            rows={3} style={{ padding:'8px 12px', border:'1px solid #ccc', borderRadius:6 }} />
        </div>
        <div style={{ display:'flex', gap:10 }}>
          <button type="submit"
            style={{ padding:'10px 24px', background:'#2563eb', color:'#fff', border:'none', borderRadius:6, cursor:'pointer' }}>
            {isEdit ? 'Save Changes' : 'Add Dog'}
          </button>
          <button type="button" onClick={() => navigate('/dogs')}
            style={{ padding:'10px 24px', background:'#e2e8f0', border:'none', borderRadius:6, cursor:'pointer' }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
