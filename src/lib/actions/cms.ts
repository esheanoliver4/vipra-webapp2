'use server';

import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { getUser } from './auth';
import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

async function getServiceRoleClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function getStaticPages() {
  const supabase = await getServiceRoleClient();
  const { data, error } = await supabase
    .from('static_pages')
    .select('*')
    .order('title', { ascending: true });

  if (error) {
    console.error('Error fetching static pages:', error);
    return { error: error.message };
  }

  return { data };
}

export async function getStaticPageBySlug(slug: string) {
  const supabase = await getServiceRoleClient();
  const { data, error } = await supabase
    .from('static_pages')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error(`Error fetching page ${slug}:`, error);
    return { error: error.message };
  }

  return { data };
}

export async function updateStaticPage(id: string, content: string) {
  const user = await getUser();
  if (!user) return { error: 'Not authenticated' };

  // Check if admin
  const supabase = await getServiceRoleClient();
  const { data: adminUser } = await supabase
    .from('users')
    .select('role')
    .eq('auth_id', user.id)
    .single();

  if (adminUser?.role !== 'admin') {
    return { error: 'Unauthorized: Admin access required' };
  }

  const { error } = await supabase
    .from('static_pages')
    .update({ 
      content,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating static page:', error);
    return { error: error.message };
  }

  return { success: true };
}

export async function getBlogPosts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('BlogPost')
    .select('*, BlogCategory(name)')
    .eq('status', 'published')
    .order('published_at', { ascending: false });

  if (error) {
    console.error('Error fetching blog posts:', error);
    return { error: error.message };
  }

  return { data };
}

export async function getSubscriptionPlans() {
  const supabase = await getServiceRoleClient();
  const { data, error } = await supabase
    .from('SubscriptionPlan')
    .select('*')
    .order('order', { ascending: true });

  if (error) {
    console.error('Error fetching subscription plans:', error);
    return { error: error.message };
  }

  return { data };
}

