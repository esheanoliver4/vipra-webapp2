'use server';

import { createClient, getServiceRoleClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function signUp(email: string, password: string, userData: any) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // Create user profile
  if (data.user) {
    // Get the Free plan ID
    const { data: freePlan } = await supabase
      .from('SubscriptionPlan')
      .select('id, name')
      .eq('price', 0)
      .eq('is_active', true)
      .single();

    const { city, location_city, ...restUserData } = userData;

    const { error: profileError } = await supabase
      .from('users')
      .insert([
        {
          id: data.user.id,
          email: data.user.email,
          is_premium: false,
          premium_plan: freePlan?.name || 'Free',
          premium_plan_id: freePlan?.id,
          connections_sent_count: 0,
          ...restUserData,
          location_city: city || location_city,
        },
      ]);

    if (profileError) {
      return { error: profileError.message };
    }
  }

  return { success: true, user: data.user };
}

export async function signIn(email: string, password: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true, user: data.user };
}

export async function signOut() {
  const supabase = await createClient();

  const { error } = await supabase.auth.signOut();

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function resetPassword(email: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function updatePassword(newPassword: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function getUser() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return null;
  }

  return user;
}

export async function getUserProfile() {
  const supabase = await createClient();

  const user = await getUser();
  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    return null;
  }

  return data;
}

export async function getFullUserProfile() {
  const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
  const user = await getUser();
  if (!user) return null;

  // Use service role to ensure user can see their own kundli record if RLS is tight
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data, error } = await supabase
    .from('users')
    .select('*, kundlis(*), profile_images(*)')
    .eq('auth_id', user.id)
    .single();

  if (error) {
    console.error('Error fetching full profile:', error);
    return null;
  }

  return data;
}

export async function saveKundliData(kundliData: {
  birth_time: string;
  birth_place: string;
  gotra: string;
}) {
  const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const supabaseServer = await (await import('@/lib/supabase/server')).createClient();
  const { data: { user } } = await supabaseServer.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  // Get internal user id first
  const { data: userData } = await supabase
    .from('users')
    .select('id')
    .eq('auth_id', user.id)
    .single();

  if (!userData) return { error: 'User profile not found' };

  const { error } = await supabase
    .from('kundlis')
    .upsert({
      user_id: userData.id,
      birth_time: kundliData.birth_time,
      birth_place: kundliData.birth_place,
      gotra: kundliData.gotra,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });

  if (error) {
    console.error('Error saving kundli data:', error);
    return { error: error.message };
  }

  return { success: true };
}

export async function likeProfile(likedUserId: string) {
  const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const supabaseServer = await (await import('@/lib/supabase/server')).createClient();
  const { data: { user } } = await supabaseServer.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  // Get internal user id
  const { data: currentUser } = await supabase
    .from('users')
    .select('id')
    .eq('auth_id', user.id)
    .single();

  if (!currentUser) return { error: 'User profile not found' };

  const { error } = await supabase
    .from('likes')
    .insert([
      {
        user_id: currentUser.id,
        liked_user_id: likedUserId,
        action: 'like',
      },
    ]);

  if (error) {
    if (error.code === '23505') return { success: true }; // Already liked
    console.error('Error liking profile:', error);
    return { error: error.message };
  }

  return { success: true };
}

export async function passProfile(passedUserId: string) {
  const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const supabaseServer = await (await import('@/lib/supabase/server')).createClient();
  const { data: { user } } = await supabaseServer.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  // Get internal user id
  const { data: currentUser } = await supabase
    .from('users')
    .select('id')
    .eq('auth_id', user.id)
    .single();

  if (!currentUser) return { error: 'User profile not found' };

  const { error } = await supabase
    .from('likes')
    .insert([
      {
        user_id: currentUser.id,
        liked_user_id: passedUserId,
        action: 'pass',
      },
    ]);

  if (error) {
    if (error.code === '23505') return { success: true };
    console.error('Error passing profile:', error);
    return { error: error.message };
  }

  return { success: true };
}

export async function getBrowseProfiles(filters: {
  gender?: 'male' | 'female' | 'all';
}) {
  const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
  const user = await getUser();
  if (!user) return { error: 'Not authenticated' };

  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Get current user profile and gotra
  const { data: currentUserProfile } = await supabase
    .from('users')
    .select('*, kundlis(*)')
    .eq('auth_id', user.id)
    .single();

  if (!currentUserProfile) return { error: 'User profile not found' };

  const currentUserGotra = Array.isArray(currentUserProfile.kundlis) 
    ? currentUserProfile.kundlis[0]?.gotra 
    : currentUserProfile.kundlis?.gotra;

  // Fetch IDs of profiles already interacted with
  const { data: likesData } = await supabase
    .from('likes')
    .select('liked_user_id')
    .eq('user_id', currentUserProfile.id);

  const { data: connectionsFrom } = await supabase
    .from('connections')
    .select('to_user_id')
    .eq('from_user_id', currentUserProfile.id);

  const { data: connectionsTo } = await supabase
    .from('connections')
    .select('from_user_id')
    .eq('to_user_id', currentUserProfile.id);

  const excludeIds = new Set<string>();
  excludeIds.add(currentUserProfile.id);
  (likesData || []).forEach(l => excludeIds.add(l.liked_user_id));
  (connectionsFrom || []).forEach(c => excludeIds.add(c.to_user_id));
  (connectionsTo || []).forEach(c => excludeIds.add(c.from_user_id));

  let query = supabase
    .from('users')
    .select(`
      id,
      first_name,
      last_name,
      gender,
      date_of_birth,
      age,
      location_city,
      location_state,
      profession,
      education,
      marital_status,
      mother_tongue,
      hobbies,
      short_bio,
      bio,
      profile_images(
        image_url,
        is_primary
      ),
      kundlis(
        gotra
      )
    `)
    .neq('role', 'admin')
    .eq('is_approved', true);

  const excludeArray = Array.from(excludeIds).filter(Boolean);
  if (excludeArray.length > 0) {
    query = query.not('id', 'in', `(${excludeArray.join(',')})`);
  }

  // Default to opposite gender if not specified
  let targetGender: string | undefined = filters.gender;
  if (!targetGender || targetGender === 'all') {
    targetGender = currentUserProfile.gender?.toLowerCase() === 'male' ? 'female' : 'male';
  }

  if (targetGender && targetGender !== 'all') {
    query = query.eq('gender', targetGender);
  }

  const { data, error } = await query.limit(100);

  if (error) {
    console.error('Error fetching browse profiles:', error);
    return { error: error.message };
  }

  // Final Sagotra filter in JS
  const filteredData = (data || []).filter((profile: any) => {
    const profileGotra = Array.isArray(profile.kundlis) ? profile.kundlis[0]?.gotra : profile.kundlis?.gotra;
    if (!currentUserGotra || !profileGotra) return true;
    return currentUserGotra.toLowerCase().trim() !== profileGotra.toLowerCase().trim();
  });

  return { success: true, data: filteredData };
}

