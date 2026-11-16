import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export async function syncSaveToSupabase(playerKey: string, stateSnapshot: unknown): Promise<{ ok: boolean; message: string }> {
  if (!supabase) {
    return { ok: false, message: 'لم يتم إعداد مفاتيح Supabase في ملف .env (الحفظ المحلي نشط)' };
  }
  const { error } = await supabase
    .from('game_saves')
    .upsert({ player_key: playerKey, save_data: stateSnapshot, updated_at: new Date().toISOString() });

  if (error) {
    return { ok: false, message: `خطأ في المزامنة: ${error.message}` };
  }
  return { ok: true, message: 'تمت مزامنة التقدم مع قاعدة بيانات Supabase بنجاح' };
}

export async function loadSaveFromSupabase(playerKey: string): Promise<{ data: any | null; message: string }> {
  if (!supabase) {
    return { data: null, message: 'Supabase غير متصل' };
  }
  const { data, error } = await supabase
    .from('game_saves')
    .select('save_data')
    .eq('player_key', playerKey)
    .single();

  if (error || !data) {
    return { data: null, message: 'لا يوجد حفظ سحابي لهذا المعرف' };
  }
  return { data: data.save_data, message: 'تم استرجاع الحفظ السحابي بنجاح' };
}
