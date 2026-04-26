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

    const { amount, method } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // TODO: Process reward redemption
    // const userRewards = await prisma.reward.findMany({
    //   where: {
    //     user_id: user.id,
    //     redeemed: false,
    //   },
    // });

    // const totalAvailable = userRewards.reduce((sum, r) => sum + r.amount, 0);

    // if (amount > totalAvailable) {
    //   return NextResponse.json(
    //     { error: 'Insufficient balance' },
    //     { status: 400 }
    //   );
    // }

    // // Mark rewards as redeemed
    // let remaining = amount;
    // for (const reward of userRewards) {
    //   if (remaining <= 0) break;
    //   const deductAmount = Math.min(remaining, reward.amount);
    //   await prisma.reward.update({
    //     where: { id: reward.id },
    //     data: { redeemed: true, redeemed_at: new Date() },
    //   });
    //   remaining -= deductAmount;
    // }

    return NextResponse.json({
      success: true,
      message: `₹${amount} has been redeemed successfully!`,
      redemption: {
        amount,
        method: method || 'bank_transfer',
        status: 'processing',
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('[v0] Reward redemption error:', error);
    return NextResponse.json(
      { error: 'Failed to redeem rewards' },
      { status: 500 }
    );
  }
}
