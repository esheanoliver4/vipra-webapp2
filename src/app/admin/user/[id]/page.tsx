import UserDetailClient from './UserDetailClient';

export default async function AdminUserViewPage({ params }: { params: { id: string } }) {
  // Access params.id directly in the page component
  const { id } = await params;
  
  return <UserDetailClient userId={id} />;
}
