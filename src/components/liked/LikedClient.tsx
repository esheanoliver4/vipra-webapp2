'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Loader2, User, MapPin, Briefcase } from 'lucide-react';
import { getLikedProfiles } from '@/lib/actions/auth';
import { toast } from 'sonner';
import Link from 'next/link';

interface LikedProfile {
  id: string;
  first_name: string;
  last_name: string;
  gender: string;
  date_of_birth: string;
  location_city: string;
  profession: string;
  profile_images: {
    image_url: string;
    is_primary: boolean;
  }[];
}

export default function LikedClient() {
  const [profiles, setProfiles] = useState<LikedProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLikedProfiles();
  }, []);

  const fetchLikedProfiles = async () => {
    try {
      setLoading(true);
      const result = await getLikedProfiles();
      if (result.error) {
        toast.error(result.error);
      } else {
        setProfiles((result.data as any) || []);
      }
    } catch (error) {
      console.error('Error fetching liked profiles:', error);
      toast.error('Failed to load liked profiles');
    } finally {
      setLoading(false);
    }
  };

  const getAge = (dob: string) => {
    if (!dob) return '';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-red-100 rounded-2xl">
            <Heart className="w-8 h-8 text-red-600 fill-red-600" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900">Profiles You Liked</h1>
            <p className="text-slate-500 font-medium">Keep track of interesting people you've found</p>
          </div>
        </div>

        {profiles.length === 0 ? (
          <Card className="border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-3xl">
            <CardContent className="p-16 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">No likes yet</h3>
              <p className="text-slate-500 mb-8 max-w-sm mx-auto font-medium">
                When you like someone's profile while browsing, they'll show up here.
              </p>
              <Link href="/browse">
                <Button className="btn-gradient-primary px-8 py-6 rounded-2xl font-bold text-lg">
                  Start Browsing
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {profiles.map((profile) => {
              const primaryImage = profile.profile_images?.find(img => img.is_primary)?.image_url 
                || profile.profile_images?.[0]?.image_url;

              return (
                <Card key={profile.id} className="group overflow-hidden border-2 border-slate-100 hover:border-red-100 hover:shadow-xl transition-all duration-300 rounded-3xl bg-white">
                  <div className="flex h-full">
                    <div className="w-1/3 aspect-[3/4] relative overflow-hidden bg-slate-100">
                      {primaryImage ? (
                        <img 
                          src={primaryImage} 
                          alt={profile.first_name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <User className="w-12 h-12" />
                        </div>
                      )}
                    </div>
                    
                    <div className="w-2/3 p-6 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 mb-1">
                          {profile.first_name} {profile.last_name}
                        </h3>
                        <div className="flex items-center gap-2 text-slate-500 text-sm mb-4 font-medium">
                          <span>{getAge(profile.date_of_birth)} years</span>
                          <span>•</span>
                          <span className="capitalize">{profile.gender}</span>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-slate-600 text-sm">
                            <MapPin className="w-4 h-4 text-red-400" />
                            <span className="line-clamp-1">{profile.location_city || 'Not specified'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-slate-600 text-sm">
                            <Briefcase className="w-4 h-4 text-red-400" />
                            <span className="line-clamp-1">{profile.profession || 'Not specified'}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex gap-2">
                        <Link href={`/profile/${profile.id}`} className="flex-1">
                          <Button variant="outline" className="w-full border-2 border-slate-100 rounded-xl font-bold hover:bg-slate-50">
                            View
                          </Button>
                        </Link>
                        <Button className="rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border-none">
                          <Heart className="w-5 h-5 fill-red-600" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