export async function updateSubscriptionPlan(id: string, updates: any) {
  const user = await getUser();
  if (!user) return { error: 'Not authenticated' };

  const supabase = await getServiceRoleClient();
  const { data: adminUser } = await supabase
    .from('users')
    .select('role')
    .eq('auth_id', user.id)
    .single();

  if (adminUser?.role !== 'admin') {
    return { error: 'Unauthorized' };
  }

  const { error } = await supabase
    .from('SubscriptionPlan')
    .update({ 
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id);

  if (error) {
    console.error('Error updating plan:', error);
    return { error: error.message };
  }

  return { success: true };
}

export async function createSubscriptionPlan(planData: any) {
  const user = await getUser();
  if (!user) return { error: 'Not authenticated' };

  const supabase = await getServiceRoleClient();
  const { data: adminUser } = await supabase
    .from('users')
    .select('role')
    .eq('auth_id', user.id)
    .single();

  if (adminUser?.role !== 'admin') {
    return { error: 'Unauthorized' };
  }

  const { data, error } = await supabase
    .from('SubscriptionPlan')
    .insert([{
      ...planData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) {
    console.error('Error creating plan:', error);
    return { error: error.message };
  }

  return { data };
}

export async function deleteSubscriptionPlan(id: string) {
  const user = await getUser();
  if (!user) return { error: 'Not authenticated' };

  const supabase = await getServiceRoleClient();
  const { data: adminUser } = await supabase
    .from('users')
    .select('role')
    .eq('auth_id', user.id)
    .single();

  if (adminUser?.role !== 'admin') {
    return { error: 'Unauthorized' };
  }

  const { error } = await supabase
    .from('SubscriptionPlan')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting plan:', error);
    return { error: error.message };
  }

  return { success: true };
}

export async function getPlatformSettings() {
  const supabase = await getServiceRoleClient();
  const { data, error } = await supabase
    .from('PlatformSettings')
    .select('*')
    .eq('id', 'default')
    .single();

  if (error && error.code !== 'PGRST116') {
    return { error: error.message };
  }

  return { data };
}

export async function updatePlatformSettings(settings: any) {
  const user = await getUser();
  if (!user) return { error: 'Not authenticated' };

  const supabase = await getServiceRoleClient();
  const { data: adminUser } = await supabase
    .from('users')
    .select('role')
    .eq('auth_id', user.id)
    .single();

  if (adminUser?.role !== 'admin') {
    return { error: 'Unauthorized' };
  }

  const { error } = await supabase
    .from('PlatformSettings')
    .upsert({
      id: 'default',
      ...settings,
      updated_at: new Date().toISOString()
    });

  if (error) return { error: error.message };
  return { success: true };
}

export async function submitPaymentRequest(paymentData: {
  plan_id: string;
  transaction_id: string;
  amount: number;
}) {
  const user = await getUser();
  if (!user) return { error: 'Not authenticated' };

  const supabase = await getServiceRoleClient();
  
  // Get internal user id and plan details
  const [profileRes, planRes] = await Promise.all([
    supabase.from('users').select('id').eq('auth_id', user.id).single(),
    supabase.from('SubscriptionPlan').select('name').eq('id', paymentData.plan_id).single()
  ]);

  if (profileRes.error || !profileRes.data) return { error: 'Profile not found' };
  if (planRes.error || !planRes.data) return { error: 'Plan not found' };

  const { error: requestError } = await supabase
    .from('PaymentRequest')
    .insert([{
      id: crypto.randomUUID(),
      user_id: profileRes.data.id,
      plan_id: paymentData.plan_id,
      transaction_id: paymentData.transaction_id,
      amount: paymentData.amount,
      status: 'pending' // Force to pending for admin verification
    }]);

  if (requestError) {
    if (requestError.code === '23505') return { error: 'This transaction ID has already been submitted.' };
    return { error: requestError.message };
  }

  return { success: true };
}

export async function getUsers() {
  const user = await getUser();
  if (!user) return { error: 'Not authenticated' };

  const supabase = await getServiceRoleClient();
  
  // Verify admin
  const { data: adminUser } = await supabase
    .from('users')
    .select('role')
    .eq('auth_id', user.id)
    .single();

  if (adminUser?.role !== 'admin') {
    return { error: 'Unauthorized' };
  }

  const { data, error } = await supabase
    .from('users')
    .select('id, email, first_name, last_name, role, is_premium, premium_plan, created_at')
    .order('created_at', { ascending: false });

  if (error) return { error: error.message };
  return { data };
}

// Blog Actions
export async function getCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('BlogCategory')
    .select('*')
    .order('name', { ascending: true });
  
  if (error) return { error: error.message };
  return { data };
}

export async function getAdminBlogPosts() {
  const user = await getUser();
  if (!user) return { error: 'Not authenticated' };

  const supabase = await getServiceRoleClient();
  
  // Verify admin
  const { data: adminUser } = await supabase
    .from('users')
    .select('role')
    .eq('auth_id', user.id)
    .single();

  if (adminUser?.role !== 'admin') {
    return { error: 'Unauthorized' };
  }

  const { data, error } = await supabase
    .from('BlogPost')
    .select('*, BlogCategory(name)')
    .order('created_at', { ascending: false });

  if (error) return { error: error.message };
  return { data };
}

export async function saveBlogPost(postData: any) {
  const user = await getUser();
  if (!user) return { error: 'Not authenticated' };

  const supabase = await getServiceRoleClient();
  
  // Verify admin
  const { data: adminUser } = await supabase
    .from('users')
    .select('id, role')
    .eq('auth_id', user.id)
    .single();

  if (adminUser?.role !== 'admin') {
    return { error: 'Unauthorized' };
  }

  const { id, ...data } = postData;
  const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  
  const payload = {
    ...data,
    slug,
    author_id: adminUser.id,
    updated_at: new Date().toISOString(),
    published_at: data.status === 'published' ? new Date().toISOString() : null
  };

  let result;
  if (id && id !== 'new') {
    result = await supabase
      .from('BlogPost')
      .update(payload)
      .eq('id', id);
  } else {
    result = await supabase
      .from('BlogPost')
      .insert([payload])
      .select()
      .single();
  }

  if (result.error) return { error: result.error.message };
  
  // Revalidate the blog pages
  revalidatePath('/blog');
  return { success: true, data: result.data };
}

export async function deleteBlogPost(id: string) {
  const user = await getUser();
  if (!user) return { error: 'Not authenticated' };

  const supabase = await getServiceRoleClient();
  
  // Verify admin
  const { data: adminUser } = await supabase
    .from('users')
    .select('role')
    .eq('auth_id', user.id)
    .single();

  if (adminUser?.role !== 'admin') {
    return { error: 'Unauthorized' };
  }

  const { error } = await supabase
    .from('BlogPost')
    .delete()
    .eq('id', id);

  if (error) return { error: error.message };
  
  revalidatePath('/blog');
  return { success: true };
}

export async function getBlogPostBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('BlogPost')
    .select('*, BlogCategory(name)')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (error) return { error: error.message };
  return { data };
}

export async function updateUserPlan(userId: string, planData: {
  is_premium: boolean;
  premium_plan: string | null;
  premium_plan_id: string | null;
}) {
  const user = await getUser();
  if (!user) return { error: 'Not authenticated' };

  const supabase = await getServiceRoleClient();
  
  // Verify admin
  const { data: adminUser } = await supabase
    .from('users')
    .select('role')
    .eq('auth_id', user.id)
    .single();

  if (adminUser?.role !== 'admin') {
    return { error: 'Unauthorized' };
  }

  const { error } = await supabase
    .from('users')
    .update({
      ...planData,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);

  if (error) return { error: error.message };
  return { success: true };
}
