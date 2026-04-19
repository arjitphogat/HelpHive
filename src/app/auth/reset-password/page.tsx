'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth';
import { auth, isConfigured } from '@/lib/firebase';

const resetSchema = z.object({
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ResetFormData = z.infer<typeof resetSchema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [email, setEmail] = useState('');

  const oobCode = searchParams.get('oobCode') || searchParams.get('token');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  });

  useEffect(() => {
    if (!isConfigured || !auth) {
      setIsValid(true);
      return;
    }

    if (!oobCode) {
      setError('Invalid reset link. Please request a new password reset.');
      return;
    }

    if (oobCode && !searchParams.get('token')) {
      verifyPasswordResetCode(auth, oobCode)
        .then((email) => {
          setEmail(email);
          setIsValid(true);
        })
        .catch(() => {
          setError('This reset link has expired. Please request a new one.');
        });
    } else {
      setIsValid(true);
    }
  }, [oobCode, searchParams]);

  const onSubmit = async (data: ResetFormData) => {
    if (!isConfigured || !auth) {
      setIsSuccess(true);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      if (oobCode && !searchParams.get('token')) {
        await confirmPasswordReset(auth, oobCode, data.newPassword);
      }
      setIsSuccess(true);
    } catch (err: any) {
      if (err.code === 'auth-expired-action-code') {
        setError('This reset link has expired. Please request a new one.');
      } else {
        setError(err.message || 'Failed to reset password');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white rounded-[var(--radius-xl)] shadow-[var(--shadow-modal)] p-8 animate-fade-in-up text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--color-success-bg)] flex items-center justify-center">
          <svg className="w-8 h-8 text-[var(--color-success)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-[var(--color-text)] mb-2">Password reset!</h1>
        <p className="text-[var(--color-text-secondary)] mb-6">
          Your password has been successfully reset. You can now sign in with your new password.
        </p>
        <Link href="/auth/login" className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-[var(--radius-lg)] bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary-hover)]">
          Sign in
        </Link>
      </div>
    );
  }

  if (error && !isValid) {
    return (
      <div className="bg-white rounded-[var(--radius-xl)] shadow-[var(--shadow-modal)] p-8 animate-fade-in-up text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--color-error-bg)] flex items-center justify-center">
          <svg className="w-8 h-8 text-[var(--color-error)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-[var(--color-text)] mb-2">Invalid reset link</h1>
        <p className="text-[var(--color-text-secondary)] mb-6">{error}</p>
        <Link href="/auth/forgot-password" className="inline-flex items-center justify-center gap-2 w-full py-3.5 rounded-[var(--radius-lg)] bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary-hover)]">
          Request new reset
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[var(--radius-xl)] shadow-[var(--shadow-modal)] p-8 animate-fade-in-up">
      <h1 className="text-2xl font-bold text-[var(--color-text)] text-center mb-2">Set new password</h1>
      <p className="text-[var(--color-text-secondary)] text-center mb-6">Enter your new password below</p>

      {error && (
        <div className="mb-6 p-4 rounded-[var(--radius-lg)] bg-[var(--color-error-bg)] border border-[var(--color-error)]/20">
          <p className="text-sm text-[var(--color-error)]">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">New Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter new password"
              className={`w-full px-4 py-3 rounded-[var(--radius-lg)] border ${errors.newPassword ? 'border-[var(--color-error)]' : 'border-[var(--color-border-light)]'} bg-white text-[var(--color-text)] pr-12`}
              {...register('newPassword')}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          {errors.newPassword && <p className="mt-1.5 text-xs text-[var(--color-error)]">{errors.newPassword.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1.5">Confirm Password</label>
          <input
            type={showConfirm ? 'text' : 'password'}
            placeholder="Confirm new password"
            className={`w-full px-4 py-3 rounded-[var(--radius-lg)] border ${errors.confirmPassword ? 'border-[var(--color-error)]' : 'border-[var(--color-border-light)]'} bg-white text-[var(--color-text)]`}
            {...register('confirmPassword')}
          />
          {errors.confirmPassword && <p className="mt-1.5 text-xs text-[var(--color-error)]">{errors.confirmPassword.message}</p>}
        </div>

        <button type="submit" disabled={isLoading || !isValid} className="w-full py-3.5 rounded-[var(--radius-lg)] bg-[var(--color-primary)] text-white font-semibold hover:bg-[var(--color-primary-hover)] disabled:opacity-60 flex items-center justify-center gap-2">
          {isLoading ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Resetting...</span></> : <span>Reset password</span>}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface-muted)] px-4 py-12">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--color-primary)]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[var(--color-primary)]/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
      </div>

      <div className="relative w-full max-w-[440px]">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="text-4xl">🐝</span>
            <span className="text-2xl font-bold text-[var(--color-text)]">HelpHive</span>
          </Link>
        </div>

        <Suspense fallback={
          <div className="bg-white rounded-[var(--radius-xl)] shadow-[var(--shadow-modal)] p-8">
            <div className="flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
            </div>
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>

        <div className="mt-6 text-center">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to HelpHive
          </Link>
        </div>
      </div>
    </div>
  );
}