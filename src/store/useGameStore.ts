import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  ARABIC_NAMES,
  CLIENT_COMPANIES,
  COUNTRIES,
  DEPARTMENTS_INFO,
  EMPLOYEE_ROLES,
  FACTORY_TEMPLATES,
  PRODUCTS,
  RAW_MATERIALS,
} from '../data/gameCatalog';
import {
  CountryKey,
  DepartmentKey,
  DepartmentState,
  Employee,
  EmployeeRole,
  Factory,
  GameState,
  MarketOrder,
  ProductKey,
  ProductionLine,
  RawMaterialKey,
  ShippingMethod,
} from '../types/game';

interface GameActions {
  setSpeed: (speed: 0 | 1 | 2 | 4) => void;
  setActiveFactory: (factoryId: string) => void;
  tick: () => void;
  buyRawMaterial: (factoryId: string, material: RawMaterialKey, qty: number) => boolean;
  setReorderLevel: (factoryId: string, material: RawMaterialKey, level: number) => void;
  transferStock: (fromFactoryId: string, toFactoryId: string, material: RawMaterialKey, qty: number) => boolean;
  upgradeDepartment: (factoryId: string, deptKey: DepartmentKey) => boolean;
  upgradeLaundryMachine: (factoryId: string, washType?: 'normal' | 'stone' | 'enzyme' | 'acid') => boolean;
  addProductionLine: (factoryId: string, productKey: ProductKey) => boolean;
  upgradeLineMachines: (lineId: string) => boolean;
  toggleLineActive: (lineId: string) => void;
  repairLine: (lineId: string) => boolean;
  hireEmployee: (factoryId: string, role: EmployeeRole) => boolean;
  trainEmployee: (employeeId: string) => boolean;
  transferEmployee: (employeeId: string, targetFactoryId: string) => void;
  fireEmployee: (employeeId: string) => void;
  shipOrder: (orderId: string, factoryId: string, method: ShippingMethod) => { ok: boolean; msg: string };
  refreshOrders: () => void;
  buyNewFactory: (templateId: string) => boolean;
  upgradeFactoryBuilding: (factoryId: string) => boolean;
  takeLoan: (bankName: string, amount: number, interestRate: number) => void;
  repayLoan: (loanId: string, amount: number) => boolean;
  resetGame: () => void;
  loadCloudState: (saved: Partial<GameState>) => void;
}

function createInitialDepartments(): Record<DepartmentKey, DepartmentState> {
  const keys = Object.keys(DEPARTMENTS_INFO) as DepartmentKey[];
  const record = {} as Record<DepartmentKey, DepartmentState>;
  keys.forEach((k) => {
    record[k] = {
      key: k,
      level: 1,
      capacity: 120,
      operatingCost: 80,
      ...(k === 'laundry' ? { washMachines: 2, washType: 'normal' as const, waterConsumption: 150 } : {}),
    };
  });
  return record;
}

function createStarterFactory(): Factory {
  return {
    id: 'fac-cairo-1',
    name: 'ورشة ومصنع القاهرة الرئيسي',
    city: 'القاهرة',
    country: 'مصر',
    areaSqm: 450,
    level: 1,
    allocatedCapital: 150000,
    departments: createInitialDepartments(),
    rawInventory: {
      cotton: 140,
      denim: 60,
      polyester: 80,
      thread: 100,
      buttons: 90,
      zippers: 70,
      ink: 50,
      detergent: 60,
      packaging: 120,
    },
    reorderLevels: {
      cotton: 40,
      denim: 25,
      polyester: 30,
      thread: 30,
      buttons: 25,
      zippers: 20,
      ink: 15,
      detergent: 20,
      packaging: 40,
    },
    finishedInventory: {
      tshirt: { qty: 18, quality: 78 },
      shirt: { qty: 6, quality: 79 },
      jeans: { qty: 0, quality: 80 },
      pants: { qty: 0, quality: 77 },
      jacket: { qty: 0, quality: 82 },
      sportswear: { qty: 0, quality: 79 },
      underwear: { qty: 10, quality: 76 },
      kidswear: { qty: 0, quality: 80 },
      winterwear: { qty: 0, quality: 84 },
    },
    dailyRevenue: 0,
    dailyExpenses: 0,
    dailyProduced: 0,
    efficiency: 78,
  };
}

