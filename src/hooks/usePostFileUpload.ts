import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const usePostFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadPostFiles = async (postId: string, files: File[]) => {
    if (!files || files.length === 0) return [];
    
    setUploading(true);
    const uploadedImages: string[] = [];

    try {
      for (const file of files) {
        // Generate unique filename
        const fileExt = file.name.split('.').pop();
        const fileName = `${postId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('post-media')
          .upload(fileName, file);

        if (uploadError) {
          console.error('Upload error:', uploadError);
          toast({
            title: "Upload Failed",
            description: `Failed to upload ${file.name}: ${uploadError.message}`,
            variant: "destructive"
          });
          continue;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('post-media')
          .getPublicUrl(fileName);

        // Create post_images record
        const imageType = file.type.startsWith('video/') ? 'video' : 'image';
        const { error: dbError } = await supabase
          .from('post_images')
          .insert({
            post_id: postId,
            image_url: publicUrl,
            image_type: imageType
          });

        if (dbError) {
          console.error('Database error:', dbError);
          toast({
            title: "Database Error",
            description: `Failed to save ${file.name} reference`,
            variant: "destructive"
          });
          continue;
        }

        uploadedImages.push(publicUrl);
      }

      if (uploadedImages.length > 0) {
        toast({
          title: "Files Uploaded",
          description: `Successfully uploaded ${uploadedImages.length} file(s)`,
          variant: "default"
        });
      }

      return uploadedImages;
    } catch (error) {
      console.error('Upload process error:', error);
      toast({
        title: "Upload Error",
        description: "An unexpected error occurred during upload",
        variant: "destructive"
      });
      return [];
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadPostFiles,
    uploading
  };
};