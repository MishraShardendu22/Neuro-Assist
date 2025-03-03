import axiosInstance from '@/lib/axiosInstance';
import axios from 'axios';
import { useState } from 'react';


const Login = () => {
  const [userType, setUserType] = useState('patient'); // Default selection
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Define the endpoint based on the selected user type
    const endpoint =
      userType === 'patient' ? '/patient/login' : '/hospital/login';

    try {
      const response = await axiosInstance.post(endpoint, { email, password });
      const data = response.data;

      if (data.Token) {
        localStorage.setItem('token', data.Token);

      } else {
        throw new Error('Token not received from API.');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || err.message || 'An error occurred during login.');
      } else {
        setError((err as Error).message || 'An error occurred during login.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '400px',
      margin: '2rem auto',
      padding: '1rem',
      border: '1px solid #ccc'
    }}>
      <h2 style={{ textAlign: 'center' }}>Login</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="userType" style={{ display: 'block', marginBottom: '0.5rem' }}>
            User Type
          </label>
          <select
            id="userType"
            value={userType}
            onChange={(e) => setUserType(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
          >
            <option value="patient">Patient</option>
            <option value="hospital">Hospital</option>
          </select>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
            required
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem' }}>
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: '8px' }}
            required
          />
        </div>

        {error && (
          <div style={{ color: 'red', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#007BFF',
            color: '#fff',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Processing...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
