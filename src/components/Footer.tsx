'use client';

import { usePathname } from 'next/navigation';
import ModernFooter from './landing/ModernFooter';

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on auth pages
  if (
    pathname?.includes('/login') || 
    pathname?.includes('/register') || 
    pathname?.includes('/forgot-password') || 
    pathname?.includes('/reset-password')
  ) {
    return null;
  }

  // Hide footer on application pages where screen space is critical
  const appRoutes = [
    '/admin',
    '/dashboard', 
    '/messages', 
    '/connections', 
    '/edit-profile', 
    '/settings',
    '/approval-pending'
  ];
  if (appRoutes.some(route => pathname?.startsWith(route))) {
    return null;
  }

  return <ModernFooter />;
}
