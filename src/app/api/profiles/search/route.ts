import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const searchParams = request.nextUrl.searchParams;
    const gender = searchParams.get('gender');
    const minAge = searchParams.get('minAge');
    const maxAge = searchParams.get('maxAge');
    const caste = searchParams.get('caste');
    const city = searchParams.get('city');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get current user to determine opposite gender if no gender filter is provided
    let currentUserGender: string | null = null;
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: authData } = await supabase.auth.getUser(token);
      if (authData.user) {
        const { data: user } = await supabase
          .from('users')
          .select('gender')
          .eq('auth_id', authData.user.id)
          .single();
        currentUserGender = user?.gender || null;
      }
    }

    let query = supabase.from('users').select('*').eq('is_approved', true).neq('role', 'admin');

    if (gender) {
      query = query.eq('gender', gender);
    } else if (currentUserGender) {
      query = query.eq('gender', currentUserGender.toLowerCase() === 'male' ? 'female' : 'male');
    }

    if (caste) query = query.eq('gotra', caste); // Using gotra as caste for consistency
    if (city) query = query.ilike('location_city', `%${city}%`);

    if (minAge) {
      const minDateOfBirth = new Date();
      minDateOfBirth.setFullYear(minDateOfBirth.getFullYear() - parseInt(minAge));
      query = query.lte('date_of_birth', minDateOfBirth.toISOString());
    }

    if (maxAge) {
      const maxDateOfBirth = new Date();
      maxDateOfBirth.setFullYear(maxDateOfBirth.getFullYear() - parseInt(maxAge));
      query = query.gte('date_of_birth', maxDateOfBirth.toISOString());
    }

    const { data, error, count } = await query
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ profiles: data, total: count });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
