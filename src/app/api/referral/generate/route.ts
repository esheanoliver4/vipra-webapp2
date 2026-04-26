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

    // Generate unique referral code
    const code = `VIPRA${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // TODO: Save to database using Prisma
    // const referral = await prisma.referral.create({
    //   data: {
    //     referrer_id: user.id,
    //     referral_code: code,
    //   },
    // });

    return NextResponse.json({
      success: true,
      referralCode: code,
      shareUrl: `${process.env.NEXT_PUBLIC_APP_URL}/register?ref=${code}`,
    });
  } catch (error) {
    console.error('[v0] Referral generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate referral code' },
      { status: 500 }
    );
  }
}
