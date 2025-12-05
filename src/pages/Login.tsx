import { useState, useEffect } from 'react';
import { Eye, EyeOff, Play } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const backgroundImage = '/pexels-godless-humanist-739743-1587947.jpg';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      const role = user.role?.toLowerCase();
      const roleRoutes: Record<string, string> = {
        superadmin: '/superadmin',
        tenant: '/tenant',
        landlord: '/landlord',
        salesmanager: '/salesmanager',
        admin: '/admin',
        accounting: '/accounting',
        technician: '/technician',
        commercial: '/commercial',
        agencydirector: '/agencydirector',
      };
      const targetRoute = roleRoutes[role] || '/';
      if (window.location.pathname !== targetRoute) {
        navigate(targetRoute, { replace: true });
      }
    }
  }, [user, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData.email, formData.password);
      // Navigation will happen via useEffect when user state updates
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Network error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-layout">
        <div className="login-left">
          <div className="login-content">
            <div className="login-brand">
              <div className="brand-mark">
                <img src="/download.jpeg" alt="SAAF IMMO" />
              </div>
            </div>

            <div className="login-header">
              <h1>Login</h1>
              <p>Sign in to manage properties, tenants, and daily operations.</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form">
              {error && <div className="error-message">{error}</div>}
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-input">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="login-actions">
                <button
                  type="submit"
                  className="login-button"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>
                <div className="support-links">
                  <button type="button" className="link-button">
                    Forgot password?
                  </button>
                </div>
              </div>
            </form>

            <div className="login-footer">
              <p>Don't have an account? Contact your system administrator.</p>
            </div>
          </div>
        </div>

        <div
          className="login-right"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="login-overlay" />
          <div className="login-hero">
            <span className="hero-tagline">Start planning your journey</span>
            <h2>Your Condominium Management Solution</h2>
            <p>
              Manage your condominium with ease. Track performance across
              properties, coordinate teams, and keep every stakeholder informed
              in real-time.
            </p>
            <button type="button" className="hero-button">
              <Play size={18} />
              Watch overview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

