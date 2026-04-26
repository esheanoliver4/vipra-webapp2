import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { sendApprovalEmail } from '@/lib/email-service';

export async function GET(request: NextRequest) {
  try {
    // TODO: Add admin authentication check
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get pending users
    const { data: users, error } = await supabase
      .from('users')
      .select('id, email, first_name, last_name, gender, approval_status, created_at')
      .eq('approval_status', 'pending')
      .order('created_at', { ascending: true });

    if (error) throw error;

    return NextResponse.json(
      { users: users || [] },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Get pending users error:', error);
    return NextResponse.json(
      { message: 'Failed to get pending users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // TODO: Add admin authentication check
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { userId, status, notes, adminId } = await request.json();

    if (!userId || !status) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { message: 'Invalid status' },
        { status: 400 }
      );
    }

    // Get user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('email, first_name, last_name')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    // Update approval status
    const { error: updateError } = await supabase
      .from('users')
      .update({
        approval_status: status,
        is_approved: status === 'approved',
      })
      .eq('id', userId);

    if (updateError) throw updateError;

    // Log approval action
    const { error: logError } = await supabase
      .from('approval_logs')
      .insert([
        {
          user_id: userId,
          admin_id: adminId,
          status,
          notes,
        },
      ]);

    if (logError) {
      console.error('[v0] Log error:', logError);
    }

    // Send email notification
    if (status === 'approved') {
      await sendApprovalEmail(user.email, user.first_name, 'approved');
    } else if (status === 'rejected') {
      await sendApprovalEmail(user.email, user.first_name, 'rejected', notes || '');
    }

    return NextResponse.json(
      { message: `User ${status} successfully` },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Approval error:', error);
    return NextResponse.json(
      { message: 'Failed to update approval status' },
      { status: 500 }
    );
  }
}
