'use client';

import { CheckIcon } from './Icons';

interface PlanOptionsProps {
  providerType: 'byod' | 'smartpay';
  selectedOption: string | null;
  setSelectedOption: (option: string | null) => void;
}

const byodOptions = [
  { id: 'talk-text', name: 'Talk & Text', description: 'Voice calls and text messaging' },
  { id: 'data', name: 'Data', description: 'High-speed internet access' },
  { id: 'data-roaming', name: 'Data & Roaming', description: 'Data with international roaming' }
];

const smartpayOptions = [
  { id: 'talk-text', name: 'Talk & Text', description: 'Voice calls and text messaging' },
  { id: 'data', name: 'Data', description: 'High-speed internet access' },
  { id: 'data-roaming', name: 'Data & Roaming', description: 'Data with international roaming' }
];

export default function PlanOptions({
  providerType,
  selectedOption,
  setSelectedOption,
}: PlanOptionsProps) {
  const options = providerType === 'byod' ? byodOptions : smartpayOptions;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-center text-[var(--foreground)] mb-8">
        Choose Your {providerType === 'byod' ? 'BYOD' : 'SmartPay'} Plan
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {options.map((option) => (
          <div
            key={option.id}
            onClick={() => setSelectedOption(option.id)}
            className={`p-6 rounded-xl border-2 cursor-pointer transition-all hover:scale-105 ${
              selectedOption === option.id
                ? 'border-[var(--primary)] bg-[var(--accent)] shadow-lg'
                : 'border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]'
            }`}
          >
            <div className="text-center">
              <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
                selectedOption === option.id 
                  ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' 
                  : 'bg-[var(--muted)] text-[var(--muted-foreground)]'
              }`}>
                <span className="text-lg font-bold">{option.name.charAt(0)}</span>
              </div>
              <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">{option.name}</h3>
              <p className="text-[var(--muted-foreground)] text-sm mb-4">
                {option.description}
              </p>
              {selectedOption === option.id && (
                <CheckIcon className="text-[var(--primary)] mx-auto" size={20} />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Selection Summary */}
      {selectedOption && (
        <div className="mt-6 p-4 bg-[var(--accent)] border-2 border-[var(--primary)] rounded-lg animate-fade-in">
          <div className="flex items-center justify-center gap-2">
            <CheckIcon className="text-[var(--primary)]" size={20} />
            <p className="text-center text-[var(--foreground)] font-medium">
              Selected: {options.find(opt => opt.id === selectedOption)?.name} for {providerType === 'byod' ? 'BYOD' : 'SmartPay'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
