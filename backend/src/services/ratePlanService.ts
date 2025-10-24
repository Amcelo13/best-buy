import * as XLSX from 'xlsx';
import path from 'path';
import { StatusCodes } from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';

type RatePlan = {
  TERM: string;
  TIER: string;
  DATA: string;
  ROAMING: string;
  'SOC CODE': string;
  ACTIVITY: string;
  'PRICE w/o AutoPay': number;
  'LINE 1': number;
  'LINE 2': number;
  'LINE 3': number;
  'LINE 4+': number;
};

type AssistFormData = {
  selectedProvider: string;
  customerType: string;
  providerType: string;
  selectedPlan: string;
  selectedCategory: string;
  selectedDevice?: any;
  subscriberCount?: number;
  subscriberList?: any[];
  lines: number;
  data: string;
  talk: string;
  text: string;
};

const RATE_PLAN_FILES: Record<string, Record<string, string>> = {
  bell: {
    epp: path.join(__dirname, '../../../src/constants/bell_epp_rate_plans_cleaned.xlsx'),
    consumer: path.join(__dirname, '../../../src/constants/bell_consumer_rate_plans_cleaned.xlsx'),
    'small-business': path.join(__dirname, '../../../src/constants/bell_small_business_rate_plans_cleaned.xlsx'),
    student: path.join(__dirname, '../../../src/constants/bell_epp_rate_plans_cleaned.xlsx') // Use EPP for student
  },
  virgin: {
    consumer: path.join(__dirname, '../../../src/constants/virgin_plus_rate_plans_cleaned.xlsx')
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
  const isByod = (formData.providerType || '').toLowerCase() === 'byod';

  // Primary filter with robust BYOD/BYOP detection and optional roaming filter
  let filtered = plans.filter(plan => {
    const termRaw = (plan.TERM ?? '').toString().toLowerCase();
    const isByodTerm = termRaw.includes('byod') || termRaw.includes('byop') || termRaw.includes('bring your own');

    // Provider type filtering
    if (isByod) {
      // Accept when clearly BYOD or when TERM is missing/ambiguous (some sheets omit TERM)
      if (!(isByodTerm || termRaw.trim() === '')) return false;
    } else {
      // Non-BYOD: exclude explicit BYOD/BYOP terms
      if (isByodTerm) return false;
    }

    // Optional roaming filter for explicit data-only selection
    if ((formData.selectedPlan || '').toLowerCase() === 'data') {
      // Only exclude international roaming when clearly marked as such; tolerate blanks
      const roaming = (plan.ROAMING ?? '').toString().toUpperCase();
      if (roaming === 'INT') return false;
    }

    return true;
  });

  // Fallback 1: if nothing matched, relax roaming constraint and only keep provider type
  if (filtered.length === 0) {
    filtered = plans.filter(plan => {
      const termRaw = (plan.TERM ?? '').toString().toLowerCase();
      const isByodTerm = termRaw.includes('byod') || termRaw.includes('byop') || termRaw.includes('bring your own');
      if (isByod) return (isByodTerm || termRaw.trim() === '');
      return !isByodTerm;
    });
  }

  // Fallback 2: if still empty, return all plans to avoid hard failure; ranking will pick best
  if (filtered.length === 0) {
    return plans;
  }

  return filtered;
};

const getLinePrice = (plan: RatePlan, lineNumber: number): number => {
  let price: any;
  switch (lineNumber) {
    case 1:
      price = plan['LINE 1'];
      break;
    case 2:
      price = plan['LINE 2'];
      break;
    case 3:
      price = plan['LINE 3'];
      break;
    default:
      price = plan['LINE 4+'];
      break;
  }
  
  // Convert price to number if it's a string
  if (typeof price === 'string') {
    return parseFloat(price.replace('$', '')) || 0;
  }
  return price || 0;
};

const calculateTotalCost = (plan: RatePlan, lines: number): number => {
  let total = 0;
  for (let i = 1; i <= lines; i++) {
    total += getLinePrice(plan, i);
  }
  return total;
};

const findBestDataPlan = (plans: RatePlan[], lines: number): any => {
  if (plans.length === 0) {
    return null;
  }
  
  // Convert data to GB for comparison
  const planWithDataGB = plans.map(plan => {
    const dataStr = plan.DATA || '0GB';
    const dataGB = parseInt(dataStr.replace('GB', '')) || 0;
    const totalCost = calculateTotalCost(plan, lines);
    return {
      ...plan,
      dataGB,
      totalCost
    };
  });

  // Find plan with highest data
  const bestDataPlan = planWithDataGB.reduce((best, current) => 
    current.dataGB > best.dataGB ? current : best
  );

  // Calculate line-by-line pricing
  const linePricing = [];
  for (let i = 1; i <= lines; i++) {
    linePricing.push({
      lineNumber: i,
      price: getLinePrice(bestDataPlan, i)
    });
  }

  return {
    planName: `${bestDataPlan.TERM} ${bestDataPlan.TIER}`,
    tier: bestDataPlan.TIER,
    data: bestDataPlan.DATA,
    roaming: bestDataPlan.ROAMING || 'N/A',
    socCode: bestDataPlan['SOC CODE'],
    activity: bestDataPlan.ACTIVITY,
    priceWithoutAutoPay: bestDataPlan['PRICE w/o AutoPay'],
    linePrice: getLinePrice(bestDataPlan, 1),
    totalCost: bestDataPlan.totalCost,
    lines: lines,
    linePricing: linePricing
  };
};

const findBestPricePlan = (plans: RatePlan[], lines: number): any => {
  if (plans.length === 0) return null;
  
  // Calculate total cost for each plan
  const planWithCosts = plans.map(plan => ({
    ...plan,
    totalCost: calculateTotalCost(plan, lines)
  }));

  // Find plan with lowest total cost
  const bestPricePlan = planWithCosts.reduce((best, current) => 
    current.totalCost < best.totalCost ? current : best
  );

  // Calculate line-by-line pricing
  const linePricing = [];
  for (let i = 1; i <= lines; i++) {
    linePricing.push({
      lineNumber: i,
      price: getLinePrice(bestPricePlan, i)
    });
  }

  return {
    planName: `${bestPricePlan.TERM} ${bestPricePlan.TIER}`,
    tier: bestPricePlan.TIER,
    data: bestPricePlan.DATA,
    roaming: bestPricePlan.ROAMING || 'N/A',
    socCode: bestPricePlan['SOC CODE'],
    activity: bestPricePlan.ACTIVITY,
    priceWithoutAutoPay: bestPricePlan['PRICE w/o AutoPay'],
    linePrice: getLinePrice(bestPricePlan, 1),
    totalCost: bestPricePlan.totalCost,
    lines: lines,
    linePricing: linePricing
  };
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
    if (!formData.selectedProvider || !formData.selectedCategory || !formData.providerType) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Get the appropriate rate plan file based on category
    const filePath = RATE_PLAN_FILES[formData.selectedProvider]?.[formData.selectedCategory];
    
    if (!filePath) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        success: false,
        message: 'Invalid provider or customer category'
      });
    }

    // Read and filter rate plans
    const allPlans = readRatePlans(filePath);
    const filteredPlans = filterPlans(allPlans, formData);

    if (filteredPlans.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: 'No plans found matching your criteria'
      });
    }

    const lines = formData.lines || 1;

    // Find best data and best price plans
    const bestDataPlan = findBestDataPlan(filteredPlans, lines);
    const bestPricePlan = findBestPricePlan(filteredPlans, lines);

    // Prepare response with the actual form data and calculated plans
    const response = {
      success: true,
      data: {
        id: Date.now().toString(),
        selectedProvider: formData.selectedProvider,
        customerType: formData.customerType,
        providerType: formData.providerType,
        selectedPlan: formData.selectedPlan,
        selectedCategory: formData.selectedCategory,
        selectedDevice: formData.selectedDevice || null,
        subscriberCount: formData.subscriberCount || 1,
        subscriberList: formData.subscriberList || [],
        lines: lines,
        data: formData.data || '',
        talk: formData.talk || '',
        text: formData.text || '',
        bestDataPlan,
        bestPricePlan,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    };

    return res.status(StatusCodes.OK).json(response);
  } catch (error) {
    console.error('Error in submitAssistForm:', error);
    next(error);
  }
};