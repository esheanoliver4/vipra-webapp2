import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { XCircle } from 'lucide-react';

export default function ApprovalRejectedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <XCircle className="h-16 w-16 text-red-600" />
          </div>
          <CardTitle className="text-2xl">Profile Not Approved</CardTitle>
          <CardDescription className="text-base mt-2">
            Your profile did not meet our community guidelines
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-red-50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-gray-900">Why was it rejected?</h3>
            <p className="text-sm text-gray-600">
              Your profile may have been rejected for reasons including:
            </p>
            <ul className="space-y-2 text-sm text-gray-600 ml-4">
              <li>• Inappropriate or offensive content</li>
              <li>• Photos that don&apos;t meet our guidelines</li>
              <li>• Incomplete or suspicious information</li>
              <li>• Violation of community standards</li>
            </ul>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">What can you do?</h3>
            <p className="text-sm text-gray-600">
              You can update your profile and resubmit it for review. Make sure to provide accurate, respectful, and complete information with appropriate photos.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Link href="/edit-profile">
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                Update Profile & Resubmit
              </Button>
            </Link>
            <Link href="/contact-support">
              <Button variant="outline" className="w-full">
                Contact Support
              </Button>
            </Link>
          </div>

          <p className="text-xs text-center text-gray-500">
            Have questions? Email us at support@viprapariwar.com
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
