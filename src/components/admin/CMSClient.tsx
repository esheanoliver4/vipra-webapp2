'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Loader2, 
  FileText, 
  Save, 
  Edit3, 
  Globe, 
  BookOpen, 
  CreditCard, 
  Check, 
  Star, 
  Plus, 
  Trash2,
  Settings,
  QrCode,
  Upload,
  Users as UsersIcon,
  Search,
  ShieldCheck,
  ShieldX
} from 'lucide-react';
import { 
  getStaticPages, 
  updateStaticPage, 
  getBlogPosts, 
  getSubscriptionPlans, 
  updateSubscriptionPlan,
  createSubscriptionPlan,
  deleteSubscriptionPlan,
  getPlatformSettings,
  updatePlatformSettings,
  getUsers,
  updateUserPlan
} from '@/lib/actions/cms';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';

interface StaticPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  updated_at: string;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  price: number;
  billing_period: string;
  features: any;
  is_popular: boolean;
  is_active: boolean;
  order: number;
  updated_at: string;
}

interface PlatformSettings {
  qr_code_url: string;
  upipay_id: string;
}

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  is_premium: boolean;
  premium_plan: string | null;
  created_at: string;
}

export default function CMSClient() {
  const supabase = createClient();
  const [pages, setPages] = useState<StaticPage[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  
  // Page editing state
  const [editingPage, setEditingPage] = useState<StaticPage | null>(null);
  const [editedContent, setEditedContent] = useState('');

  // Plan editing state
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [editedPlanData, setEditedPlanData] = useState<Partial<SubscriptionPlan>>({});

  // Global Settings state
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>({
    qr_code_url: '',
    upipay_id: ''
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const lowerQuery = searchQuery.toLowerCase();
      setFilteredUsers(users.filter(u => 
        u.email.toLowerCase().includes(lowerQuery) || 
        `${u.first_name} ${u.last_name}`.toLowerCase().includes(lowerQuery)
      ));
    }
  }, [searchQuery, users]);

  async function loadInitialData() {
    try {
      const [pagesRes, plansRes, settingsRes, usersRes] = await Promise.all([
        getStaticPages(),
        getSubscriptionPlans(),
        getPlatformSettings(),
        getUsers()
      ]);
      
      if (pagesRes.data) setPages(pagesRes.data);
      if (plansRes.data) setPlans(plansRes.data);
      if (settingsRes.data) setPlatformSettings(settingsRes.data as PlatformSettings);
      if (usersRes.data) {
        setUsers(usersRes.data);
        setFilteredUsers(usersRes.data);
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
      toast.error('Failed to load CMS data');
    } finally {
      setLoading(false);
    }
  }

  const handleEditPage = (page: StaticPage) => {
    setEditingPage(page);
    setEditedContent(page.content);
    setEditingPlan(null);
  };

  const handleEditPlan = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setEditedPlanData({ ...plan });
    setEditingPage(null);
  };

  const handleAddNewPlan = () => {
    const newPlan: Partial<SubscriptionPlan> = {
      name: 'New Plan',
      description: 'Short description of the plan',
      price: 0,
      billing_period: 'monthly',
      features: ["Feature 1", "Feature 2"],
      is_popular: false,
      is_active: true,
      order: plans.length
    };
    setEditingPlan({ id: 'new', ...newPlan } as SubscriptionPlan);
    setEditedPlanData(newPlan);
    setEditingPage(null);
  };

  const handleSavePage = async () => {
    if (!editingPage) return;
    setSaving(editingPage.id);
    try {
      const result = await updateStaticPage(editingPage.id, editedContent);
      if (result.error) throw new Error(result.error);
      toast.success(`${editingPage.title} updated`);
      setPages(pages.map(p => p.id === editingPage.id ? { ...p, content: editedContent } : p));
      setEditingPage(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save');
    } finally {
      setSaving(null);
    }
  };

  const handleSavePlan = async () => {
    if (!editingPlan) return;
    setSaving(editingPlan.id);
    try {
      let result;
      if (editingPlan.id === 'new') {
        result = await createSubscriptionPlan(editedPlanData);
        if (result.data) {
          setPlans([...plans, result.data as SubscriptionPlan]);
          toast.success('New plan created');
        }
      } else {
        result = await updateSubscriptionPlan(editingPlan.id, editedPlanData);
        if (result.success) {
          setPlans(plans.map(p => p.id === editingPlan.id ? { ...p, ...editedPlanData } as SubscriptionPlan : p));
          toast.success(`${editingPlan.name} updated`);
        }
      }
      if (result.error) throw new Error(result.error);
      setEditingPlan(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save');
    } finally {
      setSaving(null);
    }
  };

  const handleDeletePlan = async (id: string) => {
    if (id === 'new') {
      setEditingPlan(null);
      return;
    }
    setSaving(id);
    try {
      const result = await deleteSubscriptionPlan(id);
      if (result.error) throw new Error(result.error);
      
      setPlans(plans.filter(p => p.id !== id));
      setEditingPlan(null);
      toast.success('Plan deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete plan');
    } finally {
      setSaving(null);
    }
  };

  const handleSaveSettings = async () => {
    setSaving('settings');
    try {
      const result = await updatePlatformSettings(platformSettings);
      if (result.error) throw new Error(result.error);
      toast.success('Platform settings updated');
    } catch (error: any) {
      toast.error(error.message || 'Failed to save settings');
    } finally {
      setSaving(null);
    }
  };

  const handleQRUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSaving('qr_upload');
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `payment-qr-${Date.now()}.${fileExt}`;
      const filePath = `settings/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('platform')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('platform')
        .getPublicUrl(filePath);

      setPlatformSettings({ ...platformSettings, qr_code_url: publicUrl });
      toast.success('QR Code uploaded to storage');
    } catch (error: any) {
      console.error('QR Upload error:', error);
      toast.error(error.message || 'Failed to upload QR');
    } finally {
      setSaving(null);
    }
  };

  const handleUpdateUserPlan = async (userId: string, plan: SubscriptionPlan | null) => {
    setSaving(userId);
    try {
      const planData = {
        is_premium: plan !== null,
        premium_plan: plan ? plan.name : null,
        premium_plan_id: plan ? plan.id : null
      };

      const result = await updateUserPlan(userId, planData);
      if (result.error) throw new Error(result.error);

      setUsers(users.map(u => u.id === userId ? { ...u, ...planData } : u));
      toast.success('User plan updated');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update user');
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin CMS</h1>
          <p className="text-gray-500">Manage static pages, plans, users, and global settings</p>
        </div>
      </div>

      <Tabs defaultValue="pages" className="w-full">
        <TabsList className="grid w-full grid-cols-5 max-w-3xl">
          <TabsTrigger value="pages" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Pages
          </TabsTrigger>
          <TabsTrigger value="plans" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Plans
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <UsersIcon className="w-4 h-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="blog" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Blog
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pages" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Pages</CardTitle>
                </CardHeader>
                <CardContent className="p-2 space-y-1">
                  {pages.map((page) => (
                    <button
                      key={page.id}
                      onClick={() => handleEditPage(page)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center justify-between ${
                        editingPage?.id === page.id ? 'bg-primary text-white' : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{page.title}</span>
                        <span className="text-xs opacity-70">/{page.slug}</span>
                      </div>
                      <Edit3 className="w-4 h-4 opacity-50" />
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>
            <div className="md:col-span-2">
              {editingPage ? (
                <Card className="h-full border-primary/20">
                  <CardHeader className="flex flex-row items-center justify-between border-b bg-gray-50">
                    <CardTitle className="text-xl">Editing: {editingPage.title}</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingPage(null)}>Cancel</Button>
                      <Button size="sm" onClick={handleSavePage} disabled={!!saving}>
                        {saving === editingPage.id ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        Save
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className="w-full min-h-[500px] p-6 font-mono text-sm border-none focus:outline-none"
                    />
                  </CardContent>
                </Card>
              ) : (
                <div className="h-96 flex flex-col items-center justify-center border-2 border-dashed rounded-lg text-gray-400">
                  <FileText className="w-12 h-12 mb-2" />
                  <p>Select a page to edit</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="plans" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1 space-y-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle className="text-lg">Subscription Plans</CardTitle>
                  <Button size="icon" variant="ghost" onClick={handleAddNewPlan} title="Add New Plan">
                    <Plus className="w-4 h-4" />
                  </Button>
                </CardHeader>
                <CardContent className="p-2 space-y-1">
                  {plans.map((plan) => (
                    <button
                      key={plan.id}
                      onClick={() => handleEditPlan(plan)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center justify-between ${
                        editingPlan?.id === plan.id ? 'bg-primary text-white' : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{plan.name}</span>
                        <span className="text-xs opacity-70">₹{plan.price} / {plan.billing_period}</span>
                      </div>
                      {plan.is_popular && <Star className="w-4 h-4 text-amber-400 fill-current" />}
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>
            <div className="md:col-span-2">
              {editingPlan ? (
                <Card className="h-full border-primary/20 shadow-lg">
                  <CardHeader className="flex flex-row items-center justify-between border-b bg-gray-50">
                    <div>
                      <CardTitle className="text-xl">
                        {editingPlan.id === 'new' ? 'Creating New Plan' : `Editing Plan: ${editingPlan.name}`}
                      </CardTitle>
                      <CardDescription>Update pricing, features, and plan visibility</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {editingPlan.id !== 'new' && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the <strong>{editingPlan.name}</strong> plan.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeletePlan(editingPlan.id)}
                                className="bg-red-500 hover:bg-red-600"
                              >
                                Delete Plan
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                      <Button variant="outline" size="sm" onClick={() => setEditingPlan(null)}>Cancel</Button>
                      <Button size="sm" onClick={handleSavePlan} disabled={!!saving}>
                        {saving === editingPlan.id ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        {editingPlan.id === 'new' ? 'Create Plan' : 'Save Plan'}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Plan Name</label>
                        <input 
                          type="text" 
                          value={editedPlanData.name || ''} 
                          onChange={(e) => setEditedPlanData({...editedPlanData, name: e.target.value})}
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-semibold">Price (₹)</label>
                        <input 
                          type="number" 
                          step="1"
                          value={editedPlanData.price || 0} 
                          onChange={(e) => setEditedPlanData({...editedPlanData, price: parseFloat(e.target.value)})}
                          className="w-full p-2 border rounded-md"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Description</label>
                      <input 
                        type="text" 
                        value={editedPlanData.description || ''} 
                        onChange={(e) => setEditedPlanData({...editedPlanData, description: e.target.value})}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Features (JSON Array)</label>
                      <textarea 
                        value={typeof editedPlanData.features === 'string' ? editedPlanData.features : JSON.stringify(editedPlanData.features, null, 2)} 
                        onChange={(e) => {
                          try {
                            const parsed = JSON.parse(e.target.value);
                            setEditedPlanData({...editedPlanData, features: parsed});
                          } catch (err) {
                            setEditedPlanData({...editedPlanData, features: e.target.value});
                          }
                        }}
                        className="w-full h-40 p-3 font-mono text-xs border rounded-md"
                      />
                    </div>
                    <div className="flex items-center gap-6 pt-4 border-t">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={editedPlanData.is_popular} 
                          onChange={(e) => setEditedPlanData({...editedPlanData, is_popular: e.target.checked})}
                        />
                        <span className="text-sm">Mark as Popular</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={editedPlanData.is_active} 
                          onChange={(e) => setEditedPlanData({...editedPlanData, is_active: e.target.checked})}
                        />
                        <span className="text-sm">Active Plan</span>
                      </label>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="h-96 flex flex-col items-center justify-center border-2 border-dashed rounded-lg text-gray-400">
                  <CreditCard className="w-12 h-12 mb-2" />
                  <p>Select a plan to manage pricing</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader className="border-b bg-gray-50 flex flex-row items-center justify-between">
              <div>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Upgrade or downgrade user subscription plans</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search by email or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium border-b">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Current Status</th>
                    <th className="px-6 py-4">Plan Actions</th>
                    <th className="px-6 py-4 text-right">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-400">
                        {searchQuery ? 'No users found matching your search' : 'No users registered yet'}
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-900">{user.first_name} {user.last_name}</span>
                            <span className="text-xs text-gray-500">{user.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {user.is_premium ? (
                            <div className="flex items-center gap-2">
                              <Badge className="bg-green-500 text-white">Premium</Badge>
                              <span className="text-xs font-medium text-gray-600">{user.premium_plan}</span>
                            </div>
                          ) : (
                            <Badge variant="outline" className="text-gray-400">Free</Badge>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {/* Downgrade/Remove Plan */}
                            {user.is_premium && (
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => handleUpdateUserPlan(user.id, null)}
                                disabled={saving === user.id}
                              >
                                {saving === user.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <ShieldX className="w-3 h-3 mr-1" />}
                                Downgrade to Free
                              </Button>
                            )}
                            
                            {/* Upgrade to Plans */}
                            <div className="flex items-center gap-1">
                              {plans.filter(p => p.price > 0 && p.name !== user.premium_plan).map((plan) => (
                                <Button 
                                  key={plan.id}
                                  variant="secondary" 
                                  size="sm" 
                                  className="text-xs"
                                  onClick={() => handleUpdateUserPlan(user.id, plan)}
                                  disabled={saving === user.id}
                                >
                                  {user.is_premium ? `Switch to ${plan.name}` : `Upgrade to ${plan.name}`}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right text-gray-500 text-xs">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <div className="max-w-2xl mx-auto">
            <Card className="border-primary/20 shadow-lg">
              <CardHeader className="bg-gray-50 border-b">
                <div className="flex items-center gap-2">
                  <QrCode className="w-5 h-5 text-primary" />
                  <CardTitle>Payment Settings</CardTitle>
                </div>
                <CardDescription>Configure global payment details for QR scans</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Payment QR Code</label>
                    <div className="flex gap-4 items-center">
                      <div className="flex-1">
                        <input 
                          type="text" 
                          value={platformSettings.qr_code_url || ''} 
                          readOnly
                          className="w-full p-2 border rounded-md bg-gray-50 text-xs font-mono"
                          placeholder="No QR uploaded"
                        />
                      </div>
                      <div className="flex-shrink-0">
                        <input
                          type="file"
                          id="qr-upload"
                          className="hidden"
                          accept="image/*"
                          onChange={handleQRUpload}
                          disabled={saving === 'qr_upload'}
                        />
                        <Button 
                          asChild
                          variant="outline"
                          disabled={saving === 'qr_upload'}
                        >
                          <label htmlFor="qr-upload" className="cursor-pointer">
                            {saving === 'qr_upload' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                            Upload New QR
                          </label>
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold">UPI ID (Optional Display)</label>
                    <input 
                      type="text" 
                      value={platformSettings.upipay_id || ''} 
                      onChange={(e) => setPlatformSettings({...platformSettings, upipay_id: e.target.value})}
                      className="w-full p-2 border rounded-md"
                      placeholder="e.g. admin@okaxis"
                    />
                  </div>

                  <div className="pt-4 border-t flex justify-end">
                    <Button onClick={handleSaveSettings} disabled={saving === 'settings'}>
                      {saving === 'settings' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                      Save Settings
                    </Button>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <Star className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-amber-900">Preview</h4>
                    <p className="text-sm text-amber-800 mb-4">This is what users will see when they scan to pay.</p>
                    <div className="bg-white p-4 rounded border shadow-sm w-fit mx-auto">
                      <div className="w-48 h-48 bg-gray-100 flex items-center justify-center border-2 border-dashed rounded overflow-hidden">
                        {platformSettings.qr_code_url ? (
                          <img src={platformSettings.qr_code_url} alt="QR Preview" className="w-full h-full object-contain" />
                        ) : (
                          <QrCode className="w-12 h-12 text-gray-300" />
                        )}
                      </div>
                      <div className="mt-2 text-center text-xs font-mono">{platformSettings.upipay_id || 'no-upi-id'}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="blog" className="mt-6">
          <Card className="p-12 text-center">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <CardTitle className="text-gray-400 mb-2">Blog Management Coming Soon</CardTitle>
            <p className="text-gray-500">The blog management interface is currently under development.</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
