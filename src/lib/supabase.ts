import { createClient } from '@supabase/supabase-js';

/**
 * Supabase 客户端初始化
 * NOTE: 使用 publishable key，安全性由 RLS 策略保障
 */
const SUPABASE_URL = 'https://ewitmkvrpysifhcasmch.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV3aXRta3ZycHlzaWZoY2FzbWNoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NDk3MDIsImV4cCI6MjA5MTAyNTcwMn0.C5iAsktEY-Llt6aFxicEO9SnLeaAUiCvb2PlgNVmXEo';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
