'use client';

import React from 'react';
import { TrashIcon, CopyIcon, PlusIcon } from './Icons';

export interface Subscriber {
  id: number;
  providerType: 'byod' | 'smartpay';
  planOption: string;
  planName: string;
}

interface SubscriberCountProps {
  subscriberCount: number;
  setSubscriberCount: (count: number) => void;
  providerType: 'byod' | 'smartpay';
  planOption: string;
  subscriberList: Subscriber[];
  setSubscriberList: React.Dispatch<React.SetStateAction<Subscriber[]>>;
  onAddAnother?: () => void; // New prop to handle adding another subscriber
}

const planNames: Record<string, string> = {
  'talk-text': 'Talk & Text',
  'data': 'Data',
  'data-roaming': 'Data & Roaming'
};

export default function SubscriberCount({
  subscriberCount,
  setSubscriberCount,
  providerType,
  planOption,
  subscriberList,
  setSubscriberList,
  onAddAnother,
}: SubscriberCountProps) {

  // Auto-add current selection to list on component mount
  React.useEffect(() => {
    // Only add if this combination doesn't already exist in the list
    setSubscriberList(prevList => {
      const exists = prevList.some(sub => 
        sub.providerType === providerType && sub.planOption === planOption
      );
      
      if (!exists) {
        const newSubscriber: Subscriber = {
          id: Date.now() + Math.random(), // Ensure unique ID
          providerType,
          planOption,
          planName: planNames[planOption] || planOption
        };
        return [...prevList, newSubscriber];
      }
      return prevList;
    });
  }, [providerType, planOption, setSubscriberList]);

  const removeFromList = React.useCallback((id: number) => {
    // Use functional update to ensure we have the latest state
    setSubscriberList(prevList => {
      const newList = prevList.filter(sub => sub.id !== id);
      console.log('Removing subscriber with id:', id);
      console.log('Previous list length:', prevList.length);
      console.log('New list length:', newList.length);
      return newList;
    });
  }, [setSubscriberList]);

  const duplicateSubscriber = React.useCallback((subscriber: Subscriber) => {
    // Use functional update and ensure unique timestamp
    setSubscriberList(prevList => {
      const duplicated: Subscriber = {
        ...subscriber,
        id: Date.now() + Math.random() // Add randomness to ensure uniqueness
      };
      return [...prevList, duplicated];
    });
  }, [setSubscriberList]);

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-center text-[var(--foreground)] mb-8">
        Subscribers Added
      </h2>

      {/* Current Selection Summary */}
      <div className="bg-[var(--accent)] border border-[var(--primary)] rounded-lg p-4 mb-6">
        <div className="text-center">
          <p className="text-[var(--foreground)] font-medium">
            Current Selection: <span className="font-bold text-blue-500">{providerType.toUpperCase()}</span> - <span className="font-bold text-blue-500">{planNames[planOption]}</span>
          </p>
          <p className="text-[var(--muted-foreground)] text-sm mt-1">
            This has been automatically added to your subscriber list
          </p>
        </div>
      </div>

      {/* Add Another Subscriber Button */}
      <div className="flex justify-center">
        <button
          onClick={onAddAnother}
          className="flex items-center space-x-2 px-6 py-3 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:opacity-90 transition-all font-medium"
        >
          <PlusIcon size={20} />
          <span>Add Another Subscriber</span>
        </button>
      </div>

      {/* Subscriber List */}
      {subscriberList.length > 0 && (
        <div className="mt-8 bg-[var(--card)] rounded-xl border border-[var(--border)] p-6">
          <h3 className="text-lg font-bold text-[var(--foreground)] mb-4">
            Your Subscribers ({subscriberList.length})
          </h3>
          <div className="space-y-3">
            {subscriberList.map((subscriber, index) => (
              <div
                key={subscriber.id}
                className="flex items-center justify-between p-4 bg-[var(--muted)] rounded-lg border border-[var(--border)]"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-4">
                    <span className="text-[var(--foreground)] font-medium">
                      #{index + 1}
                    </span>
                    <div>
                      <p className="text-[var(--foreground)] font-medium">
                        {subscriber.providerType.toUpperCase()}
                      </p>
                      <p className="text-[var(--muted-foreground)] text-sm font-extrabold">
                        {subscriber.planName}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => duplicateSubscriber(subscriber)}
                    className="p-2 text-[var(--primary)] hover:bg-[var(--accent)] rounded-lg transition-all"
                    title="Duplicate"
                  >
                    <CopyIcon size={16} />
                  </button>
                  <button
                    onClick={() => {
                      if (subscriberList.length === 1) {
                        if (confirm('This is your last subscriber. Are you sure you want to remove it?')) {
                          removeFromList(subscriber.id);
                        }
                      } else {
                        removeFromList(subscriber.id);
                      }
                    }}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    title="Delete"
                  >
                    <TrashIcon size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* List Summary */}
          <div className="mt-4 pt-4 border-t border-[var(--border)]">
            <p className="text-[var(--muted-foreground)] text-sm text-center">
              Total subscribers in list: <span className="font-medium text-[var(--foreground)]">{subscriberList.length}</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
