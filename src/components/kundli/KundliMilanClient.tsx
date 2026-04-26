'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Heart, Star } from 'lucide-react';
import { toast } from 'sonner';

const rashis = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const nakshatra = [
  'Ashwini', 'Bharani', 'Krittika', 'Rohini', 'Mrigashirsha', 'Ardra',
  'Punarvasu', 'Pushya', 'Ashlesha', 'Magha', 'Purva Phalguni', 'Uttara Phalguni'
];

export default function KundliMilanClient() {
  const [girl, setGirl] = useState({ name: '', rashi: '', nakshatra: '', timeOfBirth: '' });
  const [boy, setBoy] = useState({ name: '', rashi: '', nakshatra: '', timeOfBirth: '' });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const calculateCompatibility = async () => {
    if (!girl.rashi || !boy.rashi) {
      toast.error('Please select Rashi for both');
      return;
    }

    setLoading(true);
    try {
      // Simulate Kundli calculation
      setTimeout(() => {
        const baseScore = 50;
        const rashiBonus = girl.rashi === boy.rashi ? 10 : 5;
        const nakshatraBonus = girl.nakshatra === boy.nakshatra ? 8 : 3;
        const randomFactor = Math.random() * 20;

        const score = Math.min(100, baseScore + rashiBonus + nakshatraBonus + randomFactor);

        setResult({
          score: Math.round(score),
          interpretation: getInterpretation(Math.round(score)),
          details: {
            dinaKuta: Math.random() * 8,
            ganamKuta: Math.random() * 6,
            yoniKuta: Math.random() * 4,
            vasyadiKuta: Math.random() * 2,
          },
        });
        toast.success('Kundli Milan calculated successfully!');
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  const getInterpretation = (score: number) => {
    if (score >= 80) return 'Excellent match! Very high compatibility.';
    if (score >= 60) return 'Good match with positive prospects.';
    if (score >= 40) return 'Moderate compatibility with some challenges.';
    return 'Consider other aspects before proceeding.';
  };

  return (
    <div className="container max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-primary mb-2">Kundli Milan</h1>
        <p className="text-muted-foreground">Astrological Compatibility Check</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Girl's Details */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="text-primary">Bride's Details</CardTitle>
            <CardDescription>Enter bride's astrological information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="girl-name">Name</Label>
              <Input
                id="girl-name"
                placeholder="Bride's name"
                value={girl.name}
                onChange={(e) => setGirl({ ...girl, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="girl-rashi">Rashi</Label>
              <Select value={girl.rashi} onValueChange={(value) => setGirl({ ...girl, rashi: value })}>
                <SelectTrigger id="girl-rashi">
                  <SelectValue placeholder="Select Rashi" />
                </SelectTrigger>
                <SelectContent>
                  {rashis.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="girl-nakshatra">Nakshatra</Label>
              <Select value={girl.nakshatra} onValueChange={(value) => setGirl({ ...girl, nakshatra: value })}>
                <SelectTrigger id="girl-nakshatra">
                  <SelectValue placeholder="Select Nakshatra" />
                </SelectTrigger>
                <SelectContent>
                  {nakshatra.map((n) => (
                    <SelectItem key={n} value={n}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Boy's Details */}
        <Card className="border-secondary/20">
          <CardHeader>
            <CardTitle className="text-secondary">Groom's Details</CardTitle>
            <CardDescription>Enter groom's astrological information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="boy-name">Name</Label>
              <Input
                id="boy-name"
                placeholder="Groom's name"
                value={boy.name}
                onChange={(e) => setBoy({ ...boy, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="boy-rashi">Rashi</Label>
              <Select value={boy.rashi} onValueChange={(value) => setBoy({ ...boy, rashi: value })}>
                <SelectTrigger id="boy-rashi">
                  <SelectValue placeholder="Select Rashi" />
                </SelectTrigger>
                <SelectContent>
                  {rashis.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="boy-nakshatra">Nakshatra</Label>
              <Select value={boy.nakshatra} onValueChange={(value) => setBoy({ ...boy, nakshatra: value })}>
                <SelectTrigger id="boy-nakshatra">
                  <SelectValue placeholder="Select Nakshatra" />
                </SelectTrigger>
                <SelectContent>
                  {nakshatra.map((n) => (
                    <SelectItem key={n} value={n}>{n}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Calculate Button */}
      <div className="text-center mb-8">
        <Button
          onClick={calculateCompatibility}
          disabled={loading}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-white"
        >
          {loading ? 'Calculating...' : 'Calculate Kundli Milan'}
        </Button>
      </div>

      {/* Result */}
      {result && (
        <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-primary">Compatibility Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Score */}
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-white">{result.score}</div>
                    <div className="text-sm text-white/80">out of 100</div>
                  </div>
                </div>
              </div>
              <p className="text-lg font-semibold text-foreground mb-2">{result.interpretation}</p>
            </div>

            {/* Detailed Scores */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Detailed Analysis</h3>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Dina Kuta</span>
                  <span className="text-sm font-medium text-primary">{result.details.dinaKuta.toFixed(1)}/8</span>
                </div>
                <Progress value={(result.details.dinaKuta / 8) * 100} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Gana Kuta</span>
                  <span className="text-sm font-medium text-primary">{result.details.ganamKuta.toFixed(1)}/6</span>
                </div>
                <Progress value={(result.details.ganamKuta / 6) * 100} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Yoni Kuta</span>
                  <span className="text-sm font-medium text-primary">{result.details.yoniKuta.toFixed(1)}/4</span>
                </div>
                <Progress value={(result.details.yoniKuta / 4) * 100} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Vasyadi Kuta</span>
                  <span className="text-sm font-medium text-primary">{result.details.vasyadiKuta.toFixed(1)}/2</span>
                </div>
                <Progress value={(result.details.vasyadiKuta / 2) * 100} className="h-2" />
              </div>
            </div>

            {/* Recommendation */}
            <Card className="bg-background border-border">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <Heart className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold text-foreground mb-1">Recommendation</p>
                    <p className="text-sm text-muted-foreground">
                      {result.score >= 70
                        ? 'This match shows excellent astrological compatibility. Proceed with confidence.'
                        : result.score >= 40
                        ? 'The match is moderate. Consider consulting with an experienced astrologer for guidance.'
                        : 'It would be wise to discuss this with an astrologer before finalizing the match.'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      )}

      {/* Info Section */}
      {!result && (
        <Card className="bg-muted/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-secondary" />
              About Kundli Milan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              Kundli Milan is an important aspect of traditional matrimony matching in the Brahmin community. 
              It analyzes the astrological compatibility between two individuals based on their birth charts.
            </p>
            <p>
              The calculation considers various aspects including Dina Kuta, Gana Kuta, Yoni Kuta, and more 
              to determine overall compatibility on a scale of 0-100.
            </p>
            <p>
              For the most accurate results, consult with a qualified astrologer who can analyze complete birth charts.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
