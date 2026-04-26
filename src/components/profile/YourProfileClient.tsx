'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Edit, Share2, Heart, Users, FileText, Star } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface YourProfileClientProps {
  userId: string;
}

interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  dateOfBirth: string;
  caste: string;
  city: string;
  occupation: string;
  education: string;
  profilePhoto: string;
  about: string;
  height: string;
  religion: string;
  motherTongue: string;
  isVerified: boolean;
  subscriptionStatus: 'free' | 'silver' | 'gold';
}

export default function YourProfileClient({ userId }: YourProfileClientProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    connections: 0,
    interests: 0,
    matches: 0,
    profileViews: 0,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Simulate fetching profile
        setTimeout(() => {
          setProfile({
            id: userId,
            firstName: 'Rajesh',
            lastName: 'Kumar',
            email: 'rajesh@example.com',
            gender: 'Male',
            dateOfBirth: '1990-05-15',
            caste: 'Brahmin',
            city: 'Mumbai',
            occupation: 'Software Engineer',
            education: 'B.Tech Computer Science',
            profilePhoto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rajesh',
            about: 'A dedicated professional with a passion for technology and family values.',
            height: '5\'10"',
            religion: 'Hindu',
            motherTongue: 'Marathi',
            isVerified: true,
            subscriptionStatus: 'gold',
          });

          setStats({
            connections: 23,
            interests: 45,
            matches: 8,
            profileViews: 156,
          });
          setLoading(false);
        }, 500);
      } catch (error) {
        toast.error('Failed to load profile');
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  if (loading) {
    return (
      <div className="container max-w-4xl">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container max-w-4xl">
        <Card className="border-destructive/50">
          <CardContent className="pt-6">
            <p className="text-destructive">Failed to load profile. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const age = new Date().getFullYear() - new Date(profile.dateOfBirth).getFullYear();

  return (
    <div className="container max-w-4xl">
      {/* Header with Photo and Basic Info */}
      <Card className="mb-6 bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Photo */}
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-primary">
                  <AvatarImage src={profile.profilePhoto} />
                  <AvatarFallback>{profile.firstName[0]}{profile.lastName[0]}</AvatarFallback>
                </Avatar>
                {profile.isVerified && (
                  <div className="absolute bottom-0 right-0 bg-green-500 text-white rounded-full p-2">
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                )}
              </div>
              <Link href="/edit-profile">
                <Button variant="outline" size="sm" className="gap-2">
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </Button>
              </Link>
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-3xl font-bold text-foreground">
                  {profile.firstName} {profile.lastName}
                </h1>
                {profile.isVerified && (
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300">
                    Verified
                  </Badge>
                )}
                {profile.subscriptionStatus === 'gold' && (
                  <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300">
                    Gold Member
                  </Badge>
                )}
              </div>

              <div className="text-muted-foreground mb-4">
                <p className="text-lg font-semibold text-primary">{age} years • {profile.height}</p>
                <p>{profile.occupation}</p>
                <p>{profile.city}, {profile.religion}</p>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button size="sm" variant="outline" className="gap-2">
                  <Share2 className="w-4 h-4" />
                  Share Profile
                </Button>
                <Link href="/edit-profile">
                  <Button size="sm" className="gap-2">
                    <Edit className="w-4 h-4" />
                    Edit Details
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-primary">{stats.connections}</div>
            <p className="text-sm text-muted-foreground">Connections</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-secondary">{stats.interests}</div>
            <p className="text-sm text-muted-foreground">Interests</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-accent">{stats.matches}</div>
            <p className="text-sm text-muted-foreground">Matches</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="text-2xl font-bold text-foreground">{stats.profileViews}</div>
            <p className="text-sm text-muted-foreground">Views</p>
          </CardContent>
        </Card>
      </div>

      {/* Details Tabs */}
      <Tabs defaultValue="about" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>

        <TabsContent value="about" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                About Me
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {profile.about}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Personal Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Education</p>
                  <p className="font-semibold text-foreground">{profile.education}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Caste</p>
                  <p className="font-semibold text-foreground">{profile.caste}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Mother Tongue</p>
                  <p className="font-semibold text-foreground">{profile.motherTongue}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Religion</p>
                  <p className="font-semibold text-foreground">{profile.religion}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">City</p>
                  <p className="font-semibold text-foreground">{profile.city}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                  <p className="font-semibold text-foreground">{new Date(profile.dateOfBirth).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-4">
        <Link href="/edit-profile" className="flex-1">
          <Button className="w-full gap-2" size="lg">
            <Edit className="w-5 h-5" />
            Edit Profile
          </Button>
        </Link>
        <Link href="/browse" className="flex-1">
          <Button variant="outline" className="w-full gap-2" size="lg">
            <Users className="w-5 h-5" />
            Browse Matches
          </Button>
        </Link>
      </div>
    </div>
  );
}
