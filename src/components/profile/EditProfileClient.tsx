'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Loader2, Upload, Trash2, Edit2, ChevronUp, ChevronDown, User, Users, Briefcase, Heart, Globe, Info, TreeDeciduous, Plus } from 'lucide-react';
import { createClient } from '@/lib/auth-client';
import { 
  getFullUserProfile, 
  saveKundliData, 
  getFamilyMembers, 
  saveFamilyMember, 
  deleteFamilyMember 
} from '@/lib/actions/auth';

interface ProfileImage {
  id: string;
  image_url: string;
  order: number;
  is_primary: boolean;
}

interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  gender: string;
  gender_locked?: boolean;
  date_of_birth?: string;
  time_of_birth?: string;
  place_of_birth?: string;
  location_city?: string;
  profession?: string;
  education?: string;
  company_working_at?: string;
  gotra?: string;
  mother_tongue?: string;
  nri?: string;
  disability?: string;
  father_name?: string;
  mother_name?: string;
  siblings?: number;
  parents_contact_number?: string;
  marital_status?: string;
  hobbies?: string;
  short_bio?: string;
  bio?: string;
  profile_images?: ProfileImage[];
}

interface FamilyMember {
  id: string;
  relationship: string;
  name: string;
  occupation: string | null;
  is_alive: boolean;
}

