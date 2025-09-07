import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const validateFile = (file: File): { valid: boolean; error?: string } => {
  // Allowed MIME types for enhanced security
  const allowedImageTypes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'
  ];
  const allowedVideoTypes = [
    'video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov', 'video/wmv'
  ];
  
  // File type validation
  const isValidImage = allowedImageTypes.includes(file.type);
  const isValidVideo = allowedVideoTypes.includes(file.type);
  
  if (!isValidImage && !isValidVideo) {
    return { valid: false, error: "Invalid file type. Only images and videos are allowed." };
  }
  
  // File size validation (10MB for images, 50MB for videos)
  const maxImageSize = 10 * 1024 * 1024; // 10MB
  const maxVideoSize = 50 * 1024 * 1024; // 50MB
  const maxSize = isValidImage ? maxImageSize : maxVideoSize;
  
  if (file.size > maxSize) {
    const maxSizeMB = isValidImage ? 10 : 50;
    return { valid: false, error: `File too large. Maximum size: ${maxSizeMB}MB` };
  }
  
  // Filename validation to prevent path traversal
  if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
    return { valid: false, error: "Invalid filename. Special characters not allowed." };
  }
  
  // Check file extension matches MIME type
  const extension = file.name.split('.').pop()?.toLowerCase();
  const validExtensions = isValidImage 
    ? ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg']
    : ['mp4', 'webm', 'ogg', 'avi', 'mov', 'wmv'];
  
  if (!extension || !validExtensions.includes(extension)) {
    return { valid: false, error: "File extension doesn't match file type." };
  }
  
  return { valid: true };
};

export const usePostFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadPostFiles = async (postId: string, files: File[]) => {
    if (!files || files.length === 0) return [];
    
    // Validate all files before uploading any
    for (const file of files) {
      const validation = validateFile(file);
      if (!validation.valid) {
        toast({
          title: "Invalid File",
          description: `${file.name}: ${validation.error}`,
          variant: "destructive"
        });
        return [];
      }
    }
    
    setUploading(true);
    const uploadedImages: string[] = [];

    try {
      for (const file of files) {
        // Generate secure filename
        const fileExt = file.name.split('.').pop()?.toLowerCase();
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '');
        const fileName = `${postId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        
        // Upload to Supabase Storage with content type validation
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('post-media')
          .upload(fileName, file, {
            contentType: file.type,
            upsert: false // Prevent overwriting existing files
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          toast({
            title: "Upload Failed",
            description: `Failed to upload ${sanitizedName}: ${uploadError.message}`,
            variant: "destructive"
          });
          continue;
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('post-media')
          .getPublicUrl(fileName);

        // Create post_images record with proper type classification
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
          // Clean up uploaded file if database insert fails
          await supabase.storage.from('post-media').remove([fileName]);
          toast({
            title: "Database Error",
            description: `Failed to save ${sanitizedName} reference`,
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