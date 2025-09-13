import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, Leaf, TrendingUp, Users } from 'lucide-react';

interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loading?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, loading = false }) => {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const result = await onSubmit(email, password);
    console.log("v icueag akhfhjhgnoselkyjovelsyjhpvoerd rhoipahoicwuhfibqagqe ihrgoi hrertpivrjnpaekrjuie ueg io3qtodjrxd jle");
    console.log(result.success);
    if (!result.success) {
      setError(result.error || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Teal/Green Welcome Section */}
      <div className="flex-1 bg-gradient-to-br from-teal-500 to-green-600 flex flex-col justify-center items-center text-white p-12 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gray-900 bg-opacity-10"></div>
        
        <div className="relative z-10 text-center max-w-md">
          {/* Logo */}
          <div className="flex justify-center items-center space-x-3 mb-8">
            <div className="flex items-center justify-center w-12 h-12 bg-white bg-opacity-20 rounded-lg backdrop-blur-sm">
              <Leaf className="h-6 w-6 text-gray-900" />
            </div>
            <h1 className="text-2xl font-bold text-white">
              ESG Tracker
            </h1>
          </div>
          
          <h2 className="text-4xl font-bold mb-4">
            Welcome Back!
          </h2>
          <p className="text-xl text-white text-opacity-90 mb-8">
            To keep connected with us please login with your personal info
          </p>
          
          <Link
            href="/auth/register"
            className="inline-flex items-center px-8 py-3 border-2 border-white border-opacity-50 text-white font-medium rounded-full hover:bg-white hover:text-teal-600 transition-all duration-300"
          >
            SIGN UP
          </Link>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 bg-gray-50 flex flex-col justify-center items-center p-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-teal-600 mb-2">Sign In</h2>
            <p className="text-gray-600">or use your email account:</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">!</span>
                </div>
                <span>{error}</span>
              </div>
            )}
            
            <div className="space-y-4">
              {/* Email Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-900" />
                </div>
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-4 border-0 border-b-2 text-gray-900 border-gray-900 bg-transparent placeholder-gray-400 focus:outline-none focus:border-teal-500 transition-all duration-200"
                  placeholder="Email"
                />
              </div>
              
              {/* Password Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-900" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-12 py-4 border-0 border-b-2 text-gray-900 border-gray-600 bg-transparent placeholder-gray-400 focus:outline-none focus:border-teal-500 transition-all duration-200"
                  placeholder="Password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-900 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-900 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="text-sm">
                <a href="#" className="font-medium text-gray-600 hover:text-teal-500 transition-colors">
                  Forgot your password?
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-4 px-6 border border-transparent text-white font-semibold rounded-full bg-gradient-to-r from-teal-400 to-teal-600 hover:from-teal-500 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>SIGNING IN...</span>
                </div>
              ) : (
                'SIGN IN'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};