export default function EditProfileClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileImages, setProfileImages] = useState<ProfileImage[]>([]);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [newMember, setNewMember] = useState<Partial<FamilyMember>>({
    relationship: 'Brother',
    name: '',
    occupation: '',
    is_alive: true
  });
  const supabase = createClient();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    gender: '',
    dob: '',
    time_of_birth: '',
    place_of_birth: '',
    location_city: '',
    profession: '',
    education: '',
    company_working_at: '',
    gotra: '',
    mother_tongue: '',
    nri: 'No',
    disability: 'No',
    father_name: '',
    mother_name: '',
    siblings: 0,
    parents_contact_number: '',
    marital_status: '',
    hobbies: '',
    short_bio: '',
    bio: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (!authUser) {
        router.push('/login');
        return;
      }

      // Use server action to fetch full profile (bypasses client-side RLS issues)
      const [data, familyRes] = await Promise.all([
        getFullUserProfile(),
        getFamilyMembers()
      ]);

      if (!data) {
        throw new Error('Failed to fetch profile');
      }

      const kundli = Array.isArray(data.kundlis) ? data.kundlis[0] : data.kundlis;

      setProfile(data);
      setProfileImages(data.profile_images || []);
      if (familyRes.data) setFamilyMembers(familyRes.data);
      
      // Handle date formatting for input
      let formattedDob = '';
      if (data.date_of_birth) {
        formattedDob = new Date(data.date_of_birth).toISOString().split('T')[0];
      }

      // Format time for <input type="time"> (needs HH:mm)
      let formattedTime = '';
      if (kundli?.birth_time) {
        formattedTime = kundli.birth_time.substring(0, 5);
      } else if (data.time_of_birth) {
        formattedTime = data.time_of_birth.substring(0, 5);
      }

      setFormData({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        gender: data.gender || '',
        dob: formattedDob,
        time_of_birth: formattedTime,
        place_of_birth: kundli?.birth_place || data.place_of_birth || '',
        location_city: data.location_city || '',
        profession: data.profession || '',
        education: data.education || '',
        company_working_at: data.company_working_at || '',
        gotra: kundli?.gotra || data.gotra || '',
        mother_tongue: data.mother_tongue || '',
        nri: data.nri || 'No',
        disability: data.disability || 'No',
        father_name: data.father_name || '',
        mother_name: data.mother_name || '',
        siblings: data.siblings || 0,
        parents_contact_number: data.parents_contact_number || '',
        marital_status: data.marital_status || '',
        hobbies: data.hobbies || '',
        short_bio: data.short_bio || '',
        bio: data.bio || '',
      });
    } catch (error) {
      console.error('[v0] Fetch profile error:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveProfile() {
    setSaving(true);
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) throw new Error('Not authenticated');

      // Map frontend 'dob' to database 'date_of_birth' and strip invalid columns
      const finalUpdateData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        gender: profile?.gender_locked ? profile.gender : formData.gender,
        gender_locked: true,
        date_of_birth: formData.dob,
        location_city: formData.location_city,
        profession: formData.profession,
        education: formData.education,
        company_working_at: formData.company_working_at,
        father_name: formData.father_name,
        mother_name: formData.mother_name,
        siblings: parseInt(formData.siblings.toString()) || 0,
        parents_contact_number: formData.parents_contact_number,
        marital_status: formData.marital_status,
        mother_tongue: formData.mother_tongue,
        hobbies: formData.hobbies,
        short_bio: formData.short_bio,
        bio: formData.bio,
        nri: formData.nri,
        disability: formData.disability,
        age: formData.dob ? calculateAge(formData.dob) : 0,
      };

      const { error: userError } = await supabase
        .from('users')
        .update(finalUpdateData)
        .eq('auth_id', authUser.id);

      if (userError) throw userError;

      // Also update kundlis table via server action to bypass RLS issues
      const kundliResult = await saveKundliData({
        birth_time: formData.time_of_birth,
        birth_place: formData.place_of_birth,
        gotra: formData.gotra,
      });

      if (kundliResult.error) {
        console.error('[v0] Kundli save error:', kundliResult.error);
        // Don't fail the whole operation if kundli save fails, but log it
      }

      toast.success('Profile updated successfully');
      setProfile((prev) => (prev ? { ...prev, ...finalUpdateData } : null));
    } catch (error) {
      console.error('[v0] Save error:', error);
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  }

  function calculateAge(dobString: string) {
    const today = new Date();
    const birthDate = new Date(dobString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  async function handleImageDelete(imageId: string) {
    try {
      const { error } = await supabase
        .from('profile_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;

      setProfileImages((prev) => prev.filter((img) => img.id !== imageId));
      toast.success('Image deleted successfully');
    } catch (error) {
      console.error('[v0] Delete image error:', error);
      toast.error('Failed to delete image');
    }
  }

  async function handleSetPrimary(imageId: string) {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) throw new Error('Not authenticated');

      await supabase
        .from('profile_images')
        .update({ is_primary: false })
        .eq('user_id', profile?.id);

      const { error } = await supabase
        .from('profile_images')
        .update({ is_primary: true })
        .eq('id', imageId);

      if (error) throw error;

      setProfileImages((prev) =>
        prev.map((img) => ({
          ...img,
          is_primary: img.id === imageId,
        }))
      );
      toast.success('Primary image updated');
    } catch (error) {
      console.error('[v0] Set primary error:', error);
      toast.error('Failed to set primary image');
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (profileImages.length >= 6) {
      toast.error('Maximum 6 photos allowed');
      return;
    }

    setSaving(true);
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) throw new Error('Not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `${authUser.id}-${Math.random()}.${fileExt}`;
      const filePath = `${authUser.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

      const { data: imageData, error: dbError } = await supabase
        .from('profile_images')
        .insert([
          {
            user_id: profile?.id,
            image_url: publicUrl,
            order: profileImages.length,
            is_primary: profileImages.length === 0,
          },
        ])
        .select()
        .single();

      if (dbError) throw dbError;

      setProfileImages([...profileImages, imageData]);
      toast.success('Photo uploaded successfully');
    } catch (error: any) {
      console.error('[v0] Upload error:', error);
      toast.error(error.message || 'Failed to upload photo');
    } finally {
      setSaving(false);
    }
  }

  async function handleAddFamilyMember() {
    if (!newMember.name) {
      toast.error('Please enter a name');
      return;
    }
    setSaving(true);
    try {
      const result = await saveFamilyMember(newMember);
      if (result.error) throw new Error(result.error);
      
      setFamilyMembers([...familyMembers, result.data as FamilyMember]);
      setNewMember({
        relationship: 'Brother',
        name: '',
        occupation: '',
        is_alive: true
      });
      toast.success('Family member added');
    } catch (error: any) {
      toast.error(error.message || 'Failed to add member');
    } finally {
      setSaving(false);
    }
  }

  async function handleRemoveFamilyMember(id: string) {
    try {
      const result = await deleteFamilyMember(id);
      if (result.error) throw new Error(result.error);
      
      setFamilyMembers(familyMembers.filter(m => m.id !== id));
      toast.success('Member removed');
    } catch (error: any) {
      toast.error(error.message || 'Failed to remove member');
    }
  }

  async function handleReorderImages(newOrder: ProfileImage[]) {
    try {
      const updates = newOrder.map((img, idx) => 
        supabase.from('profile_images').update({ order: idx }).eq('id', img.id)
      );
      await Promise.all(updates);
      setProfileImages(newOrder);
      toast.success('Images reordered');
    } catch (error) {
      console.error('[v0] Reorder error:', error);
      toast.error('Failed to reorder images');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <Loader2 className="h-10 w-10 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Edit Your Profile</h1>
            <p className="text-slate-500 font-medium">Complete your profile to find better matches in the community</p>
          </div>
          <Button 
            onClick={handleSaveProfile} 
            disabled={saving} 
            className="bg-red-600 hover:bg-red-700 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-red-100 transition-all active:scale-95"
          >
            {saving ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 'Save All Changes'}
          </Button>
        </div>

        <Tabs defaultValue="basic" className="space-y-8">
          <TabsList className="bg-white border border-slate-200 p-1.5 rounded-2xl w-full grid grid-cols-2 md:grid-cols-6 h-auto gap-1">
            <TabsTrigger value="basic" className="rounded-xl py-3 data-[state=active]:bg-red-50 data-[state=active]:text-red-600 font-bold">
              <User className="w-4 h-4 mr-2" /> Basic
            </TabsTrigger>
            <TabsTrigger value="family" className="rounded-xl py-3 data-[state=active]:bg-red-50 data-[state=active]:text-red-600 font-bold">
              <Users className="w-4 h-4 mr-2" /> Family
            </TabsTrigger>
            <TabsTrigger value="career" className="rounded-xl py-3 data-[state=active]:bg-red-50 data-[state=active]:text-red-600 font-bold">
              <Briefcase className="w-4 h-4 mr-2" /> Career
            </TabsTrigger>
            <TabsTrigger value="cultural" className="rounded-xl py-3 data-[state=active]:bg-red-50 data-[state=active]:text-red-600 font-bold">
              <Globe className="w-4 h-4 mr-2" /> Cultural
            </TabsTrigger>
            <TabsTrigger value="family-tree" className="rounded-xl py-3 data-[state=active]:bg-red-50 data-[state=active]:text-red-600 font-bold">
              <TreeDeciduous className="w-4 h-4 mr-2" /> Family Tree
            </TabsTrigger>
            <TabsTrigger value="photos" className="rounded-xl py-3 data-[state=active]:bg-red-50 data-[state=active]:text-red-600 font-bold">
              <Heart className="w-4 h-4 mr-2" /> Photos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-6">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="bg-white border-b border-slate-100 p-8">
                <CardTitle className="text-xl font-black flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                    <User className="w-5 h-5" />
                  </div>
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-bold">First Name *</Label>
                    <Input value={formData.first_name} onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} className="rounded-xl border-slate-200 h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-bold">Last Name *</Label>
                    <Input value={formData.last_name} onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} className="rounded-xl border-slate-200 h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-bold">Gender *</Label>
                    <Select value={formData.gender} onValueChange={(val) => setFormData({ ...formData, gender: val })} disabled={profile?.gender_locked}>
                      <SelectTrigger className="rounded-xl border-slate-200 h-12">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-bold">Date of Birth *</Label>
                    <Input type="date" value={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} className="rounded-xl border-slate-200 h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-bold">Time of Birth</Label>
                    <Input type="time" value={formData.time_of_birth} onChange={(e) => setFormData({ ...formData, time_of_birth: e.target.value })} className="rounded-xl border-slate-200 h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-bold">Place of Birth *</Label>
                    <Input value={formData.place_of_birth} onChange={(e) => setFormData({ ...formData, place_of_birth: e.target.value })} placeholder="e.g. Raipur" className="rounded-xl border-slate-200 h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-bold">NRI Status</Label>
                    <Select value={formData.nri} onValueChange={(val) => setFormData({ ...formData, nri: val })}>
                      <SelectTrigger className="rounded-xl border-slate-200 h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="No">No</SelectItem>
                        <SelectItem value="Yes">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-bold">Disability Status</Label>
                    <Select value={formData.disability} onValueChange={(val) => setFormData({ ...formData, disability: val })}>
                      <SelectTrigger className="rounded-xl border-slate-200 h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="No">No</SelectItem>
                        <SelectItem value="Yes">Yes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="family" className="space-y-6">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="bg-white border-b border-slate-100 p-8">
                <CardTitle className="text-xl font-black flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                    <Users className="w-5 h-5" />
                  </div>
                  Family Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-bold">Father&apos;s Name *</Label>
                    <Input value={formData.father_name} onChange={(e) => setFormData({ ...formData, father_name: e.target.value })} className="rounded-xl border-slate-200 h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-bold">Mother&apos;s Name *</Label>
                    <Input value={formData.mother_name} onChange={(e) => setFormData({ ...formData, mother_name: e.target.value })} className="rounded-xl border-slate-200 h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-bold">Number of Siblings</Label>
                    <Input type="number" value={formData.siblings} onChange={(e) => setFormData({ ...formData, siblings: parseInt(e.target.value) || 0 })} className="rounded-xl border-slate-200 h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-bold">Marital Status *</Label>
                    <Select value={formData.marital_status} onValueChange={(val) => setFormData({ ...formData, marital_status: val })}>
                      <SelectTrigger className="rounded-xl border-slate-200 h-12">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Never Married">Never Married</SelectItem>
                        <SelectItem value="Divorced">Divorced</SelectItem>
                        <SelectItem value="Widowed">Widowed</SelectItem>
                        <SelectItem value="Awaiting Divorce">Awaiting Divorce</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-slate-700 font-bold">Parents Contact Number</Label>
                    <Input value={formData.parents_contact_number} onChange={(e) => setFormData({ ...formData, parents_contact_number: e.target.value })} placeholder="+91 XXXXXXXXXX" className="rounded-xl border-slate-200 h-12" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="career" className="space-y-6">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="bg-white border-b border-slate-100 p-8">
                <CardTitle className="text-xl font-black flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  Education & Career
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-bold">Highest Education *</Label>
                    <Input value={formData.education} onChange={(e) => setFormData({ ...formData, education: e.target.value })} placeholder="e.g. MBA" className="rounded-xl border-slate-200 h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-bold">Profession *</Label>
                    <Input value={formData.profession} onChange={(e) => setFormData({ ...formData, profession: e.target.value })} placeholder="e.g. HR Manager" className="rounded-xl border-slate-200 h-12" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-slate-700 font-bold">Company Name</Label>
                    <Input value={formData.company_working_at} onChange={(e) => setFormData({ ...formData, company_working_at: e.target.value })} placeholder="e.g. CIPLA" className="rounded-xl border-slate-200 h-12" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cultural" className="space-y-6">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="bg-white border-b border-slate-100 p-8">
                <CardTitle className="text-xl font-black flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                    <Globe className="w-5 h-5" />
                  </div>
                  Cultural Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-bold">Gotra *</Label>
                    <Input value={formData.gotra} onChange={(e) => setFormData({ ...formData, gotra: e.target.value })} placeholder="e.g. Kaushika" className="rounded-xl border-slate-200 h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-bold">Mother Tongue *</Label>
                    <Input value={formData.mother_tongue} onChange={(e) => setFormData({ ...formData, mother_tongue: e.target.value })} placeholder="e.g. HINDI" className="rounded-xl border-slate-200 h-12" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-slate-700 font-bold">Hobbies</Label>
                    <Input value={formData.hobbies} onChange={(e) => setFormData({ ...formData, hobbies: e.target.value })} placeholder="e.g. Music, Reading" className="rounded-xl border-slate-200 h-12" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-slate-700 font-bold">Short Bio (150 chars)</Label>
                    <Textarea value={formData.short_bio} onChange={(e) => setFormData({ ...formData, short_bio: e.target.value })} placeholder="A quick highlight about you" maxLength={150} className="rounded-xl border-slate-200" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-slate-700 font-bold">Full Bio</Label>
                    <Textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} placeholder="Tell us more about yourself..." rows={6} className="rounded-xl border-slate-200" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="family-tree" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Add Member Form */}
              <Card className="lg:col-span-1 border-none shadow-sm rounded-3xl overflow-hidden h-fit">
                <CardHeader className="bg-white border-b border-slate-100 p-6">
                  <CardTitle className="text-lg font-black flex items-center gap-2">
                    <Plus className="w-5 h-5 text-red-600" />
                    Add Relative
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold">Relationship</Label>
                    <Select value={newMember.relationship} onValueChange={(val) => setNewMember({...newMember, relationship: val})}>
                      <SelectTrigger className="rounded-xl border-slate-200 h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Father">Father</SelectItem>
                        <SelectItem value="Mother">Mother</SelectItem>
                        <SelectItem value="Brother">Brother</SelectItem>
                        <SelectItem value="Sister">Sister</SelectItem>
                        <SelectItem value="Paternal Grandfather">Paternal Grandfather</SelectItem>
                        <SelectItem value="Paternal Grandmother">Paternal Grandmother</SelectItem>
                        <SelectItem value="Maternal Grandfather">Maternal Grandfather</SelectItem>
                        <SelectItem value="Maternal Grandmother">Maternal Grandmother</SelectItem>
                        <SelectItem value="Uncle (Paternal)">Uncle (Paternal)</SelectItem>
                        <SelectItem value="Aunt (Paternal)">Aunt (Paternal)</SelectItem>
                        <SelectItem value="Uncle (Maternal)">Uncle (Maternal)</SelectItem>
                        <SelectItem value="Aunt (Maternal)">Aunt (Maternal)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold">Full Name</Label>
                    <Input 
                      value={newMember.name} 
                      onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                      placeholder="Enter name"
                      className="rounded-xl h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold">Occupation (Optional)</Label>
                    <Input 
                      value={newMember.occupation || ''} 
                      onChange={(e) => setNewMember({...newMember, occupation: e.target.value})}
                      placeholder="e.g. Retired Teacher"
                      className="rounded-xl h-10"
                    />
                  </div>
                  <div className="flex items-center gap-2 py-2">
                    <input 
                      type="checkbox" 
                      id="is_alive" 
                      checked={newMember.is_alive} 
                      onChange={(e) => setNewMember({...newMember, is_alive: e.target.checked})}
                      className="w-4 h-4 rounded border-slate-300 text-red-600"
                    />
                    <Label htmlFor="is_alive" className="text-sm font-medium">Currently Alive</Label>
                  </div>
                  <Button 
                    onClick={handleAddFamilyMember} 
                    disabled={saving}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-10 rounded-xl mt-2"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add to Tree'}
                  </Button>
                </CardContent>
              </Card>

              {/* Members List */}
              <Card className="lg:col-span-2 border-none shadow-sm rounded-3xl overflow-hidden">
                <CardHeader className="bg-white border-b border-slate-100 p-8">
                  <CardTitle className="text-xl font-black flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
                      <TreeDeciduous className="w-5 h-5" />
                    </div>
                    Family Map
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  {familyMembers.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                      <p className="text-slate-400 font-bold">No family members added yet</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {familyMembers.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600">
                              {member.relationship[0]}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-bold text-slate-900">{member.name}</h4>
                                <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold uppercase">{member.relationship}</span>
                              </div>
                              <p className="text-xs text-slate-500">
                                {member.occupation || 'No occupation listed'} • {member.is_alive ? 'Alive' : 'Deceased'}
                              </p>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleRemoveFamilyMember(member.id)}
                            className="text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="photos" className="space-y-6">
            <Card className="border-none shadow-sm rounded-3xl overflow-hidden">
              <CardHeader className="bg-white border-b border-slate-100 p-8 flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-xl font-black">Profile Photos ({profileImages.length}/6)</CardTitle>
                  <CardDescription className="font-bold">The first photo will be your primary profile picture.</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    id="photo-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={saving || profileImages.length >= 6}
                  />
                  <Button 
                    asChild
                    disabled={saving || profileImages.length >= 6}
                    className="bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl"
                  >
                    <label htmlFor="photo-upload" className="cursor-pointer flex items-center">
                      {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                      Upload Photo
                    </label>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                {profileImages.length === 0 ? (
                  <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <Upload className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-400 font-bold">No photos uploaded yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {profileImages.map((image, idx) => (
                      <div key={image.id} className="relative group rounded-2xl overflow-hidden aspect-square shadow-sm">
                        <img src={image.image_url} alt="Profile" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button size="icon" variant="secondary" onClick={() => handleSetPrimary(image.id)} className="rounded-full w-10 h-10 shadow-lg">
                            <Heart className={`w-5 h-5 ${image.is_primary ? 'fill-red-500 text-red-500' : 'text-slate-600'}`} />
                          </Button>
                          <Button size="icon" variant="destructive" onClick={() => handleImageDelete(image.id)} className="rounded-full w-10 h-10 shadow-lg">
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </div>
                        {image.is_primary && (
                          <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-black uppercase px-2 py-1 rounded-md shadow-lg">Primary</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
