import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: authData, error: authError } = await supabase.auth.getUser(token);

    if (authError || !authData.user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { likedUserId, action } = await request.json(); // action: 'like' | 'pass' | 'report'

    if (!likedUserId || !action) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get current user ID
    const { data: currentUser } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', authData.user.id)
      .single();

    if (!currentUser) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Record the action
    const { error } = await supabase
      .from('likes')
      .insert([
        {
          user_id: currentUser.id,
          liked_user_id: likedUserId,
          action,
        },
      ]);

    if (error) throw error;

    // Check for mutual like
    let isMutual = false;
    if (action === 'like') {
      const { data: mutualLike } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', likedUserId)
        .eq('liked_user_id', currentUser.id)
        .eq('action', 'like')
        .single();

      isMutual = !!mutualLike;

      // Create connection if mutual
      if (isMutual) {
        await supabase
          .from('connections')
          .insert([
            {
              user1_id: currentUser.id,
              user2_id: likedUserId,
              status: 'matched',
            },
          ])
          .throwOnError();
      }
    }

    return NextResponse.json(
      {
        message: 'Action recorded',
        isMutual,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Like error:', error);
    return NextResponse.json(
      { message: 'Failed to record action' },
      { status: 500 }
    );
  }
}
