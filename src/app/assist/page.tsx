'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import ProviderSelection from '@/components/ProviderSelection';

import SubscriberCount from '@/components/SubscriberCount';

export default function AssistPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [customerType, setCustomerType] = useState<'new' | 'existing' | null>(null);
  const [subscriberCount, setSubscriberCount] = useState(1);

  // Auto-advance to step 2 when provider is dropped on a customer type
  const handleProviderSelection = (provider: string | null) => {
    setSelectedProvider(provider);
    // Since the drag operation sets both provider and customer type at once,
    // we can advance immediately after a short delay to show the selection
    if (provider) {
      setTimeout(() => setCurrentStep(2), 800);
    }
  };

  const handleCustomerTypeSelection = (type: 'new' | 'existing' | null) => {
    setCustomerType(type);
  };

  const handleNext = () => {
    if (currentStep === 1 && selectedProvider && customerType) {
      setCurrentStep(2);
    }
  };

  const handleBack = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    } else if (currentStep === 1) {
      // Go back to home
      window.location.href = '/';
    }
  };

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
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${currentStep >= 1 ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' : 'bg-[var(--muted)] text-[var(--muted-foreground)]'}`}>
              1
            </div>
            <div className={`w-24 h-1 ${currentStep >= 2 ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${currentStep >= 2 ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' : 'bg-[var(--muted)] text-[var(--muted-foreground)]'}`}>
              2
            </div>
          </div>
          <div className="flex items-center justify-center mt-2 space-x-4">
            <span className="text-sm font-medium text-[var(--foreground)]">Provider Selection</span>
            <span className="w-24"></span>
            <span className="text-sm font-medium text-[var(--foreground)]">Subscriber Count</span>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-[var(--card)] rounded-xl shadow-lg p-8 border border-[var(--border)]">
          {currentStep === 1 && (
            <ProviderSelection
              selectedProvider={selectedProvider}
              setSelectedProvider={handleProviderSelection}
              customerType={customerType}
              setCustomerType={handleCustomerTypeSelection}
            />
          )}

          {currentStep === 2 && (
            <SubscriberCount
              subscriberCount={subscriberCount}
              setSubscriberCount={setSubscriberCount}
            />
          )}

          {/* Navigation Buttons */}
          <div className={`flex ${currentStep === 1 && (!selectedProvider || !customerType) ? 'justify-start' : 'justify-between'} mt-8 pt-6 border-t border-[var(--border)]`}>
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-[var(--secondary)] text-[var(--secondary-foreground)] rounded-lg hover:opacity-90 transition-all font-medium"
            >
              {currentStep === 1 ? 'Back to Home' : 'Back'}
            </button>
            {(currentStep === 1 && selectedProvider && customerType) && (
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:opacity-90 transition-all font-medium"
              >
                Next
              </button>
            )}
            {currentStep === 2 && (
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:opacity-90 transition-all font-medium"
              >
                Complete
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
