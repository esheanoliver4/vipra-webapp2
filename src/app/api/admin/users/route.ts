import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
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
      .select('role')
      .eq('email', user.email)
      .single();

    if (adminUser?.role !== 'admin') {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Fetch all users with relevant fields
    const { data: users, error } = await supabase
      .from('users')
      .select('id, name, email, approval_status, is_approved, created_at, gender, city, profession')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json(users || [], { status: 200 });
  } catch (error: any) {
    console.error('[v0] Fetch users error:', error);
    return NextResponse.json(
      { message: error.message || 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