export async function getLikedProfiles() {
  const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
  const user = await getUser();
  if (!user) return { error: 'Not authenticated' };

  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { data: profile } = await supabase
    .from('users')
    .select('id')
    .eq('auth_id', user.id)
    .single();

  if (!profile) return { error: 'Profile not found' };

  const { data, error } = await supabase
    .from('likes')
    .select(`
      liked_user_id,
      liked_user:users!liked_user_id (
        id,
        first_name,
        last_name,
        gender,
        date_of_birth,
        location_city,
        profession,
        profile_images (
          image_url,
          is_primary
        )
      )
    `)
    .eq('user_id', profile.id)
    .eq('action', 'like')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching liked profiles:', error);
    return { error: error.message };
  }

  return { success: true, data: data.map(item => item.liked_user) };
}

export async function deleteUserAccount() {
  const { createClient: createSupabaseClient } = await import('@supabase/supabase-js');
  const user = await getUser();
  if (!user) return { error: 'Not authenticated' };

  const supabase = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Get internal user id
  const { data: profile } = await supabase
    .from('users')
    .select('id')
    .eq('auth_id', user.id)
    .single();

  if (!profile) return { error: 'Profile not found' };

  try {
    // 1. Delete all related data first
    await supabase.from('likes').delete().or(`user_id.eq.${profile.id},liked_user_id.eq.${profile.id}`);
    await supabase.from('connections').delete().or(`from_user_id.eq.${profile.id},to_user_id.eq.${profile.id}`);
    await supabase.from('messages').delete().or(`sender_id.eq.${profile.id},receiver_id.eq.${profile.id}`);
    await supabase.from('profile_images').delete().eq('user_id', profile.id);
    await supabase.from('kundlis').delete().eq('user_id', profile.id);
    
    // 2. Delete user profile
    const { error: profileError } = await supabase
      .from('users')
      .delete()
      .eq('id', profile.id);

    if (profileError) throw profileError;

    // 3. Delete from Supabase Auth
    const { error: authError } = await supabase.auth.admin.deleteUser(user.id);
    
    if (authError) throw authError;

    return { success: true };
  } catch (error: any) {
    console.error('Error during account deletion:', error);
    return { error: error.message || 'Failed to delete account' };
  }
}

export async function getFamilyMembers() {
  const user = await getUser();
  if (!user) return { error: 'Not authenticated' };

  const supabase = await getServiceRoleClient();
  
  const { data: profile } = await supabase
    .from('users')
    .select('id')
    .eq('auth_id', user.id)
    .single();

  if (!profile) return { error: 'Profile not found' };

  const { data, error } = await supabase
    .from('FamilyMember')
    .select('*')
    .eq('user_id', profile.id)
    .order('created_at', { ascending: true });

  if (error) return { error: error.message };
  return { data };
}

export async function saveFamilyMember(memberData: any) {
  const user = await getUser();
  if (!user) return { error: 'Not authenticated' };

  const supabase = await getServiceRoleClient();
  
  const { data: profile } = await supabase
    .from('users')
    .select('id')
    .eq('auth_id', user.id)
    .single();

  if (!profile) return { error: 'Profile not found' };

  const { data, error } = await supabase
    .from('FamilyMember')
    .upsert({
      ...memberData,
      user_id: profile.id,
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) return { error: error.message };
  return { data };
}

export async function deleteFamilyMember(id: string) {
  const user = await getUser();
  if (!user) return { error: 'Not authenticated' };

  const supabase = await getServiceRoleClient();
  
  const { error } = await supabase
    .from('FamilyMember')
    .delete()
    .eq('id', id);

  if (error) return { error: error.message };
  return { success: true };
}

export async function getProfileContact(targetProfileId: string) {
  const user = await getUser();
  if (!user) return { error: 'Not authenticated' };

  const supabase = await createClient();

  // 1. Check if the current user is premium
  const { data: currentUser, error: profileError } = await supabase
    .from('users')
    .select('is_premium')
    .eq('auth_id', user.id)
    .single();

  if (profileError || !currentUser?.is_premium) {
    return { error: 'Upgrade to premium to view contact details' };
  }

  // 2. Fetch the contact info
  const { data: targetProfile, error: fetchError } = await supabase
    .from('users')
    .select('email, parents_contact_number')
    .eq('id', targetProfileId)
    .single();

  if (fetchError || !targetProfile) {
    return { error: 'Profile not found' };
  }

  return { data: targetProfile };
}
