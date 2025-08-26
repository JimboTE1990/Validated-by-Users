import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ReportFeedbackResponse {
  success: boolean;
  action?: string;
  status?: string;
  note?: string;
  error?: string;
}

export const useFeedbackReporting = () => {
  const [isReporting, setIsReporting] = useState(false);
  const { toast } = useToast();

  const reportFeedback = async (
    commentId: string,
    reason: string,
    details?: string
  ): Promise<ReportFeedbackResponse> => {
    setIsReporting(true);

    try {
      const { data, error } = await supabase.rpc('report_feedback_as_author', {
        p_comment_id: commentId,
        p_report_reason: reason,
        p_report_details: details || null
      });

      if (error) {
        console.error('Error reporting feedback:', error);
        toast({
          title: "Report Failed",
          description: error.message || "Failed to report feedback.",
          variant: "destructive"
        });
        return { success: false, error: error.message };
      }

      // Type guard to ensure we have a valid response object
      if (!data || typeof data !== 'object' || Array.isArray(data)) {
        throw new Error('Invalid response from server');
      }
      
      const result = data as unknown as ReportFeedbackResponse;
      
      if (result.success) {
        toast({
          title: "Feedback Reported",
          description: result.note || "Feedback has been hidden and reported for review.",
        });
      } else {
        toast({
          title: "Report Failed", 
          description: result.error || "Failed to report feedback.",
          variant: "destructive"
        });
      }

      return result;
    } catch (error) {
      console.error('Error reporting feedback:', error);
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      
      toast({
        title: "Report Failed",
        description: errorMessage,
        variant: "destructive"
      });

      return { success: false, error: errorMessage };
    } finally {
      setIsReporting(false);
    }
  };

  const getVisibleComments = async (postId: string) => {
    try {
      const { data, error } = await supabase.rpc('get_comments_for_author', {
        p_post_id: postId
      });

      if (error) {
        console.error('Error fetching visible comments:', error);
        return { data: null, error };
      }

      return { data, error: null };
    } catch (error) {
      console.error('Error fetching visible comments:', error);
      return { data: null, error };
    }
  };

  return {
    reportFeedback,
    getVisibleComments,
    isReporting
  };
};