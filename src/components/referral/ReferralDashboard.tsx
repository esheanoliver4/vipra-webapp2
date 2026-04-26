'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Copy, Gift, Users, TrendingUp, Share2, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface ReferralStats {
  totalReferrals: number;
  successfulReferrals: number;
  totalEarnings: number;
  pendingEarnings: number;
}

interface ReferralRecord {
  id: string;
  referralCode: string;
  refereeName?: string;
  status: 'pending' | 'completed' | 'claimed';
  commission: number;
  createdAt: string;
}

export default function ReferralDashboard({ userId }: { userId: string }) {
  const [referralCode, setReferralCode] = useState('');
  const [stats, setStats] = useState<ReferralStats>({
    totalReferrals: 0,
    successfulReferrals: 0,
    totalEarnings: 0,
    pendingEarnings: 0,
  });
  const [referrals, setReferrals] = useState<ReferralRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReferralData();
  }, [userId]);

  const loadReferralData = async () => {
    try {
      setLoading(true);
      // In a real app, fetch from server
      // For now, generate mock data
      const mockCode = `VIPRA${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      setReferralCode(mockCode);
      
      setStats({
        totalReferrals: 5,
        successfulReferrals: 3,
        totalEarnings: 1500,
        pendingEarnings: 500,
      });

      setReferrals([
        {
          id: '1',
          referralCode: mockCode,
          refereeName: 'Priya Sharma',
          status: 'completed',
          commission: 500,
          createdAt: '2024-03-15',
        },
        {
          id: '2',
          referralCode: mockCode,
          refereeName: 'Rajesh Kumar',
          status: 'pending',
          commission: 500,
          createdAt: '2024-03-10',
        },
      ]);
    } catch (error) {
      toast.error('Failed to load referral data');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast.success('Referral code copied!');
  };

  const handleShareReferral = () => {
    const shareUrl = `${window.location.origin}/register?ref=${referralCode}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Referral link copied!');
  };

  const handleRedeemRewards = async () => {
    try {
      toast.success('Rewards redeemed successfully!');
      setStats(prev => ({ ...prev, totalEarnings: prev.totalEarnings + prev.pendingEarnings, pendingEarnings: 0 }));
    } catch (error) {
      toast.error('Failed to redeem rewards');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
          Earn Rewards
        </h1>
        <p className="text-lg text-muted-foreground">
          Invite friends and earn exciting rewards for every successful match in your network
        </p>
      </motion.div>

      {/* Referral Code Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-primary" />
              Your Referral Code
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Share this code with friends</label>
              <div className="flex gap-2">
                <div className="flex-1 bg-white dark:bg-slate-900 border-2 border-primary/30 rounded-xl p-4 font-mono text-xl font-bold text-primary flex items-center">
                  {referralCode}
                </div>
                <Button
                  onClick={handleCopyCode}
                  size="lg"
                  className="bg-gradient-to-r from-primary to-secondary text-white rounded-xl"
                >
                  <Copy className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={handleShareReferral}
                variant="outline"
                className="rounded-xl h-12 border-primary/30 hover:border-primary"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share Link
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="rounded-xl h-12 border-primary/30 hover:border-primary">
                    <Mail className="w-5 h-5 mr-2" />
                    Email Friends
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Email Your Referral</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <Input placeholder="Friend's email" type="email" />
                    <Input placeholder="Friend's name" />
                    <Button className="w-full bg-primary text-white">Send Invite</Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button
                onClick={() => window.open(`https://twitter.com/intent/tweet?text=Join me on VipraPariwaar! Use code ${referralCode}`)}
                variant="outline"
                className="rounded-xl h-12 border-primary/30 hover:border-primary"
              >
                <Share2 className="w-5 h-5 mr-2" />
                Share on Social
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Users, label: 'Total Referrals', value: stats.totalReferrals, color: 'from-blue-500' },
          { icon: TrendingUp, label: 'Successful Referrals', value: stats.successfulReferrals, color: 'from-green-500' },
          { icon: Gift, label: 'Total Earnings', value: `₹${stats.totalEarnings}`, color: 'from-purple-500' },
          { icon: Zap, label: 'Pending Earnings', value: `₹${stats.pendingEarnings}`, color: 'from-orange-500' },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.1 }}
            >
              <Card className="border border-border/50 rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} to-transparent flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge variant="outline" className="capitalize">{stat.label}</Badge>
                  </div>
                  <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Redeem Button */}
      {stats.pendingEarnings > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <Button
            onClick={handleRedeemRewards}
            size="lg"
            className="bg-gradient-to-r from-primary to-secondary text-white rounded-xl px-8 py-6 text-lg shadow-lg hover:shadow-xl"
          >
            <Gift className="w-5 h-5 mr-2" />
            Redeem ₹{stats.pendingEarnings} Rewards
          </Button>
        </motion.div>
      )}

      {/* Referrals List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-border/30">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-6 h-6" />
              Your Referrals
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {referrals.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">No referrals yet. Start inviting friends!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {referrals.map((referral, idx) => (
                  <motion.div
                    key={referral.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center justify-between p-4 rounded-xl border border-border/50 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{referral.refereeName || 'Pending'}</p>
                      <p className="text-sm text-muted-foreground">Since {referral.createdAt}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className={
                        referral.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : referral.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }>
                        {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                      </Badge>
                      <div className="text-right">
                        <p className="font-bold text-primary">₹{referral.commission}</p>
                        <p className="text-xs text-muted-foreground">Earning</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* How It Works */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-border/30">
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { step: '1', title: 'Share', desc: 'Share your referral code with friends' },
                { step: '2', title: 'Sign Up', desc: 'They sign up using your code' },
                { step: '3', title: 'Earn', desc: 'Earn rewards when they find a match!' },
              ].map((item, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary text-white flex items-center justify-center font-bold mx-auto mb-3">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

// Icon import helper
const Mail = Share2;
