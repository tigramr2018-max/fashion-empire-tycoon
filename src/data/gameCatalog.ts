import {
  CountryKey,
  DepartmentKey,
  EmployeeRole,
  FactoryTemplate,
  ProductKey,
  RawMaterialKey,
} from '../types/game';

export const RAW_MATERIALS: Record<
  RawMaterialKey,
  { name: string; unit: string; basePrice: number; supplier: string }
> = {
  cotton: { name: 'قطن مصري فاخر', unit: 'متر', basePrice: 18, supplier: 'شركة الدلتا للغزل' },
  denim: { name: 'قماش جينز (Denim)', unit: 'متر', basePrice: 28, supplier: 'مصانع المحلة للنسيج' },
  polyester: { name: 'بوليستر صناعي', unit: 'متر', basePrice: 12, supplier: 'الخليج للبتروكيماويات' },
  thread: { name: 'خيوط حياكة مقواة', unit: 'بكرة', basePrice: 6, supplier: 'النيل للخيوط' },
  buttons: { name: 'أزرار معدنية وبلاستيكية', unit: 'علبة', basePrice: 8, supplier: 'إكسسوارات الشرق' },
  zippers: { name: 'سوست معدنية', unit: 'حزمة', basePrice: 10, supplier: 'إكسسوارات الشرق' },
  ink: { name: 'أحبار طباعة حرارية', unit: 'لتر', basePrice: 35, supplier: 'كيماويات الألوان' },
  detergent: { name: 'مواد غسيل وإنزيمات', unit: 'لتر', basePrice: 15, supplier: 'المنظفات الصناعية' },
  packaging: { name: 'مواد تغليف وكراتين', unit: 'حزمة', basePrice: 9, supplier: 'تغليف المستقبل' },
};

export const PRODUCTS: Record<
  ProductKey,
  {
    name: string;
    basePrice: number;
    productionTimeTicks: number;
    baseQuality: number;
    recipe: Partial<Record<RawMaterialKey, number>>;
    departments: DepartmentKey[];
  }
> = {
  tshirt: {
    name: 'تيشيرت قطني',
    basePrice: 120,
    productionTimeTicks: 4,
    baseQuality: 76,
    recipe: { cotton: 2, thread: 1, ink: 1, packaging: 1 },
    departments: ['receiving', 'cutting', 'sewing', 'printing', 'ironing', 'quality_control', 'packaging_dept', 'shipping'],
  },
  shirt: {
    name: 'قميص كلاسيك',
    basePrice: 210,
    productionTimeTicks: 6,
    baseQuality: 78,
    recipe: { cotton: 3, thread: 1, buttons: 2, packaging: 1 },
    departments: ['receiving', 'cutting', 'sewing', 'embroidery', 'ironing', 'quality_control', 'packaging_dept', 'shipping'],
  },
  jeans: {
    name: 'بنطلون جينز',
    basePrice: 290,
    productionTimeTicks: 8,
    baseQuality: 80,
    recipe: { denim: 3, thread: 2, buttons: 1, zippers: 1, detergent: 2, packaging: 1 },
    departments: ['receiving', 'cutting', 'sewing', 'laundry', 'finishing', 'ironing', 'quality_control', 'packaging_dept', 'shipping'],
  },
  pants: {
    name: 'بنطلون قماش',
    basePrice: 230,
    productionTimeTicks: 6,
    baseQuality: 77,
    recipe: { cotton: 2, polyester: 1, thread: 1, zippers: 1, buttons: 1, packaging: 1 },
    departments: ['receiving', 'cutting', 'sewing', 'finishing', 'ironing', 'quality_control', 'packaging_dept', 'shipping'],
  },
  jacket: {
    name: 'جاكيت ثقيل',
    basePrice: 460,
    productionTimeTicks: 10,
    baseQuality: 82,
    recipe: { denim: 2, polyester: 3, thread: 2, zippers: 2, buttons: 2, detergent: 1, packaging: 1 },
    departments: ['receiving', 'cutting', 'sewing', 'embroidery', 'laundry', 'finishing', 'quality_control', 'packaging_dept', 'shipping'],
  },
  sportswear: {
    name: 'طقم ملابس رياضية',
    basePrice: 250,
    productionTimeTicks: 6,
    baseQuality: 79,
    recipe: { polyester: 3, thread: 1, ink: 2, zippers: 1, packaging: 1 },
    departments: ['receiving', 'cutting', 'sewing', 'printing', 'quality_control', 'packaging_dept', 'shipping'],
  },
  underwear: {
    name: 'ملابس داخلية قطنية',
    basePrice: 85,
    productionTimeTicks: 3,
    baseQuality: 75,
    recipe: { cotton: 1, thread: 1, packaging: 1 },
    departments: ['receiving', 'cutting', 'sewing', 'quality_control', 'packaging_dept', 'shipping'],
  },
  kidswear: {
    name: 'ملابس أطفال',
    basePrice: 150,
    productionTimeTicks: 5,
    baseQuality: 80,
    recipe: { cotton: 2, thread: 1, ink: 1, buttons: 1, packaging: 1 },
    departments: ['receiving', 'cutting', 'sewing', 'printing', 'embroidery', 'quality_control', 'packaging_dept', 'shipping'],
  },
  winterwear: {
    name: 'معطف شتوي فاخر',
    basePrice: 540,
    productionTimeTicks: 12,
    baseQuality: 84,
    recipe: { cotton: 2, polyester: 4, thread: 3, zippers: 2, buttons: 3, packaging: 1 },
    departments: ['receiving', 'cutting', 'sewing', 'embroidery', 'finishing', 'ironing', 'quality_control', 'packaging_dept', 'shipping'],
  },
};

