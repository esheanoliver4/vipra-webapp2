'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Menu, X, LogOut, Heart, MessageCircle, Settings, Shield } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { signOut } from '@/lib/actions/auth';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string>('user');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    try {
      // Only create client inside useEffect
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn('[v0] Supabase environment variables not configured');
        setLoading(false);
        return;
      }
      
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      // Fetch user role
      if (user?.email) {
        try {
          const response = await fetch(`/api/users/role?email=${user.email}`);
          if (response.ok) {
            const data = await response.json();
            setUserRole(data.role || 'user');
          }
        } catch (error) {
          console.error('[v0] Error fetching user role:', error);
        }
      }
    } catch (error) {
      console.error('[v0] Error checking user:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await signOut();
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }

  // Don't show navbar on auth pages
  if (pathname?.includes('/login') || pathname?.includes('/register')) {
    return null;
  }

  const isHome = pathname === '/';

  return (
    <nav className={`${isHome ? 'bg-gradient-to-r from-red-50 to-pink-50 border-b border-red-100' : 'bg-gradient-red-pink'} sticky top-0 z-50 shadow-lg transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className={`text-xl sm:text-2xl font-bold transition-all duration-300 ${isHome ? 'text-gradient-red-pink' : 'text-white'}`}>
              VipraPariwaar
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex desktop-nav-container items-center justify-end gap-2 lg:gap-3 flex-1 ml-8">
            {!user ? (
              <>
                <Link href="/browse">
                  <Button variant="ghost" className={`text-sm font-semibold transition-all duration-300 hover:scale-105 ${isHome ? 'text-gray-700 hover:text-red-600' : 'text-white hover:text-white/80'}`}>
                    Browse
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button variant="ghost" className={`text-sm font-semibold transition-all duration-300 hover:scale-105 ${isHome ? 'text-gray-700 hover:text-red-600' : 'text-white hover:text-white/80'}`}>
                    Pricing
                  </Button>
                </Link>
                <div className={`w-px h-6 ${isHome ? 'bg-red-200' : 'bg-white/30'} mx-2`} />
                <Link href="/login">
                  <Button className={`text-sm font-semibold transition-all duration-300 hover-scale ${isHome ? 'bg-white text-red-600 hover:shadow-lg' : 'bg-white/20 text-white border border-white/30 hover:bg-white/30'}`}>
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-white text-red-600 hover:shadow-xl text-sm font-semibold shadow-lg transition-all duration-300 hover-scale">
                    Sign Up
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/browse">
                  <Button variant="ghost" className="text-sm font-semibold text-white hover:bg-white/20 transition-all duration-300">
                    Browse
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="ghost" className="text-sm font-semibold text-white hover:bg-white/20 transition-all duration-300">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/edit-profile">
                  <Button variant="ghost" className="text-sm font-semibold text-white hover:bg-white/20 transition-all duration-300">
                    Edit Profile
                  </Button>
                </Link>
                <Link href="/connections" title="Connections">
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 transition-colors">
                    <Heart className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/messages" title="Messages">
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/settings" title="Settings">
                  <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 transition-colors">
                    <Settings className="w-5 h-5" />
                  </Button>
                </Link>
                {userRole === 'admin' && (
                  <Link href="/admin/dashboard" title="Admin Panel">
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 transition-colors">
                      <Shield className="w-5 h-5" />
                    </Button>
                  </Link>
                )}
                <Button 
                  onClick={handleLogout}
                  variant="ghost"
                  className="text-sm font-semibold text-white hover:bg-white/20 transition-all duration-300"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="sm:hidden flex mobile-nav-container items-center gap-2">
            {user && (
              <>
                <Link href="/connections">
                  <Button variant="ghost" size="icon">
                    <Heart className="w-5 h-5" />
                  </Button>
                </Link>
                <Link href="/messages">
                  <Button variant="ghost" size="icon">
                    <MessageCircle className="w-5 h-5" />
                  </Button>
                </Link>
              </>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="sm:hidden pb-4 space-y-2">
            {!user ? (
              <>
                <Link href="/browse" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    Browse
                  </Button>
                </Link>
                <Link href="/pricing" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    Pricing
                  </Button>
                </Link>
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Sign Up
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/browse" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start font-semibold">
                    Browse
                  </Button>
                </Link>
                <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start font-semibold">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/edit-profile" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start font-semibold">
                    Edit Profile
                  </Button>
                </Link>
                <Link href="/settings" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start font-semibold">
                    Settings
                  </Button>
                </Link>
                {userRole === 'admin' && (
                  <Link href="/admin/dashboard" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start font-semibold text-red-600">
                      <Shield className="w-4 h-4 mr-2" />
                      Admin Dashboard
                    </Button>
                  </Link>
                )}
                <Button
                  className="w-full bg-gradient-red-pink text-white font-semibold hover:shadow-lg transition-all duration-300"
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
