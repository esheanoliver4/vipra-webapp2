// User type for Supabase
export type User = {
  id: string
  email: string
  full_name?: string
  age?: number
  gender?: string
  location?: string
  caste?: string
  occupation?: string
  education?: string
  height?: string
  profile_photo?: string
  bio?: string
  religion?: string
  mother_tongue?: string
  created_at?: string
  updated_at?: string
  profile_id?: string | null
}

// Connection type for tracking interactions between users
export interface Connection {
  id: string
  from_user_id: string
  to_user_id: string
  status: 'pending' | 'accepted' | 'rejected'
  message?: string
  created_at: Date
}

// This file uses Supabase client functions instead of Prisma
// All database operations are in /lib/actions/