export const DEPARTMENTS_INFO: Record<
  DepartmentKey,
  { name: string; description: string; baseUpgradeCost: number; roleBonus: EmployeeRole }
> = {
  receiving: { name: 'استلام الخامات', description: 'فحص واستلام الشحنات الواردة من الموردين', baseUpgradeCost: 4000, roleBonus: 'warehouse_manager' },
  raw_warehouse: { name: 'مخزن الخامات', description: 'تخزين الأقمشة والإكسسوارات وحفظها من التلف', baseUpgradeCost: 5000, roleBonus: 'warehouse_manager' },
  cutting: { name: 'قسم القص', description: 'قص الباترونات بدقة وتقليل الهالك من الأقمشة', baseUpgradeCost: 6500, roleBonus: 'worker' },
  sewing: { name: 'قسم الخياطة', description: 'تجميع القطع وحياكتها على خطوط الماكينات', baseUpgradeCost: 8000, roleBonus: 'supervisor' },
  printing: { name: 'قسم الطباعة', description: 'الطباعة الحرارية والسلك سكرين على الملابس', baseUpgradeCost: 6000, roleBonus: 'technician' },
  embroidery: { name: 'قسم التطريز', description: 'تطريز الشعارات والزخارف بالماكينات الرقمية', baseUpgradeCost: 6500, roleBonus: 'technician' },
  laundry: { name: 'المغاسل الصناعية', description: 'غسيل الإنزيمات والحجر وتنعيم الأقمشة', baseUpgradeCost: 9000, roleBonus: 'technician' },
  finishing: { name: 'قسم التشطيب', description: 'إزالة الخيوط الزائدة وتركيب الأزرار والسوست', baseUpgradeCost: 5500, roleBonus: 'worker' },
  ironing: { name: 'قسم الكي بالبخار', description: 'كي الملابس وتجهيزها بالمظهر النهائي', baseUpgradeCost: 5000, roleBonus: 'worker' },
  quality_control: { name: 'مراقبة الجودة', description: 'فحص القطع واستبعاد العيوب قبل التغليف', baseUpgradeCost: 7500, roleBonus: 'quality_manager' },
  packaging_dept: { name: 'قسم التعبئة', description: 'تغليف المنتجات ووضع الملصقات والباركود', baseUpgradeCost: 4500, roleBonus: 'worker' },
  finished_warehouse: { name: 'مخزن المنتجات النهائية', description: 'تخزين الجاهز للتسليم المحلي والتصدير', baseUpgradeCost: 5500, roleBonus: 'warehouse_manager' },
  shipping: { name: 'قسم الشحن والتصدير', description: 'تجهيز الحاويات وبوالص الشحن البري والبحري والجوي', baseUpgradeCost: 7000, roleBonus: 'export_manager' },
};

export const EMPLOYEE_ROLES: Record<
  EmployeeRole,
  { name: string; baseSalary: number; hireCost: number; impactDesc: string }
> = {
  worker: { name: 'عامل إنتاج', baseSalary: 140, hireCost: 600, impactDesc: 'يرفع سرعة الإنتاج في الأقسام والخطوط' },
  technician: { name: 'فني صيانة وتشغيل', baseSalary: 220, hireCost: 1100, impactDesc: 'يقلل أعطال الماكينات ويرفع كفاءة المغاسل' },
  supervisor: { name: 'مشرف خط إنتاج', baseSalary: 300, hireCost: 1600, impactDesc: 'يقلل نسبة الأخطاء والهالك أثناء التشغيل' },
  production_manager: { name: 'مدير إنتاج', baseSalary: 480, hireCost: 2800, impactDesc: 'يرفع إنتاجية جميع خطوط المصنع بنسبة +12%' },
  factory_manager: { name: 'مدير مصنع', baseSalary: 650, hireCost: 4000, impactDesc: 'يرفع الكفاءة العامة للمصنع ويخفض الهدر' },
  warehouse_manager: { name: 'مدير مخازن', baseSalary: 350, hireCost: 2000, impactDesc: 'يخفض تكاليف التخزين ويمنع تلف الخامات' },
  quality_manager: { name: 'مدير جودة', baseSalary: 450, hireCost: 2600, impactDesc: 'يرفع درجة الجودة النهائية للمنتجات +8 نقاط' },
  hr_manager: { name: 'مدير موارد بشرية', baseSalary: 420, hireCost: 2400, impactDesc: 'يرفع ولاء الموظفين ويمنع الاستقالات المفاجئة' },
  finance_manager: { name: 'مدير مالي', baseSalary: 520, hireCost: 3200, impactDesc: 'يخفض تكاليف التشغيل والضرائب بنسبة 8%' },
  export_manager: { name: 'مدير تصدير', baseSalary: 500, hireCost: 3000, impactDesc: 'يزيد أرباح عقود التصدير ويخفض تكلفة الشحن' },
};

