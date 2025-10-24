import { AssistFormData } from '@/types/assist.types';
import { api } from './axios';

export const submitAssistForm = async (formData: AssistFormData) => {
  try {
    const response = await api.post('/assist', formData);
    return response;
  } catch (error) {
    console.error('Error submitting form:', error);
    throw error;
  }
};

export const updateAssistForm = async (id: string, formData: Partial<AssistFormData>) => {
  try {
    const response = await api.put(`/assist/${id}`, formData);
    return response;
  } catch (error) {
    console.error('Error updating form:', error);
    throw error;
  }
};
