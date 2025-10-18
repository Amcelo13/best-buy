'use client';

import { CheckIcon } from './Icons';

interface CustomerCategoryProps {
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
}

const categoryOptions = [
  { id: 'consumer', name: 'Consumer', description: 'Personal use customers' },
  { id: 'student', name: 'Student', description: 'Student discounts and plans' },
  { id: 'epp', name: 'EPP', description: 'Employee Purchase Program' },
  { id: 'small-business', name: 'Small Business', description: 'Small business solutions' }
];

export default function CustomerCategory({
  selectedCategory,
  setSelectedCategory,
}: CustomerCategoryProps) {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-center text-[var(--foreground)] mb-8">
        Choose Customer Category
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
        {categoryOptions.map((category) => (
          <div
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`p-6 rounded-xl border-2 cursor-pointer transition-all hover:scale-105 ${
              selectedCategory === category.id
                ? 'border-[var(--primary)] bg-[var(--accent)] shadow-lg'
                : 'border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]'
            }`}
          >
            <div className="text-center">
              <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
                selectedCategory === category.id 
                  ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' 
                  : 'bg-[var(--muted)] text-[var(--muted-foreground)]'
              }`}>
                <span className="text-lg font-bold">{category.name.charAt(0)}</span>
              </div>
              <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">{category.name}</h3>
              <p className="text-[var(--muted-foreground)] text-sm mb-4">
                {category.description}
              </p>
              {selectedCategory === category.id && (
                <CheckIcon className="text-[var(--primary)] mx-auto" size={20} />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Selection Summary */}
      {selectedCategory && (
        <div className="mt-6 p-4 bg-[var(--accent)] border-2 border-[var(--primary)] rounded-lg animate-fade-in">
          <div className="flex items-center justify-center gap-2">
            <CheckIcon className="text-[var(--primary)]" size={20} />
            <p className="text-center text-[var(--foreground)] font-medium">
              Selected: {categoryOptions.find(cat => cat.id === selectedCategory)?.name}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
