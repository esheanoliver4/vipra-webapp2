import ModernHero from '@/components/landing/ModernHero';
import ModernFeatures from '@/components/landing/ModernFeatures';
import ModernTestimonials from '@/components/landing/ModernTestimonials';
import ModernHeader from '@/components/landing/ModernHeader';
import ModernFooter from '@/components/landing/ModernFooter';
import BrahminCulture from '@/components/landing/BrahminCulture';

export default function HomePage() {
  return (
    <>
      <ModernHeader />
      <ModernHero />
      <ModernFeatures />
      <BrahminCulture />
      <ModernTestimonials />
      <ModernFooter />
    </>
  );
}
