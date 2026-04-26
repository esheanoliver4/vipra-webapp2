import KundliMilanClient from '@/components/kundli/KundliMilanClient';

export const metadata = {
  title: 'Kundli Milan - Astrological Compatibility | VipraPariwaar',
  description: 'Check astrological compatibility between potential matches using traditional Kundli Milan',
};

export default function KundliMilanPage() {
  return (
    <main className="min-h-screen bg-background py-8 md:py-12">
      <KundliMilanClient />
    </main>
  );
}
