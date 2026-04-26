import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { message: 'Email is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data: user, error } = await supabase
      .from('users')
      .select('role')
      .eq('email', email)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { role: 'user' },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { role: user.role || 'user' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('[v0] Get role error:', error);
    return NextResponse.json(
      { role: 'user' },
      { status: 200 }
    );
  }
}
