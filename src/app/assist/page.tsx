'use client';

import { useState } from 'react';
import Image from 'next/image';
import ProviderSelection from '@/components/ProviderSelection';
import ProviderTypeSelection from '@/components/ProviderTypeSelection';
import PlanOptions from '@/components/PlanOptions';
import CustomerCategory from '@/components/CustomerCategory';
import DeviceSelection from '@/components/DeviceSelection';
import EnhancedSubscriberCount, { type Subscriber } from '@/components/EnhancedSubscriberCount';
import { type Device } from '@/constants/devices';

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
      // Auto-select consumer category for Virgin
      if (selectedProvider?.toLowerCase() === 'virgin') {
        setSelectedCategory('consumer');
      }
      setTimeout(() => setCurrentStep(4), 500);
    }
  };

  const handleCategorySelection = (category: string | null) => {
    setSelectedCategory(category);
    if (category && providerType !== 'byod') {
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
    // Don't proceed if this is the final step for the current flow
    if (providerType === 'byod' && currentStep === 5) {
      console.log('BYOD flow completed at step 5');
      return; // BYOD flow ends at step 5 (category selection)
    }
    
    // Virgin + BYOD ends at step 4
    if (selectedProvider?.toLowerCase() === 'virgin' && providerType === 'byod' && currentStep === 4) {
      console.log('Virgin BYOD flow completed at step 4');
      return;
    }
    
    if (currentStep === 1 && selectedProvider && customerType) {
      setCurrentStep(2);
    } else if (currentStep === 2 && providerType) {
      setCurrentStep(3);
    } else if (currentStep === 3 && selectedPlan) {
      setCurrentStep(4);
    } else if (currentStep === 4) {
      // Skip category selection for Virgin (already auto-selected)
      if (selectedProvider?.toLowerCase() === 'virgin' && providerType !== 'byod') {
        setCurrentStep(6);
      } else {
        // Go to category selection for other providers
        setCurrentStep(5);
      }
    } else if (currentStep === 5 && selectedCategory) {
      // Only non-BYOD flows go to step 6
      setCurrentStep(6);
    }
  };
  
  // Handle step click
  const handleStepClick = (step: number) => {
    // Don't allow clicking on future steps
    if (step > currentStep) return;
    
    // Special handling for Virgin + BYOD flow (ends at step 4)
    if (selectedProvider?.toLowerCase() === 'virgin' && providerType === 'byod' && step > 4) {
      return;
    }
    
    // Special handling for BYOD flow
    if (providerType === 'byod' && step > 5) {
      return; // Skip device selection for BYOD
    }
    
    setCurrentStep(step);
  };

  const handleBack = () => {
    if (currentStep === 6) {
      // For Virgin, go back to step 4 (skip category selection)
      if (selectedProvider?.toLowerCase() === 'virgin') {
        setCurrentStep(4);
        setSelectedDevice(null); // Reset device selection
      } else {
        setCurrentStep(5);
        setSelectedDevice(null); // Reset device selection
      }
    } else if (currentStep === 5) {
      setCurrentStep(4);
      setSelectedCategory(null); // Reset category selection
    } else if (currentStep === 4) {
      // Go back to subscribers step
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
          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <Image 
                src="/logos/Bell.png" 
                alt="" 
                width={40} 
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
            <div 
              onClick={() => handleStepClick(1)}
              className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm cursor-pointer ${currentStep >= 1 ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' : 'bg-[var(--muted)] text-[var(--muted-foreground)]'}`}
            >
              1
            </div>
            <div className={`w-6 h-1 ${currentStep >= 2 ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'}`}></div>
            <div 
              onClick={() => handleStepClick(2)}
              className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm cursor-pointer ${currentStep >= 2 ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' : 'bg-[var(--muted)] text-[var(--muted-foreground)]'}`}
            >
              2
            </div>
            <div className={`w-6 h-1 ${currentStep >= 3 ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'}`}></div>
            <div 
              onClick={() => handleStepClick(3)}
              className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm cursor-pointer ${currentStep >= 3 ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' : 'bg-[var(--muted)] text-[var(--muted-foreground)]'}`}
            >
              3
            </div>
            <div className={`w-6 h-1 ${currentStep >= 4 ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'}`}></div>
            <div 
              onClick={() => handleStepClick(4)}
              className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm cursor-pointer ${currentStep >= 4 ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' : 'bg-[var(--muted)] text-[var(--muted-foreground)]'}`}
            >
              4
            </div>
            {/* Only show category step for non-Virgin providers */}
            {selectedProvider?.toLowerCase() !== 'virgin' && (
              <>
                <div className={`w-6 h-1 ${currentStep >= 5 ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'}`}></div>
                <div 
                  onClick={() => handleStepClick(5)}
                  className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm cursor-pointer ${currentStep >= 5 ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' : 'bg-[var(--muted)] text-[var(--muted-foreground)]'}`}
                >
                  5
                </div>
              </>
            )}
            {providerType !== 'byod' && (
              <>
                <div className={`w-6 h-1 ${currentStep >= 6 ? 'bg-[var(--primary)]' : 'bg-[var(--border)]'}`}></div>
                <div 
                  onClick={() => handleStepClick(6)}
                  className={`flex items-center justify-center w-8 h-8 rounded-full font-semibold text-sm cursor-pointer ${currentStep >= 6 ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' : 'bg-[var(--muted)] text-[var(--muted-foreground)]'}`}
                >
                  {selectedProvider?.toLowerCase() === 'virgin' ? '5' : '6'}
                </div>
              </>
            )}
          </div>
          <div className="flex items-center justify-center mt-2 space-x-1">
            <span className="text-xs font-medium text-[var(--foreground)]">Provider</span>
            <span className="w-6"></span>
            <span className="text-xs font-medium text-[var(--foreground)]">Type</span>
            <span className="w-6"></span>
            <span className="text-xs font-medium text-[var(--foreground)]">Plan</span>
            <span className="w-6"></span>
            <span className="text-xs font-medium text-[var(--foreground)]">Subscribers</span>
            {/* Only show Category label for non-Virgin providers */}
            {selectedProvider?.toLowerCase() !== 'virgin' && (
              <>
                <span className="w-6"></span>
                <span className="text-xs font-medium text-[var(--foreground)]">Category</span>
              </>
            )}
            {providerType !== 'byod' && (
              <>
                <span className="w-6"></span>
                <span className="text-xs font-medium text-[var(--foreground)]">Device</span>
              </>
            )}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-[var(--card)] rounded-xl shadow-lg p-8 border border-[var(--border)]">
          {/* Top Navigation for Steps 4, 5, and 6 */}
          {(currentStep === 4 || currentStep === 5 || (currentStep === 6 && providerType !== 'byod')) && (
            <div className="flex justify-between mb-8 pb-6 border-b border-[var(--border)]">
              <button
                onClick={handleBack}
                className="px-6 py-3 bg-[var(--secondary)] text-[var(--secondary-foreground)] rounded-lg hover:opacity-90 transition-all font-medium"
              >
                Back
              </button>
              
              {currentStep === 4 && (
                <button
                  onClick={() => {
                    // Virgin + BYOD ends at step 4
                    if (selectedProvider?.toLowerCase() === 'virgin' && providerType === 'byod') {
                      alert('Process completed!');
                    } else {
                      handleNext();
                    }
                  }}
                  className={`px-6 py-3 ${
                    selectedProvider?.toLowerCase() === 'virgin' && providerType === 'byod'
                      ? 'bg-green-600 text-white'
                      : 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                  } rounded-lg hover:opacity-90 transition-all font-medium`}
                >
                  {selectedProvider?.toLowerCase() === 'virgin' && providerType === 'byod' ? 'Submit' : 'Next'}
                </button>
              )}
              
              {(currentStep === 5 && selectedCategory) && (
                <button
                  onClick={() => {
                    if (providerType === 'byod') {
                      // Handle BYOD completion
                      alert('Process completed!');
                    } else {
                      handleNext();
                    }
                  }}
                  className={`px-6 py-3 ${
                    providerType === 'byod' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                  } rounded-lg hover:opacity-90 transition-all font-medium`}
                >
                  {providerType === 'byod' ? 'Submit' : 'Next'}
                </button>
              )}
              
              {(currentStep === 5 && !selectedCategory) && (
                <div></div>
              )}
              
              {(currentStep === 6 && selectedDevice) && (
                <button
                  onClick={() => {
                    // Handle completion logic for non-BYOD flow
                    alert('Process completed!');
                  }}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:opacity-90 transition-all font-medium"
                >
                  Submit
                </button>
              )}
              
              {(currentStep === 6 && !selectedDevice && providerType !== 'byod') && (
                <div></div>
              )}
            </div>
          )}

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

          {/* Only show category selection for non-Virgin providers */}
          {currentStep === 5 && selectedProvider?.toLowerCase() !== 'virgin' && (
            <CustomerCategory
              selectedCategory={selectedCategory}
              setSelectedCategory={handleCategorySelection}
              provider={selectedProvider || 'bell'}
            />
          )}

          {currentStep === 6 && (
            <DeviceSelection
              selectedDevice={selectedDevice}
              setSelectedDevice={handleDeviceSelection}
            />
          )}
          
          {/* Bottom Navigation for Steps 1, 2, and 3 */}
          {(currentStep !== 4 && currentStep !== 5 && currentStep !== 6) && (
            <div className={`flex ${
              (currentStep === 1 && (!selectedProvider || !customerType)) || 
              (currentStep === 2 && !providerType) || 
              (currentStep === 3 && !selectedPlan) ? 'justify-start' : 'justify-between'
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
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
