import PricingComponent from '@/components/pricing/PricingComponent';
import ModernHeader from '@/components/landing/ModernHeader';
import ModernFooter from '@/components/landing/ModernFooter';

export const metadata = {
  title: 'Pricing - Viprapariwar',
  description: 'Choose the perfect plan for finding your match'
};

export default function PricingPage() {
  return (
    <>
      <ModernHeader />
      <PricingComponent />
      <ModernFooter />
    </>
  );
}
