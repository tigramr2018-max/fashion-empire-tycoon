export type RawMaterialKey =
  | 'cotton'
  | 'denim'
  | 'polyester'
  | 'thread'
  | 'buttons'
  | 'zippers'
  | 'ink'
  | 'detergent'
  | 'packaging';

export type ProductKey =
  | 'tshirt'
  | 'shirt'
  | 'jeans'
  | 'pants'
  | 'jacket'
  | 'sportswear'
  | 'underwear'
  | 'kidswear'
  | 'winterwear';

export type DepartmentKey =
  | 'receiving'
  | 'raw_warehouse'
  | 'cutting'
  | 'sewing'
  | 'printing'
  | 'embroidery'
  | 'laundry'
  | 'finishing'
  | 'ironing'
  | 'quality_control'
  | 'packaging_dept'
  | 'finished_warehouse'
  | 'shipping';

export type EmployeeRole =
  | 'worker'
  | 'technician'
  | 'supervisor'
  | 'production_manager'
  | 'factory_manager'
  | 'warehouse_manager'
  | 'quality_manager'
  | 'hr_manager'
  | 'finance_manager'
  | 'export_manager';

export type ShippingMethod = 'land' | 'sea' | 'air';

export type CountryKey =
  | 'egypt'
  | 'saudi'
  | 'uae'
  | 'kuwait'
  | 'turkey'
  | 'morocco'
  | 'germany'
  | 'france'
  | 'italy'
  | 'usa';

export interface DepartmentState {
  key: DepartmentKey;
  level: number;
  capacity: number;
  operatingCost: number;
  washMachines?: number;
  washType?: 'normal' | 'stone' | 'enzyme' | 'acid';
  waterConsumption?: number;
}

export interface ProductionLine {
  id: string;
  factoryId: string;
  productKey: ProductKey;
  machines: number;
  maxMachines: number;
  active: boolean;
  progress: number;
  qualityScore: number;
  breakdownRisk: number;
  isBroken: boolean;
}

export interface Employee {
  id: string;
  factoryId: string;
  name: string;
  role: EmployeeRole;
  experience: number;
  efficiency: number;
  salary: number;
  speed: number;
  loyalty: number;
  errorRate: number;
  level: number;
}

export interface Factory {
  id: string;
  name: string;
  city: string;
  country: string;
  areaSqm: number;
  level: number;
  allocatedCapital: number;
  departments: Record<DepartmentKey, DepartmentState>;
  rawInventory: Record<RawMaterialKey, number>;
  reorderLevels: Record<RawMaterialKey, number>;
  finishedInventory: Record<ProductKey, { qty: number; quality: number }>;
  dailyRevenue: number;
  dailyExpenses: number;
  dailyProduced: number;
  efficiency: number;
}

export interface FactoryTemplate {
  id: string;
  name: string;
  city: string;
  country: string;
  price: number;
  areaSqm: number;
  bonusDesc: string;
}

export interface MarketOrder {
  id: string;
  clientName: string;
  countryKey: CountryKey;
  productKey: ProductKey;
  quantity: number;
  minQuality: number;
  unitPrice: number;
  deadlineDays: number;
  isUrgent: boolean;
  status: 'open' | 'completed' | 'expired';
}

export interface Loan {
  id: string;
  bankName: string;
  principal: number;
  remaining: number;
  interestRate: number;
  dailyPayment: number;
}

export interface FinancialLog {
  id: string;
  day: number;
  type: 'income' | 'expense';
  category: 'sales' | 'materials' | 'salaries' | 'utilities' | 'maintenance' | 'shipping' | 'taxes' | 'upgrades' | 'loans';
  description: string;
  amount: number;
}

export interface GameEventLog {
  id: string;
  day: number;
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'danger' | 'success';
}

export interface GameState {
  companyName: string;
  playerKey: string;
  cash: number;
  level: number;
  xp: number;
  reputation: number;
  day: number;
  hour: number;
  speed: 0 | 1 | 2 | 4;
  activeFactoryId: string;
  factories: Factory[];
  lines: ProductionLine[];
  employees: Employee[];
  orders: MarketOrder[];
  loans: Loan[];
  financialLogs: FinancialLog[];
  events: GameEventLog[];
  priceMultiplier: number;
  stats: {
    totalRevenue: number;
    totalExpenses: number;
    totalProduced: number;
    totalShipped: number;
    wasteCount: number;
  };
}
