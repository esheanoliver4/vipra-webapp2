'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import CardStack, { Profile } from '@/components/cards/CardStack';
import { toast } from 'sonner';
import { Filter } from 'lucide-react';

export default function BrowseClient() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [gender, setGender] = useState<'male' | 'female' | 'all'>('all');

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    fetchProfiles();
  }, [gender]);

  const fetchProfiles = async () => {
    try {
      setIsLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please login to browse profiles');
        return;
      }

      const { data: currentUserProfile } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', user.id)
        .single();

      let query = supabase
        .from('users')
        .select(`
          id,
          first_name,
          last_name,
          gender,
          date_of_birth,
          profile_image_url,
          profiles!inner (
            location_city,
            education,
            occupation,
            gotra,
            religion
          )
        `)
        .neq('id', currentUserProfile?.id);

      if (gender !== 'all') {
        query = query.eq('gender', gender);
      }

      const { data, error } = await query.limit(50);

      if (error) {
        console.error('[v0] Error fetching profiles:', error);
        toast.error('Failed to load profiles');
        return;
      }

      const transformedProfiles: Profile[] = (data || []).map((user: any) => ({
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        gender: user.gender,
        date_of_birth: user.date_of_birth,
        location_city: user.profiles?.[0]?.location_city || '',
        profile_image_url: user.profile_image_url,
        education: user.profiles?.[0]?.education,
        occupation: user.profiles?.[0]?.occupation,
        gotra: user.profiles?.[0]?.gotra,
        religion: user.profiles?.[0]?.religion,
      }));

      setProfiles(transformedProfiles);
      setIsLoading(false);
    } catch (error) {
      console.error('[v0] Error:', error);
      toast.error('Something went wrong');
      setIsLoading(false);
    }
  };

  const handleLike = async (profileId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: currentUser } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', user.id)
        .single();

      await supabase
        .from('connections')
        .insert([
          {
            initiator_id: currentUser?.id,
            recipient_id: profileId,
            status: 'pending',
          },
        ]);

      toast.success('Profile liked!');
    } catch (error) {
      console.error('[v0] Like error:', error);
    }
  };

  const handleDislike = (profileId: string) => {
    console.log('[v0] Profile passed:', profileId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-pink-50 to-white py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 animate-fadeInDown">
          <h1 className="text-3xl sm:text-5xl font-bold text-gradient-red-pink mb-2">
            Find Your Perfect Match
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">Swipe right to like, left to pass</p>
        </div>

        <div className="card-gradient-light border-0 rounded-2xl shadow-xl p-4 sm:p-6 mb-6 animate-slideInDown">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-gradient-red-pink text-white rounded-lg">
              <Filter className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-gray-800">Filter Matches</h3>
          </div>
          
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value as any)}
            className="w-full px-4 py-3 border-2 border-red-200 rounded-lg bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-300"
          >
            <option value="all">All Genders</option>
            <option value="male">Males</option>
            <option value="female">Females</option>
          </select>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin">
              <div className="w-16 h-16 rounded-full bg-gradient-red-pink opacity-20 animate-pulse"></div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center mb-8">
            <CardStack
              profiles={profiles}
              onLike={handleLike}
              onDislike={handleDislike}
              isLoading={isLoading}
            />
          </div>
        )}

        <div className="bg-gradient-to-r from-red-100 to-pink-100 border-2 border-red-200 rounded-2xl p-4 sm:p-6 text-center animate-slideInUp">
          <p className="text-sm sm:text-base font-bold text-gray-800 mb-3">How to use:</p>
          <div className="text-xs sm:text-sm text-gray-700 space-y-2">
            <p className="hover-scale">❤️ Swipe or click Heart to like</p>
            <p className="hover-scale">✕ Swipe or click Pass to skip</p>
          </div>
        </div>
      </div>
    </div>
  );
}
