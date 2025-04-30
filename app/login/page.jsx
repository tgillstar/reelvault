'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { signInWithEmailAndPassword, signInAnonymously } from 'firebase/auth';
import { auth } from '@/lib/firebase';

export default function LoginPage() {
  const router = useRouter();
  const { user, role, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Redirect if already authenticated
  useEffect(() => {
    if (user && role) {
      router.push('/');
    }
  }, [user, role, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const tokenResult = await userCred.user.getIdTokenResult();
      const claims = tokenResult.claims;

      console.log('✅ Login successful:', claims);

      router.push('/');

    } catch (err) {
      console.error(err);
      setError('Invalid credentials.');
    }
  };

  const handleGuestLogin = async () => {
    setError('');
    try {
      const userCred = await signInAnonymously(auth);
      console.log('Guest login successful:', userCred.user.uid);
      router.push('/');
    } catch (err) {
      console.error('Guest login failed:', err);
      setError('Failed to log in as guest.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-xl font-semibold mb-4">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <button
          type="submit"
          className="w-full bg-black text-white p-2 rounded hover:bg-gray-800 mb-2"
        >
          Log In
        </button>

        <button
          type="button"
          onClick={handleGuestLogin}
          className="w-full text-sm text-gray-600 underline hover:text-black"
        >
          Continue as Guest
        </button>
      </form>
    </div>
  );
}