export const COUNTRIES: Record<
  CountryKey,
  { name: string; region: string; priceMultiplier: number; taxRate: number; minQuality: number; baseShipping: number }
> = {
  egypt: { name: 'مصر (السوق المحلي)', region: 'محلي', priceMultiplier: 1.0, taxRate: 0.05, minQuality: 65, baseShipping: 400 },
  saudi: { name: 'السعودية', region: 'الخليج', priceMultiplier: 1.35, taxRate: 0.15, minQuality: 75, baseShipping: 1200 },
  uae: { name: 'الإمارات', region: 'الخليج', priceMultiplier: 1.45, taxRate: 0.05, minQuality: 78, baseShipping: 1300 },
  kuwait: { name: 'الكويت', region: 'الخليج', priceMultiplier: 1.4, taxRate: 0.05, minQuality: 76, baseShipping: 1250 },
  turkey: { name: 'تركيا', region: 'أوراسيا', priceMultiplier: 1.25, taxRate: 0.18, minQuality: 74, baseShipping: 1400 },
  morocco: { name: 'المغرب', region: 'شمال أفريقيا', priceMultiplier: 1.2, taxRate: 0.12, minQuality: 70, baseShipping: 1100 },
  germany: { name: 'ألمانيا', region: 'أوروبا', priceMultiplier: 1.85, taxRate: 0.19, minQuality: 85, baseShipping: 2400 },
  france: { name: 'فرنسا', region: 'أوروبا', priceMultiplier: 1.9, taxRate: 0.2, minQuality: 86, baseShipping: 2500 },
  italy: { name: 'إيطاليا', region: 'أوروبا', priceMultiplier: 2.0, taxRate: 0.22, minQuality: 88, baseShipping: 2300 },
  usa: { name: 'أمريكا', region: 'أمريكا الشمالية', priceMultiplier: 2.15, taxRate: 0.14, minQuality: 85, baseShipping: 3200 },
};

export const FACTORY_TEMPLATES: FactoryTemplate[] = [
  {
    id: 'fac-alex',
    name: 'مصنع الإسكندرية للمنسوجات',
    city: 'الإسكندرية',
    country: 'مصر',
    price: 95000,
    areaSqm: 900,
    bonusDesc: 'قريب من الميناء — يخفض تكلفة الشحن البحري بنسبة 15%',
  },
  {
    id: 'fac-jeddah',
    name: 'مصنع جدة الصناعي الحديث',
    city: 'جدة',
    country: 'السعودية',
    price: 180000,
    areaSqm: 1400,
    bonusDesc: 'سوق خليجي مباشر — يزيد سرعة تنفيذ طلبات الخليج',
  },
  {
    id: 'fac-istanbul',
    name: 'مصنع إسطنبول للأزياء الأوروبية',
    city: 'إسطنبول',
    country: 'تركيا',
    price: 290000,
    areaSqm: 2000,
    bonusDesc: 'جودة تصنيع عالية +7 نقاط لجميع خطوط الإنتاج',
  },
  {
    id: 'fac-milan',
    name: 'دار ومصنع ميلانو الفاخر',
    city: 'ميلانو',
    country: 'إيطاليا',
    price: 520000,
    areaSqm: 2800,
    bonusDesc: 'علامة تجارية عالمية — يضاعف سمعة الشركة وأسعار البيع',
  },
];

export const ARABIC_NAMES = [
  'أحمد محمود', 'سارة عبد الرحمن', 'محمد السيد', 'نورهان طارق', 'خالد العتيبي',
  'مريم المنصور', 'عمر فاروق', 'ياسمين حسن', 'طارق الزهراني', 'هدى إبراهيم',
  'مصطفى كامل', 'ريم القحطاني', 'كريم عادل', 'ليلى الشامسي', 'حسن النجار',
  'آية مصطفى', 'يوسف الدوسري', 'دينا سمير', 'وليد البنا', 'ندى السالم',
];

export const CLIENT_COMPANIES = [
  'مجموعة النخبة للأزياء', 'متاجر الشرق الكبرى', 'دار الأناقة الأوروبية',
  'شركة الموضة الحديثة', 'سلسلة أسواق الخليج', 'بوتيك باريس ستايل',
  'مؤسسة النجم الرياضي', 'شركة التجزئة المتحدة', 'أزياء البحر المتوسط',
];
