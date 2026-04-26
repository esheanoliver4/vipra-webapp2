'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Loader2, Search, CheckCircle, XCircle, Eye, AlertCircle } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  approval_status: string;
  is_approved: boolean;
  created_at: string;
  gender: string;
  city: string;
  profession?: string;
}

export default function UserManagementDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchTerm, filterStatus]);

  async function fetchUsers() {
    try {
      const response = await fetch('/api/admin/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('[v0] Fetch users error:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }

  function filterUsers() {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          u.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter((u) => u.approval_status === filterStatus);
    }

    setFilteredUsers(filtered);
  }

  async function approveUser(userId: string) {
    setApproving(true);
    try {
      const response = await fetch(`/api/admin/users/${userId}/approve`, {
        method: 'PATCH',
      });

      if (!response.ok) throw new Error('Failed to approve user');

      toast.success('User approved successfully');
      fetchUsers();
    } catch (error) {
      console.error('[v0] Approve error:', error);
      toast.error('Failed to approve user');
    } finally {
      setApproving(false);
    }
  }

  async function rejectUser(userId: string) {
    setApproving(true);
    try {
      const response = await fetch(`/api/admin/users/${userId}/reject`, {
        method: 'PATCH',
      });

      if (!response.ok) throw new Error('Failed to reject user');

      toast.success('User rejected');
      fetchUsers();
    } catch (error) {
      console.error('[v0] Reject error:', error);
      toast.error('Failed to reject user');
    } finally {
      setApproving(false);
    }
  }

  const stats = {
    total: users.length,
    pending: users.filter((u) => u.approval_status === 'pending').length,
    approved: users.filter((u) => u.is_approved).length,
    rejected: users.filter((u) => u.approval_status === 'rejected').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fadeInDown">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users and approve profiles</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Users', value: stats.total, color: 'bg-blue-100 text-blue-700' },
            { label: 'Pending', value: stats.pending, color: 'bg-yellow-100 text-yellow-700' },
            { label: 'Approved', value: stats.approved, color: 'bg-green-100 text-green-700' },
            { label: 'Rejected', value: stats.rejected, color: 'bg-red-100 text-red-700' },
          ].map((stat) => (
            <Card key={stat.label} className="border-0 shadow-md hover-lift">
              <CardContent className="pt-6">
                <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                <p className={`text-3xl font-bold mt-2 ${stat.color} p-2 rounded-lg inline-block`}>
                  {stat.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters and Search */}
        <Card className="border-0 shadow-md mb-6">
          <CardHeader>
            <CardTitle>Search & Filter</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-2 border-gray-300 focus:border-red-500 rounded-lg"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <p className="text-sm text-gray-600">
              Showing {filteredUsers.length} of {users.length} users
            </p>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="border-0 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gradient-to-r from-gray-100 to-gray-50">
                <TableRow className="border-b border-gray-200">
                  <TableHead className="font-bold text-gray-700">Name</TableHead>
                  <TableHead className="font-bold text-gray-700">Email</TableHead>
                  <TableHead className="font-bold text-gray-700">Gender</TableHead>
                  <TableHead className="font-bold text-gray-700">City</TableHead>
                  <TableHead className="font-bold text-gray-700">Status</TableHead>
                  <TableHead className="font-bold text-gray-700">Created</TableHead>
                  <TableHead className="font-bold text-gray-700 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <TableCell className="font-semibold text-gray-900">{user.name}</TableCell>
                      <TableCell className="text-gray-600 text-sm">{user.email}</TableCell>
                      <TableCell className="text-gray-600">{user.gender}</TableCell>
                      <TableCell className="text-gray-600">{user.city}</TableCell>
                      <TableCell>
                        <Badge
                          className={`${
                            user.approval_status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : user.approval_status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {user.approval_status.charAt(0).toUpperCase() + user.approval_status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-blue-300 text-blue-600 hover:bg-blue-50"
                            onClick={() => setSelectedUser(user)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {user.approval_status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => approveUser(user.id)}
                                disabled={approving}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                className="bg-red-600 hover:bg-red-700 text-white"
                                onClick={() => rejectUser(user.id)}
                                disabled={approving}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        {/* User Details Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-96 overflow-y-auto">
              <CardHeader className="bg-gradient-red-pink text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{selectedUser.name}</CardTitle>
                    <CardDescription className="text-white/90">{selectedUser.email}</CardDescription>
                  </div>
                  <Button variant="ghost" onClick={() => setSelectedUser(null)} className="text-white">
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Gender</p>
                    <p className="font-semibold">{selectedUser.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">City</p>
                    <p className="font-semibold">{selectedUser.city}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Profession</p>
                    <p className="font-semibold">{selectedUser.profession || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <Badge className="mt-1">{selectedUser.approval_status}</Badge>
                  </div>
                </div>

                {selectedUser.approval_status === 'pending' && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-yellow-800">Awaiting Approval</p>
                      <p className="text-sm text-yellow-700">Review profile and approve or reject</p>
                      <div className="flex gap-2 mt-3">
                        <Button
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => {
                            approveUser(selectedUser.id);
                            setSelectedUser(null);
                          }}
                          disabled={approving}
                        >
                          Approve
                        </Button>
                        <Button
                          className="bg-red-600 hover:bg-red-700 text-white"
                          onClick={() => {
                            rejectUser(selectedUser.id);
                            setSelectedUser(null);
                          }}
                          disabled={approving}
                        >
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
