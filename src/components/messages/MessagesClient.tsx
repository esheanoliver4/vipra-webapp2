'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, Send, MessageCircle, Search, MoreVertical, Smile, Paperclip } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { sendMessage, getConversations, getConversation } from '@/lib/actions/messaging';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read_at?: string;
}

interface Conversation {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
}

interface UserProfile {
  id: string;
  full_name: string;
  profile_photo?: string;
}

export default function MessagesClient() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfiles, setUserProfiles] = useState<{ [key: string]: UserProfile }>({});
  const supabase = createClient();

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation && currentUser) {
      loadMessages(selectedConversation);
    }
  }, [selectedConversation]);

  async function loadConversations() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUser(user);

      const result = await getConversations();
      if (result.data) {
        setConversations(result.data);

        // Load user profiles
        const userIds = result.data.map((conv) =>
          conv.sender_id === user?.id ? conv.receiver_id : conv.sender_id
        );
        await loadUserProfiles([...new Set(userIds)]);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  }

  async function loadUserProfiles(userIds: string[]) {
    try {
      const { data } = await supabase
        .from('users')
        .select('id, full_name, profile_photo')
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

  async function loadMessages(conversationPartnerId: string) {
    try {
      const result = await getConversation(conversationPartnerId);
      if (result.data) {
        setMessages(result.data);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }

  async function handleSendMessage() {
    if (!messageText.trim() || !selectedConversation) return;

    setSending(true);
    try {
      const result = await sendMessage(selectedConversation, messageText);
      if (result.success) {
        setMessageText('');
        await loadMessages(selectedConversation);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
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
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50/10 dark:via-blue-950/10 to-background py-6 md:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Messages</h1>
          <p className="text-muted-foreground">Connect and chat with your matches</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)] min-h-[500px]">
          {/* Conversations List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <Card className="h-full flex flex-col border border-border/50 shadow-lg rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-border/50 pb-4">
                <div className="flex items-center justify-between mb-4">
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-6 h-6 text-primary" />
                    <span>Conversations</span>
                  </CardTitle>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search conversations..."
                    className="pl-10 h-10"
                  />
                </div>
              </CardHeader>

              <CardContent className="flex-1 overflow-y-auto p-4 space-y-2">
                <AnimatePresence>
                  {conversations.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center h-full text-center py-12"
                    >
                      <MessageCircle className="w-12 h-12 text-muted-foreground/50 mb-4" />
                      <p className="text-muted-foreground">No conversations yet</p>
                      <p className="text-xs text-muted-foreground/70 mt-2">Start by liking a profile</p>
                    </motion.div>
                  ) : (
                    conversations.map((conv, idx) => {
                      const partnerId =
                        conv.sender_id === currentUser?.id
                          ? conv.receiver_id
                          : conv.sender_id;
                      const profile = userProfiles[partnerId];

                      return (
                        <motion.button
                          key={conv.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          onClick={() => setSelectedConversation(partnerId)}
                          className={`w-full text-left p-3 rounded-xl transition-all duration-200 ${
                            selectedConversation === partnerId
                              ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-lg'
                              : 'hover:bg-muted'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                                {profile?.full_name?.[0] || '?'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className={`font-semibold truncate ${selectedConversation === partnerId ? 'text-white' : 'text-foreground'}`}>
                                {profile?.full_name || 'Unknown'}
                              </p>
                              <p className={`text-sm truncate ${selectedConversation === partnerId ? 'text-white/70' : 'text-muted-foreground'}`}>
                                {conv.content}
                              </p>
                            </div>
                          </div>
                        </motion.button>
                      );
                    })
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>

          {/* Messages Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <Card className="h-full flex flex-col border border-border/50 shadow-lg rounded-2xl overflow-hidden">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <CardHeader className="border-b border-border/50 pb-4 flex flex-row items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-primary/20 text-primary font-bold">
                          {userProfiles[selectedConversation]?.full_name?.[0] || '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-foreground">
                          {userProfiles[selectedConversation]?.full_name || 'Chat'}
                        </p>
                        <p className="text-xs text-muted-foreground">Active now</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </CardHeader>

                  {/* Messages Container */}
                  <CardContent className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-background to-muted/20">
                    <AnimatePresence>
                      {messages.map((msg, idx) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          className={`flex ${msg.sender_id === currentUser?.id ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs md:max-w-sm lg:max-w-md px-4 py-3 rounded-2xl ${
                              msg.sender_id === currentUser?.id
                                ? 'bg-gradient-to-r from-primary to-rose-500 text-white shadow-lg'
                                : 'bg-muted/80 text-foreground'
                            }`}
                          >
                            <p className="break-words">{msg.content}</p>
                            <p className={`text-xs mt-2 ${msg.sender_id === currentUser?.id ? 'text-white/70' : 'text-muted-foreground'}`}>
                              {new Date(msg.created_at).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </CardContent>

                  {/* Message Input */}
                  <div className="border-t border-border/50 p-4 bg-background">
                    <div className="flex gap-3 items-end">
                      <Button variant="ghost" size="icon" className="flex-shrink-0">
                        <Paperclip className="w-5 h-5" />
                      </Button>
                      <div className="flex-1 relative">
                        <Input
                          placeholder="Type a message..."
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                          className="pr-10 h-11 rounded-full"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1/2 -translate-y-1/2"
                        >
                          <Smile className="w-5 h-5" />
                        </Button>
                      </div>
                      <Button
                        onClick={handleSendMessage}
                        disabled={sending || !messageText.trim()}
                        className="bg-gradient-to-r from-primary to-rose-500 text-white flex-shrink-0 rounded-full h-11 w-11 p-0"
                      >
                        {sending ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Send className="w-5 h-5" />
                        )}
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <CardContent className="flex items-center justify-center h-full">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                  >
                    <MessageCircle className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground font-medium">
                      Select a conversation to start messaging
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-2">
                      Your matches will appear here
                    </p>
                  </motion.div>
                </CardContent>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
