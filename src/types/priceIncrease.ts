
export type PriceStatus = 'critical_increase' | 'increase' | 'no_change' | 'decrease' | 'no_basis' | 'no_transaction';

export interface PurchaseDetail {
  id: string;
  year: number;
  month: number;
  date: string;
  docNumber: string;
  docType: string;
  itemCode: string;
  itemTitle: string;
  purchaseGroup: string;
  unit: string;
  quantity: number;
  purchasePrice: number;
  totalPrice: number;
  amount: number;
  netAmount: number;
  currency: string;
  exchangeRate: number;
  supplier: string;
  warehouse: string;
  baseDocNumber?: string;
  description?: string;
  shippingCost?: number;
}

export interface MonthlyPurchaseSummary {
  itemCode: string;
  itemTitle: string;
  purchaseGroup: string;
  unit: string;
  month: number;
  quantity: number;
  netAmount: number;
  weightedAvgPrice: number;
  minPrice: number;
  maxPrice: number;
  docCount: number;
  lastPrice: number;
  changePercent: number;
}

export interface ItemPriceChange {
  itemCode: string;
  itemTitle: string;
  purchaseGroup: string;
  unit: string;
  basePrice: number;
  cumulativeChange: number;
  status: PriceStatus;
  monthlyData: {
    month: number;
    weightedAvgPrice: number;
    changePercent: number;
    hasTransaction: boolean;
  }[];
}

export interface GroupPriceChange {
  id: string;
  code: string;
  title: string;
  level: number;
  parentId: string | null;
  itemCount: number;
  activeItemCount: number;
  prevMonthAmount: number;
  currentMonthAmount: number;
  weightedAvgIncrease: number;
  minItemChange: number;
  maxItemChange: number;
  cumulativeChange: number;
  status: PriceStatus;
}

export interface SaleDetail {
  id: string;
  itemCode: string;
  itemTitle: string;
  salesGroup: string;
  unit: string;
  basePrice: number;
  cumulativeChange: number;
  status: PriceStatus;
  monthlyData: {
    month: number;
    weightedAvgPrice: number;
    changePercent: number;
    hasTransaction: boolean;
  }[];
}

export interface PurchasePriceBasis {
  itemCode: string;
  itemTitle: string;
  purchaseGroup: string;
  lastMonthPrevYear: string;
  lastValidPrice: number;
  lastPurchaseDate: string;
  lastSupplier: string;
  status: 'valid' | 'no_basis';
}

export interface SalesPriceBasis {
  itemCode: string;
  itemTitle: string;
  salesGroup: string;
  lastMonthPrevYear: string;
  lastValidPrice: number;
  lastSaleDate: string;
  lastCustomer: string;
  status: 'valid' | 'no_basis';
}

export interface ItemGroupMapping {
  itemCode: string;
  itemTitle: string;
  purchaseGroup: string;
  salesGroup: string;
  itemType: string;
  unit: string;
  status: 'ok' | 'warning';
}
