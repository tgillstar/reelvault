'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RequireGuest({ children }) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (role !== 'guest') {
        router.push('/unauthorized'); // Or route to different experience
      }
    }
  }, [user, role, loading, router]);

  if (loading || role !== 'guest') return null;

  return <>{children}</>;
}
