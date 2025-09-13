import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, User, Leaf, TrendingUp, Users, Check, X } from 'lucide-react';

interface RegisterFormProps {
  onSubmit: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loading?: boolean;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, loading = false }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Password validation states
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
  });

  const validatePassword = (password: string) => {
    const validation = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
    };
    setPasswordValidation(validation);
    return validation;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const validation = validatePassword(password);
    const isPasswordValid = Object.values(validation).every(Boolean);
    
    if (!isPasswordValid) {
      setError('Please ensure your password meets all requirements');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    const result = await onSubmit(name, email, password);
    if (!result.success) {
      setError(result.error || 'Registration failed');
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    validatePassword(value);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Registration Form */}
      <div className="flex-1 bg-gray-50 flex flex-col justify-center items-center p-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-teal-600 mb-2">Create Account</h2>
            <p className="text-gray-600">or use your email for registration:</p>
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
              {/* Name Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-900" />
                </div>
                <input
                  type="text"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full pl-10 pr-3 py-4 border-0 border-b-2 text-gray-900 border-gray-200 bg-transparent placeholder-gray-400 focus:outline-none focus:border-teal-500 transition-all duration-200"
                  placeholder="Name"
                />
              </div>
              
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
                  className="block w-full pl-10 pr-3 py-4 border-0 text-gray-900 border-b-2 border-gray-200 bg-transparent placeholder-gray-400 focus:outline-none focus:border-teal-500 transition-all duration-200"
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
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => handlePasswordChange(e.target.value)}
                  className="block w-full pl-10 pr-12 py-4 border-0 border-b-2 text-gray-900 border-gray-200 bg-transparent placeholder-gray-400 focus:outline-none focus:border-teal-500 transition-all duration-200"
                  placeholder="Password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Password Requirements - Simplified */}
            {password && (
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className={`flex items-center space-x-1 ${passwordValidation.length ? 'text-green-600' : 'text-gray-900'}`}>
                    {passwordValidation.length ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    <span>8+ chars</span>
                  </div>
                  <div className={`flex items-center space-x-1 ${passwordValidation.uppercase ? 'text-green-600' : 'text-gray-900'}`}>
                    {passwordValidation.uppercase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    <span>Uppercase</span>
                  </div>
                  <div className={`flex items-center space-x-1 ${passwordValidation.lowercase ? 'text-green-600' : 'text-gray-900'}`}>
                    {passwordValidation.lowercase ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    <span>Lowercase</span>
                  </div>
                  <div className={`flex items-center space-x-1 ${passwordValidation.number ? 'text-green-600' : 'text-gray-900'}`}>
                    {passwordValidation.number ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                    <span>Number</span>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !Object.values(passwordValidation).every(Boolean)}
              className="w-full flex justify-center py-4 px-6 border border-transparent text-white font-semibold rounded-full bg-gradient-to-r from-teal-400 to-teal-600 hover:from-teal-500 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>CREATING ACCOUNT...</span>
                </div>
              ) : (
                'SIGN UP'
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Right Panel - Dark Welcome Section */}
      <div className="flex-1 bg-gray-900 flex flex-col justify-center items-center text-white p-12 relative overflow-hidden">
        
        <div className="relative z-10 text-center max-w-md">
          {/* Logo */}
          <div className="flex justify-center items-center space-x-3 mb-8">
            <div className="flex items-center justify-center w-12 h-12 bg-white rounded-lg">
              <Leaf className="h-6 w-6 text-gray-900" />
            </div>
            <h1 className="text-2xl font-bold text-white">
              ESG Tracker
            </h1>
          </div>
          
          <h2 className="text-4xl font-bold mb-4">
            Hello, Friend!
          </h2>
          <p className="text-xl text-white text-opacity-90 mb-8">
            Enter your personal details and start your ESG journey with us
          </p>
          
          <Link
            href="/auth/login"
            className="inline-flex items-center px-8 py-3 border-2 border-white border-opacity-50 text-white font-medium rounded-full hover:bg-white hover:text-gray-900 transition-all duration-300"
          >
            SIGN IN
          </Link>
        </div>
      </div>
    </div>
  );
};
