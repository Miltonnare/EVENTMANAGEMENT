import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Verification token is missing.');
        return;
      }
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_AUTH_URL}/verify-email`,
          { token },
          { headers: { 'Content-Type': 'application/json' } }
        );
        setStatus('success');
        setMessage(res.data.message);
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed');
      }
    };
    verify();
  }, [token]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Email Verification</h2>
          {status === 'verifying' && <p className="text-gray-500">Verifying your email...</p>}
          {status !== 'verifying' && (
            <p className={status === 'success' ? 'text-green-600' : 'text-red-500'}>{message}</p>
          )}
          <Link to="/login" className="inline-block mt-6 text-blue-600 hover:underline">
            Go to login
          </Link>
        </div>
      </main>
    </div>
  );
};

export default VerifyEmail;
