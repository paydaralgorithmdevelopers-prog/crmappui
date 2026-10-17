
import { 
  PurchaseDetail, 
  MonthlyPurchaseSummary, 
  ItemPriceChange, 
  GroupPriceChange, 
  PurchasePriceBasis, 
  ItemGroupMapping,
  SalesPriceBasis,
  SaleDetail
} from '../types/priceIncrease';

export const mockPurchaseDetails: PurchaseDetail[] = [
  {
    id: '1',
    year: 1405,
    month: 1,
    date: '1405/01/15',
    docNumber: 'PH-1001',
    docType: 'فاکتور خرید',
    itemCode: 'PRD-001',
    itemTitle: 'ورق فولادی ۲ میل',
    purchaseGroup: 'مواد اولیه فلزی',
    unit: 'کیلوگرم',
    quantity: 1000,
    purchasePrice: 450000,
    totalPrice: 450000000,
    amount: 450000000,
    netAmount: 450000000,
    currency: 'ریال',
    exchangeRate: 1,
    supplier: 'فولاد مبارکه',
    warehouse: 'انبار مرکزی',
    description: 'خرید پارت اول سال'
  },
  {
    id: '2',
    year: 1405,
    month: 1,
    date: '1405/01/20',
    docNumber: 'PH-1002',
    docType: 'فاکتور خرید',
    itemCode: 'PRD-002',
    itemTitle: 'الکترود جوشکاری',
    purchaseGroup: 'ملزومات تولید',
    unit: 'بسته',
    quantity: 50,
    purchasePrice: 1200000,
    totalPrice: 60000000,
    amount: 60000000,
    netAmount: 60000000,
    currency: 'ریال',
    exchangeRate: 1,
    supplier: 'جوشیران',
    warehouse: 'انبار ملزومات'
  },
  {
    id: '3',
    year: 1405,
    month: 2,
    date: '1405/02/10',
    docNumber: 'PH-1005',
    docType: 'فاکتور خرید',
    itemCode: 'PRD-001',
    itemTitle: 'ورق فولادی ۲ میل',
    purchaseGroup: 'مواد اولیه فلزی',
    unit: 'کیلوگرم',
    quantity: 1200,
    purchasePrice: 480000,
    totalPrice: 576000000,
    amount: 576000000,
    netAmount: 576000000,
    currency: 'ریال',
    exchangeRate: 1,
    supplier: 'فولاد مبارکه',
    warehouse: 'انبار مرکزی'
  }
];

export const mockMonthlyPurchaseSummaries: MonthlyPurchaseSummary[] = [
  {
    itemCode: 'PRD-001',
    itemTitle: 'ورق فولادی ۲ میل',
    purchaseGroup: 'مواد اولیه فلزی',
    unit: 'کیلوگرم',
    month: 1,
    quantity: 1000,
    netAmount: 450000000,
    weightedAvgPrice: 450000,
    minPrice: 450000,
    maxPrice: 450000,
    docCount: 1,
    lastPrice: 450000,
    changePercent: 5.2
  },
  {
    itemCode: 'PRD-001',
    itemTitle: 'ورق فولادی ۲ میل',
    purchaseGroup: 'مواد اولیه فلزی',
    unit: 'کیلوگرم',
    month: 2,
    quantity: 1200,
    netAmount: 576000000,
    weightedAvgPrice: 480000,
    minPrice: 480000,
    maxPrice: 480000,
    docCount: 1,
    lastPrice: 480000,
    changePercent: 6.6
  }
];

export const mockItemPriceChanges: ItemPriceChange[] = [
  {
    itemCode: 'PRD-001',
    itemTitle: 'ورق فولادی ۲ میل',
    purchaseGroup: 'مواد اولیه فلزی',
    unit: 'کیلوگرم',
    basePrice: 420000,
    cumulativeChange: 14.3,
    status: 'increase',
    monthlyData: [
      { month: 1, weightedAvgPrice: 450000, changePercent: 7.1, hasTransaction: true },
      { month: 2, weightedAvgPrice: 480000, changePercent: 6.6, hasTransaction: true },
      { month: 3, weightedAvgPrice: 480000, changePercent: 0, hasTransaction: false },
      { month: 4, weightedAvgPrice: 510000, changePercent: 6.2, hasTransaction: true },
      { month: 5, weightedAvgPrice: 540000, changePercent: 5.8, hasTransaction: true }
    ]
  },
  {
    itemCode: 'PRD-002',
    itemTitle: 'الکترود جوشکاری',
    purchaseGroup: 'ملزومات تولید',
    unit: 'بسته',
    basePrice: 1100000,
    cumulativeChange: 25.5,
    status: 'critical_increase',
    monthlyData: [
      { month: 1, weightedAvgPrice: 1200000, changePercent: 9.1, hasTransaction: true },
      { month: 2, weightedAvgPrice: 1350000, changePercent: 12.5, hasTransaction: true },
      { month: 3, weightedAvgPrice: 1350000, changePercent: 0, hasTransaction: false },
      { month: 4, weightedAvgPrice: 1480000, changePercent: 9.6, hasTransaction: true },
      { month: 5, weightedAvgPrice: 1480000, changePercent: 0, hasTransaction: false }
    ]
  }
];

