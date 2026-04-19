import { NextRequest, NextResponse } from 'next/server';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, isConfigured } from '@/lib/firebase';
import { sendGuideConfirmationEmail } from '@/lib/email.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      uid,
      email,
      displayName,
      phone,
      city,
      languages,
      categories,
      bio,
      experience,
      hourlyRate,
    } = body;

    if (!email || !displayName || !city) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create guide profile in Firestore
    const guideData = {
      uid,
      email,
      displayName,
      phone: phone || '',
      city,
      languages: languages || ['English', 'Hindi'],
      categories: categories || [],
      bio: bio || '',
      experience: experience || '',
      hourlyRate: hourlyRate || 500,
      isApproved: false,
      isActive: false,
      totalTours: 0,
      rating: 0,
      reviews: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    if (isConfigured && db) {
      await setDoc(doc(db, 'guides', uid), guideData);
    }

    // Send confirmation email
    try {
      await sendGuideConfirmationEmail(email, displayName, city);
    } catch (e) {
      console.log('Email sending skipped in demo mode');
    }

    return NextResponse.json({
      success: true,
      message: 'Guide application submitted successfully',
      data: { guideId: uid }
    });
  } catch (error) {
    console.error('Guide registration error:', error);
    return NextResponse.json({ error: 'Failed to register as guide' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Guide registration API' });
}