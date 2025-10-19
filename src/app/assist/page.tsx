'use client';

import { useState } from 'react';
import Image from 'next/image';
import ProviderSelection from '@/components/ProviderSelection';
import ProviderTypeSelection from '@/components/ProviderTypeSelection';
import PlanOptions from '@/components/PlanOptions';
import CustomerCategory from '@/components/CustomerCategory';
import DeviceSelection from '@/components/DeviceSelection';
import EnhancedSubscriberCount, { type Subscriber } from '@/components/EnhancedSubscriberCount';

// Define Device interface to match DeviceSelection component
interface Device {
  id: string;
  name: string;
  brand: string;
  model: string;
  color: string;
  storage: string;
  price: number;
  image: string;
  category: string;
}

export default function AssistPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [customerType, setCustomerType] = useState<'new' | 'existing' | null>(null);
  const [providerType, setProviderType] = useState<'byod' | 'smartpay' | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [subscriberCount, setSubscriberCount] = useState(1);
  const [subscriberList, setSubscriberList] = useState<Subscriber[]>([]);

  const handleProviderSelection = (provider: string | null) => {
    setSelectedProvider(provider);
    // Auto-advance to step 2 when provider is dropped
    if (provider) {
      setTimeout(() => setCurrentStep(2), 800);
    }
  };

  const handleCustomerTypeSelection = (type: 'new' | 'existing' | null) => {
    setCustomerType(type);
  };

  const handleProviderTypeSelection = (type: 'byod' | 'smartpay' | null) => {
    setProviderType(type);
    // Auto-advance to step 3 when provider type is selected
    if (type) {
      setTimeout(() => setCurrentStep(3), 500);
    }
  };

  const handlePlanSelection = (plan: string | null) => {
    setSelectedPlan(plan);
    // Auto-advance to step 4 when plan is selected
    if (plan) {
      setTimeout(() => setCurrentStep(4), 500);
    }
  };

  const handleCategorySelection = (category: string | null) => {
    setSelectedCategory(category);
    // Auto-advance to step 6 when category is selected
    if (category) {
      setTimeout(() => setCurrentStep(6), 500);
    }
  };

  const handleAddAnotherSubscriber = () => {
    setCurrentStep(2);
    setProviderType(null); // Reset provider type selection
    setSelectedPlan(null); // Reset plan selection
  };

  const handleDeviceSelection = (device: Device | null) => {
    setSelectedDevice(device);
    // Device selection is now the final step, no auto-advance
  };

  const handleNext = () => {
    if (currentStep === 1 && selectedProvider && customerType) {
      setCurrentStep(2);
    } else if (currentStep === 2 && providerType) {
      setCurrentStep(3);
    } else if (currentStep === 3 && selectedPlan) {
      setCurrentStep(4);
    } else if (currentStep === 4) {
      setCurrentStep(5);
    } else if (currentStep === 5 && selectedCategory) {
      setCurrentStep(6);
    }
  };

  const handleBack = () => {
    if (currentStep === 6) {
      setCurrentStep(5);
      setSelectedDevice(null); // Reset device selection
    } else if (currentStep === 5) {
      setCurrentStep(4);
      setSelectedCategory(null); // Reset category selection
    } else if (currentStep === 4) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(2);
      setSelectedPlan(null); // Reset plan selection
    } else if (currentStep === 2) {
      setCurrentStep(1);
      setProviderType(null); // Reset provider type selection
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
                onClick={() => window.location.href = '/'}
                className="cursor-pointer hover:opacity-80 transition-opacity"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-1">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm ${currentStep >= 1 ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' : 'bg-[var(--muted)] text-[var(--muted-foreground)]'}`}>
              1
            </div>
            <div className={`w-6 h-1 ${currentStep >= 2 ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm ${currentStep >= 2 ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' : 'bg-[var(--muted)] text-[var(--muted-foreground)]'}`}>
              2
            </div>
            <div className={`w-6 h-1 ${currentStep >= 3 ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm ${currentStep >= 3 ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' : 'bg-[var(--muted)] text-[var(--muted-foreground)]'}`}>
              3
            </div>
            <div className={`w-6 h-1 ${currentStep >= 4 ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm ${currentStep >= 4 ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' : 'bg-[var(--muted)] text-[var(--muted-foreground)]'}`}>
              4
            </div>
            <div className={`w-6 h-1 ${currentStep >= 5 ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm ${currentStep >= 5 ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' : 'bg-[var(--muted)] text-[var(--muted-foreground)]'}`}>
              5
            </div>
            <div className={`w-6 h-1 ${currentStep >= 6 ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm ${currentStep >= 6 ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' : 'bg-[var(--muted)] text-[var(--muted-foreground)]'}`}>
              6
            </div>
          </div>
          <div className="flex items-center justify-center mt-2 space-x-1">
            <span className="text-xs font-medium text-[var(--foreground)]">Provider</span>
            <span className="w-6"></span>
            <span className="text-xs font-medium text-[var(--foreground)]">Type</span>
            <span className="w-6"></span>
            <span className="text-xs font-medium text-[var(--foreground)]">Plan</span>
            <span className="w-6"></span>
            <span className="text-xs font-medium text-[var(--foreground)]">Subscribers</span>
            <span className="w-6"></span>
            <span className="text-xs font-medium text-[var(--foreground)]">Category</span>
            <span className="w-6"></span>
            <span className="text-xs font-medium text-[var(--foreground)]">Device</span>
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
            <ProviderTypeSelection
              selectedType={providerType}
              setSelectedType={handleProviderTypeSelection}
            />
          )}

          {currentStep === 3 && providerType && (
            <PlanOptions
              providerType={providerType}
              selectedOption={selectedPlan}
              setSelectedOption={handlePlanSelection}
            />
          )}

          {currentStep === 4 && providerType && selectedPlan && (
            <EnhancedSubscriberCount
              subscriberCount={subscriberCount}
              setSubscriberCount={setSubscriberCount}
              providerType={providerType}
              planOption={selectedPlan}
              subscriberList={subscriberList}
              setSubscriberList={setSubscriberList}
              onAddAnother={handleAddAnotherSubscriber}
            />
          )}

          {currentStep === 5 && (
            <CustomerCategory
              selectedCategory={selectedCategory}
              setSelectedCategory={handleCategorySelection}
            />
          )}

          {currentStep === 6 && (
            <DeviceSelection
              selectedDevice={selectedDevice}
              setSelectedDevice={handleDeviceSelection}
            />
          )}

          {/* Navigation Buttons */}
          <div className={`flex ${
            (currentStep === 1 && (!selectedProvider || !customerType)) || 
            (currentStep === 2 && !providerType) || 
            (currentStep === 3 && !selectedPlan) || 
            (currentStep === 5 && !selectedCategory) ||
            (currentStep === 6 && !selectedDevice) ? 'justify-start' : 'justify-between'
          } mt-8 pt-6 border-t border-[var(--border)]`}>

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
            
            {(currentStep === 2 && providerType) && (
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:opacity-90 transition-all font-medium"
              >
                Next
              </button>
            )}
            
            {(currentStep === 3 && selectedPlan) && (
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:opacity-90 transition-all font-medium"
              >
                Next
              </button>
            )}

            {currentStep === 4 && (
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:opacity-90 transition-all font-medium"
              >
                Next
              </button>
            )}
            
            {(currentStep === 5 && selectedCategory) && (
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:opacity-90 transition-all font-medium"
              >
                Next
              </button>
            )}
            
            {(currentStep === 6 && selectedDevice) && (
              <button
                onClick={() => {
                  // Handle completion logic here
                  alert('Process completed!');
                }}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:opacity-90 transition-all font-medium"
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
