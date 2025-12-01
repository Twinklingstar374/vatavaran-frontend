'use client';

import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (allowedRoles && !allowedRoles.includes(role)) {
        // Redirect to appropriate dashboard if role doesn't match
        if (role === 'STAFF') router.push('/staff');
        else if (role === 'SUPERVISOR') router.push('/supervisor');
        else if (role === 'ADMIN') router.push('/admin');
        else router.push('/home');
      }
    }
  }, [user, role, loading, allowedRoles, router]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!user || (allowedRoles && !allowedRoles.includes(role))) {
    return null; // Don't render anything while redirecting
  }

  return <>{children}</>;
}
