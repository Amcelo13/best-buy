'use client';

import { useState } from 'react';
import { CheckIcon } from './Icons';

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

interface DeviceSelectionProps {
  selectedDevice: Device | null;
  setSelectedDevice: (device: Device | null) => void;
}

const devices: Device[] = [
  // iPhones
  {
    id: 'iphone-15-pro-max-256gb-black',
    name: 'iPhone 15 Pro Max',
    brand: 'Apple',
    model: 'iPhone 15 Pro Max',
    color: 'Natural Titanium',
    storage: '256GB',
    price: 1199,
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-max-naturaltitanium-select?wid=470&hei=556&fmt=png-alpha&.v=1692895855329',
    category: 'smartphone'
  },
  {
    id: 'iphone-15-128gb-pink',
    name: 'iPhone 15',
    brand: 'Apple',
    model: 'iPhone 15',
    color: 'Pink',
    storage: '128GB',
    price: 799,
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pink-select-202309?wid=470&hei=556&fmt=png-alpha&.v=1692895856458',
    category: 'smartphone'
  },
  {
    id: 'iphone-14-128gb-blue',
    name: 'iPhone 14',
    brand: 'Apple',
    model: 'iPhone 14',
    color: 'Blue',
    storage: '128GB',
    price: 699,
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-blue-select-2022?wid=470&hei=556&fmt=png-alpha&.v=1660780435012',
    category: 'smartphone'
  },
  {
    id: 'iphone-13-128gb-midnight',
    name: 'iPhone 13',
    brand: 'Apple',
    model: 'iPhone 13',
    color: 'Midnight',
    storage: '128GB',
    price: 599,
    image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-13-midnight-select-2021?wid=470&hei=556&fmt=png-alpha&.v=1645572315424',
    category: 'smartphone'
  },
  // Samsung Phones
  {
    id: 'galaxy-s24-ultra-256gb-titanium',
    name: 'Galaxy S24 Ultra',
    brand: 'Samsung',
    model: 'Galaxy S24 Ultra',
    color: 'Titanium Gray',
    storage: '256GB',
    price: 1199,
    image: 'https://images.samsung.com/is/image/samsung/p6pim/ca/2401/gallery/ca-galaxy-s24-s928-sm-s928wzaaxac-thumb-539573072',
    category: 'smartphone'
  },
  {
    id: 'galaxy-s24-128gb-violet',
    name: 'Galaxy S24',
    brand: 'Samsung',
    model: 'Galaxy S24',
    color: 'Cobalt Violet',
    storage: '128GB',
    price: 799,
    image: 'https://images.samsung.com/is/image/samsung/p6pim/ca/2401/gallery/ca-galaxy-s24-s921-sm-s921bzvcxac-thumb-539573041',
    category: 'smartphone'
  },
  {
    id: 'galaxy-a54-128gb-black',
    name: 'Galaxy A54 5G',
    brand: 'Samsung',
    model: 'Galaxy A54',
    color: 'Awesome Graphite',
    storage: '128GB',
    price: 449,
    image: 'https://images.samsung.com/is/image/samsung/p6pim/ca/2303/gallery/ca-galaxy-a54-5g-a546-sm-a546vzkcxac-thumb-535406925',
    category: 'smartphone'
  },
  {
    id: 'galaxy-z-flip5-256gb-mint',
    name: 'Galaxy Z Flip5',
    brand: 'Samsung',
    model: 'Galaxy Z Flip5',
    color: 'Mint',
    storage: '256GB',
    price: 999,
    image: 'https://images.samsung.com/is/image/samsung/p6pim/ca/2307/gallery/ca-galaxy-z-flip5-f731-sm-f731bzgcxac-thumb-537515739',
    category: 'smartphone'
  }
];

