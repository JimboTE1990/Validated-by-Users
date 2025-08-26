import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ModerationService } from '@/services/moderationService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ModerationResult {
  classification: 'valid' | 'spam';
  reason: string;
  action: 'keep' | 'remove' | 'suspend';
  strike_level: number;
  user_message: string;
}

export const useModeration = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const moderateContent = async (content: string, postId?: string): Promise<ModerationResult | null> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    setIsProcessing(true);

    try {
      // First, get current user strike count
      const { data: strikeData, error: strikeError } = await supabase
        .from('user_strikes')
        .select('strike_count, is_suspended')
        .eq('user_id', user.id)
        .maybeSingle();

      if (strikeError && strikeError.code !== 'PGRST116') {
        console.error('Error checking user strikes:', strikeError);
        throw strikeError;
      }

      // Check if user is already suspended
      if (strikeData?.is_suspended) {
        const suspendedResult: ModerationResult = {
          classification: 'spam',
          reason: 'User account is suspended',
          action: 'suspend',
          strike_level: strikeData.strike_count,
          user_message: '🚫 Your account is suspended. Contact support if you believe this is an error.'
        };
        
        await logModerationAction(user.id, content, suspendedResult, postId);
        return suspendedResult;
      }

      const currentStrikes = strikeData?.strike_count || 0;

      // Run moderation
      const result = ModerationService.moderate(content, currentStrikes);

      // If content is spam, increment strike count
      if (result.classification === 'spam') {
        const { error: incrementError } = await supabase
          .rpc('increment_user_strike', { target_user_id: user.id });

        if (incrementError) {
          console.error('Error incrementing user strike:', incrementError);
          throw incrementError;
        }

        // Show warning message to user
        toast({
          title: "Content Removed",
          description: result.user_message,
          variant: "destructive",
        });
      }

      // Log the moderation action
      await logModerationAction(user.id, content, result, postId);

      return result;
      
    } catch (error) {
      console.error('Error during moderation:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const logModerationAction = async (
    userId: string,
    content: string, 
    result: ModerationResult,
    postId?: string
  ) => {
    try {
      const { error } = await supabase
        .from('moderated_content')
        .insert({
          user_id: userId,
          content,
          classification: result.classification,
          reason: result.reason,
          action_taken: result.action,
          strike_level: result.strike_level,
          related_post_id: postId,
        });

      if (error) {
        console.error('Error logging moderation action:', error);
      }
    } catch (error) {
      console.error('Error logging moderation action:', error);
    }
  };

  const checkUserStatus = async (): Promise<{ isSuspended: boolean; strikeCount: number }> => {
    if (!user) {
      return { isSuspended: false, strikeCount: 0 };
    }

    try {
      const { data, error } = await supabase
        .from('user_strikes')
        .select('strike_count, is_suspended')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error checking user status:', error);
        return { isSuspended: false, strikeCount: 0 };
      }

      return {
        isSuspended: data?.is_suspended || false,
        strikeCount: data?.strike_count || 0
      };
    } catch (error) {
      console.error('Error checking user status:', error);
      return { isSuspended: false, strikeCount: 0 };
    }
  };

  return {
    moderateContent,
    checkUserStatus,
    isProcessing
  };
};