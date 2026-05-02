'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Users, AlertCircle, CheckCircle, XCircle, Eye, Trash2, Clock, Loader2, Power } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { approveUser, rejectUser, deleteUser, deactivateUser, getAdminStats } from '@/lib/actions/admin';

interface AdminClientProps {
  userId: string;
}

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  gender: string;
  payment_id: string;
  payment_status: boolean;
  approval_status: string;
  deactivated_at: string | null;
  created_at: string;
}

export default function AdminClient({ userId }: AdminClientProps) {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingUsers: 0,
    acceptedUsers: 0,
    rejectedUsers: 0,
  });
  const supabase = createClient();

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);

      // Fetch stats using server action
      const statsData = await getAdminStats();
      setStats(statsData);

      // Fetch users data
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, email, first_name, last_name, gender, payment_id, payment_status, approval_status, deactivated_at, created_at')
        .order('created_at', { ascending: false })
        .limit(100);

      if (usersError) {
        console.error('[v0] Error fetching users:', usersError);
        toast.error('Failed to load users data');
      } else {
        setUsers(usersData || []);
      }
    } catch (error) {
      console.error('[v0] Admin data fetch error:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId: string) => {
    try {
      const result = await approveUser(userId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('User approved successfully');
        fetchAdminData();
      }
    } catch (error) {
      toast.error('Error approving user');
    }
  };

  const handleReject = async (userId: string) => {
    try {
      const result = await rejectUser(userId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('User rejected successfully');
        fetchAdminData();
      }
    } catch (error) {
      toast.error('Error rejecting user');
    }
  };

  const handleDelete = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const result = await deleteUser(userId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('User deleted successfully');
        fetchAdminData();
      }
    } catch (error) {
      toast.error('Error deleting user');
    }
  };

  const handleDeactivate = async (userId: string) => {
    if (!window.confirm('Are you sure you want to deactivate this user?')) return;
    try {
      const result = await deactivateUser(userId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('User deactivated successfully');
        fetchAdminData();
      }
    } catch (error) {
      toast.error('Error deactivating user');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-500 font-medium text-lg">Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="max-w-7xl mx-auto space-y-12 py-12 px-4 sm:px-6">
        {/* Page Title */}
        <div className="text-center space-y-3">
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">Admin Dashboard</h1>
          <p className="text-xl text-slate-500 font-medium">Manage user registrations and approvals</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-orange-600', bgColor: 'bg-orange-50' },
            { label: 'Pending', value: stats.pendingUsers, icon: Clock, color: 'text-amber-500', bgColor: 'bg-amber-50' },
            { label: 'Accepted', value: stats.acceptedUsers, icon: CheckCircle, color: 'text-emerald-500', bgColor: 'bg-emerald-50' },
            { label: 'Rejected', value: stats.rejectedUsers, icon: XCircle, color: 'text-rose-500', bgColor: 'bg-rose-50' },
          ].map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Card key={idx} className="border-none shadow-sm rounded-3xl overflow-hidden bg-white hover:shadow-md transition-all duration-300">
                <CardContent className="p-8 text-center space-y-4">
                  <div className={`w-14 h-14 ${stat.bgColor} rounded-2xl flex items-center justify-center mx-auto`}>
                    <Icon className={`w-7 h-7 ${stat.color}`} />
                  </div>
                  <div>
                    <div className="text-4xl font-black text-slate-900 leading-none">{stat.value}</div>
                    <p className="text-sm font-bold text-slate-400 tracking-widest uppercase mt-2">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Users Table */}
        <Card className="border-none shadow-sm rounded-3xl overflow-hidden bg-white">
          <CardHeader className="bg-white border-b border-slate-100 p-8">
            <CardTitle className="text-2xl font-black text-slate-900">User Management</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                    <TableHead className="font-bold text-slate-900 py-4 pl-4">Name</TableHead>
                    <TableHead className="font-bold text-slate-900 py-4 px-2">TXN ID</TableHead>
                    <TableHead className="font-bold text-slate-900 py-4 px-2">Payment</TableHead>
                    <TableHead className="font-bold text-slate-900 py-4 px-2">Status</TableHead>
                    <TableHead className="font-bold text-slate-900 py-4 px-2">Info</TableHead>
                    <TableHead className="font-bold text-slate-900 py-4 px-2">Date</TableHead>
                    <TableHead className="font-bold text-slate-900 py-4 pr-4">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length > 0 ? (
                    users.map((user) => (
                      <TableRow key={user.id} className="hover:bg-slate-50/30 transition-colors border-b border-slate-50">
                        <TableCell className="py-4 pl-4">
                          <div className="font-bold text-slate-900 text-sm">{user.first_name} {user.last_name}</div>
                          <div className="text-[10px] font-bold text-slate-400 capitalize">{user.gender}</div>
                        </TableCell>
                        <TableCell className="py-4 px-2">
                          <span className="font-mono text-[10px] text-slate-400 bg-slate-50 px-1 py-0.5 rounded">
                            {user.payment_id ? user.payment_id.slice(-6) : '-'}
                          </span>
                        </TableCell>
                        <TableCell className="py-4 px-2">
                          {user.payment_status ? (
                            <Badge className="bg-emerald-50 text-emerald-600 border-none font-bold px-3 py-1 rounded-full shadow-none">Paid</Badge>
                          ) : (
                            <span className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full">Not paid</span>
                          )}
                        </TableCell>
                        <TableCell className="py-6">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <div className={`w-2.5 h-2.5 rounded-full ${user.approval_status === 'approved' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' :
                                  user.approval_status === 'rejected' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]' :
                                    'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]'
                                }`} />
                              <span className={`text-xs font-black uppercase tracking-widest ${user.approval_status === 'approved' ? 'text-emerald-600' :
                                  user.approval_status === 'rejected' ? 'text-rose-600' : 'text-amber-600'
                                }`}>
                                {user.approval_status || 'pending'}
                              </span>
                              {user.approval_status === 'approved' && (
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-6">
                          {user.approval_status === 'approved' ? (
                            <div className="flex flex-col">
                              <span className="text-xs font-bold text-emerald-600">Active</span>
                              <span className="text-[10px] font-bold text-slate-400">
                                Approved:<br />
                                {new Date(user.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm font-bold text-slate-300">-</span>
                          )}
                        </TableCell>
                        <TableCell className="py-6 text-sm text-slate-500 font-bold">
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="py-6 pr-8">
                          <div className="flex items-center gap-3">
                            {user.approval_status === 'pending' ? (
                              <Button
                                size="sm"
                                className="bg-emerald-600 hover:bg-emerald-700 text-white hover:text-black font-black gap-2 px-5 py-5 rounded-xl shadow-lg shadow-emerald-100 transition-all active:scale-95 border-2 border-emerald-700/10"
                                onClick={() => handleApprove(user.id)}
                              >
                                <CheckCircle className="w-4 h-4" />
                                Accept
                              </Button>
                            ) : user.approval_status === 'approved' ? (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-2 border-amber-400 text-amber-600 hover:bg-amber-50 hover:text-black font-black gap-2 px-5 py-5 rounded-xl transition-all active:scale-95 shadow-sm"
                                onClick={() => handleDeactivate(user.id)}
                              >
                                <Power className="w-4 h-4" />
                                Deactivate
                              </Button>
                            ) : null}

                            {user.approval_status === 'pending' && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-2 border-rose-400 text-rose-600 hover:bg-rose-50 hover:text-black font-black gap-2 px-5 py-5 rounded-xl transition-all active:scale-95 shadow-sm"
                                onClick={() => handleReject(user.id)}
                              >
                                <XCircle className="w-4 h-4" />
                                Reject
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-2 border-orange-400 text-orange-600 hover:bg-orange-50 hover:text-black font-black gap-2 px-5 py-5 rounded-xl transition-all active:scale-95 shadow-sm"
                              onClick={() => router.push(`/admin/user/${user.id}`)}
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-2 border-slate-400 text-slate-600 hover:bg-slate-50 hover:text-black font-black gap-2 px-5 py-5 rounded-xl transition-all active:scale-95 shadow-sm"
                              onClick={() => handleDelete(user.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                              Remove
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-24">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center">
                            <Users className="w-10 h-10 text-slate-200" />
                          </div>
                          <p className="text-slate-400 font-bold text-lg">No users found in the system</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
