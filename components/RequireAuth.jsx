'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function RequireAuth({ children, allow = ['admin', 'guest'] }) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    
    if (!loading) {
      if (!user) router.push('/login');
      else if (!allow.includes(role)) router.push('/unauthorized');
    }
  }, [user, role, loading, router]);

  if (loading || !user || !allow.includes(role)) {
    return <div className="text-white p-8">Loading...</div>;
  }

  return children;
}