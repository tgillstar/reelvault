'use client';

import React from 'react';
import RequireAuth from '@/components/RequireAuth'; 
import { Providers } from './providers'; 
import HomeContent from './HomeContent'; 

export default function HomePage() {
  return (
    <Providers>
       <RequireAuth allow={['guest', 'admin']}>
        <HomeContent />
      </RequireAuth>
    </Providers>
  );
}
