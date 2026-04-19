import { NextRequest, NextResponse } from 'next/server';
import { doc, setDoc, updateDoc, increment, serverTimestamp, getDoc } from 'firebase/firestore';
import { db, isConfigured } from '@/lib/firebase';
import { sendTournamentConfirmationEmail } from '@/lib/email.service';

interface TournamentRegistration {
  tournamentId: string;
  uid: string;
  displayName: string;
  email: string;
  vehicleType: string;
  city: string;
  phone: string;
  emergencyContact?: string;
  termsAccepted: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: TournamentRegistration = await request.json();
    const {
      tournamentId,
      uid,
      displayName,
      email,
      vehicleType,
      city,
      phone,
      emergencyContact,
      termsAccepted,
    } = body;

    if (!tournamentId || !uid || !displayName || !email || !vehicleType || !city || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!termsAccepted) {
      return NextResponse.json({ error: 'You must accept the terms and conditions' }, { status: 400 });
    }

    // Create registration
    const registrationData = {
      tournamentId,
      uid,
      displayName,
      email,
      vehicleType,
      city,
      phone,
      emergencyContact: emergencyContact || '',
      status: 'confirmed',
      currentRank: 0,
      points: 0,
      wins: 0,
      losses: 0,
      registeredAt: serverTimestamp(),
    };

    if (isConfigured && db) {
      // Check if already registered
      const existingReg = await getDoc(doc(db, 'tournament_registrations', `${tournamentId}_${uid}`));
      if (existingReg.exists()) {
        return NextResponse.json({ error: 'Already registered for this tournament' }, { status: 400 });
      }

      await setDoc(doc(db, 'tournament_registrations', `${tournamentId}_${uid}`), registrationData);

      // Increment participant count
      await updateDoc(doc(db, 'tournaments', tournamentId), {
        participants: increment(1),
      });
    }

    // Send confirmation email
    try {
      await sendTournamentConfirmationEmail(
        email,
        displayName,
        'Tournament',
        '₹10,000'
      );
    } catch (e) {
      console.log('Email sending skipped in demo mode');
    }

    return NextResponse.json({
      success: true,
      message: 'Tournament registration successful',
      data: {
        registrationId: `${tournamentId}_${uid}`,
        tournamentName: 'Tournament',
      }
    });
  } catch (error) {
    console.error('Tournament registration error:', error);
    return NextResponse.json({ error: 'Failed to register for tournament' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Tournament registration API' });
}