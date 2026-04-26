'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

export default function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-red-50 to-pink-50 border-b border-red-100 sticky top-0 z-50 shadow-lg transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="text-xl sm:text-2xl font-bold transition-all duration-300 text-gradient-red-pink">
              VipraPariwaar
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex desktop-nav-container items-center justify-end gap-4 flex-1">
            <Link href="/browse">
              <Button variant="ghost" className="text-sm font-bold text-slate-800 hover:text-red-600 hover:bg-white/50">
                Browse
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="ghost" className="text-sm font-bold text-slate-800 hover:text-red-600 hover:bg-white/50">
                Pricing
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="text-sm font-bold px-6 border-red-600 text-red-600 bg-white hover:bg-red-50 shadow-sm">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button className="font-bold px-8 shadow-md bg-red-600 text-white hover:bg-red-700">
                Sign Up Free
              </Button>
            </Link>
          </div>

          {/* Mobile Navigation Toggle + Quick Actions */}
          <div className="sm:hidden flex mobile-nav-container items-center gap-2">
            <Link href="/login">
              <Button variant="outline" size="sm" className="text-xs font-bold px-3 border-red-600 text-red-600 bg-white">
                Login
              </Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="text-xs font-bold px-3 bg-red-600 text-white shadow-sm">
                Sign Up
              </Button>
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-800 p-1 ml-1 focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="sm:hidden pb-6 space-y-3 px-4 animate-fadeIn bg-white border-t border-red-100 mt-2 rounded-b-xl shadow-lg">
            <Link href="/browse" onClick={() => setIsOpen(false)}>
              <Button variant="ghost" className="w-full justify-start text-lg text-slate-800 hover:bg-red-50 hover:text-red-600 mt-2">
                Browse
              </Button>
            </Link>
            <Link href="/pricing" onClick={() => setIsOpen(false)}>
              <Button variant="ghost" className="w-full justify-start text-lg text-slate-800 hover:bg-red-50 hover:text-red-600">
                Pricing
              </Button>
            </Link>
            <div className="pt-4 space-y-3">
              <Link href="/login" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full border-red-600 text-red-600 bg-white hover:bg-red-50 text-lg h-12 shadow-sm">
                  Login
                </Button>
              </Link>
              <Link href="/register" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white text-lg h-12 shadow-md">
                  Sign Up Free
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
