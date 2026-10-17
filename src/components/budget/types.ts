
export type BudgetStatus = 'draft' | 'approved' | 'closed';

export interface BudgetHeaderInfo {
  fiscalYear: string;
  version: string;
  orgUnit: string;
  baseCurrency: string;
  secondaryCurrency: string;
  exchangeRate: number;
  status: BudgetStatus;
  description?: string;
  startDate: string;
  endDate: string;
}

export interface IndirectPayrollRecord {
  id: string;
  role: string;
  workLocationId: string;
  workLocationName: string;
  workLocationCode: string;
  month: number;
  headcount: number;
  amountPerPerson: number;
  amountBaseCurrency: number;
  exchangeRate: number;
  amountSecondaryCurrency: number;
  description: string;
}

export interface OtherIncomeExpenseRecord {
  id: string;
  accountCode: string;
  accountTitle: string;
  accountGroup: string;
  nature: 'income' | 'expense' | 'control';
  month: number;
  amountBaseCurrency: number;
  exchangeRate: number;
  amountSecondaryCurrency: number;
  costCenter: string;
  description: string;
}

export interface InflationPurchasePriceRecord {
  id: string;
  itemCode: string;
  itemTitle: string;
  supplyGroup: string;
  uom: string;
  month: number;
  lastPurchaseDate: string;
  lastPurchasePrice: number;
  forecastInflationRate: number;
  forecastPurchasePrice: number;
  inflationSource: string;
  description: string;
}

export interface ExchangeRateResearch {
  id: string;
  title: string;
  fiscalYear: string;
  startDate: string;
  endDate: string;
  baseCurrency: string;
  secondaryCurrency: string;
  rateDirection: string; // e.g., "تعداد ریال برای یک یورو"
  researchDate: string;
  version: string;
  status: BudgetStatus;
  description: string;
  
  // Inputs
  currentRate: number;
  currentRateDate: string;
  baseInflation: number;
  secondaryInflation: number;
  baseInterestRate: number;
  secondaryInterestRate: number;
  marketForecastEnd?: number;
  riskAdjustmentPercent?: number;
}

export interface ExchangeRateSource {
  id: string;
  title: string;
  type: 'Central Bank' | 'IMF' | 'Bank' | 'Research Institute' | 'Internal Analysis' | 'Other';
  region: string;
  indexUsed: string;
  extractedValue: number;
  publishDate: string;
  observationDate: string;
  link?: string;
  description: string;
}
