import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const supabase = await createClient();

    // Check if user is admin
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { data: adminUser } = await supabase
      .from('users')
      .select('role, id')
      .eq('email', user.email)
      .single();

    if (adminUser?.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Update user approval status
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update({
        approval_status: 'approved',
        is_approved: true,
        approved_by: adminUser.id,
        approved_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Log approval
    await supabase.from('approval_logs').insert([
      {
        user_id: id,
        admin_id: adminUser.id,
        status: 'approved',
        notes: 'Approved by admin',
      },
    ]);

    return NextResponse.json(
      {
        message: 'User approved successfully',
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[v0] Approve user error:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to approve user' },
      { status: 500 }
    );
  }
}
