import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getStaticPageBySlug } from '@/lib/actions/cms'

export const metadata: Metadata = {
  title: 'Terms of Service | VipraPariwar',
  description: 'Terms of Service for VipraPariwar - Brahmin Matrimony Platform',
}

export default async function TermsPage() {
  const { data: pageData } = await getStaticPageBySlug('terms-of-service');
  
  const content = pageData?.content || `
    <section>
      <h2 className="text-2xl font-semibold text-orange-600 mb-4">1. Acceptance of Terms</h2>
      <p>By accessing and using VipraPariwar, you accept and agree to be bound by the terms and provision of this agreement.</p>
    </section>
    <section>
      <h2 className="text-2xl font-semibold text-orange-600 mb-4">2. Use License</h2>
      <p>Permission is granted to use VipraPariwar for personal, non-commercial matrimony purposes only.</p>
    </section>
  `;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-6">
          <Button
            variant="outline"
            asChild
            className="border-orange-200 text-orange-700 hover:bg-orange-50"
          >
            <Link href="/login" className="flex items-center space-x-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Login</span>
            </Link>
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          <h1 className="text-4xl font-bold text-orange-700 mb-6">{pageData?.title || 'Terms of Service'}</h1>
          <p className="text-gray-600 mb-8">
            Last updated: {pageData?.updated_at ? new Date(pageData.updated_at).toLocaleDateString() : new Date().toLocaleDateString()}
          </p>

          <div 
            className="prose prose-lg max-w-none space-y-6 text-gray-700"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </div>
  )
}
