'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Menu, X, LogOut, Shield, Users, LayoutDashboard, Heart, MessageCircle } from 'lucide-react';
import { signOut } from '@/lib/actions/auth';
import { toast } from 'sonner';

export default function AdminNavbar() {
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
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/admin/dashboard" className="flex items-center gap-2 group">
            <Shield className="w-6 h-6 text-red-500" />
            <div className="text-xl font-bold text-white">
              Vipra<span className="text-red-500">Admin</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex desktop-nav-container items-center justify-end gap-2 flex-1">
            <Link href="/browse">
              <Button variant="ghost" className="text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800">
                Browse
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="ghost" className="text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800">
                Dashboard
              </Button>
            </Link>
            <Link href="/connections" title="Connections">
              <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white hover:bg-slate-800">
                <Heart className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/messages" title="Messages">
              <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white hover:bg-slate-800">
                <MessageCircle className="w-4 h-4" />
              </Button>
            </Link>
            
            <div className="w-px h-6 bg-slate-700 mx-2" />

            <Link href="/admin/dashboard">
              <Button variant="ghost" className="text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700">
                Admin Panel
              </Button>
            </Link>

            <Button 
              onClick={handleLogout}
              variant="outline"
              className="text-sm font-semibold border-red-500/50 text-red-400 hover:bg-red-500/10 hover:text-red-300 ml-2"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Mobile Navigation Toggle */}
          <div className="sm:hidden flex mobile-nav-container items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-300 p-2 focus:outline-none hover:text-white"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="sm:hidden pb-6 space-y-2 px-4 animate-fadeIn bg-slate-900 border-t border-slate-800 mt-2">
            <Link href="/admin/dashboard" onClick={() => setIsOpen(false)}>
              <Button variant="ghost" className="w-full justify-start text-lg font-semibold text-white hover:bg-slate-800 mt-2">
                <Shield className="w-5 h-5 mr-2 text-red-500" />
                Admin Dashboard
              </Button>
            </Link>
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <Link href="/browse" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-lg font-semibold text-slate-300 hover:text-white hover:bg-slate-800">
                  <Users className="w-5 h-5 mr-2" />
                  Browse Profiles
                </Button>
              </Link>
              <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-lg font-semibold text-slate-300 hover:text-white hover:bg-slate-800">
                  <LayoutDashboard className="w-5 h-5 mr-2" />
                  User Dashboard
                </Button>
              </Link>
              <Link href="/connections" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-lg font-semibold text-slate-300 hover:text-white hover:bg-slate-800">
                  <Heart className="w-5 h-5 mr-2" />
                  Connections
                </Button>
              </Link>
              <Link href="/messages" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-lg font-semibold text-slate-300 hover:text-white hover:bg-slate-800">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Messages
                </Button>
              </Link>
            </div>
            
            <div className="pt-4 mt-2 border-t border-slate-800">
              <Button
                className="w-full bg-transparent border border-red-500/50 text-red-400 font-bold h-12 hover:bg-red-500/10"
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
