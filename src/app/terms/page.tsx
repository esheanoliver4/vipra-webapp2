import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = {
  title: 'Terms of Service | VipraPariwar',
  description: 'Terms of Service for VipraPariwar - Brahmin Matrimony Platform',
}

export default function TermsPage() {
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
          <h1 className="text-4xl font-bold text-orange-700 mb-6">Terms of Service</h1>
          <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="prose prose-lg max-w-none space-y-6 text-gray-700">
            <section>
              <h2 className="text-2xl font-semibold text-orange-600 mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using VipraPariwar, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-orange-600 mb-4">2. Use License</h2>
              <p>
                Permission is granted to temporarily use VipraPariwar for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to reverse engineer any software contained on VipraPariwar</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-orange-600 mb-4">3. User Accounts</h2>
              <p>
                You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-orange-600 mb-4">4. User Conduct</h2>
              <p>You agree to use VipraPariwar only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the platform.</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-orange-600 mb-4">5. Privacy</h2>
              <p>
                Your use of VipraPariwar is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-orange-600 mb-4">6. Limitation of Liability</h2>
              <p>
                VipraPariwar shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-orange-600 mb-4">7. Changes to Terms</h2>
              <p>
                VipraPariwar reserves the right to revise these terms of service at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-orange-600 mb-4">8. Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us through the platform.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
