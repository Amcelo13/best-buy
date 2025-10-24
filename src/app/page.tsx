import Link from 'next/link';
import Image from 'next/image';
import { DashboardIcon, OfferIcon, AssistIcon, QuizIcon, HotOffersIcon, SimulationIcon } from '@/components/Icons';

export default function Home() {
  const tiles = [
    { name: 'Plan Grid ', href: '/assets/Plan-grid.pdf', Icon: DashboardIcon },
    { name: 'OfferGrid', href: '/assets/Offer Grid.xlsx', Icon: OfferIcon },
    { name: 'Assist', href: '/assist', Icon: AssistIcon },
    { name: 'Quiz', href: '/quiz', Icon: QuizIcon },
    { name: 'Axonify', href: '/axonify', Icon: HotOffersIcon },
    {name: 'SIMU', href: '/simu', Icon: SimulationIcon }
  ];

  return (
    <div className="h-screen bg-[var(--background)] overflow-hidden">
      {/* Header */}
      <header className="bg-[white] shadow-md z-40">
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
      <main className="h-[calc(100vh-80px)] overflow-y-auto">
        <div className="max-sm:mt-60 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-7xl mx-auto p-4 h-full content-center">
          {tiles.map((tile) => (
            <Link
              key={tile.name}
              href={tile.href}
              target={tile.href.endsWith('.pdf') || tile.href.endsWith('.xlsx') ? '_blank' : undefined}
              rel={tile.href.endsWith('.pdf') || tile.href.endsWith('.xlsx') ? 'noopener noreferrer' : undefined}
              className="group bg-[var(--card)] rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 p-6  sm:p-8 md:p-10 flex flex-col items-center justify-center space-y-4 border border-[var(--border)] h-full min-h-[150px] sm:min-h-[180px] md:min-h-[160px] relative"
            >
              {/* Badge for Plan Grid and OfferGrid */}
              {(tile.name === 'Plan Grid ' || tile.name === 'OfferGrid') && (
                <div className="absolute top-3 right-3 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold shadow-lg">
                  1
                </div>
              )}
              <div className="text-[var(--primary)] group-hover:scale-110 transition-transform duration-300">
                <tile.Icon className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16" />
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-[var(--foreground)] text-center group-hover:text-[var(--primary)] transition-colors">
                {tile.name}
              </h2>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
