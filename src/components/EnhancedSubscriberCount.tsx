'use client';

import { PlusIcon, MinusIcon, TrashIcon, CopyIcon } from './Icons';
import { useState } from 'react';

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
  setSubscriberList: (list: Subscriber[]) => void;
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
}: SubscriberCountProps) {

  const increment = () => {
    setSubscriberCount(subscriberCount + 1);
  };

  const decrement = () => {
    if (subscriberCount > 1) {
      setSubscriberCount(subscriberCount - 1);
    }
  };

  const addToList = () => {
    const newSubscribers: Subscriber[] = [];
    for (let i = 0; i < subscriberCount; i++) {
      const newSubscriber: Subscriber = {
        id: Date.now() + i, // Add unique id for each subscriber
        providerType,
        planOption,
        planName: planNames[planOption] || planOption
      };
      newSubscribers.push(newSubscriber);
    }
    setSubscriberList([...subscriberList, ...newSubscribers]);
  };

  const removeFromList = (id: number) => {
    setSubscriberList(subscriberList.filter(sub => sub.id !== id));
  };

  const duplicateSubscriber = (subscriber: Subscriber) => {
    const duplicated: Subscriber = {
      ...subscriber,
      id: Date.now()
    };
    setSubscriberList([...subscriberList, duplicated]);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-center text-[var(--foreground)] mb-8">
        Number of Subscribers
      </h2>

      {/* Current Selection Summary */}
      <div className="bg-[var(--accent)] border border-[var(--primary)] rounded-lg p-4 mb-6">
        <div className="text-center">
          <p className="text-[var(--foreground)] font-medium">
            Adding subscribers for: <span className="font-bold text-blue-500">{providerType.toUpperCase()}</span> - <span className="font-bold text-blue-500">{planNames[planOption]}</span>
          </p>
        </div>
      </div>

      {/* Subscriber Counter */}
      <div className="flex flex-col items-center justify-center space-y-6">
        <div className="flex items-center space-x-8">
          <button
            onClick={decrement}
            disabled={subscriberCount <= 1}
            className="w-12 h-12 rounded-full bg-[var(--secondary)] text-[var(--secondary-foreground)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all"
          >
            <MinusIcon size={20} />
          </button>

          <div className="text-6xl font-bold text-[var(--primary)] min-w-[120px] text-center">
            {subscriberCount}
          </div>

          <button
            onClick={increment}
            className="w-12 h-12 rounded-full bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90 flex items-center justify-center transition-all"
          >
            <PlusIcon size={20} />
          </button>
        </div>

        <p className="text-[var(--muted-foreground)] text-center">
          Select the number of subscribers for this plan
        </p>

        {/* Add to List Button */}
        <button
          onClick={addToList}
          className="px-6 py-3 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:opacity-90 transition-all font-medium"
        >
          Add {subscriberCount} Subscriber{subscriberCount > 1 ? 's' : ''} to List
        </button>
      </div>

      {/* Subscriber List */}
      {subscriberList.length > 0 && (
        <div className="mt-8 bg-[var(--card)] rounded-xl border border-[var(--border)] p-6">
          <h3 className="text-lg font-bold text-[var(--foreground)] mb-4">
            Added Subscribers ({subscriberList.length})
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
                    onClick={() => removeFromList(subscriber.id)}
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
