'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Heart, CheckCircle, Clock, X, MessageCircle } from 'lucide-react';
import {
  getConnections,
  getPendingRequests,
  getSentRequests,
  acceptConnection,
  rejectConnection,
} from '@/lib/actions/connections';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface Connection {
  id: string;
  from_user_id: string;
  to_user_id: string;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

interface UserProfile {
  id: string;
  full_name: string;
  age: number;
  profile_photo?: string;
  occupation?: string;
  location?: string;
}

export default function ConnectionsClient() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [pendingRequests, setPendingRequests] = useState<Connection[]>([]);
  const [sentRequests, setSentRequests] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfiles, setUserProfiles] = useState<{ [key: string]: UserProfile }>({});
  const supabase = createClient();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [connResult, pendingResult, sentResult] = await Promise.all([
        getConnections(),
        getPendingRequests(),
        getSentRequests(),
      ]);

      if (connResult.data) setConnections(connResult.data);
      if (pendingResult.data) setPendingRequests(pendingResult.data);
      if (sentResult.data) setSentRequests(sentResult.data);

      // Load user profiles for all connections
      const { data: { user } } = await supabase.auth.getUser();
      const userIds = [
        ...connResult.data?.map((c) => c.from_user_id === user?.id ? c.to_user_id : c.from_user_id) || [],
        ...pendingResult.data?.map((r) => r.from_user_id) || [],
        ...sentResult.data?.map((r) => r.to_user_id) || [],
      ];

      const uniqueIds = [...new Set(userIds)];
      await loadUserProfiles(uniqueIds);
    } catch (error) {
      console.error('Error loading connections:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadUserProfiles(userIds: string[]) {
    try {
      const { data } = await supabase
        .from('users')
        .select('id, full_name, age, profile_photo, occupation, location')
        .in('id', userIds);

      if (data) {
        const profiles: { [key: string]: UserProfile } = {};
        data.forEach((profile) => {
          profiles[profile.id] = profile;
        });
        setUserProfiles(profiles);
      }
    } catch (error) {
      console.error('Error loading profiles:', error);
    }
  }

  async function handleAccept(connectionId: string) {
    try {
      const result = await acceptConnection(connectionId);
      if (result.success) {
        await loadData();
      }
    } catch (error) {
      console.error('Error accepting connection:', error);
    }
  }

  async function handleReject(connectionId: string) {
    try {
      const result = await rejectConnection(connectionId);
      if (result.success) {
        await loadData();
      }
    } catch (error) {
      console.error('Error rejecting connection:', error);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-2">
              <Heart className="w-8 h-8 text-primary" />
              My Connections
            </CardTitle>
          </CardHeader>
        </Card>

        <Tabs defaultValue="connections" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="connections">
              Connections ({connections.length})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Requests ({pendingRequests.length})
            </TabsTrigger>
            <TabsTrigger value="sent">
              Sent ({sentRequests.length})
            </TabsTrigger>
          </TabsList>

          {/* Connections Tab */}
          <TabsContent value="connections" className="space-y-4">
            {connections.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No connections yet</h3>
                  <p className="text-gray-600 mb-6">Start connecting with profiles to build your network</p>
                  <Link href="/browse">
                    <Button>Browse Profiles</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              connections.map((conn) => {
                const partnerId =
                  conn.from_user_id === (userProfiles[conn.from_user_id]?.id)
                    ? conn.to_user_id
                    : conn.from_user_id;
                const profile = userProfiles[partnerId];

                return (
                  <Card key={conn.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 justify-between">
                        <div className="flex items-center gap-4">
                          {profile?.profile_photo && (
                            <img
                              src={profile.profile_photo}
                              alt={profile.full_name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          )}
                          <div>
                            <h3 className="font-semibold text-lg">{profile?.full_name || 'Unknown'}</h3>
                            <p className="text-sm text-gray-600">
                              {profile?.age} • {profile?.location}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/profile/${partnerId}`}>
                            <Button variant="outline" size="sm">
                              View Profile
                            </Button>
                          </Link>
                          <Button size="sm" className="bg-primary">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            Message
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>

          {/* Pending Requests Tab */}
          <TabsContent value="pending" className="space-y-4">
            {pendingRequests.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No pending requests</h3>
                  <p className="text-gray-600">You have no incoming connection requests</p>
                </CardContent>
              </Card>
            ) : (
              pendingRequests.map((req) => {
                const profile = userProfiles[req.from_user_id];
                return (
                  <Card key={req.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 justify-between">
                        <div className="flex items-center gap-4">
                          {profile?.profile_photo && (
                            <img
                              src={profile.profile_photo}
                              alt={profile.full_name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          )}
                          <div>
                            <h3 className="font-semibold text-lg">{profile?.full_name || 'Unknown'}</h3>
                            <p className="text-sm text-gray-600">
                              {profile?.age} • {profile?.location}
                            </p>
                            {req.message && <p className="text-sm text-gray-500 mt-1">"{req.message}"</p>}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-primary"
                            onClick={() => handleAccept(req.id)}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleReject(req.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>

          {/* Sent Requests Tab */}
          <TabsContent value="sent" className="space-y-4">
            {sentRequests.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No sent requests</h3>
                  <p className="text-gray-600">You haven't sent any connection requests yet</p>
                  <Link href="/browse" className="mt-6">
                    <Button>Find Matches</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              sentRequests.map((req) => {
                const profile = userProfiles[req.to_user_id];
                return (
                  <Card key={req.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 justify-between">
                        <div className="flex items-center gap-4">
                          {profile?.profile_photo && (
                            <img
                              src={profile.profile_photo}
                              alt={profile.full_name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          )}
                          <div>
                            <h3 className="font-semibold text-lg">{profile?.full_name || 'Unknown'}</h3>
                            <p className="text-sm text-gray-600">
                              {profile?.age} • {profile?.location}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-yellow-50">
                          <Clock className="w-3 h-3 mr-1" />
                          Pending Response
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
