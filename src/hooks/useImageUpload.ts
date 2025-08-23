
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadImages = async (files: FileList, postId: string) => {
    if (!files || files.length === 0) return [];

    setUploading(true);
    const uploadedImages = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${postId}-${Date.now()}-${i}.${fileExt}`;
        const filePath = `post-images/${fileName}`;

        // Upload to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('post-media')
          .upload(filePath, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          throw uploadError;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('post-media')
          .getPublicUrl(filePath);

        // Save to post_images table
        const { error: dbError } = await supabase
          .from('post_images')
          .insert({
            post_id: postId,
            image_url: publicUrl,
            image_type: file.type.startsWith('video/') ? 'video' : 'screenshot'
          });

        if (dbError) {
          console.error('Database error:', dbError);
          throw dbError;
        }

        uploadedImages.push({
          url: publicUrl,
          type: file.type.startsWith('video/') ? 'video' : 'screenshot'
        });
      }

      return uploadedImages;
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload media. Please try again.",
        variant: "destructive"
      });
      return [];
    } finally {
      setUploading(false);
    }
  };

  return { uploadImages, uploading };
};
