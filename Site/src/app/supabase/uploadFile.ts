import { supabase } from '../../lib/supabaseClient';

async function uploadImage(file : File) {
  // Check if a file was provided
  if (!file) {
    throw new Error('No file provided');
  }

  // Generate a unique name for the file (e.g., adding a timestamp or UUID)
  const fileName = `${Date.now()}_${file.name}`;

  // Upload the image to the 'images' bucket
  const { error } = await supabase.storage
    .from('images')
    .upload(fileName, file);

  if (error) {
    console.error('Error uploading image:', error.message);
    return { success: false, error };
  }

  // Return the uploaded file's public URL (if needed)
  const { data } = supabase.storage
    .from('images')
    .getPublicUrl(fileName);

  return { success: true, publicUrl: data.publicUrl };
}

export default uploadImage;
