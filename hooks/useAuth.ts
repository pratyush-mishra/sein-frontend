"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface UseAuthOptions {
  required?: boolean;
  redirectOnFail?: string;
}

interface AuthResult {
  user: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

/**
 * Custom hook for handling authentication.
 * @param {UseAuthOptions} options - Configuration for the hook.
 * @param {boolean} [options.required=false] - If true, redirects unauthenticated users.
 * @param {string} [options.redirectOnFail='/signin'] - Path to redirect to on auth failure.
 * @returns {AuthResult} - The authentication state.
 */
export function useAuth(options: UseAuthOptions = {}): AuthResult {
  const { required = false, redirectOnFail = '/signin' } = options;
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function checkAuthStatus() {
      setIsLoading(true);
      setError(null);

      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        if (required) {
          router.push(redirectOnFail);
        }
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/users/me/`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          // Token is invalid or expired, clear it
          if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
          }
          setIsAuthenticated(false);
          setUser(null);
          if (required) {
            router.push(redirectOnFail);
          }
          // Dispatch an event to notify other components (like the navbar) of the auth change
          window.dispatchEvent(new Event('authChange'));
          throw new Error('Authentication failed. Please sign in again.');
        }

        const userData = await res.json();
        setUser(userData);
        setIsAuthenticated(true);
      } catch (err: any) {
        setError(err.message);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    checkAuthStatus();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [required, redirectOnFail]);

  return { user, isLoading, isAuthenticated, error };
}