'use client';

import { PlusIcon, MinusIcon } from './Icons';
import { useState } from 'react';

interface SubscriberCountProps {
  subscriberCount: number;
  setSubscriberCount: (count: number) => void;
}

type PlanType = 'BYOD' | 'SMARTPAY';
type BYODOption = 'Talk & Text' | 'Data';
type SmartpayOption = 'Data & Roaming';

export default function SubscriberCount({
  subscriberCount,
  setSubscriberCount,
}: SubscriberCountProps) {
  const [subscriberPlans, setSubscriberPlans] = useState<Record<number, PlanType | null>>({});
  const [subscriberOptions, setSubscriberOptions] = useState<Record<number, BYODOption | SmartpayOption | null>>({});

  const increment = () => {
    setSubscriberCount(subscriberCount + 1);
  };

  const decrement = () => {
    if (subscriberCount > 1) {
      setSubscriberCount(subscriberCount - 1);
    }
  };

  const handlePlanSelect = (index: number, plan: PlanType) => {
    setSubscriberPlans(prev => ({ ...prev, [index]: plan }));
    setSubscriberOptions(prev => ({ ...prev, [index]: null })); // Reset option when plan changes
  };

  const handleOptionSelect = (index: number, option: BYODOption | SmartpayOption) => {
    setSubscriberOptions(prev => ({ ...prev, [index]: option }));
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-center text-[var(--foreground)] mb-8">
        Number of Subscribers
      </h2>

      {/* Subscriber Counter */}
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="flex items-center space-x-8">
          <button
            onClick={decrement}
            disabled={subscriberCount <= 1}
            className="w-14 h-14 flex items-center justify-center bg-[var(--primary)] text-[var(--primary-foreground)] rounded-full hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
          >
            <MinusIcon size={24} />
          </button>

          <div className="bg-[var(--muted)] rounded-lg px-12 py-6 min-w-[200px] border border-[var(--border)]">
            <div className="text-center">
              <p className="text-sm text-[var(--muted-foreground)] font-medium mb-2">Subscribers</p>
              <p className="text-5xl font-bold text-[var(--foreground)]">{subscriberCount}</p>
            </div>
          </div>

          <button
            onClick={increment}
            className="w-14 h-14 flex items-center justify-center bg-[var(--primary)] text-[var(--primary-foreground)] rounded-full hover:opacity-90 transition-all shadow-md"
          >
            <PlusIcon size={24} />
          </button>
        </div>

        {/* Visual representation */}
        <div className="mt-8 w-full">
          <div className="flex flex-col items-center gap-6 max-w-4xl mx-auto">
            {Array.from({ length: subscriberCount }).map((_, index) => {
              const selectedPlan = subscriberPlans[index];
              const selectedOption = subscriberOptions[index];
              
              return (
                <div
                  key={index}
                  className="w-full bg-[var(--muted)] rounded-xl p-6 border border-[var(--border)] animate-fade-in"
                >
                  {/* Subscriber Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-[var(--accent)] rounded-full flex items-center justify-center text-[var(--primary)] font-semibold border border-[var(--border)]">
                      {index + 1}
                    </div>
                    <h3 className="text-lg font-semibold text-[var(--foreground)]">
                      Subscriber {index + 1}
                    </h3>
                  </div>

                  {/* Plan Selection Buttons */}
                  <div className="mb-4">
                    <p className="text-sm text-[var(--muted-foreground)] mb-3 font-medium">
                      Select Plan Type:
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handlePlanSelect(index, 'BYOD')}
                        className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                          selectedPlan === 'BYOD'
                            ? 'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-md'
                            : 'bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] hover:border-[var(--primary)]'
                        }`}
                      >
                        BYOD
                      </button>
                      <button
                        onClick={() => handlePlanSelect(index, 'SMARTPAY')}
                        className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                          selectedPlan === 'SMARTPAY'
                            ? 'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-md'
                            : 'bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] hover:border-[var(--primary)]'
                        }`}
                      >
                        SMARTPAY
                      </button>
                    </div>
                  </div>

                  {/* Options based on selected plan */}
                  {selectedPlan === 'BYOD' && (
                    <div className="mt-4 p-4 bg-[var(--background)] rounded-lg border border-[var(--border)]">
                      <p className="text-sm text-[var(--muted-foreground)] mb-3 font-medium">
                        Choose BYOD Option:
                      </p>
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleOptionSelect(index, 'Talk & Text')}
                          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                            selectedOption === 'Talk & Text'
                              ? 'bg-[var(--accent)] text-[var(--primary)] border-2 border-[var(--primary)]'
                              : 'bg-[var(--muted)] text-[var(--foreground)] border border-[var(--border)] hover:border-[var(--primary)]'
                          }`}
                        >
                          Talk & Text
                        </button>
                        <button
                          onClick={() => handleOptionSelect(index, 'Data')}
                          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                            selectedOption === 'Data'
                              ? 'bg-[var(--accent)] text-[var(--primary)] border-2 border-[var(--primary)]'
                              : 'bg-[var(--muted)] text-[var(--foreground)] border border-[var(--border)] hover:border-[var(--primary)]'
                          }`}
                        >
                          Data
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedPlan === 'SMARTPAY' && (
                    <div className="mt-4 p-4 bg-[var(--background)] rounded-lg border border-[var(--border)]">
                      <p className="text-sm text-[var(--muted-foreground)] mb-3 font-medium">
                        Choose SMARTPAY Option:
                      </p>
                      <button
                        onClick={() => handleOptionSelect(index, 'Data & Roaming')}
                        className={`w-full py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                          selectedOption === 'Data & Roaming'
                            ? 'bg-[var(--accent)] text-[var(--primary)] border-2 border-[var(--primary)]'
                            : 'bg-[var(--muted)] text-[var(--foreground)] border border-[var(--border)] hover:border-[var(--primary)]'
                        }`}
                      >
                        Data & Roaming
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

   
  
   
    </div>
  );
}