function generateOrder(day: number, companyLevel: number): MarketOrder {
  const productKeys = Object.keys(PRODUCTS) as ProductKey[];
  const availableProducts =
    companyLevel === 1
      ? (['tshirt', 'shirt', 'underwear', 'pants'] as ProductKey[])
      : companyLevel === 2
      ? (['tshirt', 'shirt', 'underwear', 'pants', 'jeans', 'sportswear', 'kidswear'] as ProductKey[])
      : productKeys;

  const countryKeys = Object.keys(COUNTRIES) as CountryKey[];
  const availableCountries =
    companyLevel === 1
      ? (['egypt', 'saudi', 'uae', 'morocco'] as CountryKey[])
      : countryKeys;

  const productKey = availableProducts[Math.floor(Math.random() * availableProducts.length)];
  const countryKey = availableCountries[Math.floor(Math.random() * availableCountries.length)];
  const product = PRODUCTS[productKey];
  const country = COUNTRIES[countryKey];
  const isUrgent = Math.random() < 0.25;
  const quantity = Math.floor((15 + Math.random() * 35) * (1 + (companyLevel - 1) * 0.35));
  const unitPrice = Math.round(product.basePrice * country.priceMultiplier * (isUrgent ? 1.25 : 1.0));

  return {
    id: `ORD-${day}-${Math.floor(1000 + Math.random() * 9000)}`,
    clientName: CLIENT_COMPANIES[Math.floor(Math.random() * CLIENT_COMPANIES.length)],
    countryKey,
    productKey,
    quantity,
    minQuality: country.minQuality,
    unitPrice,
    deadlineDays: isUrgent ? 3 : 6 + Math.floor(Math.random() * 5),
    isUrgent,
    status: 'open',
  };
}

function createInitialState(): GameState {
  const starterFactory = createStarterFactory();
  const initialLine: ProductionLine = {
    id: 'line-1',
    factoryId: starterFactory.id,
    productKey: 'tshirt',
    machines: 2,
    maxMachines: 8,
    active: true,
    progress: 0,
    qualityScore: 78,
    breakdownRisk: 3,
    isBroken: false,
  };

  const initialEmployees: Employee[] = [
    {
      id: 'emp-1',
      factoryId: starterFactory.id,
      name: 'أحمد محمود',
      role: 'worker',
      experience: 2,
      efficiency: 76,
      salary: 140,
      speed: 78,
      loyalty: 85,
      errorRate: 4,
      level: 1,
    },
    {
      id: 'emp-2',
      factoryId: starterFactory.id,
      name: 'سارة عبد الرحمن',
      role: 'supervisor',
      experience: 3,
      efficiency: 82,
      salary: 300,
      speed: 80,
      loyalty: 88,
      errorRate: 2.5,
      level: 1,
    },
  ];

  return {
    companyName: 'إمبراطورية الأزياء العربية',
    playerKey: `player_${Math.random().toString(36).substring(2, 10)}`,
    cash: 150000,
    level: 1,
    xp: 0,
    reputation: 55,
    day: 1,
    hour: 8,
    speed: 1,
    activeFactoryId: starterFactory.id,
    factories: [starterFactory],
    lines: [initialLine],
    employees: initialEmployees,
    orders: [
      {
        id: 'ORD-1-1001',
        clientName: 'مجموعة النخبة للأزياء',
        countryKey: 'egypt',
        productKey: 'tshirt',
        quantity: 15,
        minQuality: 65,
        unitPrice: 125,
        deadlineDays: 5,
        isUrgent: false,
        status: 'open',
      },
      generateOrder(1, 1),
      generateOrder(1, 1),
      generateOrder(1, 1),
    ],
    loans: [],
    financialLogs: [
      {
        id: 'log-init',
        day: 1,
        type: 'income',
        category: 'sales',
        description: 'رأس المال التأسيسي للشركة',
        amount: 150000,
      },
    ],
    events: [
      {
        id: 'evt-init',
        day: 1,
        title: 'تأسيس الشركة بنجاح',
        description: 'بدأت رحلتك في عالم صناعة الأزياء برأس مال 150,000 ج.م وخط إنتاج تيشيرتات.',
        severity: 'success',
      },
    ],
    priceMultiplier: 1.0,
    stats: {
      totalRevenue: 0,
      totalExpenses: 0,
      totalProduced: 0,
      totalShipped: 0,
      wasteCount: 0,
    },
  };
}

