import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Clock } from 'lucide-react';

export default function ApprovalPendingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Clock className="h-16 w-16 text-orange-600 animate-bounce" />
            </div>
          </div>
          <CardTitle className="text-2xl">Profile Pending Review</CardTitle>
          <CardDescription className="text-base mt-2">
            Your profile is under review by our admin team
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-orange-50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-gray-900">What happens next?</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-1">✓</span>
                <span>Our team reviews your profile for quality and authenticity</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-1">✓</span>
                <span>You&apos;ll receive an email once your profile is approved</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-600 mt-1">✓</span>
                <span>Approval typically takes 24-48 hours</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">While you wait</h3>
            <p className="text-sm text-gray-600">
              Complete your profile with more details and high-quality photos to increase your chances of making great connections.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Link href="/edit-profile">
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                Complete My Profile
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" className="w-full">
                Back to Dashboard
              </Button>
            </Link>
          </div>

          <p className="text-xs text-center text-gray-500">
            Questions? Contact our support team at support@viprapariwar.com
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
