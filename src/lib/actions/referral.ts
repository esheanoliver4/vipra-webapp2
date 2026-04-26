'use server';

import { getUser } from '@/lib/auth-server';

export async function generateReferralCode(userId: string) {
  try {
    const user = await getUser();
    if (!user || user.id !== userId) {
      throw new Error('Unauthorized');
    }

    // Generate a unique referral code
    const code = `VIPRA${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // Store in database (would use Prisma/DB client)
    // const referral = await prisma.referral.create({
    //   data: {
    //     referrer_id: userId,
    //     referral_code: code,
    //   },
    // });

    return { code, success: true };
  } catch (error) {
    console.error('Error generating referral code:', error);
    return { success: false, error: 'Failed to generate referral code' };
  }
}

export async function redeemReferral(referralCode: string) {
  try {
    const user = await getUser();
    if (!user) {
      throw new Error('Not authenticated');
    }

    // Check if code exists and is valid
    // const referral = await prisma.referral.findUnique({
    //   where: { referral_code: referralCode },
    // });

    // if (!referral || referral.status !== 'pending') {
    //   throw new Error('Invalid referral code');
    // }

    // Mark referral as completed
    // await prisma.referral.update({
    //   where: { id: referral.id },
    //   data: {
    //     referee_id: user.id,
    //     status: 'completed',
    //   },
    // });

    // Award commission to referrer
    // const COMMISSION_AMOUNT = 500; // 500 INR or equivalent
    // await prisma.reward.create({
    //   data: {
    //     user_id: referral.referrer_id,
    //     referral_id: referral.id,
    //     amount: COMMISSION_AMOUNT,
    //     reward_type: 'referral',
    //     description: `Referral commission from ${user.first_name}`,
    //   },
    // });

    return { success: true, message: 'Referral redeemed successfully!' };
  } catch (error) {
    console.error('Error redeeming referral:', error);
    return { success: false, error: 'Failed to redeem referral code' };
  }
}

export async function getUserReferrals(userId: string) {
  try {
    const user = await getUser();
    if (!user || user.id !== userId) {
      throw new Error('Unauthorized');
    }

    // Fetch user's referrals
    // const referrals = await prisma.referral.findMany({
    //   where: { referrer_id: userId },
    //   include: {
    //     rewards: true,
    //   },
    //   orderBy: { created_at: 'desc' },
    // });

    return { referrals: [], success: true };
  } catch (error) {
    console.error('Error fetching referrals:', error);
    return { success: false, error: 'Failed to fetch referrals' };
  }
}

export async function getUserRewards(userId: string) {
  try {
    const user = await getUser();
    if (!user || user.id !== userId) {
      throw new Error('Unauthorized');
    }

    // Fetch user's rewards
    // const rewards = await prisma.reward.findMany({
    //   where: { user_id: userId },
    //   orderBy: { created_at: 'desc' },
    // });

    // Calculate total earnings
    // const totalEarnings = rewards
    //   .filter((r) => !r.redeemed)
    //   .reduce((sum, r) => sum + r.amount, 0);

    return { rewards: [], totalEarnings: 0, success: true };
  } catch (error) {
    console.error('Error fetching rewards:', error);
    return { success: false, error: 'Failed to fetch rewards' };
  }
}

export async function redeemRewards(userId: string, amount: number) {
  try {
    const user = await getUser();
    if (!user || user.id !== userId) {
      throw new Error('Unauthorized');
    }

    // Process redemption
    // const rewards = await prisma.reward.findMany({
    //   where: { user_id: userId, redeemed: false },
    //   orderBy: { created_at: 'asc' },
    // });

    // const totalAvailable = rewards.reduce((sum, r) => sum + r.amount, 0);
    // if (amount > totalAvailable) {
    //   throw new Error('Insufficient balance');
    // }

    // Mark rewards as redeemed
    // let remaining = amount;
    // for (const reward of rewards) {
    //   if (remaining <= 0) break;
    //   remaining -= reward.amount;
    //   await prisma.reward.update({
    //     where: { id: reward.id },
    //     data: { redeemed: true, redeemed_at: new Date() },
    //   });
    // }

    return { success: true, message: 'Rewards redeemed successfully!' };
  } catch (error) {
    console.error('Error redeeming rewards:', error);
    return { success: false, error: 'Failed to redeem rewards' };
  }
}
