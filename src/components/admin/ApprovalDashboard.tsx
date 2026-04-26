'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface PendingUser {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  gender: string;
  approval_status: string;
  created_at: string;
}

export default function ApprovalDashboard() {
  const [users, setUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState<string | null>(null);
  const [rejecting, setRejecting] = useState<string | null>(null);
  const [rejectionNotes, setRejectionNotes] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  async function fetchPendingUsers() {
    try {
      const response = await fetch('/api/admin/approve-user');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('[v0] Fetch error:', error);
      toast.error('Failed to load pending users');
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(userId: string) {
    setApproving(userId);
    try {
      const response = await fetch('/api/admin/approve-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          status: 'approved',
          adminId: 'admin-' + Date.now(),
        }),
      });

      if (!response.ok) throw new Error('Failed to approve');
      
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      toast.success('User approved successfully');
    } catch (error) {
      console.error('[v0] Approval error:', error);
      toast.error('Failed to approve user');
    } finally {
      setApproving(null);
    }
  }

  async function handleReject(userId: string) {
    if (!rejectionNotes[userId]?.trim()) {
      toast.error('Please provide rejection notes');
      return;
    }

    setRejecting(userId);
    try {
      const response = await fetch('/api/admin/approve-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          status: 'rejected',
          notes: rejectionNotes[userId],
          adminId: 'admin-' + Date.now(),
        }),
      });

      if (!response.ok) throw new Error('Failed to reject');

      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setRejectionNotes((prev) => {
        const newNotes = { ...prev };
        delete newNotes[userId];
        return newNotes;
      });
      toast.success('User rejected and notified');
    } catch (error) {
      console.error('[v0] Rejection error:', error);
      toast.error('Failed to reject user');
    } finally {
      setRejecting(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">User Approval Dashboard</h1>
          <p className="text-gray-600">Review and approve new user registrations</p>
        </div>

        {users.length === 0 ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <p className="text-lg font-semibold text-gray-900">All caught up!</p>
                <p className="text-gray-600">No pending approvals at this time.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {users.map((user) => (
              <Card key={user.id} className="border-l-4 border-l-yellow-600">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">
                        {user.first_name} {user.last_name}
                      </CardTitle>
                      <CardDescription>{user.email}</CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-yellow-50">
                      {user.approval_status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Gender</p>
                      <p className="font-semibold text-gray-900 capitalize">
                        {user.gender}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Registered</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Rejection Notes Section */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <label className="text-sm font-medium text-gray-700 block mb-2">
                      Rejection Notes (if rejecting)
                    </label>
                    <Textarea
                      placeholder="Explain why the profile is being rejected..."
                      value={rejectionNotes[user.id] || ''}
                      onChange={(e) =>
                        setRejectionNotes({
                          ...rejectionNotes,
                          [user.id]: e.target.value,
                        })
                      }
                      className="min-h-24"
                      disabled={rejecting === user.id}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <Button
                      onClick={() => handleApprove(user.id)}
                      disabled={approving === user.id}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                      {approving === user.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Approving...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Approve
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => handleReject(user.id)}
                      disabled={rejecting === user.id}
                      variant="destructive"
                      className="flex-1"
                    >
                      {rejecting === user.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Rejecting...
                        </>
                      ) : (
                        <>
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="text-sm text-gray-600 text-center py-4">
              Showing {users.length} pending{' '}
              {users.length === 1 ? 'approval' : 'approvals'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
