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
import { Loader2, Upload, Trash2, Edit2, ChevronUp, ChevronDown } from 'lucide-react';

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
  location_city?: string;
  profession?: string;
  education?: string;
  short_bio?: string;
  bio?: string;
  profileImages?: ProfileImage[];
}

export default function EditProfileClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileImages, setProfileImages] = useState<ProfileImage[]>([]);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    gender: '',
    location_city: '',
    profession: '',
    education: '',
    short_bio: '',
    bio: '',
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const response = await fetch('/api/profiles/user');
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      const data = await response.json();
      setProfile(data);
      setProfileImages(data.profileImages || []);
      setFormData({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        gender: data.gender || '',
        location_city: data.location_city || '',
        profession: data.profession || '',
        education: data.education || '',
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
      const response = await fetch('/api/profiles/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          // Gender can only be changed if not locked
          gender: profile?.gender_locked ? profile.gender : formData.gender,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      toast.success('Profile updated successfully');
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              ...formData,
              gender_locked: true, // Lock gender after first update
            }
          : null
      );
    } catch (error) {
      console.error('[v0] Save error:', error);
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  }

  async function handleImageDelete(imageId: string) {
    try {
      const response = await fetch(`/api/profiles/images/${imageId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete image');
      }

      setProfileImages((prev) => prev.filter((img) => img.id !== imageId));
      toast.success('Image deleted successfully');
    } catch (error) {
      console.error('[v0] Delete image error:', error);
      toast.error('Failed to delete image');
    }
  }

  async function handleSetPrimary(imageId: string) {
    try {
      const response = await fetch(`/api/profiles/images/${imageId}/primary`, {
        method: 'PATCH',
      });

      if (!response.ok) {
        throw new Error('Failed to set primary image');
      }

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

  async function handleReorderImages(newOrder: ProfileImage[]) {
    try {
      const response = await fetch('/api/profiles/images/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          images: newOrder.map((img, idx) => ({
            id: img.id,
            order: idx,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to reorder images');
      }

      setProfileImages(newOrder);
      toast.success('Images reordered');
    } catch (error) {
      console.error('[v0] Reorder error:', error);
      toast.error('Failed to reorder images');
    }
  }

  function moveImageUp(index: number) {
    if (index === 0) return;
    const newOrder = [...profileImages];
    [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
    handleReorderImages(newOrder);
  }

  function moveImageDown(index: number) {
    if (index === profileImages.length - 1) return;
    const newOrder = [...profileImages];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    handleReorderImages(newOrder);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-red-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-pink-50 py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 animate-fadeInDown">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gradient-red-pink mb-2">Edit Profile</h1>
          <p className="text-gray-600 text-sm sm:text-base">Update your information and showcase your best photos</p>
        </div>

        <Tabs defaultValue="info" className="space-y-6 animate-slideInUp">
          <TabsList className="grid w-full grid-cols-2 bg-white shadow-md rounded-lg p-1">
            <TabsTrigger value="info" className="font-semibold transition-all duration-300 data-[state=active]:bg-gradient-red-pink data-[state=active]:text-white">
              Personal Info
            </TabsTrigger>
            <TabsTrigger value="photos" className="font-semibold transition-all duration-300 data-[state=active]:bg-gradient-red-pink data-[state=active]:text-white">
              Photos ({profileImages.length}/6)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <Card className="card-gradient-light border-0 shadow-xl">
              <CardHeader className="bg-gradient-red-pink text-white rounded-t-2xl">
                <CardTitle className="text-2xl">Personal Information</CardTitle>
                <CardDescription className="text-white/90">Update your profile details and make a great impression</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      placeholder="First name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      placeholder="Last name"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="gender">Gender *</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) => setFormData({ ...formData, gender: value })}
                    disabled={profile?.gender_locked}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  {profile?.gender_locked && (
                    <p className="text-sm text-gray-500 mt-1">Gender cannot be changed after initial selection</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={formData.location_city}
                      onChange={(e) => setFormData({ ...formData, location_city: e.target.value })}
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <Label htmlFor="profession">Profession</Label>
                    <Input
                      id="profession"
                      value={formData.profession}
                      onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                      placeholder="Your profession"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="education">Education</Label>
                  <Input
                    id="education"
                    value={formData.education}
                    onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                    placeholder="Your education"
                  />
                </div>

                <div>
                  <Label htmlFor="shortBio">Short Bio (displayed on cards)</Label>
                  <Textarea
                    id="shortBio"
                    value={formData.short_bio}
                    onChange={(e) => setFormData({ ...formData, short_bio: e.target.value })}
                    placeholder="A short introduction about yourself (50-100 characters)"
                    maxLength={150}
                    rows={3}
                  />
                  <p className="text-sm text-gray-500 mt-1">{formData.short_bio.length}/150</p>
                </div>

                <div>
                  <Label htmlFor="bio">Full Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell us more about yourself"
                    rows={5}
                  />
                </div>

                <Button 
                  onClick={handleSaveProfile} 
                  disabled={saving} 
                  className="w-full btn-gradient-primary text-white font-bold py-3 sm:py-4 rounded-lg text-base sm:text-lg transition-all duration-300 hover-lift hover-glow-red"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="photos">
            <Card>
              <CardHeader>
                <CardTitle>Profile Photos</CardTitle>
                <CardDescription>Upload up to 6 photos (Max 500MB each)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {profileImages.length < 6 && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Click or drag images to upload</p>
                  </div>
                )}

                {profileImages.length === 0 ? (
                  <div className="text-center py-12">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No photos yet. Upload your first photo!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                    {profileImages.map((image, idx) => (
                      <div key={image.id} className="relative group animate-bounceIn" style={{ animationDelay: `${idx * 100}ms` }}>
                        <img
                          src={image.image_url}
                          alt={`Profile ${idx + 1}`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        {image.is_primary && (
                          <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded text-xs">
                            Primary
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-lg transition duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                          {!image.is_primary && (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleSetPrimary(image.id)}
                              title="Set as primary"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          )}
                          {idx > 0 && (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => moveImageUp(idx)}
                              title="Move up"
                            >
                              <ChevronUp className="h-4 w-4" />
                            </Button>
                          )}
                          {idx < profileImages.length - 1 && (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => moveImageDown(idx)}
                              title="Move down"
                            >
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleImageDelete(image.id)}
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
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
