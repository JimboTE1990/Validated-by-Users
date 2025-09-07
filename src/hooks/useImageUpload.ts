
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

export const useImageUpload = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const uploadImages = async (files: FileList, postId: string) => {
    if (!files || files.length === 0) return [];

    // Validate all files before uploading any
    for (let i = 0; i < files.length; i++) {
      const validation = validateFile(files[i]);
      if (!validation.valid) {
        toast({
          title: "Invalid File",
          description: `${files[i].name}: ${validation.error}`,
          variant: "destructive"
        });
        return [];
      }
    }

    setUploading(true);
    const uploadedImages = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Generate secure filename
        const fileExt = file.name.split('.').pop()?.toLowerCase();
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '');
        const fileName = `${postId}-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `post-images/${fileName}`;

        // Upload to Supabase Storage with content type validation
        const { error: uploadError } = await supabase.storage
          .from('post-media')
          .upload(filePath, file, {
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
          continue; // Continue with other files instead of failing all
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('post-media')
          .getPublicUrl(filePath);

        // Save to post_images table with type classification
        const imageType = file.type.startsWith('video/') ? 'video' : 'screenshot';
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
          await supabase.storage.from('post-media').remove([filePath]);
          toast({
            title: "Database Error",
            description: `Failed to save ${sanitizedName} reference`,
            variant: "destructive"
          });
          continue;
        }

        uploadedImages.push({
          url: publicUrl,
          type: imageType
        });
      }

      if (uploadedImages.length > 0) {
        toast({
          title: "Upload Complete",
          description: `Successfully uploaded ${uploadedImages.length} file(s)`,
          variant: "default"
        });
      }

      return uploadedImages;
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: "Upload Failed",
        description: "An unexpected error occurred during upload.",
        variant: "destructive"
      });
      return [];
    } finally {
      setUploading(false);
    }
  };

  return { uploadImages, uploading };
};
