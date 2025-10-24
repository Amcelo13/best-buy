import * as XLSX from 'xlsx';
import path from 'path';
import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';

type RatePlan = {
  planName: string;
  price: number;
  data: string;
  talk: string;
  text: string;
  contractTerm: string;
  carrier: string;
  customerType: string;
};

type AssistFormData = {
  selectedProvider: string;
  customerType: string;
  providerType: string;
  lines: number;
  data: string;
  talk: string;
  text: string;
};

const RATE_PLAN_FILES: Record<string, Record<string, string>> = {
  bell: {
    epp: path.join(__dirname, '../../src/constants/bell_epp_rate_plans_cleaned.xlsx'),
    consumer: path.join(__dirname, '../../src/constants/bell_consumer_rate_plans_cleaned.xlsx'),
    small_business: path.join(__dirname, '../../src/constants/bell_small_business_rate_plans_cleaned.xlsx')
  },
  virgin: {
    consumer: path.join(__dirname, '../../src/constants/virgin_plus_rate_plans_cleaned.xlsx')
  }
};

const readRatePlans = (filePath: string): RatePlan[] => {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(worksheet);
  } catch (error) {
    console.error('Error reading Excel file:', error);
    return [];
  }
};

const filterPlans = (plans: RatePlan[], formData: AssistFormData): RatePlan[] => {
  return plans.filter(plan => {
    // Filter out roaming plans
    if (plan.planName.toLowerCase().includes('roam')) {
      return false;
    }

    // Filter by data if specified
    if (formData.data && plan.data !== formData.data) {
      return false;
    }

    // Filter by talk if specified
    if (formData.talk && plan.talk !== formData.talk) {
      return false;
    }

    // Filter by text if specified
    if (formData.text && plan.text !== formData.text) {
      return false;
    }

    return true;
  });
};

export const submitAssistForm = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const formData: AssistFormData = req.body;
    console.log('Form Data:', formData);

    // Basic validation
    if (!formData.selectedProvider || !formData.customerType || !formData.providerType) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Get the appropriate rate plan file
    const filePath = RATE_PLAN_FILES[formData.selectedProvider]?.[formData.customerType];
    if (!filePath) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid provider or customer type'
      });
    }

    // Read and filter rate plans
    const allPlans = readRatePlans(filePath);
    const filteredPlans = filterPlans(allPlans, formData);

    // Calculate total price for the requested number of lines
    const linePrices = filteredPlans.map(plan => ({
      ...plan,
      linePrice: parseFloat(plan.price.toString()),
      totalPrice: parseFloat(plan.price.toString()) * (formData.lines || 1)
    }));

    // Prepare response
    const response = {
      success: true,
      data: {
        provider: formData.selectedProvider,
        customerType: formData.customerType,
        lines: formData.lines || 1,
        plans: linePrices,
        totalPrice: linePrices.reduce((sum, plan) => sum + plan.totalPrice, 0)
      }
    };

    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    console.error('Error in submitAssistForm:', error);
    next(error);
  }
};