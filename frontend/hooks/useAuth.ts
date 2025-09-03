// import { useState, useEffect } from 'react';
// import { User } from '@/types';
// import { getAuthToken, getUser, setAuthToken, setUser, clearAuth } from '@/lib/auth';
// import { authApi } from '@/lib/api';

// export const useAuth = () => {
//   const [user, setUserState] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = getAuthToken();
//     const storedUser = getUser();

//     if (token && storedUser) {
//       // Type guard to ensure storedUser is a User
//       if (storedUser && typeof storedUser === 'object' && 'id' in storedUser && 'email' in storedUser && 'name' in storedUser) {
//         setUserState(storedUser as User);
//         // Verify token is still valid
//         authApi.getCurrentUser()
//           .then(({ user }) => {
//             setUserState(user);
//             setUser(user);
//           })
//           .catch(() => {
//             clearAuth();
//             setUserState(null);
//           })
//           .finally(() => setLoading(false));
//       } else {
//         clearAuth();
//         setLoading(false);
//       }
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   const login = async (email: string, password: string) => {
//     try {
//       const { token, user } = await authApi.login(email, password);
//       setAuthToken(token);
//       setUser(user);
//       setUserState(user);
//       return { success: true };
//     } catch (error: any) {
//       return { 
//         success: false, 
//         error: error.response?.data?.error || 'Login failed' 
//       };
//     }
//   };

//   const register = async (name: string, email: string, password: string) => {
//     try {
//       const { token, user } = await authApi.register(name, email, password);
//       setAuthToken(token);
//       setUser(user);
//       setUserState(user);
//       return { success: true };
//     } catch (error: any) {
//       return { 
//         success: false, 
//         error: error.response?.data?.error || 'Registration failed' 
//       };
//     }
//   };

//   const logout = () => {
//     clearAuth();
//     setUserState(null);
//   };

//   return {
//     user,
//     loading,
//     login,
//     register,
//     logout,
//     isAuthenticated: !!user,
//   };
// };

'use client';

import { useState, useEffect, useCallback } from 'react';
import { User } from '@/types';
import { getAuthToken, getUser, setAuthToken, setUser, clearAuth } from '@/lib/auth';
import { authApi } from '@/lib/api';

export const useAuth = () => {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth on mount
  useEffect(() => {
    const init = async () => {
      const token = getAuthToken();
      const storedUser = getUser();

      if (token && storedUser) {
        try {
          const { user: verifiedUser } = await authApi.getCurrentUser();
          setUserState(verifiedUser);
          setUser(verifiedUser);
          setIsAuthenticated(true);
        } catch {
          clearAuth();
          setUserState(null);
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  // Login
  const login = useCallback(async (email: string, password: string) => {
    try {
      const { token, user: loggedInUser } = await authApi.login(email, password);
      localStorage.setItem("token",token);
      setAuthToken(token);
      setUser(loggedInUser);
      setUserState(loggedInUser);
      setIsAuthenticated(true);
      console.log("LOGIN",token);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed',
      };
    }
  }, []);

  // Register
  const register = useCallback(async (name: string, email: string, password: string) => {
    try {
      const { token, user: newUser } = await authApi.register(name, email, password);
      setAuthToken(token);
      setUser(newUser);
      setUserState(newUser);
      setIsAuthenticated(true);
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed',
      };
    }
  }, []);

  // Logout
  const logout = useCallback(() => {
    clearAuth();
    setUserState(null);
    setIsAuthenticated(false);
  }, []);

  return {
    user,
    loading,
    isAuthenticated,
    token: getAuthToken(),
    login,
    register,
    logout,
  };
};
