// Device types that would be used in the form
export interface Device {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  // Add other device properties as needed
}

// Subscriber information
export interface Subscriber {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  // Add other subscriber properties as needed
}

export type ProviderType = 'byod' | 'smartpay' | null;
export type CustomerType = 'new' | 'existing' | null;

export interface AssistFormData {
  id?: string;
  selectedProvider: string | null;
  customerType: CustomerType;
  providerType: ProviderType;
  selectedPlan: string | null;
  selectedCategory: string | null;
  selectedDevice: Device | null;
  subscriberCount: number;
  subscriberList: Subscriber[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  count?: number;
}
