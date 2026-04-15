import { supabase } from '../config/supabase';

export const uploadImage = async (uri, userId) => {
  try {
    const fileName = `${userId}/${Date.now()}.jpg`;

    // ✅ Use fetch + arrayBuffer instead of FileSystem — works reliably in Expo Go
    const response = await fetch(uri);
    if (!response.ok) throw new Error('Failed to read image file');

    const arrayBuffer = await response.arrayBuffer();

    const { data, error } = await supabase.storage
      .from('report-images')
      .upload(fileName, arrayBuffer, {
        contentType: 'image/jpeg',
        upsert: false,
      });

    if (error) throw error;

    const { data: publicUrlData } = supabase.storage
      .from('report-images')
      .getPublicUrl(fileName);

    return publicUrlData.publicUrl;

  } catch (err) {
    console.error('uploadImage error:', err);
    throw err;
  }
};