import { supabase } from "./supabase";

const BUCKET = "puzzle";

/**
 * base64 data URL을 Supabase Storage에 업로드하고 public URL을 반환
 * @param dataUrl  getCroppedDataURL()의 반환값 (data:image/jpeg;base64,...)
 * @param path     저장 경로 (예: "userId/filename.jpg")
 */
export async function uploadImage(
  dataUrl: string,
  path: string,
): Promise<string> {
  const base64 = dataUrl.split(",")[1];
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const blob = new Blob([bytes], { type: "image/jpeg" });

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, { contentType: "image/jpeg", upsert: false });

  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
