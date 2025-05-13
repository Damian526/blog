// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function uploadImage(file: File): Promise<string> {
  const path = `uploads/${Date.now()}_${file.name}`;
  const { data, error } = await supabase.storage
    .from('images')
    .upload(path, file);
  if (error || !data) throw error || new Error('Upload failed');
  const { publicUrl } = supabase.storage.from('images').getPublicUrl(data.path);
  return publicUrl;
}
