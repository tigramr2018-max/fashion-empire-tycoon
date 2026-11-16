-- Fashion Empire Tycoon - PostgreSQL / Supabase Schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. جدول حسابات الشركات (ملف اللاعب)
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'إمبراطورية النسيج العربية',
  cash NUMERIC(14,2) NOT NULL DEFAULT 150000,
  level INT NOT NULL DEFAULT 1,
  xp INT NOT NULL DEFAULT 0,
  reputation INT NOT NULL DEFAULT 50,
  game_day INT NOT NULL DEFAULT 1,
  game_hour INT NOT NULL DEFAULT 8,
  total_revenue NUMERIC(14,2) NOT NULL DEFAULT 0,
  total_expenses NUMERIC(14,2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. جدول المصانع
CREATE TABLE IF NOT EXISTS factories (
  id TEXT PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  area_sqm INT NOT NULL DEFAULT 400,
  level INT NOT NULL DEFAULT 1,
  allocated_budget NUMERIC(14,2) NOT NULL DEFAULT 50000,
  daily_revenue NUMERIC(14,2) NOT NULL DEFAULT 0,
  daily_expenses NUMERIC(14,2) NOT NULL DEFAULT 0,
  efficiency NUMERIC(5,2) NOT NULL DEFAULT 75
);

-- 3. جدول الأقسام الصناعية الـ 13 لكل مصنع
CREATE TABLE IF NOT EXISTS factory_departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  factory_id TEXT REFERENCES factories(id) ON DELETE CASCADE,
  dept_key TEXT NOT NULL,
  level INT NOT NULL DEFAULT 1,
  capacity INT NOT NULL DEFAULT 100,
  operating_cost NUMERIC(10,2) NOT NULL DEFAULT 120,
  wash_machines INT DEFAULT 0,
  water_usage INT DEFAULT 0,
  UNIQUE(factory_id, dept_key)
);

-- 4. جدول خطوط الإنتاج
CREATE TABLE IF NOT EXISTS production_lines (
  id TEXT PRIMARY KEY,
  factory_id TEXT REFERENCES factories(id) ON DELETE CASCADE,
  product_key TEXT NOT NULL,
  machines INT NOT NULL DEFAULT 2,
  max_machines INT NOT NULL DEFAULT 10,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  progress NUMERIC(5,2) NOT NULL DEFAULT 0,
  quality_score NUMERIC(5,2) NOT NULL DEFAULT 75,
  breakdown_risk NUMERIC(5,2) NOT NULL DEFAULT 4
);

-- 5. جدول الموارد البشرية (الموظفين)
CREATE TABLE IF NOT EXISTS employees (
  id TEXT PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  factory_id TEXT REFERENCES factories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  experience INT NOT NULL DEFAULT 1,
  efficiency INT NOT NULL DEFAULT 70,
  salary NUMERIC(10,2) NOT NULL DEFAULT 150,
  speed INT NOT NULL DEFAULT 70,
  loyalty INT NOT NULL DEFAULT 80,
  error_rate NUMERIC(5,2) NOT NULL DEFAULT 5,
  level INT NOT NULL DEFAULT 1
);

-- 6. جدول المخازن (خامات ومنتجات نهائية)
CREATE TABLE IF NOT EXISTS inventory (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  factory_id TEXT REFERENCES factories(id) ON DELETE CASCADE,
  item_category TEXT NOT NULL CHECK (item_category IN ('raw', 'finished')),
  item_key TEXT NOT NULL,
  quantity INT NOT NULL DEFAULT 0,
  reorder_level INT NOT NULL DEFAULT 50,
  avg_quality NUMERIC(5,2) NOT NULL DEFAULT 80,
  UNIQUE(factory_id, item_category, item_key)
);

-- 7. جدول الطلبات والتصدير
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  client_name TEXT NOT NULL,
  country_key TEXT NOT NULL,
  product_key TEXT NOT NULL,
  quantity INT NOT NULL,
  min_quality INT NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL,
  deadline_days INT NOT NULL,
  is_urgent BOOLEAN NOT NULL DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'open'
);

-- 8. جدول القروض والسجلات المالية
CREATE TABLE IF NOT EXISTS loans (
  id TEXT PRIMARY KEY,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  bank_name TEXT NOT NULL,
  principal NUMERIC(14,2) NOT NULL,
  remaining NUMERIC(14,2) NOT NULL,
  interest_rate NUMERIC(5,4) NOT NULL,
  daily_payment NUMERIC(10,2) NOT NULL
);

-- 9. جدول حفظ حالة اللعبة الكاملة (Snapshot Sync)
CREATE TABLE IF NOT EXISTS game_saves (
  player_key TEXT PRIMARY KEY,
  save_data JSONB NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
