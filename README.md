# Fashion Empire Tycoon (إمبراطورية الأزياء)

لعبة إدارة أعمال ومصانع ملابس احترافية (Business Management & Factory Tycoon) باللغة العربية بالكامل مع دعم RTL.

## التقنيات المستخدمة
- **React 18 + TypeScript**
- **Tailwind CSS** (تصميم متجاوب بالكامل مع دعم RTL)
- **Zustand** (إدارة حالة اللعبة والمحرك الزمني + الحفظ التلقائي في LocalStorage)
- **Supabase & PostgreSQL** (مخطط قاعدة بيانات متكامل ومزامنة سحابية اختيارية)

## طريقة التشغيل المحلي
1. ثبت الحزم:
   ```bash
   npm install
   ```
2. (اختياري) انسخ `.env.example` إلى `.env` وأضف بيانات Supabase الخاصة بك، ثم نفذ ملف `supabase/schema.sql` في لوحة تحكم Supabase SQL Editor.
3. شغّل خادم التطوير:
   ```bash
   npm run dev
   ```
