import CMSClient from '@/components/admin/CMSClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Content Management | Admin Panel',
  description: 'Manage static pages and blog content',
};

export default function CMSPage() {
  return <CMSClient />;
}
