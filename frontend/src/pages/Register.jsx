import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authAPI } from '../api/api';

export default function Register() {
  const [form, setForm] = useState({
    username: '', email: '', first_name: '', last_name: '',
    password: '', password2: '', role: 'dog_owner', phone_number: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = e => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleBlur = e => {
    setTouched(t => ({ ...t, [e.target.name]: true }));
  };

  const validateForm = () => {
    const errors = {};
    
    if (!form.username.trim()) errors.username = 'Username is required';
    else if (form.username.length < 3) errors.username = 'Username must be at least 3 characters';
    else if (form.username.length > 20) errors.username = 'Username must be less than 20 characters';
    
    if (!form.email.trim()) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errors.email = 'Email is invalid';
    
    if (!form.first_name.trim()) errors.first_name = 'First name is required';
    if (!form.last_name.trim()) errors.last_name = 'Last name is required';
    
    if (!form.password) errors.password = 'Password is required';
    else if (form.password.length < 8) errors.password = 'Password must be at least 8 characters';
    else if (!/(?=.*[a-z])/.test(form.password)) errors.password = 'Password must contain at least one lowercase letter';
    else if (!/(?=.*[A-Z])/.test(form.password)) errors.password = 'Password must contain at least one uppercase letter';
    else if (!/(?=.*\d)/.test(form.password)) errors.password = 'Password must contain at least one number';
    
    if (form.password !== form.password2) errors.password2 = 'Passwords do not match';
    
    if (form.phone_number && !/^\+?[\d\s-]{10,}$/.test(form.phone_number.replace(/\s/g, ''))) {
      errors.phone_number = 'Phone number is invalid';
    }
    
    return errors;
  };

  const getFieldError = (field) => {
    const errors = validateForm();
    return touched[field] ? errors[field] : null;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = {};
    Object.keys(form).forEach(key => { allTouched[key] = true; });
    setTouched(allTouched);
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setError('Please fix the errors above before submitting.');
      return;
    }
    
    setError('');
    setLoading(true);
    try {
      await authAPI.register(form);
      setSuccess('Account created! Check your email to verify your account.');
    } catch (err) {
      const errorMessage = typeof err === 'object' ? 
        (err.detail || err.message || JSON.stringify(err)) : 
        String(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div style={styles.successContainer}>
      <div style={styles.successCard}>
        <div style={styles.successIcon}>✓</div>
        <p style={styles.successText}>{success}</p>
        <Link to="/login" style={styles.successButton}>Go to Login →</Link>
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>🐾 Create Account</h2>
          <p style={styles.subtitle}>Join PawGuard to keep your pets safe</p>
        </div>

        {error && (
          <div style={styles.errorContainer}>
            <span style={styles.errorIcon}>⚠️</span>
            <div style={styles.errorContent}>
              <strong style={styles.errorTitle}>Registration Failed</strong>
              <span style={styles.errorText}>{error}</span>
            </div>
            <button onClick={() => setError('')} style={styles.errorClose}>×</button>
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Username Field */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              Username <span style={styles.required}>*</span>
            </label>
            <input
              name="username"
              type="text"
              placeholder="e.g., john_doe"
              value={form.username}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading}
              style={{
                ...styles.input,
                ...(getFieldError('username') && styles.inputError)
              }}
            />
            {getFieldError('username') && (
              <div style={styles.fieldError}>{getFieldError('username')}</div>
            )}
            <div style={styles.hint}>3-20 characters, letters and numbers only</div>
          </div>

          {/* Name Fields Row */}
          <div style={styles.row}>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>First Name <span style={styles.required}>*</span></label>
              <input
                name="first_name"
                type="text"
                placeholder="First name"
                value={form.first_name}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={loading}
                style={{
                  ...styles.input,
                  ...(getFieldError('first_name') && styles.inputError)
                }}
              />
              {getFieldError('first_name') && (
                <div style={styles.fieldError}>{getFieldError('first_name')}</div>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <label style={styles.label}>Last Name <span style={styles.required}>*</span></label>
              <input
                name="last_name"
                type="text"
                placeholder="Last name"
                value={form.last_name}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={loading}
                style={{
                  ...styles.input,
                  ...(getFieldError('last_name') && styles.inputError)
                }}
              />
              {getFieldError('last_name') && (
                <div style={styles.fieldError}>{getFieldError('last_name')}</div>
              )}
            </div>
          </div>

          {/* Email Field */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              Email Address <span style={styles.required}>*</span>
            </label>
            <input
              name="email"
              type="email"
              placeholder="john.doe@gmail.com"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading}
              style={{
                ...styles.input,
                ...(getFieldError('email') && styles.inputError)
              }}
            />
            {getFieldError('email') && (
              <div style={styles.fieldError}>{getFieldError('email')}</div>
            )}
          </div>

          {/* Phone Field */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Phone Number <span style={styles.optional}>(optional)</span></label>
            <input
              name="phone_number"
              type="tel"
              placeholder="+68 936 834 3421"
              value={form.phone_number}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={loading}
              style={{
                ...styles.input,
                ...(getFieldError('phone_number') && styles.inputError)
              }}
            />
            {getFieldError('phone_number') && (
              <div style={styles.fieldError}>{getFieldError('phone_number')}</div>
            )}
            <div style={styles.hint}>Include country code for international numbers</div>
          </div>

          {/* Role Selection */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              Account Type <span style={styles.required}>*</span>
            </label>
            <select
              name="role"
              value={form.role}
              onChange={handleChange}
              disabled={loading}
              style={styles.select}
            >
              <option value="dog_owner">🐕 Dog Owner - Manage your pets</option>
              <option value="event_manager">📅 Event Manager - Organize pet events</option>
            </select>
            <div style={styles.hint}>
              {form.role === 'dog_owner' 
                ? 'Register your dogs, track their health, and connect with vets' 
                : 'Create and manage pet-related events, track attendance'}
            </div>
          </div>

          {/* Password Fields */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              Password <span style={styles.required}>*</span>
            </label>
            <div style={styles.passwordWrapper}>
              <input
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                value={form.password}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={loading}
                style={{
                  ...styles.input,
                  ...(getFieldError('password') && styles.inputError),
                  paddingRight: '40px'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.passwordToggle}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {getFieldError('password') && (
              <div style={styles.fieldError}>{getFieldError('password')}</div>
            )}
            <div style={styles.passwordRequirements}>
              <div style={{ ...styles.reqItem, color: form.password.length >= 8 ? '#10b981' : '#94a3b8' }}>
                ✓ At least 8 characters
              </div>
              <div style={{ ...styles.reqItem, color: /[A-Z]/.test(form.password) ? '#10b981' : '#94a3b8' }}>
                ✓ One uppercase letter
              </div>
              <div style={{ ...styles.reqItem, color: /[a-z]/.test(form.password) ? '#10b981' : '#94a3b8' }}>
                ✓ One lowercase letter
              </div>
              <div style={{ ...styles.reqItem, color: /\d/.test(form.password) ? '#10b981' : '#94a3b8' }}>
                ✓ One number
              </div>
            </div>
          </div>

          {/* Confirm Password Field */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>
              Confirm Password <span style={styles.required}>*</span>
            </label>
            <div style={styles.passwordWrapper}>
              <input
                name="password2"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                value={form.password2}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={loading}
                style={{
                  ...styles.input,
                  ...(getFieldError('password2') && styles.inputError),
                  paddingRight: '40px'
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.passwordToggle}
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </button>
            </div>
            {getFieldError('password2') && (
              <div style={styles.fieldError}>{getFieldError('password2')}</div>
            )}
            {form.password && form.password2 && form.password === form.password2 && (
              <div style={styles.successHint}>✓ Passwords match</div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitButton,
              ...(loading && styles.submitButtonDisabled)
            }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div style={styles.footer}>
          <span style={styles.footerText}>Already have an account?</span>
          <Link to="/login" style={styles.loginLink}>Sign in instead</Link>
        </div>

        <div style={styles.terms}>
          By creating an account, you agree to our{' '}
          <Link to="/terms" style={styles.termsLink}>Terms of Service</Link> and{' '}
          <Link to="/privacy" style={styles.termsLink}>Privacy Policy</Link>
        </div>
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
    backgroundColor: '#ffffff',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  card: {
    maxWidth: '560px',
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '40px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    border: '1px solid #e5e7eb'
  },
  header: {
    textAlign: 'center',
    marginBottom: '32px'
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '8px',
    letterSpacing: '-0.025em'
  },
  subtitle: {
    fontSize: '14px',
    color: '#6b7280',
    lineHeight: '1.5'
  },
  errorContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    backgroundColor: '#fef2f2',
    border: '1px solid #fecaca',
    borderRadius: '12px',
    padding: '14px 16px',
    marginBottom: '24px'
  },
  errorIcon: {
    fontSize: '18px',
    marginTop: '1px'
  },
  errorContent: {
    flex: 1
  },
  errorTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#991b1b',
    display: 'block',
    marginBottom: '4px'
  },
  errorText: {
    fontSize: '13px',
    color: '#991b1b',
    wordBreak: 'break-word'
  },
  errorClose: {
    background: 'none',
    border: 'none',
    fontSize: '20px',
    cursor: 'pointer',
    color: '#991b1b',
    padding: '0',
    lineHeight: '1',
    opacity: '0.6'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  row: {
    display: 'flex',
    gap: '16px',
    flexWrap: 'wrap'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#374151'
  },
  required: {
    color: '#ef4444',
    marginLeft: '2px'
  },
  optional: {
    color: '#9ca3af',
    fontSize: '12px',
    fontWeight: 'normal',
    marginLeft: '4px'
  },
  input: {
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    transition: 'all 0.15s ease',
    outline: 'none',
    fontFamily: 'inherit',
    backgroundColor: '#ffffff'
  },
  inputError: {
    borderColor: '#ef4444',
    backgroundColor: '#fef2f2'
  },
  fieldError: {
    fontSize: '12px',
    color: '#ef4444',
    marginTop: '2px'
  },
  hint: {
    fontSize: '11px',
    color: '#9ca3af',
    marginTop: '2px'
  },
  successHint: {
    fontSize: '12px',
    color: '#10b981',
    marginTop: '2px'
  },
  passwordWrapper: {
    position: 'relative'
  },
  passwordToggle: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    padding: '4px',
    opacity: '0.6',
    fontFamily: 'inherit'
  },
  passwordRequirements: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    marginTop: '4px'
  },
  reqItem: {
    fontSize: '11px',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  select: {
    padding: '10px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    fontFamily: 'inherit'
  },
  submitButton: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '10px',
    padding: '12px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    marginTop: '8px',
    fontFamily: 'inherit'
  },
  submitButtonDisabled: {
    opacity: '0.6',
    cursor: 'not-allowed'
  },
  footer: {
    marginTop: '24px',
    textAlign: 'center',
    paddingTop: '20px',
    borderTop: '1px solid #e5e7eb',
    display: 'flex',
    gap: '8px',
    justifyContent: 'center'
  },
  footerText: {
    fontSize: '14px',
    color: '#6b7280'
  },
  loginLink: {
    color: '#2563eb',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: '500'
  },
  terms: {
    marginTop: '20px',
    textAlign: 'center',
    fontSize: '11px',
    color: '#9ca3af',
    lineHeight: '1.5'
  },
  termsLink: {
    color: '#6b7280',
    textDecoration: 'underline',
    textDecorationColor: '#d1d5db'
  },
  successContainer: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    padding: '20px'
  },
  successCard: {
    maxWidth: '400px',
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: '16px',
    padding: '40px',
    textAlign: 'center',
    border: '1px solid #e5e7eb',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  },
  successIcon: {
    width: '48px',
    height: '48px',
    backgroundColor: '#10b981',
    color: '#ffffff',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0 auto 20px'
  },
  successText: {
    color: '#111827',
    fontSize: '16px',
    marginBottom: '24px',
    lineHeight: '1.5'
  },
  successButton: {
    display: 'inline-block',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    textDecoration: 'none',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500'
  }
};

// Add hover styles via CSS (no animations)
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  input:hover:not(:disabled), select:hover:not(:disabled) {
    border-color: #9ca3af;
  }
  
  input:focus, select:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
    outline: none;
  }
  
  button:hover:not(:disabled) {
    background-color: #1d4ed8;
  }
  
  .loginLink:hover, .termsLink:hover {
    color: #1d4ed8;
    text-decoration: underline;
  }
  
  .errorClose:hover {
    opacity: 1;
  }
  
  .passwordToggle:hover {
    opacity: 1;
  }
`;
document.head.appendChild(styleSheet);