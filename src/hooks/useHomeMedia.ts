import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface HomeMedia {
  id: string;
  step_number: number;
  file_name: string;
  file_path: string;
  media_type: 'image' | 'video';
  created_at: string;
}

export const useHomeMedia = () => {
  const [media, setMedia] = useState<HomeMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchHomeMedia = async () => {
    try {
      const { data, error } = await supabase
        .from('home_media')
        .select('*')
        .order('step_number');

      if (error) {
        console.error('Error fetching home media:', error);
        toast({
          title: "Error",
          description: "Failed to load home media.",
          variant: "destructive"
        });
        return;
      }

      setMedia(data?.map(item => ({
        ...item,
        media_type: item.media_type as 'image' | 'video'
      })) || []);
    } catch (error) {
      console.error('Error fetching home media:', error);
      toast({
        title: "Error",
        description: "Failed to load home media.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadMedia = async (stepNumber: number, file: File): Promise<string | null> => {
    try {
      // Generate unique file path
      const fileExt = file.name.split('.').pop();
      const fileName = `step-${stepNumber}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('home-media')
        .upload(filePath, file, {
          upsert: true,
          contentType: file.type
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        toast({
          title: "Upload Failed",
          description: uploadError.message,
          variant: "destructive"
        });
        return null;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('home-media')
        .getPublicUrl(filePath);

      // Save record to database
      const mediaType = file.type.startsWith('image/') ? 'image' : 'video';
      
      const { error: dbError } = await supabase
        .from('home_media')
        .upsert({
          step_number: stepNumber,
          file_name: file.name,
          file_path: publicUrl,
          media_type: mediaType
        }, {
          onConflict: 'step_number'
        });

      if (dbError) {
        console.error('Database error:', dbError);
        toast({
          title: "Database Error",
          description: dbError.message,
          variant: "destructive"
        });
        return null;
      }

      // Refresh media list
      await fetchHomeMedia();

      toast({
        title: "Upload Successful",
        description: `${mediaType === 'image' ? 'Image' : 'Video'} uploaded successfully.`
      });

      return publicUrl;
    } catch (error) {
      console.error('Error uploading media:', error);
      toast({
        title: "Upload Failed",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
      return null;
    }
  };

  const removeMedia = async (stepNumber: number): Promise<boolean> => {
    try {
      // Get current media to delete from storage
      const currentMedia = media.find(m => m.step_number === stepNumber);
      
      if (currentMedia) {
        // Extract file path from URL for storage deletion
        const url = new URL(currentMedia.file_path);
        const pathSegments = url.pathname.split('/');
        const fileName = pathSegments[pathSegments.length - 1];

        // Delete from storage
        const { error: storageError } = await supabase.storage
          .from('home-media')
          .remove([fileName]);

        if (storageError) {
          console.error('Storage deletion error:', storageError);
        }
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('home_media')
        .delete()
        .eq('step_number', stepNumber);

      if (dbError) {
        console.error('Database deletion error:', dbError);
        toast({
          title: "Deletion Failed",
          description: dbError.message,
          variant: "destructive"
        });
        return false;
      }

      // Refresh media list
      await fetchHomeMedia();

      toast({
        title: "Media Removed",
        description: "Media removed successfully."
      });

      return true;
    } catch (error) {
      console.error('Error removing media:', error);
      toast({
        title: "Removal Failed",
        description: "An unexpected error occurred.",
        variant: "destructive"
      });
      return false;
    }
  };

  const getMediaForStep = (stepNumber: number): HomeMedia | undefined => {
    return media.find(m => m.step_number === stepNumber);
  };

  useEffect(() => {
    fetchHomeMedia();
  }, []);

  return {
    media,
    loading,
    uploadMedia,
    removeMedia,
    getMediaForStep,
    refetch: fetchHomeMedia
  };
};