'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Mail, Heart, Share2 } from 'lucide-react';
import { sendConnectionRequest } from '@/lib/actions/connections';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface Profile {
  id: string;
  full_name: string;
  age: number;
  gender: string;
  religion: string;
  caste: string;
  location: string;
  occupation: string;
  profile_photo: string;
  bio: string;
  education: string;
  height: string;
  income: string;
  profile_completed: boolean;
  created_at: string;
}

interface ProfileViewClientProps {
  userId: string;
}

export default function ProfileViewClient({ userId }: ProfileViewClientProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    loadProfile();
  }, [userId]);

  async function loadProfile() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleConnect() {
    setSending(true);
    try {
      const result = await sendConnectionRequest(userId, 'I am interested in connecting with you');
      if (result.success) {
        alert('Connection request sent!');
      } else {
        alert(result.error || 'Failed to send request');
      }
    } finally {
      setSending(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-600">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        {profile.profile_photo && (
          <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
            <img
              src={profile.profile_photo}
              alt={profile.full_name}
              className="w-full h-96 object-cover"
            />
          </div>
        )}

        {/* Profile Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl mb-2">{profile.full_name}</CardTitle>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline">{profile.age} years</Badge>
                  <Badge variant="outline">{profile.gender}</Badge>
                  <Badge variant="outline">{profile.location}</Badge>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Heart className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {profile.bio && (
              <div className="mb-6">
                <h3 className="font-semibold mb-2">About</h3>
                <p className="text-gray-600">{profile.bio}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 mb-6">
              {profile.education && (
                <div>
                  <p className="text-sm text-gray-500">Education</p>
                  <p className="font-semibold">{profile.education}</p>
                </div>
              )}
              {profile.occupation && (
                <div>
                  <p className="text-sm text-gray-500">Occupation</p>
                  <p className="font-semibold">{profile.occupation}</p>
                </div>
              )}
              {profile.height && (
                <div>
                  <p className="text-sm text-gray-500">Height</p>
                  <p className="font-semibold">{profile.height}</p>
                </div>
              )}
              {profile.income && (
                <div>
                  <p className="text-sm text-gray-500">Income</p>
                  <p className="font-semibold">{profile.income}</p>
                </div>
              )}
              {profile.religion && (
                <div>
                  <p className="text-sm text-gray-500">Religion</p>
                  <p className="font-semibold">{profile.religion}</p>
                </div>
              )}
              {profile.caste && (
                <div>
                  <p className="text-sm text-gray-500">Caste</p>
                  <p className="font-semibold">{profile.caste}</p>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              <Button
                size="lg"
                className="flex-1 bg-primary hover:bg-primary/90"
                onClick={handleConnect}
                disabled={sending}
              >
                {sending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 mr-2" />
                    Connect
                  </>
                )}
              </Button>
              <Button size="lg" variant="outline" className="flex-1">
                <Mail className="w-4 h-4 mr-2" />
                Message
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
