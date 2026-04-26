'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, Edit2, Award, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface SuccessStory {
  id: string;
  title: string;
  couple_name: string;
  description: string;
  story_content: string;
  couple_image?: string;
  match_date?: string;
  wedding_date?: string;
  published: boolean;
  featured: boolean;
  views: number;
  created_at: string;
}

export default function SuccessStoriesCMS() {
  const [stories, setStories] = useState<SuccessStory[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    couple_name: '',
    description: '',
    story_content: '',
    couple_image: '',
    match_date: '',
    wedding_date: '',
    published: false,
    featured: false,
  });

  useEffect(() => {
    loadSuccessStories();
  }, []);

  const loadSuccessStories = async () => {
    try {
      setLoading(true);
      // Mock data
      setStories([
        {
          id: '1',
          title: 'A Match Made in Heaven',
          couple_name: 'Rajesh & Priya',
          description: 'How they met and found their soulmate',
          story_content: 'Their beautiful journey...',
          published: true,
          featured: true,
          views: 456,
          created_at: '2024-03-10',
        },
      ]);
    } catch (error) {
      toast.error('Failed to load success stories');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveStory = async () => {
    if (!formData.title || !formData.couple_name || !formData.story_content) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingId) {
        setStories(stories.map(s =>
          s.id === editingId
            ? { ...s, ...formData, updated_at: new Date().toISOString() }
            : s
        ));
        toast.success('Success story updated!');
      } else {
        const newStory: SuccessStory = {
          id: Date.now().toString(),
          ...formData,
          views: 0,
          created_at: new Date().toISOString(),
        };
        setStories([newStory, ...stories]);
        toast.success('Success story created!');
      }

      resetForm();
      setIsOpen(false);
    } catch (error) {
      toast.error('Failed to save success story');
    }
  };

  const handleDeleteStory = (id: string) => {
    setStories(stories.filter(s => s.id !== id));
    toast.success('Success story deleted!');
  };

  const handleEditStory = (story: SuccessStory) => {
    setFormData({
      title: story.title,
      couple_name: story.couple_name,
      description: story.description,
      story_content: story.story_content,
      couple_image: story.couple_image || '',
      match_date: story.match_date || '',
      wedding_date: story.wedding_date || '',
      published: story.published,
      featured: story.featured,
    });
    setEditingId(story.id);
    setIsOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      couple_name: '',
      description: '',
      story_content: '',
      couple_image: '',
      match_date: '',
      wedding_date: '',
      published: false,
      featured: false,
    });
    setEditingId(null);
  };

  const togglePublish = (id: string) => {
    setStories(stories.map(s =>
      s.id === id ? { ...s, published: !s.published } : s
    ));
  };

  const toggleFeatured = (id: string) => {
    setStories(stories.map(s =>
      s.id === id ? { ...s, featured: !s.featured } : s
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Award className="w-6 h-6" />
            Success Stories
          </h2>
          <p className="text-muted-foreground mt-1">Share and manage success stories</p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => resetForm()}
              className="bg-gradient-to-r from-primary to-secondary text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Story
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit Success Story' : 'Add Success Story'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="title">Story Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., A Match Made in Heaven"
                  className="rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="couple">Couple Name *</Label>
                  <Input
                    id="couple"
                    value={formData.couple_name}
                    onChange={(e) => setFormData({ ...formData, couple_name: e.target.value })}
                    placeholder="e.g., Rajesh & Priya"
                    className="rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Couple Image URL</Label>
                  <Input
                    id="image"
                    value={formData.couple_image}
                    onChange={(e) => setFormData({ ...formData, couple_image: e.target.value })}
                    placeholder="https://..."
                    className="rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="matchDate">Match Date</Label>
                  <Input
                    id="matchDate"
                    type="date"
                    value={formData.match_date}
                    onChange={(e) => setFormData({ ...formData, match_date: e.target.value })}
                    className="rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weddingDate">Wedding Date</Label>
                  <Input
                    id="weddingDate"
                    type="date"
                    value={formData.wedding_date}
                    onChange={(e) => setFormData({ ...formData, wedding_date: e.target.value })}
                    className="rounded-lg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description..."
                  className="rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="story">Their Story *</Label>
                <Textarea
                  id="story"
                  value={formData.story_content}
                  onChange={(e) => setFormData({ ...formData, story_content: e.target.value })}
                  placeholder="Tell their beautiful story..."
                  className="rounded-lg min-h-40"
                />
              </div>

              <div className="flex gap-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="published"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4 rounded"
                  />
                  <Label htmlFor="published" className="cursor-pointer">Publish</Label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded"
                  />
                  <Label htmlFor="featured" className="cursor-pointer">Feature on Homepage</Label>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button onClick={handleSaveStory} className="flex-1 bg-primary text-white">
                  {editingId ? 'Update Story' : 'Create Story'}
                </Button>
                <Button onClick={() => setIsOpen(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stories Table */}
      <Card className="rounded-xl overflow-hidden">
        <CardContent className="p-0">
          {stories.length === 0 ? (
            <div className="text-center py-12">
              <Award className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">No success stories yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Title</TableHead>
                    <TableHead>Couple</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Views</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {stories.map((story) => (
                      <motion.tr
                        key={story.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-muted/30 border-b"
                      >
                        <TableCell>
                          <div>
                            <p className="font-medium">{story.title}</p>
                            {story.featured && (
                              <Badge className="bg-amber-100 text-amber-800 mt-1" variant="outline">
                                <Star className="w-3 h-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{story.couple_name}</TableCell>
                        <TableCell>
                          <Badge
                            className={story.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                          >
                            {story.published ? 'Published' : 'Draft'}
                          </Badge>
                        </TableCell>
                        <TableCell>{story.views}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditStory(story)}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => toggleFeatured(story.id)}
                              className={story.featured ? 'text-amber-600' : 'text-muted-foreground'}
                            >
                              <Star className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => togglePublish(story.id)}
                              className="text-blue-600"
                            >
                              {story.published ? 'Hide' : 'Publish'}
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteStory(story.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
