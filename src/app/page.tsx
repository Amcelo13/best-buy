import Link from 'next/link';
import Image from 'next/image';
import { DashboardIcon, OfferIcon, AssistIcon, QuizIcon, HotOffersIcon } from '@/components/Icons';

export default function Home() {
  const tiles = [
    { name: 'Plan Grid ', href: '/assets/Plan-grid.pdf', Icon: DashboardIcon },
    { name: 'OfferGrid', href: '/assets/Offer Grid.xlsx', Icon: OfferIcon },
    { name: 'Assist', href: '/assist', Icon: AssistIcon },
    { name: 'Quiz', href: '/quiz', Icon: QuizIcon },
    { name: 'Hot Offers', href: '/hot-offers', Icon: HotOffersIcon },
  ];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="bg-[white] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Image 
                src="/logos/Bell.png" 
                alt="Bell" 
                width={120} 
                height={40}
                priority
              />
            </div>
            {/* <h1 className="text-xl font-semibold text-white">Dashboard</h1> */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {tiles.map((tile) => (
            <Link
              key={tile.name}
              href={tile.href}
              target={tile.href.endsWith('.pdf') || tile.href.endsWith('.xlsx') ? '_blank' : undefined}
              rel={tile.href.endsWith('.pdf') || tile.href.endsWith('.xlsx') ? 'noopener noreferrer' : undefined}
              className="group bg-[var(--card)] rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-8 flex flex-col items-center justify-center space-y-4 border border-[var(--border)]"
            >
              <div className="text-[var(--primary)] group-hover:scale-110 transition-transform duration-300">
                <tile.Icon size={48} />
              </div>
              <h2 className="text-lg font-semibold text-[var(--foreground)] text-center group-hover:text-[var(--primary)] transition-colors">
                {tile.name}
              </h2>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
