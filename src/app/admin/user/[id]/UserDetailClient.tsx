'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Trash2, 
  User as UserIcon, 
  Mail, 
  Calendar, 
  MapPin, 
  Clock, 
  Globe, 
  Briefcase, 
  GraduationCap, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Home,
  Heart,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getAdminUserDetail, deleteUser } from '@/lib/actions/admin';
import { toast } from 'sonner';

interface UserDetailProps {
  userId: string;
}

export default function UserDetailClient({ userId }: UserDetailProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchUserDetail();
  }, [userId]);

  const fetchUserDetail = async () => {
    try {
      setLoading(true);
      const result = await getAdminUserDetail(userId);
      if (result.error) {
        toast.error(result.error);
        router.push('/admin');
      } else {
        setUser(result.data);
      }
    } catch (error) {
      toast.error('Failed to load user details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to remove this user?')) return;
    try {
      const result = await deleteUser(userId);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('User removed successfully');
        router.push('/admin');
      }
    } catch (error) {
      toast.error('Error removing user');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50">
        <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading user profile...</p>
      </div>
    );
  }

  if (!user) return null;

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const primaryImage = user.profile_images?.find((img: any) => img.is_primary)?.image_url || user.profile_photo;

  return (
    <div className="min-h-screen bg-slate-50/30 pb-20 pt-8">
      <div className="max-w-6xl mx-auto px-4 space-y-10">
        {/* Navigation & Header */}
        <div className="flex flex-col items-center gap-6">
          <Link href="/admin">
            <Button variant="outline" className="border-2 border-orange-400 text-orange-600 hover:bg-orange-50 font-black gap-2 px-6 h-10 rounded-xl shadow-sm transition-all active:scale-95 text-xs">
              <ArrowLeft className="w-4 h-4" />
              Back to Admin
            </Button>
          </Link>
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight">User Profile: {user.first_name} {user.last_name}</h1>
            <p className="text-slate-500 font-bold">Detailed user information and management</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-4 py-2 rounded-full border border-emerald-100 shadow-sm">
              <CheckCircle className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-widest">{user.approval_status || 'pending'}</span>
            </div>
            <Button 
              variant="outline" 
              className="border-2 border-rose-400 text-rose-600 hover:bg-rose-50 font-black gap-2 px-6 h-10 rounded-xl transition-all active:scale-95 shadow-sm text-xs"
              onClick={handleDelete}
            >
              <Trash2 className="w-4 h-4" />
              Remove User
            </Button>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Detailed Information Cards */}
          <div className="lg:col-span-8 space-y-8">
            {/* Basic Information */}
            <Card className="border-2 border-slate-900 rounded-2xl overflow-hidden shadow-none bg-white">
              <CardHeader className="p-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <UserIcon className="w-5 h-5 text-orange-600" />
                  <CardTitle className="text-xl font-black text-slate-900">Basic Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  {[
                    { label: 'Full Name', value: `${user.first_name} ${user.last_name}` },
                    { label: 'Email', value: user.email, icon: Mail },
                    { label: 'Gender', value: user.gender },
                    { label: 'Age', value: `${user.age || 'N/A'} years old` },
                    { label: 'Date of Birth', value: formatDate(user.dob), icon: Calendar },
                    { label: 'Place of Birth', value: user.place_of_birth || user.location_city },
                    { label: 'Time of Birth', value: user.time_of_birth, icon: Clock },
                    { label: 'NRI Status', value: user.nri || 'No' },
                    { label: 'Disability Status', value: user.disability || 'No' },
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <p className="text-xs font-bold text-slate-400">{item.label}</p>
                      <div className="flex items-center gap-2">
                        {item.icon && <item.icon className="w-4 h-4 text-slate-300" />}
                        <p className="font-bold text-slate-800">{item.value || '-'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Family Information */}
            <Card className="border-2 border-slate-900 rounded-2xl overflow-hidden shadow-none bg-white">
              <CardHeader className="p-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <Home className="w-5 h-5 text-orange-600" />
                  <CardTitle className="text-xl font-black text-slate-900">Family Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  {[
                    { label: 'Father\'s Name', value: user.father_name },
                    { label: 'Mother\'s Name', value: user.mother_name },
                    { label: 'Siblings', value: user.siblings },
                    { label: 'Marital Status', value: user.marital_status },
                    { label: 'Parents Contact Number', value: user.parents_contact_number },
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <p className="text-xs font-bold text-slate-400">{item.label}</p>
                      <p className="font-bold text-slate-800">{item.value || '-'}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Family Tree / Relatives */}
            <Card className="border-2 border-slate-900 rounded-2xl overflow-hidden shadow-none bg-white">
              <CardHeader className="p-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-orange-600" />
                  <CardTitle className="text-xl font-black text-slate-900">Family Tree (Detailed)</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                {!user.FamilyMember || user.FamilyMember.length === 0 ? (
                  <p className="text-slate-400 font-bold italic">No detailed family tree members added.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.FamilyMember.map((member: any) => (
                      <div key={member.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-orange-500">{member.relationship}</p>
                            <h4 className="font-bold text-slate-900">{member.name}</h4>
                            <p className="text-xs text-slate-500 mt-1">
                              {member.occupation || 'No occupation listed'}
                            </p>
                          </div>
                          <Badge variant={member.is_alive ? 'outline' : 'secondary'} className="text-[9px] uppercase tracking-tighter h-5">
                            {member.is_alive ? 'Alive' : 'Deceased'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Education & Career */}
            <Card className="border-2 border-slate-900 rounded-2xl overflow-hidden shadow-none bg-white">
              <CardHeader className="p-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-orange-600" />
                  <CardTitle className="text-xl font-black text-slate-900">Education & Career</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  {[
                    { label: 'Education', value: user.education },
                    { label: 'Profession', value: user.profession },
                    { label: 'Company', value: user.company_working_at },
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <p className="text-xs font-bold text-slate-400">{item.label}</p>
                      <p className="font-bold text-slate-800">{item.value || '-'}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cultural Information */}
            <Card className="border-2 border-slate-900 rounded-2xl overflow-hidden shadow-none bg-white">
              <CardHeader className="p-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-orange-600" />
                  <CardTitle className="text-xl font-black text-slate-900">Cultural Information</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  {[
                    { label: 'Gotra', value: user.gotra },
                    { label: 'Mother Tongue', value: user.mother_tongue },
                    { label: 'Hobbies', value: user.hobbies },
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <p className="text-xs font-bold text-slate-400">{item.label}</p>
                      <p className="font-bold text-slate-800">{item.value || '-'}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Summaries & Account Info */}
          <div className="lg:col-span-4 space-y-8">
            {/* Profile Summary */}
            <Card className="border-2 border-slate-900 rounded-2xl overflow-hidden shadow-none bg-white">
              <CardHeader className="p-6 border-b border-slate-100">
                <CardTitle className="text-xl font-black text-slate-900">Profile Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-8 flex flex-col items-center text-center space-y-6">
                <div className="w-28 h-28 bg-slate-100 rounded-full flex items-center justify-center overflow-hidden border-4 border-slate-50">
                  {primaryImage ? (
                    <img src={primaryImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-12 h-12 text-slate-300" />
                  )}
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-slate-900">{user.first_name} {user.last_name}</h3>
                  <p className="text-sm font-bold text-slate-500">{user.age || 'N/A'} years old • {user.gender}</p>
                  <div className="mt-2 inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full border border-emerald-100 text-[10px] font-black uppercase tracking-widest">
                    {user.approval_status || 'pending'}
                  </div>
                </div>
                <div className="w-full pt-6 border-t border-slate-50 space-y-3 text-left">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold text-slate-600">{user.location_city || user.city || '-'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Briefcase className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold text-slate-600">{user.profession || '-'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <GraduationCap className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold text-slate-600">{user.education || '-'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="border-2 border-slate-900 rounded-2xl overflow-hidden shadow-none bg-white">
              <CardHeader className="p-6 border-b border-slate-100">
                <CardTitle className="text-xl font-black text-slate-900">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-bold text-slate-700">{user.email}</span>
                </div>
              </CardContent>
            </Card>

            {/* Account Information */}
            <Card className="border-2 border-slate-900 rounded-2xl overflow-hidden shadow-none bg-white">
              <CardHeader className="p-6 border-b border-slate-100">
                <CardTitle className="text-xl font-black text-slate-900">Account Information</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Member ID</p>
                  <p className="text-xs font-mono font-bold text-slate-600 break-all">{user.id}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Joined</p>
                    <p className="text-sm font-bold text-slate-800">{formatDate(user.created_at)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Updated</p>
                    <p className="text-sm font-bold text-slate-800">{formatDate(user.updated_at)}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Payment Status</p>
                  <div className={`inline-flex px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${user.payment_status ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                    {user.payment_status ? 'Paid' : 'Not Paid'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
