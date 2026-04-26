import { TbPhone, TbMail, TbMapPin } from "react-icons/tb";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const CONTACT_INFO = {
  phone: "+91 98290 12345",
  email: "support@viprapariwar.com",
  address: "Udaipur, Rajasthan, India",
  office: "Near City Palace, Udaipur 313001",
  hours: "Mon–Sat: 10:00 AM – 6:00 PM IST",
};

const ContactSection = () => {
  return (
    <section id="contact" className="py-16 md:py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Get in Touch
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Request an invitation or reach out to our team in India
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-foreground">
              Contact Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <TbPhone className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Phone (India)</p>
                  <a
                    href={`tel:${CONTACT_INFO.phone.replace(/\s/g, "")}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {CONTACT_INFO.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <TbMail className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Email</p>
                  <a
                    href={`mailto:${CONTACT_INFO.email}`}
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {CONTACT_INFO.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <TbMapPin className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Office</p>
                  <p className="text-muted-foreground">{CONTACT_INFO.address}</p>
                  <p className="text-muted-foreground text-sm">
                    {CONTACT_INFO.office}
                  </p>
                  <p className="text-muted-foreground text-sm mt-1">
                    {CONTACT_INFO.hours}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-xl font-semibold text-foreground mb-4">
              Request Your Invitation
            </h3>
            <div className="space-y-4">
              <div>
                <Label className="mb-2">Full Name</Label>
                <Input
                  type="text"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <Label className="mb-2">Email</Label>
                <Input
                  type="email"
                  placeholder="your.email@example.com"
                />
              </div>
              <div>
                <Label className="mb-2">Gothra</Label>
                <Input
                  type="text"
                  placeholder="Enter your gothra"
                />
              </div>
              <div>
                <Label className="mb-2">Message</Label>
                <Textarea
                  className="min-h-28"
                  placeholder="Tell us about your family background and why you'd like to join..."
                />
              </div>
              <Button className="w-full">
                Send Request
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default ContactSection;
