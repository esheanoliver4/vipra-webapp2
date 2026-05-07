'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import CardStack, { Profile } from '@/components/cards/CardStack';
import { toast } from 'sonner';
import { likeProfile, passProfile, getBrowseProfiles } from '@/lib/actions/auth';
import { Filter } from 'lucide-react';

export default function BrowseClient() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [gender, setGender] = useState<'male' | 'female' | 'all'>('all');
  const [isPremium, setIsPremium] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    fetchProfiles();
  }, [gender]);

  const fetchProfiles = async () => {
    try {
      setIsLoading(true);
      
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        const { data: profile } = await supabase
          .from('users')
          .select('is_premium')
          .eq('auth_id', authUser.id)
          .single();
        setIsPremium(!!profile?.is_premium);
      }

      const result = await getBrowseProfiles({ gender });

      if (result.error) {
        console.error('[v0] Error fetching profiles:', result.error);
        toast.error('Failed to load profiles');
        setIsLoading(false);
        return;
      }

      const transformedProfiles: Profile[] = (result.data || []).map((user: any) => {
        // Find primary image or fallback to first image
        const primaryImage = user.profile_images?.find((img: any) => img.is_primary)?.image_url;
        const fallbackImage = user.profile_images?.[0]?.image_url || user.profile_image_url || user.profile_pic || '';
        
        const userGotra = Array.isArray(user.kundlis) ? user.kundlis[0]?.gotra : user.kundlis?.gotra;

        return {
          id: user.id,
          first_name: user.first_name || '',
          last_name: user.last_name || '',
          gender: user.gender || '',
          date_of_birth: user.date_of_birth || user.dob || '',
          location_city: user.location_city || user.city || '',
          profile_image_url: primaryImage || fallbackImage,
          education: user.education || '',
          occupation: user.profession || user.occupation || '',
          gotra: userGotra || user.gotra || '',
          religion: user.religion || '',
          email: user.email || '',
          parents_contact_number: user.parents_contact_number || '',
        };
      });

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
      const result = await likeProfile(profileId);
      if (result.error) throw new Error(result.error);
      toast.success('Profile liked!');
    } catch (error) {
      console.error('[v0] Like error:', error);
      toast.error('Failed to like profile');
    }
  };

  const handleDislike = async (profileId: string) => {
    try {
      const result = await passProfile(profileId);
      if (result.error) throw new Error(result.error);
      console.log('[v0] Profile passed:', profileId);
    } catch (error) {
      console.error('[v0] Pass error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 via-pink-50 to-white py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg mx-auto">
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
              isPremium={isPremium}
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
