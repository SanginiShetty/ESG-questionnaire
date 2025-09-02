'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Loader } from '@/components/ui/Loader';

export default function Home() {
  const { loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.push('/dashboard');
      } else {
        router.push('/auth/login');
      }
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Loading ESG Questionnaire...</p>
        </div>
      </div>
    );
  }

  return null;
}
