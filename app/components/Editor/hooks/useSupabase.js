import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseService } from '@/app/components/Editor/utils/supabase/supabaseService';

export function useSupabase() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editorData, setEditorData] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const data = await supabaseService.fetchEditorData();
        setEditorData(data || []);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    // Set up auth listener
    const { data: { subscription } } = supabaseService.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        router.push('/auth/login');
      }
    });

    fetchInitialData();

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const saveContent = async (content, file, title) => {
  setLoading(true);
  try {
    let imageUrl = null;
    // Upload image only if a file is provided
    if (file) {
      imageUrl = await supabaseService.uploadImage(file); // Upload image and get the URL
    }
console.log("imageurl", imageUrl)
    // Insert the content into the 'editor_data' table
    const { data, error } = await supabaseService.saveEditorContent(content, imageUrl, title)

    if (error) throw error;

    // Assuming 'savedData' is the data returned from Supabase after insertion
    const savedData = data || [];

    // Update editorData state with the newly saved content
    setEditorData(prev => [...prev, ...savedData]);

    return { success: true, data: savedData };
  } catch (err) {
    setError(err);
    return { success: false, error: err };
  } finally {
    setLoading(false);
  }
};


  return {
    loading,
    error,
    editorData,
    saveContent,
  };
}
