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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Edit2, Calendar, Newspaper } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  image_url?: string;
  registration_link?: string;
  published: boolean;
  created_at: string;
}

interface News {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  published: boolean;
  featured: boolean;
  views: number;
  created_at: string;
}

export default function EventsNewsCMS() {
  const [events, setEvents] = useState<Event[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'events' | 'news'>('events');
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    event_date: '',
    location: '',
    image_url: '',
    registration_link: '',
    published: false,
  });
  const [newsForm, setNewsForm] = useState({
    title: '',
    content: '',
    image_url: '',
    published: false,
    featured: false,
  });

  useEffect(() => {
    loadEventsAndNews();
  }, []);

  const loadEventsAndNews = async () => {
    try {
      // Mock events
      setEvents([
        {
          id: '1',
          title: 'Annual VipraPariwaar Meetup',
          description: 'Join us for our annual community meetup',
          event_date: '2024-04-15',
          location: 'Mumbai, India',
          published: true,
          created_at: '2024-03-10',
        },
      ]);

      // Mock news
      setNews([
        {
          id: '1',
          title: 'VipraPariwaar Reaches 10,000 Members!',
          content: 'We are proud to announce...',
          published: true,
          featured: true,
          views: 234,
          created_at: '2024-03-15',
        },
      ]);
    } catch (error) {
      toast.error('Failed to load events and news');
    }
  };

  // Event Handlers
  const handleSaveEvent = async () => {
    if (!eventForm.title || !eventForm.description || !eventForm.event_date || !eventForm.location) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingId && activeTab === 'events') {
        setEvents(events.map(e =>
          e.id === editingId
            ? { ...e, ...eventForm }
            : e
        ));
        toast.success('Event updated!');
      } else {
        const newEvent: Event = {
          id: Date.now().toString(),
          ...eventForm,
          created_at: new Date().toISOString(),
        };
        setEvents([newEvent, ...events]);
        toast.success('Event created!');
      }

      resetEventForm();
      setIsOpen(false);
    } catch (error) {
      toast.error('Failed to save event');
    }
  };

  const resetEventForm = () => {
    setEventForm({
      title: '',
      description: '',
      event_date: '',
      location: '',
      image_url: '',
      registration_link: '',
      published: false,
    });
    setEditingId(null);
  };

  // News Handlers
  const handleSaveNews = async () => {
    if (!newsForm.title || !newsForm.content) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      if (editingId && activeTab === 'news') {
        setNews(news.map(n =>
          n.id === editingId
            ? { ...n, ...newsForm }
            : n
        ));
        toast.success('News updated!');
      } else {
        const newNews: News = {
          id: Date.now().toString(),
          ...newsForm,
          views: 0,
          created_at: new Date().toISOString(),
        };
        setNews([newNews, ...news]);
        toast.success('News created!');
      }

      resetNewsForm();
      setIsOpen(false);
    } catch (error) {
      toast.error('Failed to save news');
    }
  };

  const resetNewsForm = () => {
    setNewsForm({
      title: '',
      content: '',
      image_url: '',
      published: false,
      featured: false,
    });
    setEditingId(null);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
    toast.success('Event deleted!');
  };

  const handleDeleteNews = (id: string) => {
    setNews(news.filter(n => n.id !== id));
    toast.success('News deleted!');
  };

  const toggleEventPublish = (id: string) => {
    setEvents(events.map(e =>
      e.id === id ? { ...e, published: !e.published } : e
    ));
  };

  const toggleNewsPublish = (id: string) => {
    setNews(news.map(n =>
      n.id === id ? { ...n, published: !n.published } : n
    ));
  };

  const toggleNewsFeatured = (id: string) => {
    setNews(news.map(n =>
      n.id === id ? { ...n, featured: !n.featured } : n
    ));
  };

  return (
    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'events' | 'news')} className="w-full space-y-6">
      <TabsList className="grid w-full grid-cols-2 bg-muted">
        <TabsTrigger value="events" className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Events
        </TabsTrigger>
        <TabsTrigger value="news" className="flex items-center gap-2">
          <Newspaper className="w-4 h-4" />
          News
        </TabsTrigger>
      </TabsList>

      {/* Events Tab */}
      <TabsContent value="events" className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              Events Management
            </h2>
            <p className="text-muted-foreground mt-1">Create and manage community events</p>
          </div>
          <Dialog open={isOpen && activeTab === 'events'} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  resetEventForm();
                  setActiveTab('events');
                }}
                className="bg-gradient-to-r from-primary to-secondary text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Event
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Event</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="etitle">Title *</Label>
                  <Input
                    id="etitle"
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    placeholder="Event title"
                    className="rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edesc">Description *</Label>
                  <Textarea
                    id="edesc"
                    value={eventForm.description}
                    onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                    placeholder="Event description"
                    className="rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edate">Event Date *</Label>
                    <Input
                      id="edate"
                      type="date"
                      value={eventForm.event_date}
                      onChange={(e) => setEventForm({ ...eventForm, event_date: e.target.value })}
                      className="rounded-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="eloc">Location *</Label>
                    <Input
                      id="eloc"
                      value={eventForm.location}
                      onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                      placeholder="City, Country"
                      className="rounded-lg"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="eimg">Image URL</Label>
                  <Input
                    id="eimg"
                    value={eventForm.image_url}
                    onChange={(e) => setEventForm({ ...eventForm, image_url: e.target.value })}
                    placeholder="https://..."
                    className="rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ereg">Registration Link</Label>
                  <Input
                    id="ereg"
                    value={eventForm.registration_link}
                    onChange={(e) => setEventForm({ ...eventForm, registration_link: e.target.value })}
                    placeholder="https://..."
                    className="rounded-lg"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="epub"
                    checked={eventForm.published}
                    onChange={(e) => setEventForm({ ...eventForm, published: e.target.checked })}
                    className="w-4 h-4 rounded"
                  />
                  <Label htmlFor="epub" className="cursor-pointer">Publish event</Label>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button onClick={handleSaveEvent} className="flex-1 bg-primary text-white">
                    Create Event
                  </Button>
                  <Button onClick={() => setIsOpen(false)} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Events Table */}
        <Card className="rounded-xl overflow-hidden">
          <CardContent className="p-0">
            {events.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">No events yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Title</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {events.map((event) => (
                        <motion.tr
                          key={event.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="hover:bg-muted/30 border-b"
                        >
                          <TableCell className="font-medium">{event.title}</TableCell>
                          <TableCell>{new Date(event.event_date).toLocaleDateString()}</TableCell>
                          <TableCell>{event.location}</TableCell>
                          <TableCell>
                            <Badge className={event.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                              {event.published ? 'Published' : 'Draft'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button size="sm" variant="ghost"><Edit2 className="w-4 h-4" /></Button>
                            <Button size="sm" variant="ghost" onClick={() => toggleEventPublish(event.id)} className="text-blue-600">
                              {event.published ? 'Hide' : 'Publish'}
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDeleteEvent(event.id)} className="text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </Button>
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
      </TabsContent>

      {/* News Tab */}
      <TabsContent value="news" className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Newspaper className="w-6 h-6" />
              News Management
            </h2>
            <p className="text-muted-foreground mt-1">Create and manage news articles</p>
          </div>
          <Dialog open={isOpen && activeTab === 'news'} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  resetNewsForm();
                  setActiveTab('news');
                }}
                className="bg-gradient-to-r from-primary to-secondary text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Article
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create News Article</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="ntitle">Title *</Label>
                  <Input
                    id="ntitle"
                    value={newsForm.title}
                    onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                    placeholder="Article title"
                    className="rounded-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ncontent">Content *</Label>
                  <Textarea
                    id="ncontent"
                    value={newsForm.content}
                    onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                    placeholder="Article content"
                    className="rounded-lg min-h-40"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nimg">Image URL</Label>
                  <Input
                    id="nimg"
                    value={newsForm.image_url}
                    onChange={(e) => setNewsForm({ ...newsForm, image_url: e.target.value })}
                    placeholder="https://..."
                    className="rounded-lg"
                  />
                </div>

                <div className="flex gap-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="npub"
                      checked={newsForm.published}
                      onChange={(e) => setNewsForm({ ...newsForm, published: e.target.checked })}
                      className="w-4 h-4 rounded"
                    />
                    <Label htmlFor="npub" className="cursor-pointer">Publish</Label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="nfeat"
                      checked={newsForm.featured}
                      onChange={(e) => setNewsForm({ ...newsForm, featured: e.target.checked })}
                      className="w-4 h-4 rounded"
                    />
                    <Label htmlFor="nfeat" className="cursor-pointer">Feature</Label>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <Button onClick={handleSaveNews} className="flex-1 bg-primary text-white">
                    Create Article
                  </Button>
                  <Button onClick={() => setIsOpen(false)} variant="outline" className="flex-1">
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* News Table */}
        <Card className="rounded-xl overflow-hidden">
          <CardContent className="p-0">
            {news.length === 0 ? (
              <div className="text-center py-12">
                <Newspaper className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">No news articles yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {news.map((item) => (
                        <motion.tr
                          key={item.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="hover:bg-muted/30 border-b"
                        >
                          <TableCell className="font-medium">{item.title}</TableCell>
                          <TableCell>
                            <Badge className={item.published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                              {item.published ? 'Published' : 'Draft'}
                            </Badge>
                          </TableCell>
                          <TableCell>{item.views}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Button size="sm" variant="ghost"><Edit2 className="w-4 h-4" /></Button>
                            <Button size="sm" variant="ghost" onClick={() => toggleNewsFeatured(item.id)} className={item.featured ? 'text-amber-600' : ''}>
                              ★
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => toggleNewsPublish(item.id)} className="text-blue-600">
                              {item.published ? 'Hide' : 'Publish'}
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDeleteNews(item.id)} className="text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </Button>
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
      </TabsContent>
    </Tabs>
  );
}
