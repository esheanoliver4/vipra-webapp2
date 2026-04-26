import { Heart, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const SUCCESS_STORIES = [
  {
    couple: "Priya & Arjun Sharma",
    city: "New Delhi",
    state: "Delhi",
    story: "VipraPariwar helped us find each other while respecting our family traditions and gotra compatibility. Our families connected instantly.",
    married: "2024",
  },
  {
    couple: "Kavya & Rohit Mishra",
    city: "Varanasi",
    state: "Uttar Pradesh",
    story: "We found our perfect match with compatible gothra and shared values. The platform's focus on Brahmin heritage made our parents confident.",
    married: "2023",
  },
  {
    couple: "Anjali & Vikram Joshi",
    city: "Pune",
    state: "Maharashtra",
    story: "The process was smooth and culturally appropriate. We are grateful for a platform that preserves our sacred traditions.",
    married: "2024",
  },
  {
    couple: "Divya & Karthik Iyer",
    city: "Chennai",
    state: "Tamil Nadu",
    story: "From the first meeting to the wedding, VipraPariwar supported us. Our kundli matching and family values aligned perfectly.",
    married: "2023",
  },
];

export function SuccessStories() {
  return (
    <section id="success-stories" className="py-16 md:py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Success Stories
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Blessed unions from our Brahmin community across India
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SUCCESS_STORIES.map((item, index) => (
            <Card key={index} className="bg-card border-border overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 text-primary mb-3">
                  <Heart className="h-5 w-5 fill-primary" />
                  <span className="text-xs font-medium text-primary">
                    Married {item.married}
                  </span>
                </div>
                <p className="text-sm text-foreground/90 mb-4 italic">
                  &ldquo;{item.story}&rdquo;
                </p>
                <p className="font-semibold text-foreground">{item.couple}</p>
                <div className="flex items-center gap-1.5 text-muted-foreground text-sm mt-1">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>
                    {item.city}, {item.state}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
