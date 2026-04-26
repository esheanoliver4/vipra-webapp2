import { Metadata } from 'next';
import UserManagementDashboard from '@/components/admin/UserManagementDashboard';

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Manage users and approve profiles',
};

export default function AdminDashboardPage() {
  return <UserManagementDashboard />;
}
