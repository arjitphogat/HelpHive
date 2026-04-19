import { NextRequest, NextResponse } from 'next/server';
import { sendVerificationEmail } from '@/lib/email.service';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Generate 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Send email
    await sendVerificationEmail(email, code);

    const response = NextResponse.json({ success: true, message: 'Verification code sent', code });

    // In production, set httpOnly cookie with verification code
    response.cookies.set('verify_code', code, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600,
    });

    return response;
  } catch (error) {
    console.error('Send verification error:', error);
    return NextResponse.json({ error: 'Failed to send verification code' }, { status: 500 });
  }
}