export const mockGroupPriceChanges: GroupPriceChange[] = [
  {
    id: 'G1',
    code: 'PG-01',
    title: 'مواد اولیه فلزی',
    level: 1,
    parentId: null,
    itemCount: 15,
    activeItemCount: 12,
    prevMonthAmount: 4500000000,
    currentMonthAmount: 5200000000,
    weightedAvgIncrease: 12.5,
    minItemChange: 2.1,
    maxItemChange: 18.4,
    cumulativeChange: 24.2,
    status: 'increase'
  },
  {
    id: 'G2',
    code: 'PG-02',
    title: 'ملزومات تولید',
    level: 1,
    parentId: null,
    itemCount: 45,
    activeItemCount: 38,
    prevMonthAmount: 1200000000,
    currentMonthAmount: 1550000000,
    weightedAvgIncrease: 22.1,
    minItemChange: 8.5,
    maxItemChange: 35.0,
    cumulativeChange: 42.5,
    status: 'critical_increase'
  }
];

export const mockPurchasePriceBasis: PurchasePriceBasis[] = [
  {
    itemCode: 'PRD-001',
    itemTitle: 'ورق فولادی ۲ میل',
    purchaseGroup: 'مواد اولیه فلزی',
    lastMonthPrevYear: 'اسفند ۱۴۰۴',
    lastValidPrice: 420000,
    lastPurchaseDate: '1404/12/25',
    lastSupplier: 'فولاد مبارکه',
    status: 'valid'
  },
  {
    itemCode: 'PRD-003',
    itemTitle: 'موتور گیربکس ۳ اسب',
    purchaseGroup: 'قطعات فنی',
    lastMonthPrevYear: '-',
    lastValidPrice: 0,
    lastPurchaseDate: '-',
    lastSupplier: '-',
    status: 'no_basis'
  }
];

export const mockItemGroupMappings: ItemGroupMapping[] = [
  {
    itemCode: 'PRD-001',
    itemTitle: 'ورق فولادی ۲ میل',
    purchaseGroup: 'مواد اولیه فلزی',
    salesGroup: 'محصولات نیم ساخته',
    itemType: 'کالا',
    unit: 'کیلوگرم',
    status: 'ok'
  },
  {
    itemCode: 'SRV-101',
    itemTitle: 'خدمات جوشکاری تخصصی',
    purchaseGroup: 'خدمات پیمانکاری',
    salesGroup: 'خدمات فنی',
    itemType: 'خدمت',
    unit: 'نفر ساعت',
    status: 'ok'
  }
];

export const mockSalesPriceBasis: SalesPriceBasis[] = [
  {
    itemCode: 'PRD-001',
    itemTitle: 'ورق فولادی ۲ میل',
    salesGroup: 'محصولات نیم ساخته',
    lastMonthPrevYear: 'اسفند ۱۴۰۴',
    lastValidPrice: 650000,
    lastSaleDate: '1404/12/28',
    lastCustomer: 'سازه گستر آریا',
    status: 'valid'
  }
];

export const mockSaleDetails: SaleDetail[] = [
  {
    id: 'S1',
    itemCode: 'PRD-001',
    itemTitle: 'ورق فولادی ۲ میل',
    salesGroup: 'محصولات نیم ساخته',
    unit: 'کیلوگرم',
    basePrice: 650000,
    cumulativeChange: 15.4,
    status: 'increase',
    monthlyData: [
      { month: 1, weightedAvgPrice: 700000, changePercent: 7.7, hasTransaction: true },
      { month: 2, weightedAvgPrice: 750000, changePercent: 7.1, hasTransaction: true },
      { month: 3, weightedAvgPrice: 750000, changePercent: 0, hasTransaction: false },
      { month: 4, weightedAvgPrice: 780000, changePercent: 4.0, hasTransaction: true },
      { month: 5, weightedAvgPrice: 810000, changePercent: 3.8, hasTransaction: true }
    ]
  },
  {
    id: 'S2',
    itemCode: 'PRD-002',
    itemTitle: 'الکترود جوشکاری',
    salesGroup: 'ملزومات تولید',
    unit: 'بسته',
    basePrice: 1500000,
    cumulativeChange: 20.0,
    status: 'increase',
    monthlyData: [
      { month: 1, weightedAvgPrice: 1600000, changePercent: 6.7, hasTransaction: true },
      { month: 2, weightedAvgPrice: 1750000, changePercent: 9.4, hasTransaction: true },
      { month: 3, weightedAvgPrice: 1750000, changePercent: 0, hasTransaction: false },
      { month: 4, weightedAvgPrice: 1800000, changePercent: 2.9, hasTransaction: true },
      { month: 5, weightedAvgPrice: 1800000, changePercent: 0, hasTransaction: false }
    ]
  }
];

export const mockGroupPriceChangesSales: GroupPriceChange[] = [
  {
    id: 'GS1',
    code: 'SG-01',
    title: 'محصولات نیم ساخته',
    level: 1,
    parentId: null,
    itemCount: 20,
    activeItemCount: 18,
    prevMonthAmount: 8500000000,
    currentMonthAmount: 9800000000,
    weightedAvgIncrease: 15.3,
    minItemChange: 5.1,
    maxItemChange: 22.4,
    cumulativeChange: 30.2,
    status: 'increase'
  },
  {
    id: 'GS2',
    code: 'SG-02',
    title: 'خدمات فنی',
    level: 1,
    parentId: null,
    itemCount: 10,
    activeItemCount: 10,
    prevMonthAmount: 2200000000,
    currentMonthAmount: 2550000000,
    weightedAvgIncrease: 15.9,
    minItemChange: 10.5,
    maxItemChange: 25.0,
    cumulativeChange: 35.5,
    status: 'critical_increase'
  }
];
