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
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: authData, error: authError } = await supabase.auth.getUser(token);

    if (authError || !authData.user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { image_url } = await request.json();

    // Get user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', authData.user.id)
      .single();

    if (userError || !user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Check image count
    const { data: images, error: countError } = await supabase
      .from('profile_images')
      .select('id')
      .eq('user_id', user.id);

    if (images && images.length >= 6) {
      return NextResponse.json(
        { message: 'Maximum 6 images allowed' },
        { status: 400 }
      );
    }

    // Insert image
    const { data: newImage, error } = await supabase
      .from('profile_images')
      .insert([
        {
          user_id: user.id,
          image_url,
          order: images?.length || 0,
          is_primary: !images || images.length === 0,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(newImage, { status: 201 });
  } catch (error) {
    console.error('[v0] Upload image error:', error);
    return NextResponse.json(
      { message: 'Failed to upload image' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { images } = await request.json();

    // Update order for all images
    for (const img of images) {
      const { error } = await supabase
        .from('profile_images')
        .update({ order: img.order })
        .eq('id', img.id);

      if (error) throw error;
    }

    return NextResponse.json({ message: 'Images reordered' }, { status: 200 });
  } catch (error) {
    console.error('[v0] Reorder error:', error);
    return NextResponse.json(
      { message: 'Failed to reorder images' },
      { status: 500 }
    );
  }
}
