'use client';

import { useAuth } from '@/hooks/useAuth';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RegisterPage() {
  const { register, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleRegister = async (name: string, email: string, password: string) => {
    const result = await register(name, email, password);
    if (result.success) {
      router.push('/dashboard');
    }
    return result;
  };

  return <RegisterForm onSubmit={handleRegister} />;
}
