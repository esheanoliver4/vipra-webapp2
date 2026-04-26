'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function AdminUserViewPage() {
  const params = useParams()
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Admin
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>User Details - {params.id}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">User management feature coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
