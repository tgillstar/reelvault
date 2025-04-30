'use client';

import { signInAnonymously } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function GuestLoginButton() {
  const router = useRouter();

  const handleGuestLogin = async () => {
    try {
      await signInAnonymously(auth);
      router.push('/');
    } catch (err) {
      console.error('Failed to sign in as guest:', err);
    }
  };

  return (
    <button onClick={handleGuestLogin} className="underline text-sm text-gray-300 hover:text-white mt-2">
      Try as Guest (30 min)
    </button>
  );
}
