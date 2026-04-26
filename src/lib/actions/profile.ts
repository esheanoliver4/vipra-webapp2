'use server';

import { createClient } from '@/lib/supabase/server';
import { getUser } from './auth';

export async function updateProfile(profileData: any) {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  const { error } = await supabase
    .from('users')
    .update(profileData)
    .eq('id', user.id);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function getProfile(userId?: string) {
  const supabase = await createClient();
  const user = await getUser();

  const targetId = userId || user?.id;
  if (!targetId) {
    return null;
  }

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', targetId)
    .single();

  if (error) {
    return null;
  }

  return data;
}

export async function searchProfiles(filters: any) {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) {
    return { error: 'Not authenticated' };
  }

  let query = supabase
    .from('users')
    .select('*')
    .neq('id', user.id)
    .eq('profile_completed', true);

  if (filters.gender) {
    query = query.eq('gender', filters.gender);
  }

  if (filters.ageMin && filters.ageMax) {
    query = query
      .gte('age', filters.ageMin)
      .lte('age', filters.ageMax);
  }

  if (filters.religion) {
    query = query.eq('religion', filters.religion);
  }

  if (filters.caste) {
    query = query.eq('caste', filters.caste);
  }

  if (filters.location) {
    query = query.ilike('location', `%${filters.location}%`);
  }

  const { data, error } = await query.limit(50);

  if (error) {
    return { error: error.message };
  }

  return { data };
}

export async function uploadProfilePhoto(userId: string, file: File) {
  const supabase = await createClient();
  const user = await getUser();

  if (!user || user.id !== userId) {
    return { error: 'Unauthorized' };
  }

  const filename = `${userId}/${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage
    .from('profile-photos')
    .upload(filename, file, { upsert: true });

  if (uploadError) {
    return { error: uploadError.message };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from('profile-photos').getPublicUrl(filename);

  // Update profile with new photo
  const { error: updateError } = await supabase
    .from('users')
    .update({ profile_photo: publicUrl })
    .eq('id', userId);

  if (updateError) {
    return { error: updateError.message };
  }

  return { success: true, url: publicUrl };
}
