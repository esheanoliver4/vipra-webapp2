'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Menu, X, LogOut, Shield, Users, LayoutDashboard, Heart, MessageCircle, FileText } from 'lucide-react';
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
            <Link href="/admin/dashboard">
              <Button variant="ghost" className="text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10">
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link href="/admin/cms">
              <Button variant="ghost" className="text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/10">
                <FileText className="w-4 h-4 mr-2" />
                CMS
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
            <Link href="/admin/dashboard" className="block pt-4">
              <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-white/10">
                <LayoutDashboard className="w-5 h-5 mr-2" />
                Dashboard
              </Button>
            </Link>
            <Link href="/admin/cms">
              <Button variant="ghost" className="w-full justify-start text-slate-300 hover:text-white hover:bg-white/10">
                <FileText className="w-5 h-5 mr-2" />
                CMS
              </Button>
            </Link>
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
