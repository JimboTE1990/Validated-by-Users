import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Winner {
  id: string;
  user_id: string;
  prize_amount: number;
  position: number;
  payout_status: string;
  comment_content?: string;
  user_name?: string;
}

interface WinnerManagementResult {
  success: boolean;
  winners?: Winner[];
  processedPayouts?: any[];
  failedPayouts?: any[];
  message: string;
  error?: string;
}

export const useWinnerManagement = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const selectWinners = async (postId: string): Promise<WinnerManagementResult> => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('select-winners', {
        body: { postId }
      });

      if (error) throw error;

      toast({
        title: "Winners Selected",
        description: data.message || "Winners have been successfully selected",
        variant: "default"
      });

      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to select winners';
      
      toast({
        title: "Error Selecting Winners",
        description: errorMessage,
        variant: "destructive"
      });

      return { success: false, message: errorMessage, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const processPayouts = async (postId: string): Promise<WinnerManagementResult> => {
    setLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('process-payouts', {
        body: { postId }
      });

      if (error) throw error;

      toast({
        title: "Payouts Processed",
        description: data.message || "Payouts have been successfully processed",
        variant: "default"
      });

      return data;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to process payouts';
      
      toast({
        title: "Error Processing Payouts",
        description: errorMessage,
        variant: "destructive"
      });

      return { success: false, message: errorMessage, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const getWinners = async (postId: string) => {
    try {
      const { data, error } = await supabase
        .from('winners')
        .select(`
          id,
          user_id,
          prize_amount,
          position,
          payout_status,
          stripe_transfer_id,
          created_at,
          comments:comment_id(content),
          profiles:user_id(first_name, last_name)
        `)
        .eq('post_id', postId)
        .order('position');

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error fetching winners:', error);
      toast({
        title: "Error",
        description: "Failed to fetch winners",
        variant: "destructive"
      });
      return [];
    }
  };

  return {
    selectWinners,
    processPayouts,
    getWinners,
    loading
  };
};