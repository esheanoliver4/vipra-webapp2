import { TbShield, TbUsers, TbUser, TbStar } from "react-icons/tb";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

// Features Section
const FeaturesSection = () => {
  const features = [
    {
      icon: <TbShield className="h-12 w-12 text-primary" />,
      title: "Verified Brahmin Profiles",
      description:
        "Every profile is thoroughly verified to ensure authentic Brahmin heritage and family background.",
    },
    {
      icon: <TbUsers className="h-12 w-12 text-primary" />,
      title: "Community-Focused",
      description:
        "Exclusively for Brahmin families, preserving our sacred traditions and cultural values.",
    },
    {
      icon: <TbUser className="h-12 w-12 text-primary" />,
      title: "Detailed Profiles",
      description:
        "Comprehensive profiles including gotra, education, profession, and family details.",
    },
    {
      icon: <TbStar className="h-12 w-12 text-primary" />,
      title: "Horoscope Matching",
      description:
        "Traditional kundali matching services to ensure astrological compatibility.",
    },
  ];

  return (
    <section
      id="features"
      className="py-20 bg-secondary/20 dark:bg-secondary/10 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Why Choose VipraPariwar?
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Dedicated to serving the Brahmin community with authenticity,
            tradition, and modern convenience.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="h-full border border-border/60 bg-card/80 backdrop-blur-sm hover:shadow-lg transition-shadow"
            >
              <CardHeader className="flex flex-col items-center space-y-3">
                <div>{feature.icon}</div>
                <CardTitle className="text-lg font-semibold text-foreground">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
