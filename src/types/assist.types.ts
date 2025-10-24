import { Subscriber } from "@/components/EnhancedSubscriberCount";
import { Device } from "@/constants/devices";

export type ProviderType = 'byod' | 'smartpay' | null;
export type CustomerType = 'new' | 'existing' | null;

export interface PlanDetails {
  planName: string;
  price: number;
  data: string;
  talk: string;
  text: string;
  contractTerm: string;
  linePrice: number;
  totalPrice: number;
}

export interface AssistFormData {
  selectedProvider: string | null;
  customerType: CustomerType;
  providerType: ProviderType;
  selectedPlan: string | null;
  selectedCategory: string | null;
  selectedDevice: Device | null;
  subscriberCount: number;
  subscriberList: Subscriber[];
  lines?: number;
  data?: string;
  talk?: string;
  text?: string;
  plans?: PlanDetails[];
  totalPrice?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
