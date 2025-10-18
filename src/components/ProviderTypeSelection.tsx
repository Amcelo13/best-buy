'use client';

import { CheckIcon } from './Icons';

interface ProviderTypeSelectionProps {
  selectedType: 'byod' | 'smartpay' | null;
  setSelectedType: (type: 'byod' | 'smartpay' | null) => void;
}

export default function ProviderTypeSelection({
  selectedType,
  setSelectedType,
}: ProviderTypeSelectionProps) {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-center text-[var(--foreground)] mb-8">
        Choose Provider Type
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* BYOD Option */}
        <div
          onClick={() => setSelectedType('byod')}
          className={`p-8 rounded-xl border-2 cursor-pointer transition-all hover:scale-105 ${
            selectedType === 'byod'
              ? 'border-[var(--primary)] bg-[var(--accent)] shadow-lg'
              : 'border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]'
          }`}
        >
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-[var(--primary)] rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-[var(--primary-foreground)]">B</span>
            </div>
            <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">BYOD</h3>
            <p className="text-[var(--muted-foreground)] text-sm">
              Bring Your Own Device
            </p>
            {selectedType === 'byod' && (
              <div className="mt-4">
                <CheckIcon className="text-[var(--primary)] mx-auto" size={24} />
              </div>
            )}
          </div>
        </div>

        {/* SmartPay Option */}
        <div
          onClick={() => setSelectedType('smartpay')}
          className={`p-8 rounded-xl border-2 cursor-pointer transition-all hover:scale-105 ${
            selectedType === 'smartpay'
              ? 'border-[var(--primary)] bg-[var(--accent)] shadow-lg'
              : 'border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]'
          }`}
        >
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-[var(--primary)] rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-[var(--primary-foreground)]">S</span>
            </div>
            <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">SmartPay</h3>
            <p className="text-[var(--muted-foreground)] text-sm">
              Smart Payment Plans
            </p>
            {selectedType === 'smartpay' && (
              <div className="mt-4">
                <CheckIcon className="text-[var(--primary)] mx-auto" size={24} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selection Summary */}
      {selectedType && (
        <div className="mt-6 p-4 bg-[var(--accent)] border-2 border-[var(--primary)] rounded-lg animate-fade-in">
          <div className="flex items-center justify-center gap-2">
            <CheckIcon className="text-[var(--primary)]" size={20} />
            <p className="text-center text-[var(--foreground)] font-medium">
              Selected: {selectedType === 'byod' ? 'BYOD (Bring Your Own Device)' : 'SmartPay'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
