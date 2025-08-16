import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      console.log(`${import.meta.env.VITE_API_AUTH_URL}`);
      const res = await axios.post('http://localhost:3000/api/auth/login', form, config);
      const { token: newToken, user } = res.data;
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Modern, engaging background */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-100 via-purple-50 to-blue-200">
        <div className="absolute inset-0 bg-white/40 backdrop-blur-xl"></div>
        <div className="absolute top-10 left-10 w-40 h-40 bg-blue-400/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-blue-200/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2"></div>
      </div>
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-4 relative z-10">
        <div className="w-full max-w-md bg-white/70 backdrop-blur-lg rounded-3xl shadow-xl border border-white/30 p-8 flex flex-col gap-6">
          <h2 className="text-3xl font-bold text-blue-700 mb-2 text-center tracking-tight">Welcome Back</h2>
          <p className="text-gray-500 text-center mb-4">Sign in to your EventSphere account</p>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit} autoComplete="off">
            <label className="font-medium text-gray-700">
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="mt-2 w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white/80 shadow-inner transition-all duration-200 outline-none"
                aria-label="Email"
              />
            </label>
            <label className="font-medium text-gray-700">
              Password
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                className="mt-2 w-full px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 bg-white/80 shadow-inner transition-all duration-200 outline-none"
                aria-label="Password"
              />
            </label>
            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 text-white font-semibold shadow-lg hover:scale-[1.03] hover:shadow-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <div className="text-center text-gray-500 mt-2">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 font-semibold hover:underline transition-colors duration-200">
              Register
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;