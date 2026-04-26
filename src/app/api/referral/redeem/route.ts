import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '@/lib/auth-server';

export async function POST(request: NextRequest) {
  try {
    const user = await getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { referralCode } = await request.json();

    if (!referralCode) {
      return NextResponse.json(
        { error: 'Referral code is required' },
        { status: 400 }
      );
    }

    // TODO: Validate referral code and process redemption
    // const referral = await prisma.referral.findUnique({
    //   where: { referral_code: referralCode },
    // });

    // if (!referral) {
    //   return NextResponse.json(
    //     { error: 'Invalid referral code' },
    //     { status: 404 }
    //   );
    // }

    // if (referral.status !== 'pending') {
    //   return NextResponse.json(
    //     { error: 'This referral code has already been used' },
    //     { status: 400 }
    //   );
    // }

    // // Update referral
    // await prisma.referral.update({
    //   where: { id: referral.id },
    //   data: {
    //     referee_id: user.id,
    //     status: 'completed',
    //   },
    // });

    // // Create reward for referrer
    // const COMMISSION = 500; // ₹500 or equivalent
    // await prisma.reward.create({
    //   data: {
    //     user_id: referral.referrer_id,
    //     referral_id: referral.id,
    //     amount: COMMISSION,
    //     reward_type: 'referral',
    //     description: `Referral commission from ${user.first_name}`,
    //   },
    // });

    return NextResponse.json({
      success: true,
      message: 'Referral redeemed successfully!',
      reward: {
        amount: 500,
        currency: 'INR',
      },
    });
  } catch (error) {
    console.error('[v0] Referral redemption error:', error);
    return NextResponse.json(
      { error: 'Failed to redeem referral' },
      { status: 500 }
    );
  }
}
