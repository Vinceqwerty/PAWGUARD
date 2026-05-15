import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleBlur = e => {
    setTouched(t => ({ ...t, [e.target.name]: true }));
  };

  const validateForm = () => {
    if (!form.email.trim()) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(form.email)) return 'Email is invalid';
    if (!form.password) return 'Password is required';
    if (form.password.length < 6) return 'Password must be at least 6 characters';
    return null;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.detail || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getInputError = (field) => {
    if (!touched[field]) return null;
    if (field === 'email') {
      if (!form.email.trim()) return 'Email is required';
      if (!/\S+@\S+\.\S+/.test(form.email)) return 'Invalid email format';
    }
    if (field === 'password') {
      if (!form.password) return 'Password is required';
      if (form.password.length < 6) return 'Password must be at least 6 characters';
    }
    return null;
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.icon}>🐾</div>
          <h2 style={styles.title}>Welcome Back to PawGuard</h2>
          <p style={styles.subtitle}>Sign in to manage your pet's safety</p>
        </div>

        {error && (
          <div style={styles.errorContainer}>
            <span style={styles.errorIcon}>⚠️</span>
            <span style={styles.errorText}>{error}</span>
            <button onClick={() => setError('')} style={styles.errorClose}>×</button>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              Email Address
              <span style={styles.required}>*</span>
            </label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>📧</span>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                disabled={loading}
                style={{
                  ...styles.input,
                  ...(getInputError('email') && styles.inputError)
                }}
              />
            </div>
            {getInputError('email') && (
              <div style={styles.fieldError}>{getInputError('email')}</div>
            )}
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              Password
              <span style={styles.required}>*</span>
            </label>
            <div style={styles.inputWrapper}>
              <span style={styles.inputIcon}>🔒</span>
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                disabled={loading}
                style={{
                  ...styles.input,
                  ...(getInputError('password') && styles.inputError)
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.passwordToggle}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {getInputError('password') && (
              <div style={styles.fieldError}>{getInputError('password')}</div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitButton,
              ...(loading && styles.submitButtonDisabled)
            }}
          >
            {loading ? (
              <>
                <span style={styles.spinner}></span>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div style={styles.divider}>
          <span style={styles.dividerLine}></span>
          <span style={styles.dividerText}>or continue with</span>
          <span style={styles.dividerLine}></span>
        </div>

        <div style={styles.socialButtons}>
          <button style={styles.socialButton}>
            <span style={styles.socialIcon}>G</span>
            Google
          </button>
        </div>

        <p style={styles.registerText}>
          Don't have an account?{' '}
          <Link to="/register" style={styles.registerLink}>
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'fffff',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  card: {
    maxWidth: '480px',
    width: '100%',
    backgroundColor: 'white',
    borderRadius: '20px',
    padding: '40px',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    animation: 'slideUp 0.5s ease-out'
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px'
  },
  icon: {
    fontSize: '48px',
    marginBottom: '12px',
    animation: 'bounce 2s infinite'
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a202c',
    marginBottom: '8px'
  },
  subtitle: {
    fontSize: '14px',
    color: '#718096'
  },
  errorContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    backgroundColor: '#fed7d7',
    border: '1px solid #fc8181',
    borderRadius: '8px',
    padding: '12px 16px',
    marginBottom: '24px',
    position: 'relative'
  },
  errorIcon: {
    fontSize: '20px'
  },
  errorText: {
    flex: 1,
    fontSize: '14px',
    color: '#c53030'
  },
  errorClose: {
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
    color: '#c53030',
    padding: '0 4px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#2d3748'
  },
  required: {
    color: '#e53e3e',
    marginLeft: '4px'
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  inputIcon: {
    position: 'absolute',
    left: '12px',
    fontSize: '18px',
    opacity: 0.6
  },
  input: {
    width: '100%',
    padding: '12px 12px 12px 40px',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    fontSize: '14px',
    transition: 'all 0.3s ease',
    outline: 'none',
    fontFamily: 'inherit'
  },
  inputError: {
    borderColor: '#fc8181',
    backgroundColor: '#fff5f5'
  },
  fieldError: {
    fontSize: '12px',
    color: '#e53e3e',
    marginTop: '4px'
  },
  passwordToggle: {
    position: 'absolute',
    right: '12px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '18px',
    padding: '4px',
    opacity: 0.6
  },
  options: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '14px'
  },
  checkboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
    color: '#4a5568'
  },
  checkbox: {
    width: '16px',
    height: '16px',
    cursor: 'pointer'
  },
  forgotLink: {
    color: '#667eea',
    textDecoration: 'none',
    fontSize: '14px'
  },
  submitButton: {
    backgroundColor: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    padding: '14px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  },
  submitButtonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed'
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTopColor: 'white',
    borderRadius: '50%',
    animation: 'spin 0.6s linear infinite',
    display: 'inline-block'
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    margin: '24px 0'
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    backgroundColor: '#e2e8f0'
  },
  dividerText: {
    fontSize: '12px',
    color: '#a0aec0'
  },
  socialButtons: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px'
  },
  socialButton: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '10px',
    border: '2px solid #e2e8f0',
    borderRadius: '10px',
    backgroundColor: 'white',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '14px',
    fontWeight: '500',
    color: '#4a5568'
  },
  socialIcon: {
    fontWeight: 'bold',
    fontSize: '16px'
  },
  registerText: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#718096',
    marginTop: '8px'
  },
  registerLink: {
    color: '#667eea',
    textDecoration: 'none',
    fontWeight: '600'
  }
};
