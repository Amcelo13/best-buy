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

// Normalize roaming string for consistent comparison
const normalizeRoaming = (r?: string): string => {
  if (!r) return '';
  return r.toString().trim().toUpperCase().replace(/\s+/g, ' ');
};

const findBestDataPlan = (plans: RatePlan[], lines: number, formData?: AssistFormData): any => {
  if (plans.length === 0) {
    return null;
  }
  
  const planType = (formData?.selectedPlan || '').toLowerCase();
  
  // Filter out international roaming plans first
  const nonIntPlans = plans.filter(plan => {
    const roaming = normalizeRoaming(plan.ROAMING);
    return roaming !== 'INT';
  });
  
  // Use filtered plans if available, otherwise fallback to all plans
  const filteredPlans = nonIntPlans.length > 0 ? nonIntPlans : plans;
  
  // Convert data to GB for comparison
  const planWithDataGB = filteredPlans.map(plan => {
    const dataStr = (plan.DATA || '').toString().trim();
    let dataGB = 0;
    
    // Handle different data formats
    if (dataStr && dataStr !== '-' && dataStr !== 'N/A' && dataStr !== '') {
      // Extract number from strings like "50GB", "100 GB", etc.
      const match = dataStr.match(/(\d+\.?\d*)\s*GB/i);
      if (match) {
        dataGB = parseFloat(match[1]);
      }
    }
    
    const totalCost = calculateTotalCost(plan, lines);
    return {
      ...plan,
      dataGB,
      totalCost
    };
  });

  let bestDataPlan;
  
  // For talk/text plans, prioritize plans with no data ("-")
  if (planType.includes('talk')) {
    const noDataPlans = planWithDataGB.filter(p => p.dataGB === 0);
    if (noDataPlans.length > 0) {
      // Get the cheapest plan with no data
      bestDataPlan = noDataPlans.reduce((best, current) => 
        current.totalCost < best.totalCost ? current : best
      );
    } else {
      // Fallback to cheapest plan overall
      bestDataPlan = planWithDataGB.reduce((best, current) => 
        current.totalCost < best.totalCost ? current : best
      );
    }
  } else {
    // For data plans, get the one with highest data
    const plansWithData = planWithDataGB.filter(p => p.dataGB > 0);
    
    if (plansWithData.length > 0) {
      bestDataPlan = plansWithData.reduce((best, current) => 
        current.dataGB > best.dataGB ? current : best
      );
    } else {
      // If no data plans found, use the cheapest plan with "-" (no data)
      bestDataPlan = planWithDataGB.reduce((best, current) => 
        current.totalCost < best.totalCost ? current : best
      );
    }
  }

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
    data: bestDataPlan.DATA || '-',
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

const findBestPricePlan = (plans: RatePlan[], lines: number, formData?: AssistFormData): any => {
  if (plans.length === 0) return null;

  const isByod = (formData?.providerType || '').toLowerCase() === 'byod';
  const planType = (formData?.selectedPlan || '').toLowerCase();

  let candidates = plans;

  if (isByod) {
    const allowedRoaming = new Set(['', '-', 'US', 'US / MX', 'US/MX']);

    if (planType.includes('talk')) {
      // Talk & Text: prefer BYOD plans with no data ("-") and avoid INT roaming
      candidates = plans.filter(p => {
        const dataStr = (p.DATA ?? '').toString().trim().toUpperCase();
        const isNoData = dataStr === '' || dataStr === '-' || dataStr === 'N/A';
        const roaming = normalizeRoaming(p.ROAMING);
        const isInt = roaming === 'INT';
        return isNoData && !isInt;
      });

      // If none matched strictly no-data, relax to any non-INT BYOD plan
      if (candidates.length === 0) {
        candidates = plans.filter(p => {
          const roaming = normalizeRoaming(p.ROAMING);
          return roaming !== 'INT';
        });
      }
    } else if (planType.includes('data')) {
      // Data-centric: require tangible data and avoid INT roaming
      candidates = plans.filter(p => {
        const dataStr = (p.DATA || '').toString().toUpperCase();
        const hasData = /\d+\s*GB/.test(dataStr);
        const roaming = normalizeRoaming(p.ROAMING);
        const roamingAllowed = allowedRoaming.has(roaming);
        const isInt = roaming === 'INT';
        return hasData && !isInt && (roamingAllowed || roaming === '');
      });
      
      // If no data plans found, fallback to plans with "-"
      if (candidates.length === 0) {
        candidates = plans.filter(p => {
          const dataStr = (p.DATA ?? '').toString().trim().toUpperCase();
          const roaming = normalizeRoaming(p.ROAMING);
          return (dataStr === '-' || dataStr === '') && roaming !== 'INT';
        });
      }
    } else {
      // Combined or other: prefer plans with data but allow no-data fallback
      candidates = plans.filter(p => {
        const roaming = normalizeRoaming(p.ROAMING);
        return roaming !== 'INT';
      });
    }
  }

  // If filtering removed everything, fallback to original list to avoid hard failure
  if (candidates.length === 0) {
    candidates = plans;
  }
  
  // Calculate total cost for each candidate
  const planWithCosts = candidates.map(plan => ({
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
    data: bestPricePlan.DATA || '-',
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

    // Always calculate both best data plan and best price plan
    const bestDataPlan = findBestDataPlan(filteredPlans, lines, formData);
    const bestPricePlan = findBestPricePlan(filteredPlans, lines, formData);

    if (!bestDataPlan && !bestPricePlan) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Unable to determine best plans'
      });
    }

    // Generate a unique ID for this submission
    const submissionId = `SUB-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    const response = {
      success: true,
      data: {
        id: submissionId,
        selectedProvider: formData.selectedProvider,
        customerType: formData.customerType,
        selectedCategory: formData.selectedCategory,
        providerType: formData.providerType,
        selectedPlanType: formData.selectedPlan,
        lines,
        bestDataPlan: bestDataPlan,
        bestPricePlan: bestPricePlan,
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