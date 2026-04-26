import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get auth user
    const authHeader = request.headers.get('authorization');
    let currentUserId: string | null = null;

    if (authHeader) {
      const token = authHeader.replace('Bearer ', '');
      const { data: authData, error: authError } = await supabase.auth.getUser(token);
      if (!authError && authData.user) {
        const { data: user } = await supabase
          .from('users')
          .select('id')
          .eq('auth_id', authData.user.id)
          .single();
        currentUserId = user?.id || null;
      }
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const gender = searchParams.get('gender');
    const city = searchParams.get('city');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    let query = supabase
      .from('users')
      .select(
        `
        id,
        first_name,
        last_name,
        gender,
        date_of_birth,
        location_city,
        location_state,
        profession,
        education,
        short_bio,
        bio,
        religion,
        gotra,
        profile_images:profile_images(
          id,
          image_url,
          order,
          is_primary
        )
      `
      )
      .eq('is_approved', true)
      .order('created_at', { ascending: false });

    // Apply filters
    if (gender) {
      query = query.neq('gender', gender); // Show opposite gender
    }

    if (city) {
      query = query.eq('location_city', city);
    }

    // Exclude current user
    if (currentUserId) {
      query = query.neq('id', currentUserId);
    }

    const { data: profiles, error, count } = await query
      .range(offset, offset + limit - 1);

    if (error) {
      throw error;
    }

    // Sort images by order
    const sortedProfiles = profiles?.map((profile: any) => ({
      ...profile,
      profileImages: profile.profile_images?.sort((a: any, b: any) => a.order - b.order) || [],
    })) || [];

    return NextResponse.json(
      {
        profiles: sortedProfiles,
        total: count,
        limit,
        offset,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('[v0] Browse error:', error);
    return NextResponse.json(
      { message: 'Failed to load profiles' },
      { status: 500 }
    );
  }
}
