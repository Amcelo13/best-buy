'use client';

import { PlusIcon, MinusIcon, CheckIcon } from './Icons';

interface SubscriberCountProps {
  subscriberCount: number;
  setSubscriberCount: (count: number) => void;
}

export default function SubscriberCount({
  subscriberCount,
  setSubscriberCount,
}: SubscriberCountProps) {
  const increment = () => {
    setSubscriberCount(subscriberCount + 1);
  };

  const decrement = () => {
    if (subscriberCount > 1) {
      setSubscriberCount(subscriberCount - 1);
    }
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
        <div className="mt-8">
          <div className="flex flex-wrap justify-center gap-3 max-w-2xl">
            {Array.from({ length: subscriberCount }).map((_, index) => (
              <div
                key={index}
                className="w-12 h-12 bg-[var(--accent)] rounded-full flex items-center justify-center text-[var(--primary)] font-semibold animate-fade-in border border-[var(--border)]"
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="mt-12 space-y-4">
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[var(--foreground)] mb-4">Plan Details</h3>
          <div className="space-y-2 text-[var(--foreground)]">
            <div className="flex justify-between">
              <span>Number of Subscribers:</span>
              <span className="font-semibold">{subscriberCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Base Price per Subscriber:</span>
              <span className="font-semibold">$25/month</span>
            </div>
            <div className="flex justify-between border-t border-[var(--border)] pt-2 mt-2">
              <span className="font-bold">Total Monthly Cost:</span>
              <span className="font-bold text-[var(--primary)]">
                ${(subscriberCount * 25).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-[var(--accent)] border border-[var(--primary)] rounded-lg p-4">
          <p className="text-sm text-[var(--foreground)] flex items-center gap-2">
            <CheckIcon className="text-[var(--primary)]" size={16} />
            <strong>Special Offer:</strong> Add 5 or more subscribers and get 10% off!
          </p>
        </div>
      </div>

      {/* Features List */}
      <div className="mt-8 bg-[var(--muted)] rounded-lg p-6 border border-[var(--border)]">
        <h4 className="font-semibold text-[var(--foreground)] mb-3">Included Features:</h4>
        <ul className="space-y-2 text-[var(--foreground)]">
          <li className="flex items-center gap-2">
            <CheckIcon className="text-[var(--primary)]" size={16} />
            Unlimited calls and texts
          </li>
          <li className="flex items-center gap-2">
            <CheckIcon className="text-[var(--primary)]" size={16} />
            5G network access
          </li>
          <li className="flex items-center gap-2">
            <CheckIcon className="text-[var(--primary)]" size={16} />
            Shared data pool
          </li>
          <li className="flex items-center gap-2">
            <CheckIcon className="text-[var(--primary)]" size={16} />
            24/7 customer support
          </li>
        </ul>
      </div>
    </div>
  );
}
