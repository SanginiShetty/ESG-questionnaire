'use client';

import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from '@/components/auth/LoginForm';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { login, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, loading, router]);

  const handleLogin = async (email: string, password: string) => {
    const result = await login(email, password);
    if (result.success) {
      router.push('/dashboard'); // redirect immediately after login
    }
    return result;
  };

  return <LoginForm onSubmit={handleLogin} />;
}
