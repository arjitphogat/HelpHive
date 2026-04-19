'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, isConfigured } from '@/lib/firebase';

const registerSchema = z.object({
  displayName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

const verifySchema = z.object({
  code: z.string().length(6, 'Please enter the 6-digit code'),
});

type RegisterFormData = z.infer<typeof registerSchema>;
type VerifyFormData = z.infer<typeof verifySchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [pendingData, setPendingData] = useState<RegisterFormData | null>(null);
  const [resendTimer, setResendTimer] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const {
    register: registerVerify,
    handleSubmit: handleVerifySubmit,
    formState: { errors: verifyErrors },
  } = useForm<VerifyFormData>({
    resolver: zodResolver(verifySchema),
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

  const sendVerificationCode = async (email: string) => {
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to send verification code');
      }

      setResendTimer(60);
      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return true;
    } catch (err: any) {
      setError(err.message || 'Failed to send verification code');
      return false;
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    if (!acceptTerms) {
      setError('Please accept the Terms of Service and Privacy Policy');
      return;
    }

    if (!isConfigured || !auth) {
      router.push('/dashboard/user');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const sent = await sendVerificationCode(data.email);
      if (!sent) {
        setIsLoading(false);
        return;
      }

      setPendingData(data);
      setStep('verify');
    } catch (err: any) {
      setError(err.message || 'Failed to send verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const onVerifySubmit = async (verifyData: VerifyFormData) => {
    if (!pendingData || !auth || !db) return;

    setIsLoading(true);
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, pendingData.email, pendingData.password);
      await updateProfile(userCredential.user, { displayName: pendingData.displayName });

      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: pendingData.email,
        displayName: pendingData.displayName,
        role: 'user',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      router.push('/dashboard/user');
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists');
      } else {
        setError(err.message || 'Failed to create account');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resendCode = async () => {
    if (pendingData && resendTimer === 0) {
      await sendVerificationCode(pendingData.email);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface-muted)] px-4 py-6 sm:py-12 overflow-y-auto">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-[var(--color-primary)]/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/4" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[var(--color-primary)]/5 rounded-full blur-3xl translate-y-1/2 translate-x-1/3" />
      </div>

      <div className="relative w-full max-w-[440px] flex-shrink-0">
        {/* Logo */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="text-3xl sm:text-4xl">🐝</span>
            <span className="text-xl sm:text-2xl font-bold text-[var(--color-text)]">HelpHive</span>
          </Link>
        </div>

        {step === 'verify' ? (
          <div className="bg-white rounded-2xl sm:rounded-[var(--radius-xl)] shadow-[var(--shadow-modal)] p-6 sm:p-8 animate-fade-in-up overflow-y-auto max-h-[calc(100vh-120px)]">
            <div className="text-center mb-6">
              <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text)] mb-2">Check your email</h1>
              <p className="text-sm sm:text-base text-[var(--color-text-secondary)]">
                We sent a verification code to<br />
                <span className="font-medium text-[var(--color-text)]">{pendingData?.email}</span>
              </p>
            </div>

            {error && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl bg-[var(--color-error-bg)] border border-[var(--color-error)]/20">
                <p className="text-xs sm:text-sm text-[var(--color-error)]">{error}</p>
              </div>
            )}

            <form onSubmit={handleVerifySubmit(onVerifySubmit)} className="space-y-4 sm:space-y-5">
              <input
                type="text"
                placeholder="Enter 6-digit code"
                maxLength={6}
                className={`w-full px-4 py-3 rounded-xl sm:rounded-[var(--radius-lg)] border ${verifyErrors.code ? 'border-[var(--color-error)]' : 'border-[var(--color-border-light)]'} bg-white text-[var(--color-text)] text-center text-lg tracking-widest placeholder:text-[var(--color-text-muted)]`}
                {...registerVerify('code', { setValueAs: (v) => v.replace(/\D/g, '').slice(0, 6) })}
              />
              {verifyErrors.code && (
                <p className="text-xs text-[var(--color-error)] text-center">{verifyErrors.code.message}</p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 sm:py-3.5 rounded-xl sm:rounded-[var(--radius-lg)] bg-[var(--color-primary)] text-white font-semibold text-sm sm:text-base hover:bg-[var(--color-primary-hover)] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <span>Verify & Create Account</span>
                )}
              </button>
            </form>

            <div className="mt-4 sm:mt-6 text-center">
              <button
                onClick={resendCode}
                disabled={resendTimer > 0}
                className="text-xs sm:text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] disabled:opacity-50"
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Didn't receive the code? Resend"}
              </button>
            </div>

            <div className="mt-3 sm:mt-4 text-center">
              <button
                onClick={() => { setStep('form'); setError(''); }}
                className="text-xs sm:text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              >
                ← Back to registration
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl sm:rounded-[var(--radius-xl)] shadow-[var(--shadow-modal)] p-6 sm:p-8 animate-fade-in-up overflow-y-auto max-h-[calc(100vh-120px)]">
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text)] text-center mb-1 sm:mb-2">Create your account</h1>
            <p className="text-sm sm:text-base text-[var(--color-text-secondary)] text-center mb-4 sm:mb-6">Join HelpHive and start exploring</p>

            {error && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 rounded-xl bg-[var(--color-error-bg)] border border-[var(--color-error)]/20">
                <p className="text-xs sm:text-sm text-[var(--color-error)]">{error}</p>
              </div>
            )}

            <button
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 sm:py-3.5 rounded-xl sm:rounded-[var(--radius-lg)] border border-[var(--color-border-light)] bg-white hover:bg-[var(--color-surface-muted)] transition-all mb-4 sm:mb-6 group"
            >
              {googleLoading ? (
                <div className="w-5 h-5 border-2 border-[var(--color-border-light)] border-t-[var(--color-text)] rounded-full animate-spin" />
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              <span className="font-medium text-sm sm:text-base text-[var(--color-text)]">Continue with Google</span>
            </button>

            <div className="relative mb-4 sm:mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--color-border-light)]" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 bg-white text-xs sm:text-sm text-[var(--color-text-muted)]">or create with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-[var(--color-text)] mb-1 sm:mb-1.5">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className={`w-full px-4 py-3 rounded-xl sm:rounded-[var(--radius-lg)] border ${errors.displayName ? 'border-[var(--color-error)]' : 'border-[var(--color-border-light)]'} bg-white text-[var(--color-text)] text-sm`}
                  {...register('displayName')}
                />
                {errors.displayName && <p className="mt-1 text-xs text-[var(--color-error)]">{errors.displayName.message}</p>}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-[var(--color-text)] mb-1 sm:mb-1.5">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className={`w-full px-4 py-3 rounded-xl sm:rounded-[var(--radius-lg)] border ${errors.email ? 'border-[var(--color-error)]' : 'border-[var(--color-border-light)]'} bg-white text-[var(--color-text)] text-sm`}
                  {...register('email')}
                />
                {errors.email && <p className="mt-1 text-xs text-[var(--color-error)]">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-[var(--color-text)] mb-1 sm:mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    className={`w-full px-4 py-3 rounded-xl sm:rounded-[var(--radius-lg)] border ${errors.password ? 'border-[var(--color-error)]' : 'border-[var(--color-border-light)]'} bg-white text-[var(--color-text)] text-sm pr-12`}
                    {...register('password')}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]">
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
                <p className="mt-1 text-xs text-[var(--color-text-muted)]">At least 6 characters</p>
                {errors.password && <p className="mt-1 text-xs text-[var(--color-error)]">{errors.password.message}</p>}
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-[var(--color-text)] mb-1 sm:mb-1.5">Confirm Password</label>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your password"
                  className={`w-full px-4 py-3 rounded-xl sm:rounded-[var(--radius-lg)] border ${errors.confirmPassword ? 'border-[var(--color-error)]' : 'border-[var(--color-border-light)]'} bg-white text-[var(--color-text)] text-sm`}
                  {...register('confirmPassword')}
                />
                {errors.confirmPassword && <p className="mt-1 text-xs text-[var(--color-error)]">{errors.confirmPassword.message}</p>}
              </div>

              <div className="flex items-start gap-3 pt-1 sm:pt-2">
                <button type="button" onClick={() => setAcceptTerms(!acceptTerms)} className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center flex-shrink-0 ${acceptTerms ? 'bg-[var(--color-primary)] border-[var(--color-primary)]' : 'border-[var(--color-border-light)]'} border`}>
                  {acceptTerms && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                </button>
                <p className="text-xs sm:text-sm text-[var(--color-text-secondary)]">
                  I agree to the <Link href="/terms" className="text-[var(--color-primary)]">Terms</Link> and <Link href="/privacy" className="text-[var(--color-primary)]">Privacy Policy</Link>
                </p>
              </div>

              <button type="submit" disabled={isLoading} className="w-full py-3 sm:py-3.5 rounded-xl sm:rounded-[var(--radius-lg)] bg-[var(--color-primary)] text-white font-semibold text-sm sm:text-base hover:bg-[var(--color-primary-hover)] disabled:opacity-60 flex items-center justify-center gap-2">
                {isLoading ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Creating...</span></> : <span>Create account</span>}
              </button>
            </form>

            <p className="mt-6 sm:mt-8 text-center text-sm text-[var(--color-text-secondary)]">
              Already have an account? <Link href="/auth/login" className="text-[var(--color-primary)] font-medium">Sign in</Link>
            </p>
          </div>
        )}

        <div className="mt-4 sm:mt-6 text-center">
          <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-text)]">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to HelpHive
          </Link>
        </div>
      </div>
    </div>
  );
}
