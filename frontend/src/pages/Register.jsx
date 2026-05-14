import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../api/api';

export default function Register() {
  const [form, setForm]       = useState({
    username: '', email: '', first_name: '', last_name: '',
    password: '', password2: '', role: 'dog_owner', phone_number: ''
  });
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      await authAPI.register(form);
      setSuccess('Account created! Check your email to verify your account.');
    } catch (err) {
      setError(JSON.stringify(err));
    }
  };

  if (success) return (
    <div style={{ maxWidth: 400, margin: '60px auto', textAlign: 'center' }}>
      <p style={{ color: 'green' }}>{success}</p>
      <Link to="/login">Go to Login</Link>
    </div>
  );

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', padding: 30, border: '1px solid #ddd', borderRadius: 8 }}>
      <h2>🐾 Create Account</h2>
      {error && <p style={{ color: 'red', fontSize: 13 }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[
          ['username', 'Username', 'text'],
          ['email', 'Email', 'email'],
          ['first_name', 'First Name', 'text'],
          ['last_name', 'Last Name', 'text'],
          ['phone_number', 'Phone (optional)', 'text'],
          ['password', 'Password', 'password'],
          ['password2', 'Confirm Password', 'password'],
        ].map(([name, placeholder, type]) => (
          <input key={name} name={name} type={type} placeholder={placeholder}
            value={form[name]} onChange={handleChange}
            required={name !== 'phone_number'}
            style={{ padding: '10px 12px', border: '1px solid #ccc', borderRadius: 6 }} />
        ))}
        <select name="role" value={form.role} onChange={handleChange}
          style={{ padding: '10px 12px', border: '1px solid #ccc', borderRadius: 6 }}>
          <option value="dog_owner">Dog Owner</option>
          <option value="event_manager">Event Manager</option>
        </select>
        <button type="submit"
          style={{ padding: 10, background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
          Register
        </button>
      </form>
      <p><Link to="/login">Already have an account?</Link></p>
    </div>
  );
}