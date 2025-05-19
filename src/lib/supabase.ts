// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

export async function uploadImage(file: File): Promise<string> {
  // 1) Upload the file
  const safeName = encodeURIComponent(file.name.replace(/\s+/g, '-'));
  const path = `uploads/${Date.now()}_${safeName}`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('images')
    .upload(path, file);
  if (uploadError || !uploadData) {
    throw uploadError ?? new Error('Upload failed');
  }

  // 2) Get the public URL (synchronous and always “successful”)
  const { data: urlData } = supabase.storage
    .from('images')
    .getPublicUrl(uploadData.path);

  // urlData.publicUrl definitely exists here
  return urlData.publicUrl;
}
