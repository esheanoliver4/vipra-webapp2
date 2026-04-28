'use client';

import { usePathname } from 'next/navigation';
import LandingNavbar from './navbars/LandingNavbar';
import UserNavbar from './navbars/UserNavbar';
import AdminNavbar from './navbars/AdminNavbar';

export default function Navbar() {
  const pathname = usePathname();

  // 1. Hide navbar entirely on auth pages
  if (
    pathname?.includes('/login') || 
    pathname?.includes('/register') || 
    pathname?.includes('/forgot-password') || 
    pathname?.includes('/reset-password')
  ) {
    return null;
  }

  // 2. Admin Navbar for all /admin routes
  if (pathname?.startsWith('/admin')) {
    return <AdminNavbar />;
  }

  // 3. User Navbar for all dashboard and logged-in features
  const userRoutes = [
    '/browse',
    '/dashboard', 
    '/messages', 
    '/connections', 
    '/edit-profile', 
    '/settings', 
    '/profile',
    '/approval-pending'
  ];
  if (userRoutes.some(route => pathname?.startsWith(route))) {
    return <UserNavbar />;
  }

  // 4. Landing Navbar for public pages (/, /browse, /pricing)
  return <LandingNavbar />;
}
