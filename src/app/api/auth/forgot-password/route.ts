import { NextRequest, NextResponse } from 'next/server';
import { sendPasswordResetEmail as firebaseResetEmail } from 'firebase/auth';
import { auth, isConfigured } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Only process if Firebase is configured
    if (!isConfigured || !auth) {
      // In demo mode, just return success
      return NextResponse.json({ success: true, message: 'Password reset email sent (demo mode)' });
    }

    // Generate reset token
    await firebaseResetEmail(auth, email);

    // Generate custom reset URL for branded experience
    const resetToken = Buffer.from(`${email}:${Date.now()}`).toString('base64');
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`;

    return NextResponse.json({ success: true, message: 'Password reset email sent', resetUrl });
  } catch (error: any) {
    console.error('Reset password error:', error);

    // Don't reveal if email exists or not (security)
    if (error.code === 'auth/user-not-found') {
      // Still return success to prevent email enumeration
      return NextResponse.json({ success: true, message: 'If an account exists, a reset email has been sent' });
    }

    return NextResponse.json({ error: 'Failed to send reset email' }, { status: 500 });
  }
}