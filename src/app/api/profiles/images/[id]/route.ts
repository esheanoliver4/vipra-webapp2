import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabase
      .from('profile_images')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Image deleted' }, { status: 200 });
  } catch (error) {
    console.error('[v0] Delete image error:', error);
    return NextResponse.json(
      { message: 'Failed to delete image' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get image to find user
    const { data: image, error: imageError } = await supabase
      .from('profile_images')
      .select('user_id')
      .eq('id', id)
      .single();

    if (imageError || !image) {
      return NextResponse.json({ message: 'Image not found' }, { status: 404 });
    }

    // Remove primary from all images
    const { error: removeError } = await supabase
      .from('profile_images')
      .update({ is_primary: false })
      .eq('user_id', image.user_id);

    if (removeError) throw removeError;

    // Set as primary
    const { error: setPrimaryError } = await supabase
      .from('profile_images')
      .update({ is_primary: true })
      .eq('id', id);

    if (setPrimaryError) throw setPrimaryError;

    return NextResponse.json({ message: 'Primary image set' }, { status: 200 });
  } catch (error) {
    console.error('[v0] Set primary error:', error);
    return NextResponse.json(
      { message: 'Failed to set primary image' },
      { status: 500 }
    );
  }
}
