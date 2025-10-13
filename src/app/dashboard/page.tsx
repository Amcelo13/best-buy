import Link from 'next/link';
import Image from 'next/image';
import { DashboardIcon } from '@/components/Icons';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <header className="bg-[#0046BE] shadow-md">
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-[var(--card)] rounded-xl shadow-lg p-8 border border-[var(--border)]">
          <div className="text-center">
            <div className="flex justify-center mb-6 text-[var(--primary)]">
              <DashboardIcon size={80} />
            </div>
            <h2 className="text-3xl font-bold text-[var(--foreground)] mb-4">Dashboard Analytics</h2>
            <p className="text-[var(--muted-foreground)]">Your analytics dashboard will appear here.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
