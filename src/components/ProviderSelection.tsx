'use client';

import { useState } from 'react';
import Image from 'next/image';
import { DndContext, DragEndEvent, DragOverlay, useDraggable, useDroppable, DragStartEvent } from '@dnd-kit/core';
import { UserIcon, UsersIcon, CheckIcon } from './Icons';

interface ProviderSelectionProps {
  selectedProvider: string | null;
  setSelectedProvider: (provider: string | null) => void;
  customerType: 'new' | 'existing' | null;
  setCustomerType: (type: 'new' | 'existing' | null) => void;
}

const providers = [
  { id: 'bell', name: 'Bell', logo: '/logos/Bell.png' },
  { id: 'virgin', name: 'Virgin', logo: '/logos/Virgin.png' },
];

function DraggableProvider({ id, name, logo }: { id: string; name: string; logo: string }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        opacity: isDragging ? 0.5 : 1,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="bg-[var(--card)] rounded-xl shadow-lg p-6 border-2 border-[var(--border)] hover:border-[var(--primary)] transition-all cursor-grab active:cursor-grabbing touch-none"
    >
      <div className="flex justify-center mb-3">
        <Image src={logo} alt={name} width={100} height={60} className="object-contain" />
      </div>
      <h3 className="text-lg font-bold text-center text-[var(--foreground)]">{name}</h3>
    </div>
  );
}

function DropZone({ 
  id, 
  type, 
  icon: Icon, 
  droppedProvider 
}: { 
  id: string; 
  type: string; 
  icon: any; 
  droppedProvider?: { name: string; logo: string } | null;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`h-full min-h-[400px] rounded-xl border-4 border-dashed transition-all p-8 flex flex-col items-center justify-center ${
        isOver
          ? 'border-[var(--primary)] bg-[var(--accent)] scale-105'
          : droppedProvider
          ? 'border-[var(--primary)] bg-[var(--accent)]'
          : 'border-[var(--border)] bg-[var(--muted)]'
      }`}
    >
      {droppedProvider ? (
        <div className="flex flex-col items-center">
          <div className="mb-4 bg-[var(--card)] rounded-xl p-4 shadow-lg">
            <Image 
              src={droppedProvider.logo} 
              alt={droppedProvider.name}
              width={120}
              height={80}
              className="object-contain"
            />
          </div>
          <h3 className="text-xl font-bold text-[var(--primary)] mb-2">{droppedProvider.name}</h3>
          <p className="text-sm text-[var(--muted-foreground)]">{type}</p>
          <CheckIcon className="text-[var(--primary)] mt-2" size={24} />
        </div>
      ) : (
        <>
          <Icon className="text-[var(--primary)] mb-4" size={48} />
          <h3 className="text-2xl font-bold text-[var(--foreground)] mb-2">{type}</h3>
          <p className="text-[var(--muted-foreground)] text-center">Drop provider here</p>
        </>
      )}
    </div>
  );
}

export default function ProviderSelection({
  selectedProvider,
  setSelectedProvider,
  customerType,
  setCustomerType,
}: ProviderSelectionProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over) {
      const providerId = active.id as string;
      const dropZone = over.id as string;

      setSelectedProvider(providerId);

      if (dropZone === 'new-customer') {
        setCustomerType('new');
      } else if (dropZone === 'existing-customer') {
        setCustomerType('existing');
      }
    }

    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  const activeProvider = providers.find(p => p.id === activeId);
  const selectedProviderData = selectedProvider ? providers.find(p => p.id === selectedProvider) : null;

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-center text-[var(--foreground)] mb-8">
          Drag Provider to Customer Type
        </h2>

        {/* Main Layout: Left Zone | Center Providers | Right Zone */}
        <div className="grid grid-cols-12 gap-6 items-center">
          {/* Left Drop Zone - New Customers */}
          <div className="col-span-4">
            <DropZone 
              id="new-customer" 
              type="New Customers" 
              icon={UserIcon}
              droppedProvider={customerType === 'new' && selectedProviderData ? selectedProviderData : null}
            />
          </div>

          {/* Center - Provider Cards (Vertical Stack) */}
          <div className="col-span-4 space-y-6">
            {providers.map((provider) => (
              <DraggableProvider
                key={provider.id}
                id={provider.id}
                name={provider.name}
                logo={provider.logo}
              />
            ))}
          </div>

          {/* Right Drop Zone - Existing Customers */}
          <div className="col-span-4">
            <DropZone 
              id="existing-customer" 
              type="Existing Customers" 
              icon={UsersIcon}
              droppedProvider={customerType === 'existing' && selectedProviderData ? selectedProviderData : null}
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="text-center mt-6">
          <p className="text-[var(--muted-foreground)] text-sm">
            👆 Drag a provider to either New or Existing Customers zone
          </p>
        </div>

        {/* Selection Summary */}
        {selectedProvider && customerType && (
          <div className="mt-6 p-4 bg-[var(--accent)] border-2 border-[var(--primary)] rounded-lg animate-fade-in">
            <div className="flex items-center justify-center gap-2">
              <CheckIcon className="text-[var(--primary)]" size={20} />
              <p className="text-center text-[var(--foreground)] font-medium">
                Selected: {providers.find((p) => p.id === selectedProvider)?.name} for{' '}
                {customerType === 'new' ? 'New' : 'Existing'} Customers
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Drag Overlay */}
      <DragOverlay>
        {activeId && activeProvider ? (
          <div className="bg-[var(--card)] rounded-xl shadow-2xl p-6 border-2 border-[var(--primary)] opacity-90 rotate-3">
            <div className="flex justify-center mb-3">
              <Image
                src={activeProvider.logo}
                alt={activeProvider.name}
                width={100}
                height={60}
                className="object-contain"
              />
            </div>
            <h3 className="text-lg font-bold text-center text-[var(--foreground)]">
              {activeProvider.name}
            </h3>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
