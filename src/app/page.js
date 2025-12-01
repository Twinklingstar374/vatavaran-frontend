'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token && role) {
      // Redirect based on role
      if (role === 'STAFF') router.replace('/staff');
      else if (role === 'SUPERVISOR') router.replace('/supervisor');
      else if (role === 'ADMIN') router.replace('/admin');
    } else {
      // Not logged in, redirect to home
      router.replace('/home');
    }
  }, [router]);

  return null; // No UI
}
