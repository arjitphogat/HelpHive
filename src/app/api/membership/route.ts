import { NextRequest, NextResponse } from 'next/server';
import { generateRazorpayOrder } from '@/lib/razorpay';
import { doc, setDoc, updateDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { db, isConfigured } from '@/lib/firebase';

const MEMBERSHIP_PLANS = {
  'helphive-pass': { name: 'HelpHive Pass', price: 199, period: 'monthly' },
  'explorer-elite': { name: 'Explorer Elite', price: 499, period: 'monthly' },
  'helphive-pass-yearly': { name: 'HelpHive Pass', price: 1908, period: 'yearly' },
  'explorer-elite-yearly': { name: 'Explorer Elite', price: 4790, period: 'yearly' },
};

export async function POST(request: NextRequest) {
  try {
    const { planId, userId, billing } = await request.json();

    const plan = MEMBERSHIP_PLANS[planId as keyof typeof MEMBERSHIP_PLANS];
    if (!plan) {
      return NextResponse.json(
        { success: false, error: 'Invalid membership plan' },
        { status: 400 }
      );
    }

    const receipt = `membership_${planId}_${userId}_${Date.now()}`;

    // Create Razorpay order
    if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
      const order = await generateRazorpayOrder(plan.price, receipt);

      // Store pending membership in Firestore
      if (isConfigured && db && userId) {
        await setDoc(doc(db, 'membership_orders', receipt), {
          planId,
          userId,
          amount: plan.price,
          billing: billing || 'monthly',
          status: 'pending',
          orderId: order.id,
          createdAt: serverTimestamp(),
        });
      }

      return NextResponse.json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        planName: plan.name,
      });
    }

    // Demo mode - simulate success
    return NextResponse.json({
      success: true,
      demo: true,
      planId,
      planName: plan.name,
      amount: plan.price,
    });
  } catch (error: any) {
    console.error('Error creating membership order:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { receipt, paymentId, status } = await request.json();

    if (!receipt || !status) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update membership order status
    if (isConfigured && db) {
      const orderRef = doc(db, 'membership_orders', receipt);
      const orderSnap = await getDoc(orderRef);

      if (orderSnap.exists()) {
        const orderData = orderSnap.data();

        if (status === 'captured') {
          // Activate membership
          await updateDoc(orderRef, {
            status: 'active',
            paymentId,
            activatedAt: serverTimestamp(),
          });

          // Update user membership
          await setDoc(doc(db, 'user_memberships', orderData.userId), {
            planId: orderData.planId,
            planName: MEMBERSHIP_PLANS[orderData.planId as keyof typeof MEMBERSHIP_PLANS]?.name,
            status: 'active',
            startedAt: serverTimestamp(),
            expiresAt: orderData.billing === 'yearly'
              ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
              : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          });
        } else {
          await updateDoc(orderRef, { status });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating membership:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId || !isConfigured || !db) {
    return NextResponse.json({ membership: null });
  }

  const membershipSnap = await getDoc(doc(db, 'user_memberships', userId));

  if (membershipSnap.exists()) {
    return NextResponse.json({ membership: membershipSnap.data() });
  }

  return NextResponse.json({ membership: null });
}
