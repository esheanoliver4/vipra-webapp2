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

    let query = supabase.from('profiles').select('*').eq('is_verified', true);

    if (gender) query = query.eq('gender', gender);
    if (caste) query = query.eq('caste', caste);
    if (city) query = query.ilike('city', `%${city}%`);

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
