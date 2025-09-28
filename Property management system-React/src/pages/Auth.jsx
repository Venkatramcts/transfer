import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Select Role');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload = isLogin
      ? { email, password }
      : { email, password, role };

    const url = isLogin
      ? 'https://localhost:7067/api/Auth/login'
      : 'https://localhost:7067/api/Auth/register';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        if ([400, 401, 404].includes(response.status)) {
          throw new Error('Invalid email or password. Please try again.');
        }
        throw new Error(data.title || data.detail || 'Something went wrong. Please try again.');
      }

      if (isLogin) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('authEmail', data.email);
        localStorage.setItem('authRoles', JSON.stringify(data.roles));

        if (data.roles.includes("Owner") && data.ownerID) {
          localStorage.setItem('ownerID', data.ownerID);
        }

        if (data.roles.includes("Tenant") && data.tenantID) {
          localStorage.setItem('tenantID', data.tenantID);
        }

        navigate('/');
      } else {
        alert('Registration successful! Please log in.');
        setIsLogin(true);
        setEmail('');
        setPassword('');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1974')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        width: '100%',
      }}
    >
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <div className="card shadow-lg border-0 rounded-3" style={{ width: '100%', maxWidth: '600px', padding: '2rem' }}>
          <h2 className="text-center mb-4">{isLogin ? 'Login' : 'Register'}</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            {!isLogin && (
              <div className="mb-3">
                <select
                  className="form-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="Select Role" disabled>Select Role</option>
                  <option value="Tenant">Tenant</option>
                  <option value="Owner">Owner</option>
                </select>
              </div>
            )}
            <button type="submit" className="btn btn-primary w-100 fs-5" disabled={loading}>
              {loading ? 'Please wait...' : isLogin ? 'Login' : 'Register'}
            </button>
          </form>
          <div className="text-center mt-3">
            <button className="btn btn-link" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? "Don't have an account? Register" : "Already registered? Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
