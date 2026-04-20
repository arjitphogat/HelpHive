'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth, isConfigured } from '@/lib/firebase';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const handleGoogleSignIn = async () => {
    if (!isConfigured || !auth) {
      router.push('/dashboard/user');
      return;
    }

    setGoogleLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push('/dashboard/user');
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Failed to sign in with Google');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError('');
    try {
      // Use API route for login
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        // Store auth token or session
        localStorage.setItem('auth_token', 'firebase_token');
        localStorage.setItem('user_id', result.user.uid);
        router.push('/dashboard/user');
      } else {
        setError(result.error || 'Failed to sign in. Please check your credentials.');
      }
    } catch (err: any) {
      // Fallback to Firebase direct auth if API fails
      if (isConfigured && auth) {
        try {
          const { signInWithEmailAndPassword } = await import('firebase/auth');
          await signInWithEmailAndPassword(auth, data.email, data.password);
          router.push('/dashboard/user');
        } catch (authErr: any) {
          if (authErr.code === 'auth/user-not-found') {
            setError('No account found with this email. Please sign up first.');
          } else if (authErr.code === 'auth/wrong-password') {
            setError('Incorrect password. Please try again.');
          } else if (authErr.code === 'auth/invalid-email') {
            setError('Invalid email address.');
          } else {
            setError(authErr.message || 'Failed to sign in. Please check your credentials.');
          }
        }
      } else {
        setError('Authentication is not available. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface-muted)] px-4 py-6 sm:py-12 overflow-y-auto">
      {/* Background Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--color-primary)]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[var(--color-primary)]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
      </div>

      <div className="relative w-full max-w-[440px] flex-shrink-0">
        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="text-3xl sm:text-4xl">🐝</span>
            <span className="text-xl sm:text-2xl font-bold text-[var(--color-text)]">HelpHive</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl sm:rounded-[var(--radius-xl)] shadow-[var(--shadow-modal)] p-6 sm:p-8 animate-fade-in-up overflow-y-auto max-h-[calc(100vh-120px)]">
          <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text)] text-center mb-1 sm:mb-2">Welcome back</h1>
          <p className="text-sm sm:text-base text-[var(--color-text-secondary)] text-center mb-4 sm:mb-6">Sign in to your HelpHive account</p>

          {error && (
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl sm:rounded-[var(--radius-lg)] bg-[var(--color-error-bg)] border border-[var(--color-error)]/20 animate-fade-in">
              <p className="text-xs sm:text-sm text-[var(--color-error)]">{error}</p>
            </div>
          )}

          {/* Google Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 sm:py-3.5 rounded-xl sm:rounded-[var(--radius-lg)] border border-[var(--color-border-light)] bg-white hover:bg-[var(--color-surface-muted)] transition-all duration-200 mb-4 sm:mb-6 group"
          >
            {googleLoading ? (
              <div className="w-5 h-5 border-2 border-[var(--color-border-light)] border-t-[var(--color-text)] rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            <span className="font-medium text-sm sm:text-base text-[var(--color-text)]">Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative mb-4 sm:mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--color-border-light)]" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 bg-white text-xs sm:text-sm text-[var(--color-text-muted)]">or sign in with email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-[var(--color-text)] mb-1 sm:mb-1.5">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className={`w-full px-4 py-3 rounded-xl sm:rounded-[var(--radius-lg)] border ${errors.email ? 'border-[var(--color-error)]' : 'border-[var(--color-border-light)]'} bg-white text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] text-sm transition-all focus:outline-none focus:border-[var(--color-text)] focus:shadow-[0_0_0_1px_var(--color-text)]`}
                {...register('email')}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-[var(--color-error)]">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-[var(--color-text)] mb-1 sm:mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className={`w-full px-4 py-3 rounded-xl sm:rounded-[var(--radius-lg)] border ${errors.password ? 'border-[var(--color-error)]' : 'border-[var(--color-border-light)]'} bg-white text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] text-sm transition-all focus:outline-none focus:border-[var(--color-text)] focus:shadow-[0_0_0_1px_var(--color-text)] pr-12`}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-[var(--color-error)]">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-end">
              <Link href="/auth/forgot-password" className="text-xs sm:text-sm text-[var(--color-text-link)] hover:underline">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 sm:py-3.5 rounded-xl sm:rounded-[var(--radius-lg)] bg-[var(--color-primary)] text-white font-semibold text-sm sm:text-base hover:bg-[var(--color-primary-hover)] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign in</span>
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-6 sm:mt-8 text-center text-sm text-[var(--color-text-secondary)]">
            Don't have an account?{' '}
            <Link href="/auth/register" className="text-[var(--color-primary)] font-medium hover:underline">
              Create one
            </Link>
          </p>
        </div>

        {/* Back to home */}
        <div className="mt-4 sm:mt-6 text-center">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to HelpHive
          </Link>
        </div>
      </div>
    </div>
  );
}
