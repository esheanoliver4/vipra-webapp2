import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export const metadata = {
  title: 'Report Abuse - VipraPariwaar',
  description: 'Report suspicious behavior or abuse to our safety team.',
};

export default function ReportPage() {
  return (
    <main className="min-h-screen bg-background py-12 md:py-16">
      <div className="container max-w-3xl">
        <div className="mb-12 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">Report Abuse</h1>
          <p className="text-xl text-muted-foreground">
            Help us keep VipraPariwaar safe. Report any suspicious, offensive, or fraudulent behavior.
          </p>
        </div>

        <Card className="border-border">
          <CardHeader>
            <CardTitle>Abuse Report Form</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Type of Abuse</label>
                <select className="w-full p-2 border rounded-md bg-background text-foreground">
                  <option>Fake Profile</option>
                  <option>Harassment or Abusive Language</option>
                  <option>Financial Fraud / Asking for Money</option>
                  <option>Inappropriate Photos</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Profile ID or Name of Offender</label>
                <input className="w-full p-2 border rounded-md" placeholder="e.g. VIP12345" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description of the Incident</label>
                <textarea rows={5} className="w-full p-2 border rounded-md" placeholder="Please provide as much detail as possible to help our team investigate..."></textarea>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Your Email Address (Optional, for follow-up)</label>
                <input type="email" className="w-full p-2 border rounded-md" placeholder="your@email.com" />
              </div>

              <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold h-12">
                Submit Report
              </Button>
            </form>
            <p className="text-sm text-muted-foreground mt-4 text-center">
              All reports are completely anonymous. The user you are reporting will not be notified of who reported them.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
