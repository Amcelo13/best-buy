'use client';

import { useState, useCallback, useRef, Fragment } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Dialog, DialogBackdrop, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import ProviderSelection from '@/components/ProviderSelection';
import ProviderTypeSelection from '@/components/ProviderTypeSelection';
import PlanOptions from '@/components/PlanOptions';
import CustomerCategory from '@/components/CustomerCategory';
import DeviceSelection from '@/components/DeviceSelection';
import EnhancedSubscriberCount, { type Subscriber } from '@/components/EnhancedSubscriberCount';
import { type Device } from '@/constants/devices';
import { submitAssistForm } from '@/services/assistService';
import { type AssistFormData, type CustomerType, type ProviderType } from '@/types/assist.types';

export default function AssistPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);
  const cancelButtonRef = useRef(null);

  // Centralized form state
  const [formData, setFormData] = useState<Omit<AssistFormData, 'subscriberCount' | 'subscriberList'>>({
    selectedProvider: null,
    customerType: null,
    providerType: null,
    selectedPlan: null,
    selectedCategory: null,
    selectedDevice: null,
  });

  const [subscriberCount, setSubscriberCount] = useState(1);
  const [subscriberList, setSubscriberList] = useState<Subscriber[]>([]);

  // Destructure form data for easier access
  const {
    selectedProvider,
    customerType,
    providerType,
    selectedPlan,
    selectedCategory,
    selectedDevice
  } = formData;

  const updateFormData = useCallback((updates: Partial<AssistFormData>) => {
    setFormData(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  const handleProviderSelection = (provider: string | null) => {
    updateFormData({ selectedProvider: provider });
    // Auto-advance to step 2 when provider is dropped
    if (provider) {
      setTimeout(() => setCurrentStep(2), 800);
    }
  };

  const handleCustomerTypeSelection = (type: CustomerType) => {
    updateFormData({ customerType: type });
  };

  const handleProviderTypeSelection = (type: ProviderType) => {
    updateFormData({ providerType: type });
    // Auto-advance to step 3 when provider type is selected
    if (type) {
      setTimeout(() => setCurrentStep(3), 500);
    }
  };

  const handlePlanSelection = async (plan: string | null) => {
    updateFormData({ selectedPlan: plan });

    if (plan) {
      // Auto-select consumer category for Virgin
      if (selectedProvider?.toLowerCase() === 'virgin') {
        updateFormData({ selectedCategory: 'consumer' });
      }
      setTimeout(() => setCurrentStep(4), 500);
    }
  };

  const handleCategorySelection = (category: string | null) => {
    updateFormData({ selectedCategory: category });
    if (category && providerType !== 'byod') {
      setTimeout(() => setCurrentStep(6), 500);
    }
  };

  const handleAddAnotherSubscriber = () => {
    setCurrentStep(2);
    updateFormData({
      providerType: null,
      selectedPlan: null
    });
  };

  const handleDeviceSelection = (device: Device | null) => {
    updateFormData({ selectedDevice: device });
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const formSubmission: AssistFormData = {
        ...formData,
        subscriberCount,
        subscriberList,
        lines: subscriberList.length || 1,
        data: selectedPlan?.includes('GB') ? selectedPlan : '',
        talk: selectedPlan?.includes('min') ? selectedPlan : '',
        text: selectedPlan?.includes('unlimited') ? 'Unlimited' : ''
      };

      const result = await submitAssistForm(formSubmission);
      setSubmissionResult(result);
      setIsSuccessDialogOpen(true);
      toast.success('Form submitted successfully!');
    } catch (error) {
      console.error('Submission error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit form');
    } finally {
      setIsSubmitting(false);
    }
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
        updateFormData({ selectedDevice: null });
      } else {
        setCurrentStep(5);
        updateFormData({ selectedDevice: null });
      }
    } else if (currentStep === 5) {
      setCurrentStep(4);
      updateFormData({ selectedCategory: null });
    } else if (currentStep === 4) {
      // Go back to subscribers step
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(2);
      updateFormData({ selectedPlan: null });
    } else if (currentStep === 2) {
      setCurrentStep(1);
      updateFormData({ providerType: null });
    } else if (currentStep === 1) {
      // Do not redirect to home
      // router.push('/');
    }
  };

  // Calculate total price from submission result
  const getTotalPrice = () => {
    if (!submissionResult?.data?.plans?.length) return 0;
    return submissionResult.data.plans.reduce((sum: number, plan: any) => sum + (plan.totalPrice || 0), 0);
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Success Dialog */}
      <Transition.Root show={isSuccessDialogOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          initialFocus={cancelButtonRef}
          onClose={() => setIsSuccessDialogOpen(false)}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <DialogBackdrop className="fixed inset-0 bg-black/30 transition-opacity" />
            </Transition.Child>

            <span className="inline-block h-screen align-middle" aria-hidden="true">
              &#8203;
            </span>

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title as="h3" className="text-2xl font-bold text-gray-900">
                    Plan Details
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={() => setIsSuccessDialogOpen(false)}
                  >
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {submissionResult?.data && (
                  <div
                    className={`p-6 rounded-lg mb-6 ${submissionResult.data.provider.toLowerCase() === 'bell'
                        ? 'bg-blue-50'
                        : 'bg-red-50'
                      }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold">
                        {submissionResult.data.provider} - {submissionResult.data.customerType}
                      </h4>
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-white">
                        {submissionResult.data.lines}{' '}
                        {submissionResult.data.lines > 1 ? 'Lines' : 'Line'}
                      </span>
                    </div>

                    <div className="space-y-4">
                      {submissionResult.data.plans?.map((plan: any, index: number) => (
                        <div key={index} className="bg-white p-4 rounded-lg shadow">
                          <div className="flex justify-between items-center">
                            <div>
                              <h5 className="font-medium">{plan.planName}</h5>
                              <div className="text-sm text-gray-500">
                                {plan.data && <div>Data: {plan.data}</div>}
                                {plan.talk && <div>Talk: {plan.talk}</div>}
                                {plan.text && <div>Text: {plan.text}</div>}
                                <div>Contract: {plan.contractTerm}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-medium">${plan.linePrice}/line</div>
                              {submissionResult.data.lines > 1 && (
                                <div className="text-sm text-gray-500">
                                  {submissionResult.data.lines} × ${plan.linePrice} = ${plan.totalPrice}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      {submissionResult.data.plans?.length > 1 && (
                        <div className="flex justify-between items-center pt-4 mt-4 border-t border-gray-200">
                          <span className="font-semibold">Total Monthly Cost</span>
                          <span className="text-xl font-bold">
                            ${getTotalPrice().toFixed(2)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    onClick={() => setIsSuccessDialogOpen(false)}
                    ref={cancelButtonRef}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 text-sm font-medium text-white rounded-md ${submissionResult?.data?.provider.toLowerCase() === 'bell'
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-red-600 hover:bg-red-700'
                      }`}
                    onClick={() => {
                      setIsSuccessDialogOpen(false);
                      // Handle checkout or next steps
                    }}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>


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
                  onClick={async () => {
                    // Virgin + BYOD ends at step 4
                    if (selectedProvider?.toLowerCase() === 'virgin' && providerType === 'byod') {
                      await handleSubmit();
                    } else {
                      handleNext();
                    }
                  }}
                  className={`px-6 py-3 ${selectedProvider?.toLowerCase() === 'virgin' && providerType === 'byod'
                      ? 'bg-green-600 text-white'
                      : 'bg-[var(--primary)] text-[var(--primary-foreground)]'
                    } rounded-lg hover:opacity-90 transition-all font-medium`}
                >
                  {selectedProvider?.toLowerCase() === 'virgin' && providerType === 'byod' ? 'Submit' : 'Next'}
                </button>
              )}

              {(currentStep === 5 && selectedCategory) && (
                <button
                  onClick={async () => {
                    if (providerType === 'byod') {
                      // Handle BYOD completion
                      await handleSubmit();
                    } else {
                      handleNext();
                    }
                  }}
                  className={`px-6 py-3 ${providerType === 'byod'
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
                  onClick={async () => {
                    // Handle completion logic for non-BYOD flow
                    await handleSubmit();
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
            <div className={`flex ${(currentStep === 1 && (!selectedProvider || !customerType)) ||
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
