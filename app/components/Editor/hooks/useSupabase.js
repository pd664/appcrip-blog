import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseService } from '@/app/components/Editor/utils/supabase/supabaseService';
import axios from 'axios';

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
    let imageUrl = '';
    // Upload image only if a file is provided
    if (file) {
      
      imageUrl = await uploadFile(file);
      if (imageUrl) {
        console.log("Image URL:", imageUrl);
      } else {
        console.log("File upload failed.");
      }
 // Upload image and get the URL
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

const fetchImages = async() => {
  try {
    console.log("Uploading file to S3", file);

    const response = await axios.get(
      `https://prateek-test-interview.s3.ap-south-1.amazonaws.com/${file.name}`,
      file,
      {
        headers: {
          "Content-Type": file.type,
        },
      }
    );

    // If the upload is successful, log the response and return the file's URL
    console.log("File uploaded successfully:", response, response?.request?.responseURL);
    return response?.request?.responseURL;  // The URL of the uploaded file in S3

  } catch (err) {
    console.error("Error uploading file:", err);
    return null; // Return null if there is an error
  }
};

const fetchFirstThreeImages = async () => {
  const bucketName = "prateek-test-interview";
  const region = "ap-south-1";
  const folder = "images";

  try {
    const response = await fetch(
      `https://prateek-test-interview.s3.ap-south-1.amazonaws.com?prefix=images/`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch bucket contents: ${response.statusText}`);
    }

    const textResponse = await response.text();

    // Parse the XML response
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(textResponse, "text/xml");
    const keys = xmlDoc.getElementsByTagName("Key");

    // Extract the first three image URLs
    const imageUrls = [];
    for (let i = 0; i < Math.min(3, keys.length); i++) {
      const key = keys[i].textContent;
      imageUrls.push(`https://${bucketName}.s3.${region}.amazonaws.com/${key}`);
    }

    console.log("First three images:", imageUrls);
    return imageUrls;
  } catch (err) {
    console.error("Error fetching images from S3:", err);
    return [];
  }
};



const uploadFile = async (file) => {
  try {
    console.log("Uploading file to S3", file);

    const response = await axios.put(
      `https://prateek-test-interview.s3.ap-south-1.amazonaws.com/images/${file.name}`,
      file,
      {
        headers: {
          "Content-Type": file.type,
        },
      }
    );

    // If the upload is successful, log the response and return the file's URL
    console.log("File uploaded successfully:", response, response?.request?.responseURL);
    return response?.request?.responseURL;  // The URL of the uploaded file in S3

  } catch (err) {
    console.error("Error uploading file:", err);
    return null; // Return null if there is an error
  }
};


  return {
    loading,
    error,
    editorData,
    saveContent,
  };
}
