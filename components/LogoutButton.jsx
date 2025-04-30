'use client';

import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="absolute top-6 right-6 z-50 px-4 py-2 rounded font-semibold transition-colors
                bg-black/60 text-white hover:bg-white hover:text-black shadow-md backdrop-blur-sm"
    >
      Logout
    </button>
  );
}
