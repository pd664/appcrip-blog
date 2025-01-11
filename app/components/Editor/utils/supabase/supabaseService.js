// utils/supabase/supabaseService.js
import { createClient } from '@supabase/supabase-js';
class SupabaseService {
  constructor() {
    this.supabase = createClient(
        'https://hbwraouugycbgarnblwp.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhid3Jhb3V1Z3ljYmdhcm5ibHdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY0MjUwMTUsImV4cCI6MjA1MjAwMTAxNX0.4oC_ah05OXeDV14ubxRuSDc7TlfWkh6GSgTigCRTsJo'
      );
      this.cache = {}; 
  }

  // Authentication methods
  async getSession() {
    const { data: { session }, error } = await this.supabase.auth.getSession();
    if (error) throw error;
    return session;
  }

  onAuthStateChange(callback) {
    return this.supabase.auth.onAuthStateChange(callback);
  }

  // Editor data methods
  // async fetchEditorData() {
  //   const { data, error } = await this.supabase
  //     .from('editor_data')
  //     .select('*');

  //   if (error) throw error;
  //   console.log("dataaaaa", data)
  //   return data;
  // }

  async fetchEditorData() {
    // Only fetch needed fields for listing
    const { data, error } = await this.supabase
      .from('editor_data')
      .select('id, title, created_at')
      .order('created_at', { ascending: true });
  
    if (error) throw error;
    return data;
  }

  
  async fetchPostBySlug(slug) {
    const cachedPost = await this.getFromCache(slug);
    if (cachedPost) return cachedPost;
console.log("slug is", slug, slug.replace(/-/g, ' '))
    // If not in cache, fetch from Supabase
    const { data, error } = await this.supabase
        .from('editor_data')
        .select('*')
        .eq('title', slug.replace(/-/g, ' '))
        .single();

    if (error) {
        console.error('Error fetching post:', error);
        return null;
    }
console.log("data is ftching", data)
    if (data) {
        await this.setCache(slug, data);
    }

    return data;
}

async getFromCache(slug) {
  // Check in-memory cache
  if (this.cache[slug]) {
      console.log('Fetching from cache');
      return this.cache[slug];
  }
  return null;
}

// Optional: Set the post to cache
async setCache(slug, data) {
  // Store data in in-memory cache
  this.cache[slug] = data;
  console.log('Post cached');
}


  async saveEditorContent(content, imageUrl, title) {
    const { data, error } = await this.supabase
      .from('editor_data')
      .insert([{
        content,
        title,
        image_url: imageUrl || '',
      }])
      .select();

    if (error) throw error;
    return data;
  }
}

export const supabaseService = new SupabaseService();

// async uploadImage(file) {
//   if (!file) return null; // Check if file is selected
//   console.log("File is", file);

//   // Sanitize the file name to remove spaces or special characters
//   const sanitizedFileName = file.name.replace(/\s+/g, '_').replace(/[^\w\-_\.]/g, '');

//   // Generate a unique file path using sanitized name
//   const filePath = `images/${Date.now()}_${sanitizedFileName}`;
// console.log("file path", filePath)
//   // Upload the file
//   const { data, error } = await this.supabase.storage
//     .from('images')
//     .upload(filePath, file, {
//       cacheControl: '3600',  // You can adjust the cache control as needed
//       upsert: false,         // Set to 'false' to prevent overwriting
//     });

//   if (error) {
//     console.error('Error uploading file:', error);
//     return null; // Handle the error (you can show an alert or return an error state)
//   }

//   // Get the public URL of the uploaded file
//   const { data: imageData, error: imageError } = await this.supabase.storage
//     .from('images')
//     .getPublicUrl(filePath); // Use the correct file path

//   if (imageError) {
//     console.error('Error fetching public URL:', imageError);
//     return null; // Handle the error
//   } else {
//     // Assuming this.imageUrl is your class's state
//     this.imageUrl = imageData.publicUrl; // Update the class property with the URL
//     console.log("Uploaded image URL:", this.imageUrl);
//   }
// }


