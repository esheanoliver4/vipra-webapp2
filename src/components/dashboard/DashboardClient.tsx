'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Heart, Users, MessageCircle, Sparkles, Settings, LogOut, Home, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';
import { createClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  gender: string;
  profile_image_url?: string;
  headline?: string;
  is_premium: boolean;
  premium_plan: string;
}

export default function DashboardClient() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();

        if (!authUser) {
          router.push('/login');
          return;
        }

        // Fetch user profile from database
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('auth_id', authUser.id)
          .single();

        if (error || !data) {
          throw new Error('Failed to load profile');
        }

        setUser(data);
      } catch (error) {
        console.error('Error loading user:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [supabase, router]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Heart className="w-6 h-6 text-primary" />
          </div>
          <p className="text-lg text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const initials = `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/10 dark:via-blue-950/10 to-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl hover:scale-105 transition-transform">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                <Heart className="w-6 h-6 text-white fill-white" />
              </div>
              <span className="hidden sm:inline text-foreground">VipraPariwaar</span>
            </Link>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.push('/')} className="hover:bg-primary/10">
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
              <div className="flex items-center gap-3 pl-4 border-l border-border">
                <Avatar className="h-12 w-12 cursor-pointer border-2 border-primary/20">
                  <AvatarImage src={user.profile_image_url} alt={user.first_name} />
                  <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-bold">{initials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-sm font-semibold text-foreground">
                    {user.first_name} {user.last_name}
                  </p>
                  {user.is_premium && (
                    <p className="text-xs text-secondary font-bold flex items-center gap-1">
                      <Sparkles className="w-3 h-3 fill-current" /> Premium
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-destructive hover:bg-destructive/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-3">
            Welcome back,{' '}
            <span className="bg-gradient-to-r from-primary via-rose-500 to-secondary bg-clip-text text-transparent">
              {user.first_name}
            </span>
            !
          </h1>
          <p className="text-lg text-muted-foreground">
            {user.headline || 'Discover meaningful connections in our Brahmin community'}
          </p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { icon: TrendingUp, label: 'Profile Views', value: '0', subtitle: 'This month' },
            { icon: Heart, label: 'Connections', value: '0', subtitle: 'Active matches' },
            { icon: CheckCircle2, label: 'Interests', value: '0', subtitle: 'Favorited profiles' },
            { icon: MessageCircle, label: 'Messages', value: '0', subtitle: 'Unread' }
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="border border-border/50 rounded-2xl hover:border-primary/50 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white/50 dark:from-slate-900/50 to-white/30 dark:to-slate-900/30 backdrop-blur-sm overflow-hidden group">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl md:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                      {stat.value}
                    </div>
                    <p className="text-xs text-muted-foreground font-medium">{stat.subtitle}</p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="discovery" className="w-full">
          <TabsList className="grid w-full grid-cols-4 rounded-lg p-1 bg-muted">
            <TabsTrigger value="discovery" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Discovery</span>
            </TabsTrigger>
            <TabsTrigger value="connections" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Connections</span>
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Messages</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="discovery" className="mt-6">
            <Card className="border-border rounded-xl">
              <CardHeader>
                <CardTitle>Discover Profiles</CardTitle>
                <CardDescription>Browse and find your perfect match</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Browse Profiles</h3>
                  <p className="text-muted-foreground mb-6">
                    Start exploring profiles and find someone special
                  </p>
                  <Link href="/browse">
                    <Button className="bg-primary hover:bg-primary/90 text-white rounded-lg">
                      Start Browsing
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="connections" className="mt-6">
            <Card className="border-border rounded-xl">
              <CardHeader>
                <CardTitle>My Connections</CardTitle>
                <CardDescription>Manage your connection requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Connections Yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Send connection requests to profiles you like
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="mt-6">
            <Card className="border-border rounded-xl">
              <CardHeader>
                <CardTitle>Messages</CardTitle>
                <CardDescription>Chat with your matches</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Messages Yet</h3>
                  <p className="text-muted-foreground">
                    Start messaging once you connect with someone
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card className="border-border rounded-xl">
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your profile and preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Link href="/edit-profile">
                    <Button variant="outline" className="w-full justify-start rounded-lg">
                      <Settings className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </Link>
                  <Link href="/preferences">
                    <Button variant="outline" className="w-full justify-start rounded-lg">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Dating Preferences
                    </Button>
                  </Link>
                  <Link href="/subscription">
                    <Button variant="outline" className="w-full justify-start rounded-lg">
                      <Sparkles className="w-4 h-4 mr-2" />
                      Upgrade to Premium
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