export default function DeviceSelection({
  selectedDevice,
  setSelectedDevice,
}: DeviceSelectionProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedStorage, setSelectedStorage] = useState('');
  const [priceRange, setPriceRange] = useState('');

  // Get unique filter options
  const brands = [...new Set(devices.map(device => device.brand))];
  const colors = [...new Set(devices.map(device => device.color))];
  const storageOptions = [...new Set(devices.map(device => device.storage))];

  // Filter devices based on selected filters
  const filteredDevices = devices.filter(device => {
    const matchesSearch = device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         device.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrand = !selectedBrand || device.brand === selectedBrand;
    const matchesColor = !selectedColor || device.color === selectedColor;
    const matchesStorage = !selectedStorage || device.storage === selectedStorage;
    
    let matchesPrice = true;
    if (priceRange) {
      const price = device.price;
      switch (priceRange) {
        case 'under-500':
          matchesPrice = price < 500;
          break;
        case '500-800':
          matchesPrice = price >= 500 && price <= 800;
          break;
        case '800-1000':
          matchesPrice = price >= 800 && price <= 1000;
          break;
        case 'over-1000':
          matchesPrice = price > 1000;
          break;
      }
    }

    return matchesSearch && matchesBrand && matchesColor && matchesStorage && matchesPrice;
  });

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedBrand('');
    setSelectedColor('');
    setSelectedStorage('');
    setPriceRange('');
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-center text-[var(--foreground)] mb-8">
        Choose Your Device
      </h2>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by device name, model, etc."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-10 border border-[var(--border)] rounded-lg bg-[var(--card)] text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <svg className="w-5 h-5 text-[var(--muted-foreground)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[var(--muted)] rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-[var(--foreground)]">Filters</h3>
          <button
            onClick={resetFilters}
            className="text-[var(--primary)] hover:underline text-sm"
          >
            Reset filters
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {/* Brand Filter */}
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--card)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          >
            <option value="">All Brands</option>
            {brands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>

          {/* Color Filter */}
          <select
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--card)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          >
            <option value="">All Colors</option>
            {colors.map(color => (
              <option key={color} value={color}>{color}</option>
            ))}
          </select>

          {/* Storage Filter */}
          <select
            value={selectedStorage}
            onChange={(e) => setSelectedStorage(e.target.value)}
            className="px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--card)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          >
            <option value="">All Storage</option>
            {storageOptions.map(storage => (
              <option key={storage} value={storage}>{storage}</option>
            ))}
          </select>

          {/* Price Filter */}
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="px-3 py-2 border border-[var(--border)] rounded-lg bg-[var(--card)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          >
            <option value="">All Prices</option>
            <option value="under-500">Under $500</option>
            <option value="500-800">$500 - $800</option>
            <option value="800-1000">$800 - $1000</option>
            <option value="over-1000">Over $1000</option>
          </select>

          {/* Results Count */}
          <div className="flex items-center text-sm text-[var(--muted-foreground)]">
            Showing {filteredDevices.length} of {devices.length} devices
          </div>
        </div>
      </div>

      {/* Device Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDevices.map((device) => (
          <div
            key={device.id}
            onClick={() => setSelectedDevice(device)}
            className={`p-6 rounded-xl border-2 cursor-pointer transition-all hover:scale-105 ${
              selectedDevice?.id === device.id
                ? 'border-[var(--primary)] bg-[var(--accent)] shadow-lg'
                : 'border-[var(--border)] bg-[var(--card)] hover:border-[var(--primary)]'
            }`}
          >
            <div className="text-center">
              {/* Device Image */}
              <div className="w-32 h-40 mx-auto mb-4 bg-[var(--muted)] rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src={device.image}
                  alt={device.name}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.parentElement!.innerHTML = `<div class="text-[var(--muted-foreground)] text-sm">No Image</div>`;
                  }}
                />
              </div>

              {/* Device Info */}
              <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">{device.name}</h3>
              <p className="text-[var(--muted-foreground)] text-sm mb-2">{device.storage} • {device.color}</p>
              <p className="text-xl font-bold text-[var(--primary)] mb-4">${device.price}</p>

              {selectedDevice?.id === device.id && (
                <CheckIcon className="text-[var(--primary)] mx-auto" size={20} />
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredDevices.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[var(--muted-foreground)] text-lg">No devices found matching your criteria.</p>
          <button
            onClick={resetFilters}
            className="mt-4 px-6 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:opacity-90"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Selection Summary */}
      {selectedDevice && (
        <div className="mt-6 p-4 bg-[var(--accent)] border-2 border-[var(--primary)] rounded-lg animate-fade-in">
          <div className="flex items-center justify-center gap-2">
            <CheckIcon className="text-[var(--primary)]" size={20} />
            <p className="text-center text-[var(--foreground)] font-medium">
              Selected: {selectedDevice.name} ({selectedDevice.storage}, {selectedDevice.color}) - ${selectedDevice.price}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