export const useGameStore = create<GameState & GameActions>()(
  persist(
    (set, get) => ({
      ...createInitialState(),

      setSpeed: (speed) => set({ speed }),

      setActiveFactory: (factoryId) => set({ activeFactoryId: factoryId }),

      tick: () => {
        const state = get();
        if (state.speed === 0) return;

        let nextHour = state.hour + 1;
        let nextDay = state.day;
        const isNewDay = nextHour >= 24;
        if (isNewDay) {
          nextHour = 0;
          nextDay += 1;
        }

        let cash = state.cash;
        let xp = state.xp;
        let level = state.level;
        let reputation = state.reputation;
        let priceMultiplier = state.priceMultiplier;
        const stats = { ...state.stats };
        const financialLogs = [...state.financialLogs];
        const events = [...state.events];

        // نسخ المصانع والخطوط والموظفين للتحديث
        const factories = state.factories.map((f) => ({
          ...f,
          rawInventory: { ...f.rawInventory },
          finishedInventory: Object.fromEntries(
            Object.entries(f.finishedInventory).map(([k, v]) => [k, { ...v }])
          ) as Factory['finishedInventory'],
          departments: Object.fromEntries(
            Object.entries(f.departments).map(([k, v]) => [k, { ...v }])
          ) as Factory['departments'],
          dailyRevenue: isNewDay ? 0 : f.dailyRevenue,
          dailyExpenses: isNewDay ? 0 : f.dailyExpenses,
          dailyProduced: isNewDay ? 0 : f.dailyProduced,
        }));

        const lines = state.lines.map((l) => ({ ...l }));
        let employees = state.employees.map((e) => ({ ...e }));

        // 1. معالجة خطوط الإنتاج لكل مصنع
        lines.forEach((line) => {
          if (!line.active || line.isBroken) return;
          const factory = factories.find((f) => f.id === line.factoryId);
          if (!factory) return;

          const product = PRODUCTS[line.productKey];
          const facEmployees = employees.filter((e) => e.factoryId === factory.id);
          const workers = facEmployees.filter((e) => e.role === 'worker');
          const supervisors = facEmployees.filter((e) => e.role === 'supervisor');
          const prodManagers = facEmployees.filter((e) => e.role === 'production_manager');
          const qualityManagers = facEmployees.filter((e) => e.role === 'quality_manager');
          const technicians = facEmployees.filter((e) => e.role === 'technician');

          // حساب معاملات الأداء من الموظفين والأقسام
          const avgWorkerSpeed =
            workers.length > 0
              ? workers.reduce((acc, w) => acc + w.speed, 0) / workers.length
              : 55;
          const speedBonus =
            1 +
            (avgWorkerSpeed - 60) / 150 +
            prodManagers.length * 0.12 +
            (factory.departments.sewing.level - 1) * 0.08;

          const qualityBonus =
            (qualityManagers.length > 0 ? 7 : 0) +
            (supervisors.length > 0 ? 4 : 0) +
            (factory.departments.quality_control.level - 1) * 2.5 +
            (factory.city === 'إسطنبول' ? 7 : factory.city === 'ميلانو' ? 12 : 0);

          const effectiveQuality = Math.min(99, Math.round(product.baseQuality + qualityBonus));
          line.qualityScore = effectiveQuality;

          // التحقق من توفر الخامات اللازمة لدورة الإنتاج
          const batchSize = Math.max(1, line.machines);
          const canProduce = Object.entries(product.recipe).every(([matKey, reqQty]) => {
            const available = factory.rawInventory[matKey as RawMaterialKey] || 0;
            return available >= (reqQty || 0) * batchSize;
          });

          if (!canProduce) {
            return; // توقف الخط لعدم توفر الخامات
          }

          // زيادة التقدم
          const progressStep = (100 / product.productionTimeTicks) * Math.max(0.5, speedBonus);
          line.progress += progressStep;

          // احتمال تعطل الماكينات
          const techMitigation = technicians.length * 1.2;
          const actualBreakdownChance = Math.max(0.2, (line.breakdownRisk - techMitigation) * 0.005);
          if (Math.random() < actualBreakdownChance) {
            line.isBroken = true;
            line.active = false;
            events.unshift({
              id: `evt-brk-${Date.now()}-${Math.random()}`,
              day: nextDay,
              title: `عطل فني في ${factory.name}`,
              description: `توقف خط إنتاج (${product.name}) ويحتاج إلى صيانة عاجلة.`,
              severity: 'warning',
            });
            return;
          }

          // إتمام دورة الإنتاج
          if (line.progress >= 100) {
            line.progress -= 100;

            // خصم الخامات فعلياً
            Object.entries(product.recipe).forEach(([matKey, reqQty]) => {
              const k = matKey as RawMaterialKey;
              factory.rawInventory[k] = Math.max(0, factory.rawInventory[k] - (reqQty || 0) * batchSize);
            });

            // حساب الهالك بناءً على كفاءة القص والمشرفين
            const baseWasteRate = Math.max(
              0.01,
              0.08 - factory.departments.cutting.level * 0.01 - supervisors.length * 0.015
            );
            const wasted = Math.random() < baseWasteRate ? 1 : 0;
            const producedGood = Math.max(1, batchSize - wasted);

            const currentStock = factory.finishedInventory[line.productKey];
            const totalQty = currentStock.qty + producedGood;
            const weightedQuality = Math.round(
              (currentStock.qty * currentStock.quality + producedGood * effectiveQuality) / totalQty
            );

            factory.finishedInventory[line.productKey] = {
              qty: totalQty,
              quality: weightedQuality,
            };
            factory.dailyProduced += producedGood;
            stats.totalProduced += producedGood;
            stats.wasteCount += wasted;
            xp += producedGood * 3;
          }
        });

        // 2. الحسابات اليومية عند بداية يوم جديد
        let orders = state.orders.map((o) => ({ ...o }));
        const loans = state.loans.map((l) => ({ ...l }));

        if (isNewDay) {
          let totalDailySalaries = 0;
          let totalDailyUtilities = 0;
          let totalLoanPayments = 0;

          factories.forEach((f) => {
            const facEmps = employees.filter((e) => e.factoryId === f.id);
            const hasFinanceMgr = facEmps.some((e) => e.role === 'finance_manager');
            const discount = hasFinanceMgr ? 0.92 : 1.0;

            const salaries = Math.round(facEmps.reduce((s, e) => s + e.salary, 0) * discount);
            const deptCosts = Object.values(f.departments).reduce((s, d) => s + d.operatingCost, 0);
            const linesElectricity = lines
              .filter((l) => l.factoryId === f.id && l.active)
              .reduce((s, l) => s + l.machines * 45, 0);
            const utilities = Math.round((deptCosts + linesElectricity) * discount);

            f.dailyExpenses += salaries + utilities;
            totalDailySalaries += salaries;
            totalDailyUtilities += utilities;
          });

          // أقساط القروض اليومية
          for (let i = loans.length - 1; i >= 0; i--) {
            const loan = loans[i];
            const pay = Math.min(loan.remaining, loan.dailyPayment);
            loan.remaining -= pay;
            totalLoanPayments += pay;
            if (loan.remaining <= 0) {
              loans.splice(i, 1);
            }
          }

          const totalDayExpense = totalDailySalaries + totalDailyUtilities + totalLoanPayments;
          cash -= totalDayExpense;
          stats.totalExpenses += totalDayExpense;

          if (totalDailySalaries > 0) {
            financialLogs.unshift({
              id: `log-sal-${nextDay}`,
              day: nextDay,
              type: 'expense',
              category: 'salaries',
              description: `رواتب الموظفين اليومية (${employees.length} موظف)`,
              amount: totalDailySalaries,
            });
          }

          if (totalDailyUtilities > 0) {
            financialLogs.unshift({
              id: `log-util-${nextDay}`,
              day: nextDay,
              type: 'expense',
              category: 'utilities',
              description: 'تكاليف الكهرباء والمياه وتشغيل الأقسام الصناعية',
              amount: totalDailyUtilities,
            });
          }

          if (totalLoanPayments > 0) {
            financialLogs.unshift({
              id: `log-loan-${nextDay}`,
              day: nextDay,
              type: 'expense',
              category: 'loans',
              description: 'سداد قسط القرض البنكي اليومي',
              amount: totalLoanPayments,
            });
          }

          // تحديث مهلة الطلبات وإضافة طلبات جديدة
          orders = orders
            .map((o) => (o.status === 'open' ? { ...o, deadlineDays: o.deadlineDays - 1 } : o))
            .filter((o) => o.status === 'open' && o.deadlineDays > 0);

          while (orders.length < 5) {
            orders.push(generateOrder(nextDay, level));
          }

          // إعادة ضبط تضخم أسعار الخامات تدريجياً
          if (priceMultiplier > 1.0) {
            priceMultiplier = Math.max(1.0, Number((priceMultiplier - 0.05).toFixed(2)));
          }

          // أحداث عشوائية كل يومين تقريباً
          if (Math.random() < 0.45) {
            const roll = Math.random();
            if (roll < 0.25) {
              priceMultiplier = 1.25;
              events.unshift({
                id: `evt-price-${nextDay}`,
                day: nextDay,
                title: 'ارتفاع عالمي في أسعار الأقمشة',
                description: 'ارتفعت أسعار الخامات بنسبة 25% مؤقتاً نتيجة اضطراب سلاسل الإمداد.',
                severity: 'warning',
              });
            } else if (roll < 0.5) {
              const urgentOrder = generateOrder(nextDay, level);
              urgentOrder.isUrgent = true;
              urgentOrder.unitPrice = Math.round(urgentOrder.unitPrice * 1.35);
              urgentOrder.deadlineDays = 3;
              orders.unshift(urgentOrder);
              events.unshift({
                id: `evt-urg-${nextDay}`,
                day: nextDay,
                title: 'طلب تصدير مستعجل وعالي الربح!',
                description: `عميل دولي يطلب ${urgentOrder.quantity} قطعة من (${PRODUCTS[urgentOrder.productKey].name}) بسعر مميز.`,
                severity: 'success',
              });
            } else if (roll < 0.75 && employees.length > 2) {
              const hasHr = employees.some((e) => e.role === 'hr_manager');
              if (!hasHr) {
                const candidate = employees[employees.length - 1];
                employees = employees.filter((e) => e.id !== candidate.id);
                events.unshift({
                  id: `evt-quit-${nextDay}`,
                  day: nextDay,
                  title: 'استقالة موظف',
                  description: `غادر (${candidate.name}) العمل. تعيين مدير موارد بشرية يقلل الاستقالات.`,
                  severity: 'danger',
                });
              }
            } else {
              reputation = Math.min(100, reputation + 2);
              events.unshift({
                id: `evt-rep-${nextDay}`,
                day: nextDay,
                title: 'إشادة بجودة منتجاتك',
                description: 'ارتفعت سمعة شركتك في الأسواق المحلية والدولية +2 نقطة.',
                severity: 'info',
              });
            }
          }

          // ترقية مستوى الشركة بناءً على الخبرة
          const nextLevelThreshold = level * 600;
          if (xp >= nextLevelThreshold) {
            level += 1;
            events.unshift({
              id: `evt-lvl-${nextDay}`,
              day: nextDay,
              title: `ترقية الشركة إلى المستوى ${level}!`,
              description: 'تم فتح أسواق تصدير عالمية ومنتجات جديدة أكثر ربحية.',
              severity: 'success',
            });
          }
        }

        set({
          cash,
          xp,
          level,
          reputation,
          day: nextDay,
          hour: nextHour,
          factories,
          lines,
          employees,
          orders,
          loans,
          priceMultiplier,
          stats,
          financialLogs: financialLogs.slice(0, 60),
          events: events.slice(0, 30),
        });
      },

      buyRawMaterial: (factoryId, material, qty) => {
        const state = get();
        const matInfo = RAW_MATERIALS[material];
        const totalCost = Math.round(matInfo.basePrice * state.priceMultiplier * qty);
        if (state.cash < totalCost || qty <= 0) return false;

        const factories = state.factories.map((f) => {
          if (f.id !== factoryId) return f;
          return {
            ...f,
            rawInventory: {
              ...f.rawInventory,
              [material]: (f.rawInventory[material] || 0) + qty,
            },
            dailyExpenses: f.dailyExpenses + totalCost,
          };
        });

        set({
          cash: state.cash - totalCost,
          factories,
          stats: { ...state.stats, totalExpenses: state.stats.totalExpenses + totalCost },
          financialLogs: [
            {
              id: `log-mat-${Date.now()}`,
              day: state.day,
              type: 'expense',
              category: 'materials',
              description: `شراء ${qty} ${matInfo.unit} من ${matInfo.name}`,
              amount: totalCost,
            },
            ...state.financialLogs,
          ].slice(0, 60),
        });
        return true;
      },

      setReorderLevel: (factoryId, material, level) => {
        set((state) => ({
          factories: state.factories.map((f) =>
            f.id === factoryId
              ? { ...f, reorderLevels: { ...f.reorderLevels, [material]: Math.max(0, level) } }
              : f
          ),
        }));
      },

      transferStock: (fromFactoryId, toFactoryId, material, qty) => {
        const state = get();
        if (fromFactoryId === toFactoryId || qty <= 0) return false;
        const source = state.factories.find((f) => f.id === fromFactoryId);
        if (!source || source.rawInventory[material] < qty) return false;

        const transferFee = Math.round(qty * 1.5);
        if (state.cash < transferFee) return false;

        set({
          cash: state.cash - transferFee,
          factories: state.factories.map((f) => {
            if (f.id === fromFactoryId) {
              return { ...f, rawInventory: { ...f.rawInventory, [material]: f.rawInventory[material] - qty } };
            }
            if (f.id === toFactoryId) {
              return { ...f, rawInventory: { ...f.rawInventory, [material]: f.rawInventory[material] + qty } };
            }
            return f;
          }),
        });
        return true;
      },

      upgradeDepartment: (factoryId, deptKey) => {
        const state = get();
        const factory = state.factories.find((f) => f.id === factoryId);
        if (!factory) return false;

        const dept = factory.departments[deptKey];
        const cost = Math.round(DEPARTMENTS_INFO[deptKey].baseUpgradeCost * Math.pow(1.45, dept.level - 1));
        if (state.cash < cost) return false;

        set({
          cash: state.cash - cost,
          xp: state.xp + 80,
          factories: state.factories.map((f) => {
            if (f.id !== factoryId) return f;
            return {
              ...f,
              efficiency: Math.min(100, f.efficiency + 2),
              departments: {
                ...f.departments,
                [deptKey]: {
                  ...dept,
                  level: dept.level + 1,
                  capacity: Math.round(dept.capacity * 1.3),
                  operatingCost: Math.round(dept.operatingCost * 1.15),
                },
              },
            };
          }),
          stats: { ...state.stats, totalExpenses: state.stats.totalExpenses + cost },
          financialLogs: [
            {
              id: `log-dept-${Date.now()}`,
              day: state.day,
              type: 'expense',
              category: 'upgrades',
              description: `تطوير ${DEPARTMENTS_INFO[deptKey].name} إلى المستوى ${dept.level + 1}`,
              amount: cost,
            },
            ...state.financialLogs,
          ].slice(0, 60),
        });
        return true;
      },

      upgradeLaundryMachine: (factoryId, washType) => {
        const state = get();
        const factory = state.factories.find((f) => f.id === factoryId);
        if (!factory) return false;

        const laundry = factory.departments.laundry;
        const cost = washType ? 1500 : 4500;
        if (state.cash < cost) return false;

        set({
          cash: state.cash - cost,
          factories: state.factories.map((f) => {
            if (f.id !== factoryId) return f;
            return {
              ...f,
              departments: {
                ...f.departments,
                laundry: {
                  ...laundry,
                  washMachines: washType ? laundry.washMachines : (laundry.washMachines || 2) + 1,
                  washType: washType || laundry.washType || 'normal',
                  capacity: washType ? laundry.capacity : laundry.capacity + 60,
                  waterConsumption: washType ? laundry.waterConsumption : (laundry.waterConsumption || 150) + 50,
                },
              },
            };
          }),
          stats: { ...state.stats, totalExpenses: state.stats.totalExpenses + cost },
        });
        return true;
      },

      addProductionLine: (factoryId, productKey) => {
        const state = get();
        const factory = state.factories.find((f) => f.id === factoryId);
        if (!factory) return false;

        const factoryLines = state.lines.filter((l) => l.factoryId === factoryId);
        const maxLinesAllowed = Math.floor(factory.areaSqm / 200);
        if (factoryLines.length >= maxLinesAllowed) return false;

        const cost = 12000;
        if (state.cash < cost) return false;

        const newLine: ProductionLine = {
          id: `line-${Date.now()}`,
          factoryId,
          productKey,
          machines: 2,
          maxMachines: 10,
          active: true,
          progress: 0,
          qualityScore: PRODUCTS[productKey].baseQuality,
          breakdownRisk: 3,
          isBroken: false,
        };

        set({
          cash: state.cash - cost,
          lines: [...state.lines, newLine],
          stats: { ...state.stats, totalExpenses: state.stats.totalExpenses + cost },
          financialLogs: [
            {
              id: `log-line-${Date.now()}`,
              day: state.day,
              type: 'expense',
              category: 'upgrades',
              description: `إنشاء خط إنتاج جديد (${PRODUCTS[productKey].name})`,
              amount: cost,
            },
            ...state.financialLogs,
          ].slice(0, 60),
        });
        return true;
      },

      upgradeLineMachines: (lineId) => {
        const state = get();
        const line = state.lines.find((l) => l.id === lineId);
        if (!line || line.machines >= line.maxMachines) return false;

        const cost = line.machines * 3500;
        if (state.cash < cost) return false;

        set({
          cash: state.cash - cost,
          lines: state.lines.map((l) =>
            l.id === lineId ? { ...l, machines: l.machines + 1 } : l
          ),
          stats: { ...state.stats, totalExpenses: state.stats.totalExpenses + cost },
          financialLogs: [
            {
              id: `log-mach-${Date.now()}`,
              day: state.day,
              type: 'expense',
              category: 'upgrades',
              description: `شراء ماكينة إضافية لخط ${PRODUCTS[line.productKey].name}`,
              amount: cost,
            },
            ...state.financialLogs,
          ].slice(0, 60),
        });
        return true;
      },

      toggleLineActive: (lineId) => {
        set((state) => ({
          lines: state.lines.map((l) =>
            l.id === lineId && !l.isBroken ? { ...l, active: !l.active } : l
          ),
        }));
      },

      repairLine: (lineId) => {
        const state = get();
        const cost = 1800;
        if (state.cash < cost) return false;

        set({
          cash: state.cash - cost,
          lines: state.lines.map((l) =>
            l.id === lineId ? { ...l, isBroken: false, active: true } : l
          ),
          stats: { ...state.stats, totalExpenses: state.stats.totalExpenses + cost },
          financialLogs: [
            {
              id: `log-rep-${Date.now()}`,
              day: state.day,
              type: 'expense',
              category: 'maintenance',
              description: 'صيانة وإصلاح ماكينات خط الإنتاج',
              amount: cost,
            },
            ...state.financialLogs,
          ].slice(0, 60),
        });
        return true;
      },

      hireEmployee: (factoryId, role) => {
        const state = get();
        const roleInfo = EMPLOYEE_ROLES[role];
        if (state.cash < roleInfo.hireCost) return false;

        const randomName = ARABIC_NAMES[Math.floor(Math.random() * ARABIC_NAMES.length)];
        const newEmp: Employee = {
          id: `emp-${Date.now()}-${Math.floor(Math.random() * 100)}`,
          factoryId,
          name: randomName,
          role,
          experience: 1 + Math.floor(Math.random() * 4),
          efficiency: 70 + Math.floor(Math.random() * 18),
          salary: roleInfo.baseSalary,
          speed: 70 + Math.floor(Math.random() * 20),
          loyalty: 82,
          errorRate: Number((1.5 + Math.random() * 3).toFixed(1)),
          level: 1,
        };

        set({
          cash: state.cash - roleInfo.hireCost,
          employees: [...state.employees, newEmp],
          stats: { ...state.stats, totalExpenses: state.stats.totalExpenses + roleInfo.hireCost },
          financialLogs: [
            {
              id: `log-hire-${Date.now()}`,
              day: state.day,
              type: 'expense',
              category: 'salaries',
              description: `تعيين ${roleInfo.name}: ${randomName}`,
              amount: roleInfo.hireCost,
            },
            ...state.financialLogs,
          ].slice(0, 60),
        });
        return true;
      },

      trainEmployee: (employeeId) => {
        const state = get();
        const cost = 1500;
        if (state.cash < cost) return false;

        set({
          cash: state.cash - cost,
          employees: state.employees.map((e) =>
            e.id === employeeId
              ? {
                  ...e,
                  level: e.level + 1,
                  efficiency: Math.min(99, e.efficiency + 6),
                  speed: Math.min(99, e.speed + 6),
                  loyalty: Math.min(100, e.loyalty + 5),
                  errorRate: Math.max(0.5, Number((e.errorRate - 0.6).toFixed(1))),
                  salary: Math.round(e.salary * 1.12),
                }
              : e
          ),
          stats: { ...state.stats, totalExpenses: state.stats.totalExpenses + cost },
        });
        return true;
      },

      transferEmployee: (employeeId, targetFactoryId) => {
        set((state) => ({
          employees: state.employees.map((e) =>
            e.id === employeeId ? { ...e, factoryId: targetFactoryId } : e
          ),
        }));
      },

      fireEmployee: (employeeId) => {
        set((state) => ({
          employees: state.employees.filter((e) => e.id !== employeeId),
        }));
      },

      shipOrder: (orderId, factoryId, method) => {
        const state = get();
        const order = state.orders.find((o) => o.id === orderId);
        const factory = state.factories.find((f) => f.id === factoryId);
        if (!order || !factory) return { ok: false, msg: 'الطلب أو المصنع غير موجود' };

        const stock = factory.finishedInventory[order.productKey];
        if (stock.qty < order.quantity) {
          return {
            ok: false,
            msg: `المخزون الجاهز غير كافٍ! المتوفر: ${stock.qty} قطعة والمطلوب: ${order.quantity} قطعة.`,
          };
        }

        if (stock.quality < order.minQuality) {
          return {
            ok: false,
            msg: `جودة المنتج (${stock.quality}%) أقل من الحد الأدنى المطلوب للسوق (${order.minQuality}%). طور قسم الجودة أو عيّن مدير جودة.`,
          };
        }

        const country = COUNTRIES[order.countryKey];
        const hasExportMgr = state.employees.some(
          (e) => e.factoryId === factoryId && e.role === 'export_manager'
        );
        const methodMult = method === 'land' ? 1.0 : method === 'sea' ? 1.35 : 2.2;
        const alexDiscount = factory.city === 'الإسكندرية' && method === 'sea' ? 0.85 : 1.0;
        const exportDiscount = hasExportMgr ? 0.85 : 1.0;

        const shippingCost = Math.round(country.baseShipping * methodMult * alexDiscount * exportDiscount);
        const grossRevenue = order.quantity * order.unitPrice;
        const taxAmount = Math.round(grossRevenue * country.taxRate);
        const netProfit = grossRevenue - shippingCost - taxAmount;

        if (state.cash + grossRevenue < shippingCost + taxAmount) {
          return { ok: false, msg: 'الرصيد لا يكفي لتغطية رسوم الشحن والجمارك' };
        }

        set({
          cash: state.cash + netProfit,
          xp: state.xp + order.quantity * 8,
          reputation: Math.min(100, state.reputation + 3),
          factories: state.factories.map((f) => {
            if (f.id !== factoryId) return f;
            return {
              ...f,
              finishedInventory: {
                ...f.finishedInventory,
                [order.productKey]: {
                  ...stock,
                  qty: stock.qty - order.quantity,
                },
              },
              dailyRevenue: f.dailyRevenue + grossRevenue,
              dailyExpenses: f.dailyExpenses + shippingCost + taxAmount,
            };
          }),
          orders: [
            ...state.orders.filter((o) => o.id !== orderId),
            generateOrder(state.day, state.level),
          ],
          stats: {
            ...state.stats,
            totalRevenue: state.stats.totalRevenue + grossRevenue,
            totalExpenses: state.stats.totalExpenses + shippingCost + taxAmount,
            totalShipped: state.stats.totalShipped + order.quantity,
          },
          financialLogs: [
            {
              id: `log-ship-${Date.now()}`,
              day: state.day,
              type: 'income',
              category: 'sales',
              description: `تصدير ${order.quantity} ${PRODUCTS[order.productKey].name} إلى ${country.name}`,
              amount: grossRevenue,
            },
            {
              id: `log-tax-${Date.now()}`,
              day: state.day,
              type: 'expense',
              category: 'shipping',
              description: `رسوم شحن (${method === 'air' ? 'جوي' : method === 'sea' ? 'بحري' : 'بري'}) وضرائب تصدير`,
              amount: shippingCost + taxAmount,
            },
            ...state.financialLogs,
          ].slice(0, 60),
          events: [
            {
              id: `evt-ship-${Date.now()}`,
              day: state.day,
              title: 'تم شحن وتحصيل صفقة بنجاح!',
              description: `صافي الربح المحصل: +${netProfit.toLocaleString()} ج.م من عميل ${order.clientName}.`,
              severity: 'success',
            },
            ...state.events,
          ].slice(0, 30),
        });

        return { ok: true, msg: `تم الشحن بنجاح! صافي الربح: +${netProfit.toLocaleString()} ج.م` };
      },

      refreshOrders: () => {
        const state = get();
        const fee = 500;
        if (state.cash < fee) return;
        set({
          cash: state.cash - fee,
          orders: Array.from({ length: 5 }, () => generateOrder(state.day, state.level)),
        });
      },

      buyNewFactory: (templateId) => {
        const state = get();
        const tpl = FACTORY_TEMPLATES.find((t) => t.id === templateId);
        if (!tpl || state.cash < tpl.price) return false;
        if (state.factories.some((f) => f.id === tpl.id)) return false;

        const newFactory: Factory = {
          id: tpl.id,
          name: tpl.name,
          city: tpl.city,
          country: tpl.country,
          areaSqm: tpl.areaSqm,
          level: 1,
          allocatedCapital: tpl.price,
          departments: createInitialDepartments(),
          rawInventory: {
            cotton: 80,
            denim: 50,
            polyester: 60,
            thread: 60,
            buttons: 50,
            zippers: 50,
            ink: 40,
            detergent: 40,
            packaging: 80,
          },
          reorderLevels: {
            cotton: 30,
            denim: 25,
            polyester: 25,
            thread: 25,
            buttons: 20,
            zippers: 20,
            ink: 15,
            detergent: 15,
            packaging: 30,
          },
          finishedInventory: {
            tshirt: { qty: 0, quality: 80 },
            shirt: { qty: 0, quality: 80 },
            jeans: { qty: 0, quality: 80 },
            pants: { qty: 0, quality: 80 },
            jacket: { qty: 0, quality: 82 },
            sportswear: { qty: 0, quality: 80 },
            underwear: { qty: 0, quality: 78 },
            kidswear: { qty: 0, quality: 80 },
            winterwear: { qty: 0, quality: 84 },
          },
          dailyRevenue: 0,
          dailyExpenses: 0,
          dailyProduced: 0,
          efficiency: 82,
        };

        set({
          cash: state.cash - tpl.price,
          activeFactoryId: newFactory.id,
          factories: [...state.factories, newFactory],
          xp: state.xp + 300,
          reputation: Math.min(100, state.reputation + 8),
          stats: { ...state.stats, totalExpenses: state.stats.totalExpenses + tpl.price },
          financialLogs: [
            {
              id: `log-fac-${Date.now()}`,
              day: state.day,
              type: 'expense',
              category: 'upgrades',
              description: `الاستحواذ على ${tpl.name} (${tpl.city})`,
              amount: tpl.price,
            },
            ...state.financialLogs,
          ].slice(0, 60),
          events: [
            {
              id: `evt-fac-${Date.now()}`,
              day: state.day,
              title: `توسع دولي: افتتاح ${tpl.name}`,
              description: tpl.bonusDesc,
              severity: 'success',
            },
            ...state.events,
          ].slice(0, 30),
        });
        return true;
      },

      upgradeFactoryBuilding: (factoryId) => {
        const state = get();
        const factory = state.factories.find((f) => f.id === factoryId);
        if (!factory) return false;
        const cost = factory.level * 25000;
        if (state.cash < cost) return false;

        set({
          cash: state.cash - cost,
          factories: state.factories.map((f) =>
            f.id === factoryId
              ? {
                  ...f,
                  level: f.level + 1,
                  areaSqm: f.areaSqm + 250,
                  efficiency: Math.min(100, f.efficiency + 3),
                }
              : f
          ),
          stats: { ...state.stats, totalExpenses: state.stats.totalExpenses + cost },
        });
        return true;
      },

      takeLoan: (bankName, amount, interestRate) => {
        const state = get();
        const totalRepayable = Math.round(amount * (1 + interestRate));
        const dailyPayment = Math.round(totalRepayable / 20);

        set({
          cash: state.cash + amount,
          loans: [
            ...state.loans,
            {
              id: `loan-${Date.now()}`,
              bankName,
              principal: amount,
              remaining: totalRepayable,
              interestRate,
              dailyPayment,
            },
          ],
          financialLogs: [
            {
              id: `log-loan-in-${Date.now()}`,
              day: state.day,
              type: 'income',
              category: 'loans',
              description: `استلام تمويل بنكي من ${bankName}`,
              amount,
            },
            ...state.financialLogs,
          ].slice(0, 60),
        });
      },

      repayLoan: (loanId, amount) => {
        const state = get();
        const loan = state.loans.find((l) => l.id === loanId);
        if (!loan || state.cash < amount) return false;

        const actualPay = Math.min(loan.remaining, amount);
        set({
          cash: state.cash - actualPay,
          loans: state.loans
            .map((l) => (l.id === loanId ? { ...l, remaining: l.remaining - actualPay } : l))
            .filter((l) => l.remaining > 0),
        });
        return true;
      },

      resetGame: () => {
        set(createInitialState());
      },

      loadCloudState: (saved) => {
        set((state) => ({ ...state, ...saved }));
      },
    }),
    {
      name: 'fashion-empire-tycoon-save-v1',
    }
  )
);
