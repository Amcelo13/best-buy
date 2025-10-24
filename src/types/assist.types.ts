import { Subscriber } from "@/components/EnhancedSubscriberCount";
import { Device } from "@/constants/devices";

export type ProviderType = 'byod' | 'smartpay' | null;
export type CustomerType = 'new' | 'existing' | null;

export interface AssistFormData {
  selectedProvider: string | null;
  customerType: CustomerType;
  providerType: ProviderType;
  selectedPlan: string | null;
  selectedCategory: string | null;
  selectedDevice: Device | null;
  subscriberCount: number;
  subscriberList: Subscriber[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
