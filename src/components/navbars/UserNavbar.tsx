'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Menu, X, LogOut, Heart, MessageCircle, Settings, Users, CreditCard } from 'lucide-react';
import { signOut } from '@/lib/actions/auth';
import { toast } from 'sonner';

export default function UserNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  async function handleLogout() {
    try {
      await signOut();
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out');
    }
  }

  return (
    <nav className="bg-gradient-red-pink sticky top-0 z-50 shadow-lg transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center group">
            <div className="text-xl sm:text-2xl font-bold transition-all duration-300 text-white">
              VipraPariwar
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex desktop-nav-container items-center justify-end gap-4 flex-1">
            <Link href="/browse">
              <Button variant="ghost" className="text-sm font-semibold text-white hover:bg-white/20">
                <Users className="w-4 h-4 mr-2" />
                Browse
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost" className="text-sm font-semibold text-white hover:bg-white/20">
                Dashboard
              </Button>
            </Link>
            
            <div className="w-px h-6 bg-white/20 mx-1" />

            <Link href="/connections" title="Connections">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 transition-colors relative">
                <Heart className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/messages" title="Messages">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 transition-colors relative">
                <MessageCircle className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/subscription" title="Subscription">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 transition-colors">
                <CreditCard className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/settings" title="Settings">
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 transition-colors">
                <Settings className="w-5 h-5" />
              </Button>
            </Link>

            <div className="w-px h-6 bg-white/20 mx-1" />

            <Button 
              onClick={handleLogout}
              variant="ghost"
              className="text-sm font-semibold text-white hover:bg-red-500/50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="sm:hidden flex mobile-nav-container items-center gap-2">
            <Link href="/connections">
              <Button variant="ghost" size="icon" className="text-white">
                <Heart className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/messages">
              <Button variant="ghost" size="icon" className="text-white">
                <MessageCircle className="w-5 h-5" />
              </Button>
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white p-2 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="sm:hidden pb-6 space-y-2 px-4 animate-fadeIn bg-white/10 backdrop-blur-md border-t border-white/20 mt-2 rounded-b-xl shadow-lg">
            <Link href="/browse" onClick={() => setIsOpen(false)}>
              <Button variant="ghost" className="w-full justify-start text-lg font-semibold text-white hover:bg-white/20 mt-2">
                <Users className="w-5 h-5 mr-2" />
                Browse Profiles
              </Button>
            </Link>
            <Link href="/dashboard" onClick={() => setIsOpen(false)}>
              <Button variant="ghost" className="w-full justify-start text-lg font-semibold text-white hover:bg-white/20">
                Dashboard
              </Button>
            </Link>
            <Link href="/settings" onClick={() => setIsOpen(false)}>
              <Button variant="ghost" className="w-full justify-start text-lg font-semibold text-white hover:bg-white/20">
                <Settings className="w-5 h-5 mr-2" />
                Settings
              </Button>
            </Link>
            <div className="pt-4 mt-2 border-t border-white/20">
              <Button
                className="w-full bg-white text-red-600 font-bold h-12 shadow-md hover:bg-gray-100"
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
